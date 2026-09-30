import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
// Future: /login, /register, /dashboard, /events, /lost-and-found, /jobs, /marketplace, /help, /profile
export default function AppRoutes() {
  return (<Routes><Route path="/" element={<Home />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>);
}
