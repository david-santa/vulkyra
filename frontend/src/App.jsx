import React, { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch('http://localhost:8080/api/health')
      .then(res => res.json())
      .then(data => setMessage(data.status))
      .catch(err => setMessage('API not reachable'))
  }, [])

  return (
    <div>
      <h1>Vulkyra Platform</h1>
      <p>{message}</p>
    </div>
  )
}

export default App

