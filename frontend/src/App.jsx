import React, { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import MainContent from './components/MainContent';
import LoginPage from './pages/LoginPage';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [message, setMessage] = useState('Loading...');
  const [current, setCurrent] = useState('dashboard');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (token) {
      document.body.classList.remove('dark', 'light');
      document.body.classList.add(theme);
    }
  }, [theme, token]);

  useEffect(() => {
    if (!token) return;
    document.title = 'Vulkyra Platform';
    fetch('http://localhost:8080/api/health', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMessage(data.status))
      .catch(() => setMessage('API not reachable'));
  }, [token]);

  const handleLogin = (tok) => {
    setToken(tok);
    localStorage.setItem('token', tok);
  };
  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };
  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="container">
      <Sidebar current={current} setCurrent={setCurrent} />
      <div className="right-panel">
        <Topbar onLogout={handleLogout} token={token} />
        <MainContent
          current={current}
          message={message}
          theme={theme}
          toggleTheme={toggleTheme}
          token={token}
        />
      </div>
    </div>
  );
}
