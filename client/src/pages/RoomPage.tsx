import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { getSession } from '../lib/storage';

export default function RoomPage() {
  const session = getSession()!;
  const navigate = useNavigate();
  const [members, setMembers] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get(`/rooms/${session.code}`)
      .then(({ data }) => setMembers(data.members))
      .catch(() => {});
  }, [session.code]);

  function copyInvite() {
    const url = `${window.location.origin}/join/${session.code}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="px-4 py-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-gray-900">{session.roomName}</h2>
          <span className="bg-gray-100 text-gray-600 font-mono text-sm px-3 py-1 rounded-full tracking-widest">
            {session.code}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-2">Hallo, {session.nickname}!</p>
        {session.description && (
          <p className="text-sm text-gray-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2 mb-4 italic">
            {session.description}
          </p>
        )}

        <button
          onClick={copyInvite}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
        >
          <span>{copied ? '✓ Link kopiert!' : '📤 Einladungslink kopieren'}</span>
        </button>
        <p className="text-xs text-gray-400 text-center mt-2">
          Teile mit Freunden, Einladungscode: <strong>{session.code}</strong>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => navigate('/matches')}
          className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm hover:border-green-300 transition"
        >
          <div className="text-2xl mb-1">⚽</div>
          <div className="font-semibold text-sm text-gray-800">Tippen</div>
        </button>
        <button
          onClick={() => navigate('/leaderboard')}
          className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm hover:border-green-300 transition"
        >
          <div className="text-2xl mb-1">🏆</div>
          <div className="font-semibold text-sm text-gray-800">Rangliste</div>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-semibold text-gray-700 mb-3 text-sm">Mitglieder ({members.length})</h3>
        {members.length === 0 ? (
          <div className="text-sm text-gray-400 text-center py-4">Noch keine anderen Mitglieder</div>
        ) : (
          <div className="space-y-2">
            {members.map((m, i) => (
              <div key={m.id} className="flex items-center gap-3">
                <span className="text-lg w-7 text-center">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                </span>
                <span className="flex-1 font-medium text-gray-800">
                  {m.nickname}
                  {m.nickname === session.nickname && <span className="text-xs text-green-500 ml-1">(Ich)</span>}
                </span>
                <span className="font-bold text-green-600">{m.total_points} Pt.</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
