import React from 'react'

const ComparisonSummary = ({ data }) => {
  const { results, case_type, total_tasks } = data

  // Calculate best algorithm
  const algorithms = Object.entries(results).map(([name, metrics]) => ({
    name,
    ...metrics
  }))

  const bestProfit = algorithms.reduce((best, current) => 
    current.total_profit > best.total_profit ? current : best
  )
  
  const bestCompletion = algorithms.reduce((best, current) => 
    current.completed_tasks > best.completed_tasks ? current : best
  )
  
  const fastest = algorithms.reduce((fastest, current) => 
    current.execution_time_ms < fastest.execution_time_ms ? current : fastest
  )

  // Determine overall winner
  const overallWinner = algorithms.reduce((best, current) => {
    const bestScore = (best.total_profit / bestProfit.total_profit) * 0.5 +
                     (best.completed_tasks / bestCompletion.completed_tasks) * 0.3 +
                     (fastest.execution_time_ms / best.execution_time_ms) * 0.2
    
    const currentScore = (current.total_profit / bestProfit.total_profit) * 0.5 +
                        (current.completed_tasks / bestCompletion.completed_tasks) * 0.3 +
                        (fastest.execution_time_ms / current.execution_time_ms) * 0.2
    
    return currentScore > bestScore ? current : best
  })

  const getCaseDescription = (caseType) => {
    switch(caseType) {
      case 'best': return 'optimized conditions with lightweight tasks'
      case 'worst': return 'challenging conditions with resource-intensive tasks'
      case 'mixed': return 'real-world mixed workload conditions'
      default: return 'the given workload conditions'
    }
  }

  const getCaseDisplayName = (caseType) => {
    switch(caseType) {
      case 'best': return 'Best Case'
      case 'worst': return 'Worst Case'
      case 'mixed': return 'Mixed Case'
      default: return caseType
    }
  }

  return (
    <div className="comparison-summary">
      <h2>Performance Summary</h2>
      <p>Comprehensive analysis of algorithm performance for {getCaseDisplayName(case_type)} scenario</p>
      
      <div className="summary-content">
        <div className="winner-card">
          <h3>🏆 Best Performing Algorithm</h3>
          <div className="winner-algorithm">
            <span className="winner-name">{overallWinner.name}</span>
            <div className="winner-stats">
              <div><strong>Profit:</strong> ${overallWinner.total_profit}</div>
              <div><strong>Completed:</strong> {overallWinner.completed_tasks}/{total_tasks} tasks</div>
              <div><strong>Speed:</strong> {overallWinner.execution_time_ms.toFixed(2)}ms</div>
            </div>
          </div>
          <p className="summary-text">
            For <strong>{getCaseDisplayName(case_type)}</strong> scenario with {getCaseDescription(case_type)}, 
            <strong> {overallWinner.name}</strong> demonstrates superior performance by achieving the best 
            balance of profit generation, task completion rate, and execution efficiency.
          </p>
        </div>

        <div className="recommendation">
          <h4>💡 Recommendation</h4>
          <p>
            {overallWinner.name.includes('Greedy') ? 
              'Greedy algorithms are recommended for this scenario due to their fast execution time and efficient profit optimization while meeting task deadlines.' :
              'Dynamic Programming is recommended for this scenario as it provides optimal resource allocation and maximizes profit through careful task selection.'
            }
          </p>
        </div>

        <div className="key-insights">
          <h4>📈 Key Performance Insights</h4>
          <div className="insights-grid">
            <div className="insight">
              <div className="insight-icon">💰</div>
              <div>
                <strong>Best for Profit:</strong><br />
                {bestProfit.name}<br />
                <span className="insight-value">${bestProfit.total_profit}</span>
              </div>
            </div>
            <div className="insight">
              <div className="insight-icon">✅</div>
              <div>
                <strong>Best Completion Rate:</strong><br />
                {bestCompletion.name}<br />
                <span className="insight-value">{bestCompletion.completed_tasks}/{total_tasks} tasks</span>
              </div>
            </div>
            <div className="insight">
              <div className="insight-icon">⚡</div>
              <div>
                <strong>Fastest Execution:</strong><br />
                {fastest.name}<br />
                <span className="insight-value">{fastest.execution_time_ms.toFixed(2)}ms</span>
              </div>
            </div>
          </div>
        </div>

        <div className="algorithm-breakdown">
          <h4>🔍 Algorithm Performance Breakdown</h4>
          <div className="breakdown-grid">
            {algorithms.map((algorithm, index) => (
              <div key={algorithm.name} className="breakdown-item">
                <h5>{algorithm.name}</h5>
                <div className="breakdown-stats">
                  <div>Profit: <span>${algorithm.total_profit}</span></div>
                  <div>Completed: <span>{algorithm.completed_tasks}/{total_tasks}</span></div>
                  <div>Utilization: <span>{Math.max(...algorithm.resource_utilization.map(u => u.cpu)).toFixed(1)}%</span></div>
                  <div>Speed: <span>{algorithm.execution_time_ms.toFixed(2)}ms</span></div>
                </div>
                {algorithm.name === overallWinner.name && (
                  <div className="winner-badge">Best Overall</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparisonSummary