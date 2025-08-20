import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // State to store the message from the backend
  const [backendMessage, setBackendMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    // The URL of our Django health-check endpoint
    const apiUrl = 'http://127.0.0.1:8000/api/health-check/';

    axios.get(apiUrl)
      .then(response => {
        // On success, update the state with the message
        setBackendMessage(response.data.message);
        setLoading(false);
      })
      .catch(error => {
        // On failure, log the error and update the error state
        console.error("There was an error fetching data!", error);
        setError("Could not connect to the backend. Is the Django server running?");
        setLoading(false);
      });
  }, []); // The empty array [] means this effect runs only once

  return (
    <div className="App">
      <header className="App-header">
        <h1>Puncture Wala Platform</h1>
        <h2>Frontend-Backend Connection Status</h2>
        <div>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {backendMessage && <p style={{ color: 'lightgreen' }}>{backendMessage}</p>}
        </div>
      </header>
    </div>
  );
}

export default App;