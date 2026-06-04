import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api';
import { setSession, getSession } from '../lib/storage';

type Mode = 'home' | 'create' | 'join';
type Tournament = '2026' | '2022';

export default function HomePage() {
  const navigate = useNavigate();
  const { code: urlCode } = useParams<{ code?: string }>();
  const [mode, setMode] = useState<Mode>(urlCode ? 'join' : 'home');
  const [tournament, setTournament] = useState<Tournament>('2026');
  const [bonusTypes, setBonusTypes] = useState(['SEMI_FINALIST', 'FINALIST', 'CHAMPION']);
  const [roomName, setRoomName] = useState('');
  const [nickname, setNickname] = useState('');
  const [joinCode, setJoinCode] = useState(urlCode ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const session = getSession();
    if (session && !urlCode) navigate('/matches');
    if (urlCode) setMode('join');
  }, [urlCode]);

  async function handleCreate() {
    if (!roomName.trim() || !nickname.trim()) return setError('Bitte Raumname und Spitzname eingeben');
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/rooms', { roomName, nickname, tournament, bonusTypes });
      setSession(data);
      navigate('/matches');
    } catch (e: any) {
      setError(e.response?.data?.error ?? 'Erstellen fehlgeschlagen');
    } finally { setLoading(false); }
  }

  async function handleJoin() {
    if (!joinCode.trim() || !nickname.trim()) return setError('Bitte Einladungscode und Spitzname eingeben');
    setLoading(true); setError('');
    try {
      const { data } = await api.post(`/rooms/${joinCode.trim().toUpperCase()}/join`, { nickname });
      setSession(data);
      navigate('/matches');
    } catch (e: any) {
      setError(e.response?.data?.error ?? 'Beitreten fehlgeschlagen, bitte Einladungscode prüfen');
    } finally { setLoading(false); }
  }

  const session = getSession();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1920&q=80&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/75 via-green-900/70 to-green-950/90" />

      {/* Hero */}
      <div className="relative z-10 text-center text-white mb-10">
        <div className="text-7xl mb-4">⚽</div>
        <h1 className="text-4xl font-black tracking-tight mb-3">WM-Tipp</h1>
        <p className="text-xl font-bold text-white mb-1 drop-shadow">
          Tippen mit Freunden &amp; Familie
        </p>
        <p className="text-green-200 text-sm mb-3">FIFA World Cup Tippspiel</p>
        <div className="flex items-center justify-center gap-4 text-xs text-green-300">
          <span>✓ Richtiger Ausgang +1 Pt.</span>
          <span>·</span>
          <span>✓ Exakter Treffer +3 Pt.</span>
        </div>
      </div>

      {/* Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        {mode === 'home' && (
          <>
            {session && (
              <button
                onClick={() => navigate('/matches')}
                className="w-full mb-3 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition"
              >
                Weiter spielen →
              </button>
            )}
            <button
              onClick={() => { setMode('create'); setError(''); }}
              className="w-full mb-3 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition"
            >
              Raum erstellen
            </button>
            <button
              onClick={() => { setMode('join'); setError(''); }}
              className="w-full py-3 border-2 border-green-600 text-green-700 font-bold rounded-xl hover:bg-green-50 transition"
            >
              Raum beitreten
            </button>
          </>
        )}

        {mode === 'create' && (
          <>
            <h2 className="font-bold text-lg mb-4 text-gray-800">Raum erstellen</h2>
            <div className="flex gap-2 mb-4">
              {(['2026', '2022'] as Tournament[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTournament(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition ${
                    tournament === t
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-green-400'
                  }`}
                >
                  WM {t}
                  {t === '2022' && <span className="block text-xs font-normal opacity-75">Katar · Abgeschlossen</span>}
                  {t === '2026' && <span className="block text-xs font-normal opacity-75">USA/KAN/MEX · Aktuell</span>}
                </button>
              ))}
            </div>
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Bonus-Fragen</div>
              {[
                { type: 'SEMI_FINALIST', label: '🏅 Halbfinalisten', sub: '2 Pkt. pro Treffer' },
                { type: 'FINALIST',      label: '🥈 Finalisten',     sub: '4 Pkt. pro Treffer' },
                { type: 'CHAMPION',      label: '🏆 Weltmeister',    sub: '10 Pkt. bei Treffer' },
              ].map(b => (
                <label key={b.type} className="flex items-center gap-3 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bonusTypes.includes(b.type)}
                    onChange={e => setBonusTypes(prev =>
                      e.target.checked ? [...prev, b.type] : prev.filter(t => t !== b.type)
                    )}
                    className="w-4 h-4 accent-green-600"
                  />
                  <span className="text-sm text-gray-700 font-medium">{b.label}</span>
                  <span className="text-xs text-gray-400 ml-auto">{b.sub}</span>
                </label>
              ))}
            </div>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Raumname (z.B.: Tipprunde der Freunde)"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Dein Spitzname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-xl transition mb-2"
            >
              {loading ? 'Erstelle...' : 'Erstellen & Starten'}
            </button>
            <button onClick={() => setMode('home')} className="w-full text-sm text-gray-500 py-2">← Zurück</button>
          </>
        )}

        {mode === 'join' && (
          <>
            <h2 className="font-bold text-lg mb-4 text-gray-800">Raum beitreten</h2>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-3 text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="6-stelliger Einladungscode"
              value={joinCode}
              maxLength={6}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            />
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Dein Spitzname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-xl transition mb-2"
            >
              {loading ? 'Beitrete...' : 'Raum beitreten'}
            </button>
            {!urlCode && (
              <button onClick={() => setMode('home')} className="w-full text-sm text-gray-500 py-2">← Zurück</button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
