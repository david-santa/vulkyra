import React, { useEffect, useState } from 'react';
import './App.css';

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
    </header>
  );
}

function SettingsPage({ theme, toggleTheme }) {
  return (
    <div>
      <h2>Settings</h2>
      <div style={{ marginTop: '2rem' }}>
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={toggleTheme}
          />{' '}
          Dark Mode
        </label>
      </div>
    </div>
  );
}

function MainContent({ current, message, theme, toggleTheme }) {
  return (
    <main className="main-content">
      {current === 'dashboard' && <p>Welcome to Vulkyra. Status: <b>{message}</b></p>}
      {current === 'assets' && <p>Assets page (coming soon!)</p>}
      {current === 'vulnerabilities' && <p>Vulnerabilities page (coming soon!)</p>}
      {current === 'settings' && <SettingsPage theme={theme} toggleTheme={toggleTheme} />}
    </main>
  );
}

export default function App() {
  const [message, setMessage] = useState('Loading...');
  const [current, setCurrent] = useState('dashboard');
  const [theme, setTheme] = useState('dark');

  // Set document.body class on theme change
  useEffect(() => {
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    document.title = `Vulkyra Platform`;
    fetch('http://localhost:8080/api/health')
      .then(res => res.json())
      .then(data => setMessage(data.status))
      .catch(() => setMessage('API not reachable'));
  }, []);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <div className="container">
      <Sidebar current={current} setCurrent={setCurrent} />
      <div className="right-panel">
        <Topbar />
        <MainContent
          current={current}
          message={message}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      </div>
    </div>
  );
}
