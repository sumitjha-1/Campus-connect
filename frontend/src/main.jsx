import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext/ThemeContext';
import App from './App';
import './styles/global.css';
import './styles/landing.css';
import './styles/pages.css';
import './styles/events.css';
import './styles/nav.css';
import './styles/lostfound.css';
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter><ThemeProvider><App /></ThemeProvider></BrowserRouter>);