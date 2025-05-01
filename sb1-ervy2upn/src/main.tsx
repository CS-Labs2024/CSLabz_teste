import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { ConfigProvider } from './contexts/ConfigContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
  const saved = localStorage.getItem('darkMode');
  if (saved !== null) {
    return JSON.parse(saved);
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Apply theme class immediately to prevent flash
if (getInitialTheme()) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </ThemeProvider>
  </StrictMode>
);
