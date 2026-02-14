// Import StrictMode from React
// (used to highlight potential problems in development)
import { StrictMode } from 'react';

// Import ReactDOM function to create root for React app
import { createRoot } from 'react-dom/client';

// Global CSS styles for entire app
import './index.css';

// Main App component (root component of your project)
import App from './App.jsx';

// AuthProvider provides authentication context
// (login state, user data, auth functions)
import { AuthProvider } from "./Context/AuthContext.jsx";


// Render React app into the HTML element with id="root"
createRoot(document.getElementById('root')).render(

  // Wrap entire application with AuthProvider
  // so all components can access authentication data
  <AuthProvider>
    <App />
  </AuthProvider>
);