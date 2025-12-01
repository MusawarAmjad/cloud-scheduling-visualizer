class DAGAnalyzer:
    def __init__(self, tasks):
        self.tasks = tasks
        self.task_map = {task.task_id: task for task in tasks}
        self.graph = self.build_graph()
        
    def build_graph(self):
        """Build adjacency list representation of the DAG"""
        graph = {task.task_id: [] for task in self.tasks}
        for task in self.tasks:
            for dep_id in task.dependencies:
                if dep_id in graph:
                    graph[dep_id].append(task.task_id)
        return graph
    
    def topological_sort(self):
        """Perform topological sorting using Kahn's algorithm"""
        # Calculate in-degrees
        in_degree = {task.task_id: 0 for task in self.tasks}
        for task in self.tasks:
            for dep_id in task.dependencies:
                if dep_id in in_degree:
                    in_degree[task.task_id] += 1
        
        # Initialize queue with nodes having 0 in-degree
        queue = [task_id for task_id, degree in in_degree.items() if degree == 0]
        top_order = []
        
        while queue:
            current = queue.pop(0)
            top_order.append(current)
            
            # Reduce in-degree of neighbors
            for neighbor in self.graph.get(current, []):
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
        
        if len(top_order) == len(self.tasks):
            return top_order
        else:
            return []  # Graph has a cycle
    
    def detect_cycles(self):
        """Detect if there are cycles in the graph"""
        visited = set()
        rec_stack = set()
        
        def dfs(node):
            visited.add(node)
            rec_stack.add(node)
            
            for neighbor in self.graph.get(node, []):
                if neighbor not in visited:
                    if dfs(neighbor):
                        return True
                elif neighbor in rec_stack:
                    return True
            
            rec_stack.remove(node)
            return False
        
        for node in self.graph:
            if node not in visited:
                if dfs(node):
                    return True
        return False
    
    def calculate_critical_path(self):
        """Calculate critical path (longest path) in the DAG"""
        if self.detect_cycles():
            return []
        
        top_order = self.topological_sort()
        if not top_order:
            return []
        
        # Initialize distances
        dist = {node: 0 for node in top_order}
        predecessor = {node: None for node in top_order}
        
        # Calculate longest path
        for node in top_order:
            for neighbor in self.graph.get(node, []):
                new_dist = dist[node] + self.task_map[neighbor].execution_time
                if new_dist > dist[neighbor]:
                    dist[neighbor] = new_dist
                    predecessor[neighbor] = node
        
        # Find the node with maximum distance
        end_node = max(dist, key=dist.get)
        
        # Reconstruct critical path
        critical_path = []
        current = end_node
        while current is not None:
            critical_path.insert(0, current)
            current = predecessor[current]
        
        return critical_path
    
    def calculate_path_length(self, path):
        """Calculate total execution time of a path"""
        total_time = 0
        for task_id in path:
            if task_id in self.task_map:
                total_time += self.task_map[task_id].execution_time
        return total_time
    
    def get_graph_visualization_data(self):
        """Prepare data for graph visualization"""
        nodes = []
        edges = []
        
        for task in self.tasks:
            nodes.append({
                'id': task.task_id,
                'label': f'T{task.task_id}',
                'execution_time': task.execution_time,
                'profit': task.profit,
                'cpu': task.cpu_cores,
                'ram': task.ram_gb
            })
            
            for dep_id in task.dependencies:
                if dep_id <= len(self.tasks):  # Ensure valid dependency
                    edges.append({
                        'from': dep_id,
                        'to': task.task_id,
                        'label': 'depends on'
                    })
        
        return {
            'nodes': nodes,
            'edges': edges
        }
    
    def analyze_dependencies(self):
        """Analyze dependency patterns"""
        analysis = {
            'total_tasks': len(self.tasks),
            'tasks_with_dependencies': sum(1 for task in self.tasks if task.dependencies),
            'max_dependencies': max(len(task.dependencies) for task in self.tasks),
            'avg_dependencies': sum(len(task.dependencies) for task in self.tasks) / len(self.tasks),
            'has_cycles': self.detect_cycles(),
            'topological_order': self.topological_sort(),
            'critical_path': self.calculate_critical_path(),
            'critical_path_length': self.calculate_path_length(self.calculate_critical_path())
        }
        
        return analysis