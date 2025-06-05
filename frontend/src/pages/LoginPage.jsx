import React, { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      onLogin(data.token);
    } else {
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <h2>Login to Vulkyra</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}
