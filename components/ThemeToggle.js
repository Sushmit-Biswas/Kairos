'use client';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    // Read saved preference
    const saved = localStorage.getItem('kairos-theme') || 'system';
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const applyTheme = (mode) => {
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', mode);
    }
  };

  const handleChange = (mode) => {
    setTheme(mode);
    localStorage.setItem('kairos-theme', mode);
    applyTheme(mode);
  };

  // Listen for system theme changes when in system mode
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  return (
    <div className="theme-toggle-group">
      <button
        className={`theme-toggle-btn ${theme === 'light' ? 'active' : ''}`}
        onClick={() => handleChange('light')}
        title="Light mode"
      >
        ☀️
      </button>
      <button
        className={`theme-toggle-btn ${theme === 'system' ? 'active' : ''}`}
        onClick={() => handleChange('system')}
        title="System default"
      >
        💻
      </button>
      <button
        className={`theme-toggle-btn ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => handleChange('dark')}
        title="Dark mode"
      >
        🌙
      </button>
    </div>
  );
}
