import React from 'react';
import './App.css';
import { Generator } from './Generator';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Typography, Toolbar } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#ff847c',
      main: '#e84a5F',
      dark: '#a23342',
      contrastText: '#fff',
    },
    secondary: {
      light: '#8fab8e',
      main: '#749672',
      dark: '#51694f',
      contrastText: '#000',
    },
    background: {
      default: '#1d2529', // Dark background
      paper: '#2a363b',   // Slightly lighter for cards, modals
    },
    action: {
      active: '#feceab'
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Quizbowl Anki Card Generator
              </Typography>
            </Toolbar>
          </AppBar>
        </header>
        <Generator />
        <footer className="App-footer"></footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
