import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactGA from "react-ga4";
import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { NotificationProvider } from './context/NotificationContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
if (process.env.REACT_APP_GOOGLE_ANALYTICS) {
  ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS);
}
root.render(

  <NotificationProvider>
    <App />
    </NotificationProvider>

);

reportWebVitals();
