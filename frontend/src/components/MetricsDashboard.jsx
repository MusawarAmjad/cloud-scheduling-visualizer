import React from 'react'

const MetricsDashboard = ({ data }) => {
  const { results } = data

  // Group algorithms by category
  const greedyAlgorithms = Object.entries(results).filter(([name]) => 
    name.includes('EDF') || name.includes('SJF')
  )
  
  const dpAlgorithms = Object.entries(results).filter(([name]) => 
    name.includes('Knapsack')
  )

  return (
    <div className="metrics-dashboard">
      <h2>Algorithm Performance Metrics</h2>
      <p>Comparison of Greedy vs Dynamic Programming approaches</p>
      
      <div className="algorithm-categories">
        {/* Greedy Algorithms */}
        <div className="algorithm-category">
          <h3 className="category-title greedy-title">Greedy Algorithms</h3>
          <div className="metrics-grid">
            {greedyAlgorithms.map(([algorithm, metrics]) => (
              <div key={algorithm} className="algorithm-metrics greedy-metrics">
                <h4>{algorithm}</h4>
                
                <div className="metric">
                  <span className="metric-label">Total Profit:</span>
                  <span className="metric-value profit-value">
                    ${metrics.total_profit}
                  </span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Completed Tasks:</span>
                  <span className="metric-value">
                    {metrics.completed_tasks}/{data.total_tasks}
                  </span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Utilization:</span>
                  <span className="metric-value">
                    {Math.max(...metrics.resource_utilization.map(u => u.cpu)).toFixed(1)}%
                  </span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Execution Time:</span>
                  <span className="metric-value">
                    {metrics.execution_time_ms.toFixed(2)}ms
                  </span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Complexity:</span>
                  <span className="metric-value">
                    {metrics.theoretical_complexity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Programming Algorithms */}
        <div className="algorithm-category">
          <h3 className="category-title dp-title">Dynamic Programming</h3>
          <div className="metrics-grid">
            {dpAlgorithms.map(([algorithm, metrics]) => (
              <div key={algorithm} className="algorithm-metrics dp-metrics">
                <h4>{algorithm}</h4>
                
                <div className="metric">
                  <span className="metric-label">Total Profit:</span>
                  <span className="metric-value profit-value">
                    ${metrics.total_profit}
                  </span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Completed Tasks:</span>
                  <span className="metric-value">
                    {metrics.completed_tasks}/{data.total_tasks}
                  </span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Utilization:</span>
                  <span className="metric-value">
                    {Math.max(...metrics.resource_utilization.map(u => u.cpu)).toFixed(1)}%
                  </span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Execution Time:</span>
                  <span className="metric-value">
                    {metrics.execution_time_ms.toFixed(2)}ms
                  </span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Complexity:</span>
                  <span className="metric-value">
                    {metrics.theoretical_complexity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MetricsDashboard