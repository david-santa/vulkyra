import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import MainContent from './components/MainContent';
import LoginPage from './pages/LoginPage';

// MUI theme imports
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';

const fetchWithAuth = (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  return fetch(url, { ...options, headers })
    .then(async res => {
      if (res.status === 401 || res.status === 403) {
        // Unauthorized, force logout
        handleLogout(); // You may need to pass this as a prop/context
        throw new Error('Unauthorized');
      }
      // Optional: handle other error statuses
      return res;
    });
};

// Your color palettes
const lightPalette = {
  mode: 'light',
  background: { default: '#f5f6fa', paper: '#ffffff' },
  primary: { main: '#29c7ac' },
  secondary: { main: '#5e35b1' },
  text: { primary: '#23234a', secondary: '#61677c' },
};

const darkPalette = {
  mode: 'dark',
  background: { default: '#181a22', paper: '#23234a' },
  primary: { main: '#29c7ac' },
  secondary: { main: '#7f53ac' },
  text: { primary: '#f5f5f5', secondary: '#b0b4c3' },
};

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [message, setMessage] = useState('Loading...');
  const [current, setCurrent] = useState('dashboard');
  const [theme, setTheme] = useState('dark');

  // Set body class for your own CSS
  useEffect(() => {
    if (token) {
      document.body.classList.remove('dark', 'light');
      document.body.classList.add(theme);
    }
  }, [theme, token]);

  useEffect(() => {
    if (!token) return;
    document.title = 'Vulkyra Platform';
    fetchWithAuth('http://localhost:8080/api/health', {
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

  // Create the MUI theme (only changes palette for MUI components)
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: theme === 'light' ? lightPalette : darkPalette,
      }),
    [theme]
  );

    if (!token) {
    return (
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <LoginPage onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar is permanent and on the left */}
        <Sidebar current={current} setCurrent={setCurrent} />
        {/* Main area grows to fill the rest */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Topbar onLogout={handleLogout} token={token} theme={theme} toggleTheme={toggleTheme}/>
          <MainContent
            current={current}
            message={message}
            theme={theme}
            toggleTheme={toggleTheme}
            token={token}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
