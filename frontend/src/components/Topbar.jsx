import React from 'react';

export default function Topbar({ onLogout }) {
  return (
    <header className="topbar">
      <h1 className="project-title">Vulkyra Platform</h1>
      {onLogout && <button style={{ float: 'right' }} onClick={onLogout}>Logout</button>}
    </header>
  );
}