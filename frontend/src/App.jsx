import React, { useEffect, useState } from 'react';
import './App.css'; // Make sure to import your CSS

function Sidebar({ current, setCurrent }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-title">Vulkyra</div>
      <button className={current === 'dashboard' ? 'active' : ''} onClick={() => setCurrent('dashboard')}>Dashboard</button>
      <button className={current === 'assets' ? 'active' : ''} onClick={() => setCurrent('assets')}>Assets</button>
      <button className={current === 'vulnerabilities' ? 'active' : ''} onClick={() => setCurrent('vulnerabilities')}>Vulnerabilities</button>
      <button className={current === 'settings' ? 'active' : ''} onClick={() => setCurrent('settings')}>Settings</button>
    </nav>
  );
}

function Topbar() {
  return (
    <header className="topbar">
      <h1 className="project-title">Vulkyra Platform</h1>
      {/* You could add a user avatar, notifications, etc. here */}
    </header>
  );
}

function MainContent({ current, message }) {
  return (
    <main className="main-content">
      {current === 'dashboard' && <p>Welcome to Vulkyra. Status: <b>{message}</b></p>}
      {current === 'assets' && <p>Assets page (coming soon!)</p>}
      {current === 'vulnerabilities' && <p>Vulnerabilities page (coming soon!)</p>}
      {current === 'settings' && <p>Settings page (coming soon!)</p>}
    </main>
  );
}

export default function App() {
  const [message, setMessage] = useState('Loading...');
  const [current, setCurrent] = useState('dashboard');

  useEffect(() => {
    fetch('http://localhost:8080/api/health')
      .then(res => res.json())
      .then(data => setMessage(data.status))
      .catch(() => setMessage('API not reachable'));
  }, []);

  return (
    <div className="container">
      <Sidebar current={current} setCurrent={setCurrent} />
      <div className="right-panel">
        <Topbar />
        <MainContent current={current} message={message} />
      </div>
    </div>
  );
}