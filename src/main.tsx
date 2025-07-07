import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { HashRouter } from 'react-router-dom';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  );
} else {
  throw new Error("Root element with ID 'root' not found.");
}
