import { useState, useEffect } from 'react';
import api from '../lib/api';
import { LeaderboardEntry } from '../types';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const { data } = await api.get('/leaderboard');
      setEntries(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 30_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="px-4 py-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Rangliste</h2>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Lädt...</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Noch niemand hat getippt</div>
      ) : (
        <div className="space-y-2">
          {entries.map((e) => (
            <div
              key={e.id}
              className={`flex items-center gap-3 rounded-xl p-4 ${
                e.is_me ? 'bg-green-50 border-2 border-green-500' : 'bg-white border border-gray-100'
              } shadow-sm`}
            >
              <div className="text-2xl w-8 text-center">
                {MEDALS[e.rank - 1] ?? <span className="text-gray-400 font-semibold">{e.rank}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">
                  {e.nickname} {e.is_me && <span className="text-green-600 text-xs">(Ich)</span>}
                </div>
                <div className="text-xs text-gray-500">
                  Tipps: {e.predictions_count} · Exakt: {e.exact_scores} · Richtig: {e.correct_outcomes}
                </div>
                {e.bonus_points > 0 && (
                  <div className="text-xs text-purple-500 font-medium">
                    ⚡ {e.match_points} Tipp + {e.bonus_points} Bonus
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-green-600">{e.total_points}</div>
                <div className="text-xs text-gray-400">Punkte</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={load}
        className="mt-6 w-full py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
      >
        Rangliste aktualisieren
      </button>
    </div>
  );
}
