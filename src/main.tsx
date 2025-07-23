import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { HashRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; 

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    
    <React.StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}> 
        <HashRouter>
          <App />
        </HashRouter>
      </GoogleOAuthProvider>
    </React.StrictMode>
    
  );
} else {
  throw new Error("Root element with ID 'root' not found.");
}

