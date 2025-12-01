class ScheduleResult:
    def __init__(self, algorithm_name):
        self.algorithm_name = algorithm_name
        self.schedule = []
        self.total_profit = 0
        self.completed_tasks = 0
        self.rejected_tasks = 0
        self.resource_utilization = []
        self.execution_time_ms = 0
        self.theoretical_complexity = ""
    
    def to_dict(self):
        return {
            'algorithm_name': self.algorithm_name,
            'total_profit': self.total_profit,
            'completed_tasks': self.completed_tasks,
            'rejected_tasks': self.rejected_tasks,
            'resource_utilization': self.resource_utilization,
            'execution_time_ms': self.execution_time_ms,
            'theoretical_complexity': self.theoretical_complexity,
            'schedule': [
                {
                    'task_id': entry['task'].task_id,
                    'vm_id': entry['vm_id'],
                    'start_time': entry['start_time'],
                    'end_time': entry['end_time'],
                    'profit': entry['task'].profit
                }
                for entry in self.schedule
            ]
        }