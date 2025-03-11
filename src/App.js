import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <div className="App">
        <ProfilePage />
      </div>
    </Router>
  );
}

export default App; 