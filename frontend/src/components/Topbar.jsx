import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { fetchWithAuth } from '../utils/api';



function Topbar({ onLogout, token, theme, toggleTheme }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetchWithAuth('http://localhost:8080/api/me', {
      token,
      handleLogout: onLogout,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, [token, onLogout]);

  return (
    <AppBar position="static" elevation={0} color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
          Vulkyra Platform
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Theme toggle button */}
          <Tooltip title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
              {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
          {user && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mr: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {user.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.role}
              </Typography>
            </Box>
          )}
          {onLogout && (
            <Button color="inherit" variant="outlined" onClick={onLogout}>
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default Topbar;
