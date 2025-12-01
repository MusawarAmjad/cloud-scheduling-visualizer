import React, { useRef, useEffect, useState } from 'react'

const DependencyGraph = ({ data }) => {
  const containerRef = useRef(null)
  const [graphLoaded, setGraphLoaded] = useState(false)

  useEffect(() => {
    // Load vis-network from CDN
    const loadVisNetwork = () => {
      return new Promise((resolve, reject) => {
        if (window.vis) {
          resolve()
          return
        }

        // Load vis-network CSS
        const cssLink = document.createElement('link')
        cssLink.rel = 'stylesheet'
        cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/vis-network/9.1.6/dist/dist/vis-network.min.css'
        document.head.appendChild(cssLink)

        // Load vis-network JS
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/vis-network/9.1.6/standalone/umd/vis-network.min.js'
        script.async = true
        
        script.onload = () => {
          if (window.vis) {
            setGraphLoaded(true)
            resolve()
          } else {
            reject(new Error('vis-network failed to load'))
          }
        }
        
        script.onerror = () => reject(new Error('Failed to load vis-network'))
        document.head.appendChild(script)
      })
    }

    const createGraph = async () => {
      if (!data || !data.graph_data) return

      try {
        await loadVisNetwork()
        
        const { nodes, edges } = data.graph_data
        const { DataSet, Network } = window.vis

        // Format nodes
        const visNodes = new DataSet(
          nodes.map(node => ({
            id: node.id,
            label: node.label,
            title: `
              Task ${node.id}
              Exec Time: ${node.execution_time} units
              Profit: $${node.profit}
              CPU: ${node.cpu} cores
              RAM: ${node.ram} GB
            `,
            color: node.execution_time > 5 ? '#FF6B6B' : 
                   node.execution_time > 3 ? '#FFA726' : '#4CAF50',
            value: node.execution_time,
            shape: 'dot',
            size: 20 + node.execution_time * 2,
            font: {
              size: 14,
              color: '#333'
            }
          }))
        )

        // Format edges
        const visEdges = new DataSet(
          edges.map(edge => ({
            from: edge.from,
            to: edge.to,
            arrows: 'to',
            color: '#667eea',
            width: 2,
            smooth: true
          }))
        )

        // Create network
        const options = {
          layout: {
            hierarchical: {
              enabled: true,
              direction: 'LR',
              sortMethod: 'directed',
              levelSeparation: 150,
              nodeSpacing: 100
            }
          },
          interaction: {
            dragNodes: true,
            dragView: true,
            zoomView: true,
            hover: true,
            tooltipDelay: 200
          },
          physics: {
            enabled: false,
            hierarchicalRepulsion: {
              centralGravity: 0.0,
              springLength: 100,
              springConstant: 0.01,
              nodeDistance: 120,
              damping: 0.09
            }
          },
          nodes: {
            shapeProperties: {
              useBorderWithImage: true
            }
          },
          edges: {
            smooth: {
              type: 'cubicBezier',
              forceDirection: 'horizontal'
            }
          }
        }

        const networkData = {
          nodes: visNodes,
          edges: visEdges
        }

        new Network(containerRef.current, networkData, options)

      } catch (error) {
        console.error('Failed to create graph:', error)
        // Fallback to simple HTML representation
        containerRef.current.innerHTML = `
          <div style="padding: 20px; color: #666; text-align: center;">
            <h3>⚠️ Graph Visualization Failed to Load</h3>
            <p>Showing dependency structure as text:</p>
            <div style="text-align: left; margin-top: 20px;">
              ${renderFallbackGraph(data)}
            </div>
          </div>
        `
      }
    }

    createGraph()

    return () => {
      // Cleanup
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [data, graphLoaded])

  const renderFallbackGraph = (data) => {
    if (!data || !data.graph_data) return ''
    
    const { nodes, edges } = data.graph_data
    let html = '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">'
    
    nodes.forEach(node => {
      const dependencies = edges
        .filter(edge => edge.to === node.id)
        .map(edge => edge.from)
      
      html += `
        <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; background: #f8f9fa;">
          <strong>T${node.id}</strong><br/>
          Dependencies: ${dependencies.length > 0 ? dependencies.map(d => `T${d}`).join(', ') : 'None'}
        </div>
      `
    })
    
    html += '</div>'
    return html
  }

  if (!data) {
    return (
      <div className="dependency-graph">
        <h2>Task Dependency Graph (DAG)</h2>
        <p>Loading dependency analysis...</p>
      </div>
    )
  }

  return (
    <div className="dependency-graph">
      <h2>Task Dependency Graph (DAG)</h2>
      <p>Visual representation of task dependencies and critical path analysis</p>
      
      <div className="graph-container">
        <div ref={containerRef} style={{ height: '500px', width: '100%' }} />
      </div>

      <div className="graph-analysis">
        <div className="analysis-card">
          <h3>📊 Dependency Analysis</h3>
          <div className="analysis-grid">
            <div className="analysis-item">
              <strong>Total Tasks:</strong> {data.dependency_analysis.total_tasks}
            </div>
            <div className="analysis-item">
              <strong>Tasks with Dependencies:</strong> {data.dependency_analysis.tasks_with_dependencies}
            </div>
            <div className="analysis-item">
              <strong>Max Dependencies per Task:</strong> {data.dependency_analysis.max_dependencies}
            </div>
            <div className="analysis-item">
              <strong>Average Dependencies:</strong> {data.dependency_analysis.avg_dependencies.toFixed(2)}
            </div>
            <div className="analysis-item">
              <strong>Has Cycles:</strong> {data.dependency_analysis.has_cycles ? 'Yes ⚠️' : 'No ✅'}
            </div>
          </div>
        </div>

        <div className="analysis-card">
          <h3>🎯 Critical Path Analysis</h3>
          {data.dependency_analysis.critical_path && data.dependency_analysis.critical_path.length > 0 ? (
            <>
              <div className="critical-path">
                <strong>Critical Path:</strong>
                <div className="path-sequence">
                  {data.dependency_analysis.critical_path.map((taskId, index) => (
                    <span key={taskId} className="path-node">
                      T{taskId}
                      {index < data.dependency_analysis.critical_path.length - 1 && ' → '}
                    </span>
                  ))}
                </div>
                <div className="path-length">
                  <strong>Total Path Length:</strong> {data.dependency_analysis.critical_path_length} time units
                </div>
              </div>
            </>
          ) : (
            <p>No valid critical path detected (possible cycle in dependencies)</p>
          )}
        </div>

        <div className="analysis-card">
          <h3>📋 Topological Order</h3>
          {data.dependency_analysis.topological_order && data.dependency_analysis.topological_order.length > 0 ? (
            <div className="topological-order">
              {data.dependency_analysis.topological_order.map((taskId, index) => (
                <span key={taskId} className="order-node">
                  T{taskId}
                  {index < data.dependency_analysis.topological_order.length - 1 && ', '}
                </span>
              ))}
            </div>
          ) : (
            <p>No valid topological order (graph has cycles)</p>
          )}
        </div>
      </div>

      <div className="graph-legend">
        <h4>Graph Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="color-box green"></div>
            <span>Short Task (&lt; 3 units)</span>
          </div>
          <div className="legend-item">
            <div className="color-box orange"></div>
            <span>Medium Task (3-5 units)</span>
          </div>
          <div className="legend-item">
            <div className="color-box red"></div>
            <span>Long Task (&gt; 5 units)</span>
          </div>
          <div className="legend-item">
            <div className="line-sample"></div>
            <span>Dependency Edge</span>
          </div>
          <div className="legend-item">
            <div className="arrow-sample"></div>
            <span>Execution Order</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DependencyGraph