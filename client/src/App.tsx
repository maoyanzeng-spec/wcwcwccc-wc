import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getSession } from './lib/storage';
import HomePage from './pages/HomePage';
import RoomPage from './pages/RoomPage';
import MatchesPage from './pages/MatchesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import BonusPage from './pages/BonusPage';
import NavBar from './components/NavBar';

function Protected({ children }: { children: React.ReactNode }) {
  if (!getSession()) return <Navigate to="/" replace />;
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-lg mx-auto pb-20">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/join/:code" element={<HomePage />} />
        <Route path="/room" element={<Protected><RoomPage /></Protected>} />
        <Route path="/matches" element={<Protected><MatchesPage /></Protected>} />
        <Route path="/leaderboard" element={<Protected><LeaderboardPage /></Protected>} />
        <Route path="/bonus" element={<Protected><BonusPage /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
