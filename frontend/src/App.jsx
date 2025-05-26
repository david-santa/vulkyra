import React, { useEffect, useState } from 'react';
import logo from './assets/vulkyra-logo.png'
import './App.css';

function Sidebar({ current, setCurrent }) {
  return (
    <nav className="sidebar">
      <img src={logo} alt="Vulkyra logo" className="logo-img-sidebar" />
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

function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/assets')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch assets');
        return res.json();
      })
      .then(data => {
        setAssets(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading assets...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (assets.length === 0) return <div>No assets found.</div>;

  return (
    <div>
      <h2>Assets</h2>
      <table className="assets-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>FQDN</th>
            <th>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr key={asset.id}>
              <td>{asset.id}</td>
              <td>{asset.fqdn}</td>
              <td>{asset.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MainContent({ current, message, theme, toggleTheme }) {
  return (
    <main className="main-content">
      {current === 'dashboard' && <p>Welcome to Vulkyra. Status: <b>{message}</b></p>}
      {current === 'assets' && <AssetsPage />}
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
