import React from 'react';
import logo from '../assets/vulkyra-logo.png';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  Toolbar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const drawerWidth = 200;

const menu = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { key: 'teams', label: 'Teams', icon: <GroupIcon /> },
  { key: 'assets', label: 'Assets', icon: <StorageIcon /> },
  { key: 'vulnerabilities', label: 'Vulnerabilities', icon: <WarningAmberIcon /> },
  { key: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

export default function Sidebar({ current, setCurrent }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: 'sidebar' // This will pick up your theme palette if set.
        },
      }}
    >
      <Toolbar sx={{ minHeight: 90, justifyContent: 'center' }}>
        <Box component="img"
          src={logo}
          alt="Vulkyra logo"
          sx={{ height: 60, mb: 2 }}
        />
      </Toolbar>
      <List>
        {menu.map(item => (
          <ListItemButton
            key={item.key}
            selected={current === item.key}
            onClick={() => setCurrent(item.key)}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
