import React, { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState('Connecting to server...');

  // Simple test to ensure React connects to Express
  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(res => res.text())
      .then(data => setStatus(data))
      .catch(err => setStatus('Error connecting to API'));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Projeto DW</h1>
      <p>Server Status: <strong>{status}</strong></p>
    </div>
  );
}

export default App;