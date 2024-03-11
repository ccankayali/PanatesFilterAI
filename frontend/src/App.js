import React, { useState } from 'react';
import './App.css';

function App() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim() })
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }

      const data = await response.json();
      let displayMessage = `Message: ${data.message}`;
      if (data.details) {
        displayMessage += ` | Details: ${data.details}`;
      }
      setResponseMessage(displayMessage);
      setContent('');
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage(`Error sending data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit} className="form">
        <textarea
          className="textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Dakika başına sınırlı hakkınız vardır."
          disabled={loading}
        />
        <button type="submit" className="button" disabled={loading || !content.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
      {responseMessage && <div className="responseMessage">{responseMessage}</div>}
    </div>
  );
}

export default App;
