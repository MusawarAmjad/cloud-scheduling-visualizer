import time
from models.virtual_machine import VirtualMachine

class BaseScheduler:
    def __init__(self, name, complexity):
        self.name = name
        self.theoretical_complexity = complexity
    
    def schedule(self, tasks, vms):
        start_time = time.time() * 1000  # ms
        
        # Reset VMs
        for vm in vms:
            vm.reset()
        
        # Implement scheduling logic in child classes
        result = self._schedule_tasks(tasks, vms)
        
        # Calculate execution time
        result.execution_time_ms = time.time() * 1000 - start_time
        result.theoretical_complexity = self.theoretical_complexity
        
        return result
    
    def _schedule_tasks(self, tasks, vms):
        raise NotImplementedError("Subclasses must implement this method")
    
    def find_best_vm_for_task(self, task, start_time, max_time=100):
        """Find the best VM for a task at a given start time"""
        best_vm = None
        best_utilization = float('inf')
        
        for vm in self.vms:
            if self.can_schedule_at_time(task, vm, start_time):
                # Calculate current utilization of this VM
                current_util = self.calculate_vm_utilization_at_time(vm, start_time)
                
                # Prefer VM with lower utilization for load balancing
                if current_util < best_utilization:
                    best_utilization = current_util
                    best_vm = vm
        
        return best_vm
    
    def calculate_vm_utilization_at_time(self, vm, time_slot):
        """Calculate current utilization of a VM at specific time"""
        cpu_used = 0
        ram_used = 0
        
        for scheduled in vm.scheduled_tasks:
            if scheduled['start_time'] <= time_slot < scheduled['end_time']:
                cpu_used += scheduled['task'].cpu_cores
                ram_used += scheduled['task'].ram_gb
        
        cpu_util = (cpu_used / vm.total_cpu) * 100 if vm.total_cpu > 0 else 0
        ram_util = (ram_used / vm.total_ram) * 100 if vm.total_ram > 0 else 0
        
        return (cpu_util + ram_util) / 2  # Average utilization
    
    def find_available_slot(self, task, vms, max_time=100):
        """Find available time slot for task across all VMs"""
        current_time = task.arrival_time
        
        while current_time <= task.deadline - task.execution_time:
            # Try all VMs to find one that can schedule at this time
            for vm in vms:
                if self.can_schedule_at_time(task, vm, current_time):
                    return current_time, vm
            current_time += 1
        
        return None, None
    
    def can_schedule_at_time(self, task, vm, start_time):
        """Check if task can be scheduled at specific time on VM"""
        end_time = start_time + task.execution_time
        
        # Check if VM has enough resources at this time
        available_cpu = vm.total_cpu
        available_ram = vm.total_ram
        
        # Check overlapping tasks
        for scheduled in vm.scheduled_tasks:
            scheduled_start = scheduled['start_time']
            scheduled_end = scheduled['end_time']
            
            # If time ranges overlap
            if not (end_time <= scheduled_start or start_time >= scheduled_end):
                # Resources are occupied during overlap
                available_cpu -= scheduled['task'].cpu_cores
                available_ram -= scheduled['task'].ram_gb
        
        # Check if enough resources available and meets deadline
        return (available_cpu >= task.cpu_cores and 
                available_ram >= task.ram_gb and
                end_time <= task.deadline)
    
    def calculate_utilization(self, vms, max_time):
        utilization = []
        for time_slot in range(max_time):
            total_cpu_used = 0
            total_ram_used = 0
            total_cpu = 0
            total_ram = 0
            
            for vm in vms:
                total_cpu += vm.total_cpu
                total_ram += vm.total_ram
                
                cpu_used = 0
                ram_used = 0
                
                for scheduled in vm.scheduled_tasks:
                    if scheduled['start_time'] <= time_slot < scheduled['end_time']:
                        cpu_used += scheduled['task'].cpu_cores
                        ram_used += scheduled['task'].ram_gb
                
                total_cpu_used += cpu_used
                total_ram_used += ram_used
            
            cpu_util = (total_cpu_used / total_cpu) * 100 if total_cpu > 0 else 0
            ram_util = (total_ram_used / total_ram) * 100 if total_ram > 0 else 0
            avg_util = (cpu_util + ram_util) / 2
            utilization.append({'time': time_slot, 'cpu': cpu_util, 'ram': ram_util, 'avg': avg_util})
        
        return utilization
    
    def can_execute_with_dependencies(self, task, executed_tasks):
        """Check if all dependencies of a task are satisfied"""
        if not task.dependencies:
            return True
        
        executed_ids = {t.task_id for t in executed_tasks}
        return all(dep_id in executed_ids for dep_id in task.dependencies)
    
    def schedule_with_dependencies(self, tasks, vms):
        """Schedule tasks considering dependencies"""
        result = ScheduleResult(self.name)
        
        # Get topological order considering dependencies
        dag = DAGAnalyzer(tasks)
        execution_order = dag.topological_sort()
        
        if not execution_order:
            # If no valid topological order, schedule without dependencies
            return self._schedule_without_dependencies(tasks, vms, result)
        
        # Convert order back to tasks
        task_map = {task.task_id: task for task in tasks}
        ordered_tasks = [task_map[task_id] for task_id in execution_order 
                        if task_id in task_map]
        
        max_time = max(task.deadline for task in tasks) + 50
        executed_tasks = []
        
        for task in ordered_tasks:
            scheduled = False
            
            # Check if dependencies are satisfied
            if not self.can_execute_with_dependencies(task, executed_tasks):
                result.rejected_tasks += 1
                continue
            
            # Find available slot
            start_time, selected_vm = self.find_available_slot(task, vms, max_time)
            
            if start_time is not None and selected_vm is not None:
                # Schedule the task
                selected_vm.allocate_task(task, start_time)
                result.schedule.append({
                    'task': task,
                    'vm_id': selected_vm.vm_id,
                    'start_time': start_time,
                    'end_time': start_time + task.execution_time
                })
                result.total_profit += task.profit
                result.completed_tasks += 1
                executed_tasks.append(task)
                scheduled = True
            
            if not scheduled:
                result.rejected_tasks += 1
        
        result.resource_utilization = self.calculate_utilization(vms, max_time)
        return result
    
    def _schedule_without_dependencies(self, tasks, vms, result):
        """Fallback scheduling without considering dependencies"""
        # Your existing scheduling logic here
        max_time = max(task.deadline for task in tasks) + 50
        
        for task in tasks:
            scheduled = False
            start_time, selected_vm = self.find_available_slot(task, vms, max_time)
            
            if start_time is not None and selected_vm is not None:
                selected_vm.allocate_task(task, start_time)
                result.schedule.append({
                    'task': task,
                    'vm_id': selected_vm.vm_id,
                    'start_time': start_time,
                    'end_time': start_time + task.execution_time
                })
                result.total_profit += task.profit
                result.completed_tasks += 1
                scheduled = True
            
            if not scheduled:
                result.rejected_tasks += 1
        
        result.resource_utilization = self.calculate_utilization(vms, max_time)
        return result