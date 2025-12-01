import React from 'react'

const GanttCharts = ({ data }) => {
  const { results } = data

  // Calculate timeline bounds
  const allSchedules = Object.values(results).flatMap(r => r.schedule)
  const maxTime = Math.max(...allSchedules.map(s => s.end_time), 10)
  
  // Fixed VM IDs based on config
  const vmIds = [1, 2, 3]

  const getTaskColor = (profit) => {
    // Lower thresholds for better color distribution
    if (profit > 100) return '#4CAF50'      // Green - High profit
    if (profit > 50) return '#FF9800'       // Orange - Medium profit
    return '#f44336'                        // Red - Low profit
  }

  return (
    <div className="gantt-charts">
      <h2>Schedule Visualization</h2>
      <p>Gantt charts showing task scheduling across virtual machines</p>
      
      <div className="gantt-grid">
        {Object.entries(results).map(([algorithm, metrics]) => (
          <div key={algorithm} className="gantt-chart">
            <h4>{algorithm}</h4>
            <div className="gantt-container">
              {/* VM Rows */}
              {vmIds.map(vmId => {
                const vmTasks = metrics.schedule
                  .filter(task => task.vm_id === vmId)
                  .sort((a, b) => a.start_time - b.start_time)
                
                return (
                  <div key={vmId} className="vm-row">
                    <div className="vm-label">VM {vmId}</div>
                    <div className="timeline">
                      {vmTasks.map(task => {
                        const left = (task.start_time / maxTime) * 100
                        const width = Math.max(((task.end_time - task.start_time) / maxTime) * 100, 3)
                        
                        return (
                          <div
                            key={`${task.task_id}-${task.start_time}`}
                            className="task-bar"
                            style={{
                              left: `${left}%`,
                              width: `${width}%`,
                              backgroundColor: getTaskColor(task.profit)
                            }}
                            title={`Task ${task.task_id} (Profit: $${task.profit})
Start: ${task.start_time}, End: ${task.end_time}
Duration: ${task.end_time - task.start_time} units
VM: ${vmId}`}
                          >
                            <span className="task-label">Task {task.task_id}</span>
                          </div>
                        )
                      })}
                      
                      {/* Show empty state */}
                      {vmTasks.length === 0 && (
                        <div className="no-tasks">No tasks scheduled</div>
                      )}
                    </div>
                  </div>
                )
              })}
              
              {/* Time scale */}
              <div className="time-scale">
                {[0, Math.floor(maxTime/4), Math.floor(maxTime/2), Math.floor(maxTime*3/4), maxTime].map(time => (
                  <div key={time} className="time-marker">
                    {time}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="algorithm-summary">
              Scheduled: {metrics.schedule.length} tasks | 
              Completed: {metrics.completed_tasks} | 
              Profit: ${metrics.total_profit}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="gantt-legend">
        <h4>Color Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="color-box high-profit"></div>
            <span>High Profit (&gt; $100)</span>
          </div>
          <div className="legend-item">
            <div className="color-box medium-profit"></div>
            <span>Medium Profit ($50-$100)</span>
          </div>
          <div className="legend-item">
            <div className="color-box low-profit"></div>
            <span>Low Profit (&lt; $50)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GanttCharts