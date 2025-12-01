class Task:
    def __init__(self, task_id, arrival_time, cpu_cores, ram_gb, execution_time, deadline, priority, profit, dependencies=None):
        self.task_id = task_id
        self.arrival_time = arrival_time
        self.cpu_cores = cpu_cores
        self.ram_gb = ram_gb
        self.execution_time = execution_time
        self.deadline = deadline
        self.priority = priority
        self.profit = profit
        self.dependencies = dependencies if dependencies is not None else []
        
    def to_dict(self):
        return {
            'task_id': self.task_id,
            'arrival_time': self.arrival_time,
            'cpu_cores': self.cpu_cores,
            'ram_gb': self.ram_gb,
            'execution_time': self.execution_time,
            'deadline': self.deadline,
            'priority': self.priority,
            'profit': self.profit,
            'dependencies': self.dependencies
        }