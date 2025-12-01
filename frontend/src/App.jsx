import React, { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import CaseSelector from './components/CaseSelector'
import MetricsDashboard from './components/MetricsDashboard'
import GanttCharts from './components/GanttCharts'
import AlgorithmComparison from './components/AlgorithmComparison'
import ComplexityAnalysis from './components/ComplexityAnalysis'
import ComparisonSummary from './components/ComparisonSummary'
import DependencyGraph from './components/DependencyGraph'  // Add this import
import './App.css'

function App() {
  const [simulationData, setSimulationData] = useState(null)
  const [graphData, setGraphData] = useState(null)  // Add this state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showLanding, setShowLanding] = useState(true)

  const handleCaseSelect = async (caseType) => {
    setLoading(true)
    setError(null)

    try {
      // Load simulation data
      const simulationResponse = await fetch('/api/run-simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ case_type: caseType }),
      })

      if (!simulationResponse.ok) {
        throw new Error('Failed to run simulation')
      }

      const simulationData = await simulationResponse.json()
      setSimulationData(simulationData)

      // Load graph data
      // Change this line in handleCaseSelect function:
      const graphResponse = await fetch(`/api/dependency-analysis/${caseType}`)
      if (graphResponse.ok) {
        const graphData = await graphResponse.json()
        setGraphData(graphData)
      }

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGetStarted = () => {
    setShowLanding(false)
  }

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cloud Resource Allocation System</h1>
        <p>Compare Greedy vs Dynamic Programming Scheduling Algorithms</p>
      </header>

      <main className="app-main">
        <CaseSelector onCaseSelect={handleCaseSelect} loading={loading} />

        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}

        {simulationData && (
          <>
            <MetricsDashboard data={simulationData} />
            <AlgorithmComparison data={simulationData} />
            <ComplexityAnalysis data={simulationData} />
            <GanttCharts data={simulationData} />
            {graphData && <DependencyGraph data={graphData} />}  {/* Add this line */}
            <ComparisonSummary data={simulationData} />
            <div className="project-description">
              <h2>About the Project</h2>
              <p>
                This project evaluates cloud task scheduling efficiency using Greedy and Dynamic Programming
                algorithms under diverse workload conditions. The goal is to identify performance behavior
                across best, worst, and mixed cases.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App