import React from 'react'

const AlgorithmComparison = ({ data }) => {
  const { results } = data
  
  const algorithms = Object.entries(results).map(([name, metrics]) => ({
    name,
    ...metrics
  }))

  // Find best profit for highlighting
  const bestProfit = Math.max(...algorithms.map(a => a.total_profit))

  return (
    <div className="algorithm-comparison">
      <h2>Algorithm Comparison Summary</h2>
      
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Algorithm</th>
            <th>Total Profit</th>
            <th>Completed Tasks</th>
            <th>Max Utilization</th>
            <th>Execution Time</th>
            <th>Complexity</th>
          </tr>
        </thead>
        <tbody>
          {algorithms.map((algorithm) => (
            <tr key={algorithm.name}>
              <td><strong>{algorithm.name}</strong></td>
              <td style={{ 
                color: algorithm.total_profit === bestProfit ? '#4CAF50' : '#333',
                fontWeight: algorithm.total_profit === bestProfit ? 'bold' : 'normal'
              }}>
                ${algorithm.total_profit}
                {algorithm.total_profit === bestProfit && ' 🏆'}
              </td>
              <td>{algorithm.completed_tasks}/{data.total_tasks}</td>
              <td>{Math.max(...algorithm.resource_utilization.map(u => u.cpu)).toFixed(1)}%</td>
              <td>{algorithm.execution_time_ms.toFixed(2)}ms</td>
              <td>{algorithm.theoretical_complexity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AlgorithmComparison