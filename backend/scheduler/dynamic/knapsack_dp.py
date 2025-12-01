from scheduler.base_scheduler import BaseScheduler
from models.schedule_result import ScheduleResult

class KnapsackDPScheduler(BaseScheduler):
    def __init__(self):
        super().__init__("Knapsack-based DP", "O(n*C*R)")
    
    def _schedule_tasks(self, tasks, vms):
        result = ScheduleResult(self.name)
        
        if not tasks:
            return result
        
        # Use a simple greedy approach for task selection with load balancing
        # Sort by profit density (profit per resource unit)
        sorted_tasks = sorted(tasks, key=lambda x: -((x.profit) / (x.cpu_cores + x.ram_gb)))
        
        max_time = max(task.deadline for task in tasks) + 50
        
        for task in sorted_tasks:
            scheduled = False
            
            # Try to find the best VM with load balancing
            best_vm = None
            best_start_time = None
            min_utilization = float('inf')
            
            for vm in vms:
                start_time = task.arrival_time
                while start_time <= task.deadline - task.execution_time:
                    if self.can_schedule_at_time(task, vm, start_time):
                        # Calculate current utilization of this VM
                        current_util = self.calculate_vm_utilization_at_time(vm, start_time)
                        
                        # Choose VM with lowest utilization for load balancing
                        if current_util < min_utilization:
                            min_utilization = current_util
                            best_vm = vm
                            best_start_time = start_time
                    start_time += 1
            
            if best_vm is not None and best_start_time is not None:
                best_vm.allocate_task(task, best_start_time)
                result.schedule.append({
                    'task': task,
                    'vm_id': best_vm.vm_id,
                    'start_time': best_start_time,
                    'end_time': best_start_time + task.execution_time
                })
                result.total_profit += task.profit
                result.completed_tasks += 1
                scheduled = True
            
            if not scheduled:
                result.rejected_tasks += 1
        
        result.resource_utilization = self.calculate_utilization(vms, max_time)
        return result
    
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