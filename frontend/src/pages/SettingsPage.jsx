import React from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Paper,
} from '@mui/material';

export default function SettingsPage({ theme, toggleTheme }) {
  return (
    <Box sx={{ maxWidth: 400, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>
        <Box sx={{ mt: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={theme === 'dark'}
                onChange={toggleTheme}
                color="primary"
              />
            }
            label="Dark Mode"
          />
        </Box>
      </Paper>
    </Box>
  );
}
