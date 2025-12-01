from scheduler.base_scheduler import BaseScheduler
from models.schedule_result import ScheduleResult

class EDFScheduler(BaseScheduler):
    def __init__(self):
        super().__init__("Earliest Deadline First (EDF)", "O(n log n + n*m)")
    
    def _schedule_tasks(self, tasks, vms):
        result = ScheduleResult(self.name)
        
        # Sort tasks by deadline (earliest first) and then by profit (highest first)
        sorted_tasks = sorted(tasks, key=lambda x: (x.deadline, -x.profit))
        
        max_time = max(task.deadline for task in tasks) + 50
        
        for task in sorted_tasks:
            scheduled = False
            
            # Find available slot across all VMs
            start_time, selected_vm = self.find_available_slot(task, vms, max_time)
            
            if start_time is not None and selected_vm is not None:
                # Schedule the task on the selected VM
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