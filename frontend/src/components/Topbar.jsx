import React, { useEffect, useState } from 'react';

function Topbar({onLogout, token}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/me', {
      headers:{
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

    console.log("Topbar mounted")

  return (
    <header className="topbar">
      <h1 className="project-title">Vulkyra Platform</h1>
       {onLogout && <button style={{ float: 'right' }} onClick={onLogout}>Logout</button>}
      {user && (
        <div className="topbar-user">
          <span className="topbar-username">{user.username}</span>
          <span className="topbar-role">{user.role}</span>
        </div>
      )}
    </header>
  );
}
export default Topbar;
