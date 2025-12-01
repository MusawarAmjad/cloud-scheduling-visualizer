import React from 'react'

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Optimize Your Cloud.<br />
            <span className="highlight">Compare Smarter.</span>
          </h1>
          <p className="hero-description">
            This tool lets you analyze cloud scheduling algorithms using real-world inspired datasets. 
            See how Greedy and DP scheduling methods react to different task patterns—from lightweight, 
            profitable tasks to heavy workloads with strict deadlines.
          </p>
          <p className="hero-subdescription">
            Interactive visuals, detailed analytics, and instant comparisons make it easy to discover 
            which algorithm performs best for your cloud environment.
          </p>
          <button className="cta-button" onClick={onGetStarted}>
            Start Analysis →
          </button>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2>What You'll Discover</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Algorithm Performance</h3>
              <p>Compare Greedy (EDF, SJF) vs Dynamic Programming approaches under different workload conditions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Resource Utilization</h3>
              <p>Analyze CPU and RAM usage patterns across virtual machines with interactive Gantt charts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Profit Optimization</h3>
              <p>See which scheduling strategy maximizes revenue while meeting deadlines and resource constraints</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Detailed Analytics</h3>
              <p>Get comprehensive metrics including completion rates, execution times, and complexity analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="test-scenarios">
        <div className="container">
          <h2>Test Scenarios</h2>
          <div className="scenarios-grid">
            <div className="scenario-card best">
              <h3>Best Case</h3>
              <p>Lightweight tasks with generous deadlines and high profit potential</p>
            </div>
            <div className="scenario-card worst">
              <h3>Worst Case</h3>
              <p>Resource-intensive tasks with tight deadlines and challenging constraints</p>
            </div>
            <div className="scenario-card mixed">
              <h3>Mixed Case</h3>
              <p>Real-world scenario with varied task characteristics and requirements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage