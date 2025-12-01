// API service functions
export const runSimulation = async (caseType) => {
  const response = await fetch('/api/run-simulation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ case_type: caseType }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to run simulation')
  }
  
  return await response.json()
}

export const getCaseTypes = async () => {
  const response = await fetch('/api/case-types')
  
  if (!response.ok) {
    throw new Error('Failed to fetch case types')
  }
  
  return await response.json()
}