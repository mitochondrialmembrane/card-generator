import React from 'react';
import './App.css';
import { Generator } from './Generator';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Typography, Toolbar } from '@mui/material';
import { Info } from "./info";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    secondary: {
      light: '#ffd86b',
      main: '#eda726',
      dark: '#b36b14',
      contrastText: '#000',
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
            <Toolbar sx={{
              display: "flex",
              justifyContent: "space-between"
            }}>
              <Typography variant="h6" component="div">
                Quizbowl Anki Card Generator
              </Typography>
              <Info />
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
