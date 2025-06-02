import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Criação do tema global do Material UI
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4F8EF7' },
    secondary: { main: '#FFB300' },
    background: { default: '#181C25', paper: '#23283B' },
  },
  typography: { fontFamily: 'Ubuntu, Arial, sans-serif' },
  shape: { borderRadius: 12 },
});

// Busca o elemento root no HTML
const rootElement = document.getElementById('root');

// Só renderiza o app se o elemento root existir
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      {/* Provider do tema global e reset de CSS */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Componente principal da aplicação */}
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}
else {
  console.error('Root element not found. Make sure there is a <div id="root"></div> in your HTML.');
}