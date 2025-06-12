// src/context/ThemeContext.jsx

import React, { createContext, useState, useContext, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const useColorMode = () => useContext(ColorModeContext);

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                background: { default: '#f5f6fa', paper: '#ffffff' },
                primary: { main: '#29c7ac' },
                secondary: { main: '#5e35b1' },
                text: { primary: '#23234a', secondary: '#61677c' },
              }
            : {
                background: { default: '#181a22', paper: '#23234a' },
                primary: { main: '#29c7ac' },
                secondary: { main: '#7f53ac' },
                text: { primary: '#f5f5f5', secondary: '#b0b4c3' },
              }),
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#e8eaf6' : '#21243a',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === 'light' ? '#e8eaf6' : '#21243a',
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};
