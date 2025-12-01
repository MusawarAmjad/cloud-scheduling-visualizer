from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from graph.dag_analyzer import DAGAnalyzer
from models.task import Task
from models.virtual_machine import VirtualMachine
from config import VMS
from scheduler.greedy.edf_scheduler import EDFScheduler
from scheduler.greedy.sjf_scheduler import SJFScheduler
from scheduler.dynamic.knapsack_dp import KnapsackDPScheduler
from graph.dag_analyzer import DAGAnalyzer
app = Flask(__name__)
CORS(app)

# Add a default route to test if server is working
@app.route('/')
def home():
    return jsonify({
        "message": "Cloud Resource Scheduler API is running!",
        "status": "success",
        "endpoints": {
            "home": "GET /",
            "run_simulation": "POST /api/run-simulation",
            "case_types": "GET /api/case-types"
        }
    })

def load_tasks(case_type):
    """Load tasks from JSON file based on case type"""
    filename = f"data/{case_type}_tasks.json"
    filepath = os.path.join(os.path.dirname(__file__), filename)
    
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
        
        tasks = []
        for task_data in data:
            task = Task(
                task_id=task_data['task_id'],
                arrival_time=task_data['arrival_time'],
                cpu_cores=task_data['cpu_cores'],
                ram_gb=task_data['ram_gb'],
                execution_time=task_data['execution_time'],
                deadline=task_data['deadline'],
                priority=task_data['priority'],
                profit=task_data['profit'],
                dependencies=task_data.get('dependencies', [])  # This line is important
            )
            tasks.append(task)
        
        return tasks
    except FileNotFoundError:
        return []
    except Exception as e:
        print(f"Error loading tasks: {e}")
        return []

def initialize_vms():
    """Initialize virtual machines from config"""
    return [VirtualMachine(vm['vm_id'], vm['total_cpu'], vm['total_ram']) for vm in VMS]

@app.route('/api/run-simulation', methods=['POST'])
def run_simulation():
    try:
        data = request.get_json()
        case_type = data.get('case_type', 'mixed')
        
        # Load tasks and initialize VMs
        tasks = load_tasks(case_type)
        if not tasks:
            return jsonify({'error': f'No tasks found for case type: {case_type}'}), 400
        
        vms = initialize_vms()
        
        # Initialize schedulers - Only EDF, SJF (Greedy) and Knapsack (DP)
        schedulers = [
            EDFScheduler(),
            SJFScheduler(),
            KnapsackDPScheduler()
        ]
        
        results = {}
        
        # Run each scheduler
        for scheduler in schedulers:
            # Create fresh VMs for each scheduler
            scheduler_vms = initialize_vms()
            result = scheduler.schedule(tasks, scheduler_vms)
            results[scheduler.name] = result.to_dict()
        
        response = {
            'case_type': case_type,
            'total_tasks': len(tasks),
            'results': results
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/case-types', methods=['GET'])
def get_case_types():
    return jsonify({
        'case_types': ['best', 'worst', 'mixed']
    })

@app.route('/api/analyze-dependencies/<case_type>', methods=['GET'])
def analyze_dependencies(case_type):
    """Analyze task dependencies and graph structure"""
    tasks = load_tasks(case_type)
    if not tasks:
        return jsonify({'error': f'No tasks found for case type: {case_type}'}), 400
    
    analyzer = DAGAnalyzer(tasks)
    analysis = analyzer.analyze_dependencies()
    graph_data = analyzer.get_graph_visualization_data()
    
    return jsonify({
        'case_type': case_type,
        'dependency_analysis': analysis,
        'graph_data': graph_data
    })
@app.route('/api/dependency-analysis/<case_type>', methods=['GET'])
def dependency_analysis(case_type):  # Changed function name
    """Analyze task dependencies and graph structure"""
    try:
        tasks = load_tasks(case_type)
        if not tasks:
            return jsonify({'error': f'No tasks found for case type: {case_type}'}), 400
        
        analyzer = DAGAnalyzer(tasks)
        analysis = analyzer.analyze_dependencies()
        graph_data = analyzer.get_graph_visualization_data()
        
        return jsonify({
            'case_type': case_type,
            'dependency_analysis': analysis,
            'graph_data': graph_data
        })
    
    except Exception as e:
        print(f"Error analyzing dependencies: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Cloud Resource Scheduler Server...")
    print("Backend API running on: http://localhost:5000")
    print("Access the frontend on: http://localhost:3000")
    app.run(debug=True, port=5000)