import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { NotificationProvider } from './context/NotificationContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <NotificationProvider>
    <App />
    </NotificationProvider>

);

reportWebVitals();
