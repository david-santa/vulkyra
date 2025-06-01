import React, { useEffect, useState } from 'react';
import logo from './assets/vulkyra-logo.png'
import './App.css';

function Sidebar({ current, setCurrent }) {
  return (
    <nav className="sidebar">
      <img src={logo} alt="Vulkyra logo" className="logo-img-sidebar" />
      <button className={current === 'dashboard' ? 'active' : ''} onClick={() => setCurrent('dashboard')}>Dashboard</button>
      <button className={current === 'teams' ? 'active' : ''} onClick={() => setCurrent('teams')}>Teams</button>
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

// AssetsPage with table functionality
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

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/teams')
      .then(res => res.json())
      .then(data => {
        setTeams(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  // Find parent name helper
  const getParentName = (parentId) => {
    if (!parentId) return <span style={{ color: '#888' }}>ROOT</span>;
    const parent = teams.find(t => t.id === parentId);
    return parent ? parent.name : <span style={{ color: '#888' }}>Unknown</span>;
  };

  // Build tree structure from flat array
  const buildTeamTree = (teamsList) => {
    const map = {};
    teamsList.forEach(team => (map[team.id] = { ...team, children: [] }));
    const roots = [];

    teamsList.forEach(team => {
      if (team.parent_id && map[team.parent_id]) {
        map[team.parent_id].children.push(map[team.id]);
      } else {
        roots.push(map[team.id]);
      }
    });

    return roots;
  };

  // Recursive rendering of tree
  const renderTree = (nodes) => (
    <ul className="teams-tree">
      {nodes.map(node => (
        <li key={node.id}>
          <span className="team-node" style={{ fontWeight: node.parent_id == null ? 'bold' : 'normal' }}>
            {node.name}
            <span className="team-email">({node.email})</span>
          </span>
          {node.children && node.children.length > 0 && renderTree(node.children)}
        </li>
      ))}
    </ul>
  );

  if (loading) return <div>Loading teams...</div>;

  const treeRoots = buildTeamTree(teams);

  return (
    <div>
      <h2>Teams</h2>
      <table className="teams-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Parent Team</th>
          </tr>
        </thead>
        <tbody>
          {teams.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", color: "#888" }}>
                No teams found.
              </td>
            </tr>
          ) : (
            teams.map(team => (
              <tr key={team.id}>
                <td data-label="Name">{team.name}</td>
                <td data-label="Email">{team.email}</td>
                <td data-label="Parent Team">{getParentName(team.parent_id)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {teams.length > 0 && (
        <div className="teams-tree-container">
          <h3 style={{ marginBottom: '0.5em' }}>Team Hierarchy</h3>
            {renderTree(treeRoots)}
        </div>
      )}
    </div>
  );
}


function MainContent({ current, message, theme, toggleTheme }) {
  return (
    <main className="main-content">
      {current === 'dashboard' && <p>Welcome to Vulkyra. Status: <b>{message}</b></p>}
      {current === 'teams' && <TeamsPage />}
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
