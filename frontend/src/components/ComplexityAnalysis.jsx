import React from 'react'

const ComplexityAnalysis = ({ data }) => {
  const { results } = data

  const complexityExplanations = {
    "O(n log n + n*m)": {
      description: "Efficient polynomial time",
      explanation: "The algorithm sorts tasks (n log n) and then assigns them to VMs (n*m). Scales well with large inputs.",
      bestFor: "Large datasets where sorting efficiency matters",
      scalability: "Excellent - handles thousands of tasks efficiently"
    },
    "O(n*T*C*R)": {
      description: "Pseudo-polynomial time",
      explanation: "Complexity depends on task count (n), time slots (T), CPU capacity (C), and RAM capacity (R). More comprehensive but computationally expensive for large inputs.",
      bestFor: "Small to medium datasets where optimal solutions are required",
      scalability: "Moderate - becomes slow with hundreds of tasks or high resource constraints"
    },
    "O(n*C*R)": {
      description: "Pseudo-polynomial time",
      explanation: "Complexity depends on task count (n), CPU capacity (C), and RAM capacity (R). Optimizes resource allocation through dynamic programming table.",
      bestFor: "Scenarios requiring optimal profit with resource constraints",
      scalability: "Limited by available CPU and RAM resources"
    }
  }

  const algorithms = Object.entries(results).map(([name, metrics]) => ({
    name,
    ...metrics,
    ...complexityExplanations[metrics.theoretical_complexity]
  }))

  // Calculate efficiency scores
  const maxProfit = Math.max(...algorithms.map(a => a.total_profit))
  const minTime = Math.min(...algorithms.map(a => a.execution_time_ms))

  algorithms.forEach(algorithm => {
    algorithm.efficiencyScore = (
      (algorithm.total_profit / maxProfit) * 0.7 +
      (minTime / algorithm.execution_time_ms) * 0.3
    ) * 100
  })

  return (
    <div className="complexity-analysis">
      <h2>Algorithm Complexity Analysis</h2>
      <p>Theoretical and empirical analysis of algorithm performance</p>

      <div className="complexity-grid">
        {algorithms.map((algorithm) => (
          <div key={algorithm.name} className="complexity-card">
            <h3>{algorithm.name}</h3>

            <div className="complexity-metrics">
              <div className="metric-row">
                <span className="metric-label">Theoretical Complexity:</span>
                <span className="metric-value complexity-badge">
                  {algorithm.theoretical_complexity}
                </span>
              </div>

              <div className="metric-row">
                <span className="metric-label">Empirical Runtime:</span>
                <span className="metric-value">
                  {algorithm.execution_time_ms.toFixed(2)}ms
                </span>
              </div>

              <div className="metric-row">
                <span className="metric-label">Efficiency Score:</span>
                <span className="metric-value efficiency-score">
                  {algorithm.efficiencyScore.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="complexity-details">
              <h4>Complexity Analysis:</h4>
              <p><strong>Description:</strong> {algorithm.description || "No description available"}</p>
              <p><strong>Explanation:</strong> {algorithm.explanation || "No explanation available"}</p>
              <p><strong>Best For:</strong> {algorithm.bestFor || "No information available"}</p>
              <p><strong>Scalability:</strong> {algorithm.scalability || "No scalability information available"}</p>
            </div>

            <div className="performance-insights">
              <h4>Performance Insights:</h4>
              <ul>
                <li>
                  <strong>Profit Efficiency:</strong> ${algorithm.total_profit}
                  ({(algorithm.total_profit / maxProfit * 100).toFixed(1)}% of best)
                </li>
                <li>
                  <strong>Speed:</strong> {algorithm.execution_time_ms.toFixed(2)}ms
                  {algorithm.execution_time_ms === minTime ? ' 🚀 Fastest' : ''}
                </li>
                <li>
                  <strong>Task Completion:</strong> {algorithm.completed_tasks}/{data.total_tasks} tasks
                  ({(algorithm.completed_tasks / data.total_tasks * 100).toFixed(1)}%)
                </li>
                <li>
                  <strong>Resource Utilization:</strong> {Math.max(...algorithm.resource_utilization.map(u => u.cpu)).toFixed(1)}%
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="complexity-comparison">
        <h3>Algorithm Comparison Summary</h3>
        <div className="comparison-grid">
          <div className="comparison-category">
            <h4>🏆 Best for Profit:</h4>
            <p>{algorithms.reduce((best, current) =>
              current.total_profit > best.total_profit ? current : best
            ).name} - ${maxProfit}</p>
          </div>

          <div className="comparison-category">
            <h4>⚡ Fastest Execution:</h4>
            <p>{algorithms.reduce((fastest, current) =>
              current.execution_time_ms < fastest.execution_time_ms ? current : fastest
            ).name} - {minTime.toFixed(2)}ms</p>
          </div>

          <div className="comparison-category">
            <h4>📊 Most Efficient:</h4>
            <p>{algorithms.reduce((best, current) =>
              current.efficiencyScore > best.efficiencyScore ? current : best
            ).name} - {Math.max(...algorithms.map(a => a.efficiencyScore)).toFixed(1)}%</p>
          </div>

          <div className="comparison-category">
            <h4>🔄 Best Completion Rate:</h4>
            <p>{algorithms.reduce((best, current) =>
              current.completed_tasks > best.completed_tasks ? current : best
            ).name} - {Math.max(...algorithms.map(a => a.completed_tasks))}/{data.total_tasks} tasks</p>
          </div>
        </div>
      </div>

      <div className="big-o-explanation">
        <h3>Big O Complexity Reference</h3>
        <div className="complexity-levels">
          <div className="complexity-level">
            <span className="level-badge efficient">O(n log n)</span>
            <span>Efficient - Scales well with large inputs</span>
          </div>
          <div className="complexity-level">
            <span className="level-badge expensive">O(n*T*C*R)</span>
            <span>Expensive - Limited by time and resource constraints</span>
          </div>
          <div className="complexity-level">
            <span className="level-badge expensive">O(n*C*R)</span>
            <span>Expensive - Limited by CPU and RAM constraints</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplexityAnalysis