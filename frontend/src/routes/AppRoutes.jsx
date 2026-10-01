import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Events from '../pages/Events/Events';
import LostFound from '../pages/LostFound/LostFound';
import Calibrate from '../pages/LostFound/Calibrate';
import ToolPage from '../pages/Tool/ToolPage';

export default function AppRoutes() {
  return (<Routes>
    <Route path="/" element={<Home />} />
    <Route path="/lost-and-found" element={<LostFound />} />
    <Route path="/marketplace" element={<ToolPage k="market" />} />
    <Route path="/jobs-alumni" element={<ToolPage k="alumni" />} />
    <Route path="/campus-assistance" element={<ToolPage k="help" />} />
    <Route path="/events" element={<Events />} />
    <Route path="/lf-calibrate" element={<Calibrate />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>);
}