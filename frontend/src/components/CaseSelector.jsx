import React from 'react'

const CaseSelector = ({ onCaseSelect, loading }) => {
  const cases = [
    { type: 'best', label: 'Best Case', description: 'Optimal conditions for scheduling' },
    { type: 'worst', label: 'Worst Case', description: 'Challenging conditions for scheduling' },
    { type: 'mixed', label: 'Mixed Case', description: 'Real-world mixed conditions' }
  ]

  return (
    <div className="case-selector">
      <h2>Select Test Case Scenario</h2>
      <p>Choose a scenario to run all four scheduling algorithms</p>
      
      <div className="case-buttons">
        {cases.map((caseItem) => (
          <button
            key={caseItem.type}
            className={`case-button ${caseItem.type}`}
            onClick={() => onCaseSelect(caseItem.type)}
            disabled={loading}
          >
            {caseItem.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Running simulation with all algorithms...</p>
        </div>
      )}
    </div>
  )
}

export default CaseSelector