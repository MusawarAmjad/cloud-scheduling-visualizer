class VirtualMachine:
    def __init__(self, vm_id, total_cpu, total_ram):
        self.vm_id = vm_id
        self.total_cpu = total_cpu
        self.total_ram = total_ram
        self.available_cpu = total_cpu
        self.available_ram = total_ram
        self.scheduled_tasks = []
        self.utilization_history = []
    
    def can_allocate(self, task):
        return (self.available_cpu >= task.cpu_cores and 
                self.available_ram >= task.ram_gb)
    
    def allocate_task(self, task, start_time):
        if self.can_allocate(task):
            self.available_cpu -= task.cpu_cores
            self.available_ram -= task.ram_gb
            end_time = start_time + task.execution_time
            schedule_entry = {
                'task': task,
                'start_time': start_time,
                'end_time': end_time,
                'vm_id': self.vm_id
            }
            self.scheduled_tasks.append(schedule_entry)
            return True
        return False
    
    def get_current_utilization(self, current_time):
        """Get current CPU and RAM utilization at given time"""
        cpu_used = 0
        ram_used = 0
        
        for scheduled in self.scheduled_tasks:
            if scheduled['start_time'] <= current_time < scheduled['end_time']:
                cpu_used += scheduled['task'].cpu_cores
                ram_used += scheduled['task'].ram_gb
        
        cpu_util = (cpu_used / self.total_cpu) * 100 if self.total_cpu > 0 else 0
        ram_util = (ram_used / self.total_ram) * 100 if self.total_ram > 0 else 0
        
        return cpu_util, ram_util
    
    def reset(self):
        self.available_cpu = self.total_cpu
        self.available_ram = self.total_ram
        self.scheduled_tasks = []
        self.utilization_history = []