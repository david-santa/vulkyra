import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import TeamsPage from '../pages/TeamsPage';
import AssetsPage from '../pages/AssetsPage';
import SettingsPage from '../pages/SettingsPage';
import VulnerabilitiesPage from '../pages/VulnerabilitiesPage';

export default function MainContent({ current, message, theme, toggleTheme, token }) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        bgcolor: 'background.default',
        minHeight: 'calc(100vh - 64px)', // Adjust if your AppBar is a different height
        overflow: 'auto',
      }}
    >
      {current === 'dashboard' && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Welcome to Vulkyra.
          </Typography>
          <Typography>
            Status: <b>{message}</b>
          </Typography>
        </Paper>
      )}
      {current === 'teams' && <TeamsPage token={token} />}
      {current === 'assets' && <AssetsPage token={token} />}
      {current === 'vulnerabilities' && <VulnerabilitiesPage token={token} />}
      {current === 'settings' && <SettingsPage theme={theme} toggleTheme={toggleTheme} />}
    </Box>
  );
}
