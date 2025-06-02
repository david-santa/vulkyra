import React, { useEffect, useState } from 'react';
import './App.css';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import MainContent from './components/MainContent';

export default function App() {
  const [message, setMessage] = useState('Loading...');
  const [current, setCurrent] = useState('dashboard');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    document.title = 'Vulkyra Platform';
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
