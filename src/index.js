import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Correct import for the App component
import './App.css'; // If you're using styles
import './style.scss';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
const root=ReactDOM.createRoot(document.getElementById("root"));
//test for github
root.render(
  <AuthContextProvider>
  <ChatContextProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  </ChatContextProvider>,
  </AuthContextProvider>,

);
