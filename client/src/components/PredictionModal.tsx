import { useState } from 'react';
import { Match } from '../types';
import api from '../lib/api';

interface Props {
  match: Match;
  onClose: () => void;
  onSaved: () => void;
}

export default function PredictionModal({ match, onClose, onSaved }: Props) {
  const [home, setHome] = useState<number>(match.my_prediction?.home_score ?? 1);
  const [away, setAway] = useState<number>(match.my_prediction?.away_score ?? 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    setLoading(true);
    setError('');
    try {
      await api.post('/predictions', { match_id: match.id, home_score: home, away_score: away });
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.response?.data?.error ?? '提交出错，请重试');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg rounded-t-2xl p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div className="text-xs text-gray-500 mb-1">预测比分</div>
          <div className="font-bold text-gray-900">
            {match.home_team_short ?? match.home_team} vs {match.away_team_short ?? match.away_team}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mb-6">
          <ScoreInput label={match.home_team_short ?? match.home_team} value={home} onChange={setHome} />
          <span className="text-2xl text-gray-400 font-light">—</span>
          <ScoreInput label={match.away_team_short ?? match.away_team} value={away} onChange={setAway} />
        </div>

        <div className="bg-green-50 rounded-lg p-3 text-xs text-green-800 text-center mb-4">
          猜对胜负 <strong>+1 分</strong> · 精确比分 <strong>+3 分</strong>
        </div>

        {error && <div className="text-red-500 text-sm text-center mb-3">{error}</div>}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-xl transition text-base"
        >
          {loading ? '提交中...' : '确认预测'}
        </button>
      </div>
    </div>
  );
}

function ScoreInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="text-center">
      <div className="text-xs text-gray-500 mb-2 truncate max-w-[80px]">{label}</div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-9 h-9 rounded-full border-2 border-gray-200 text-xl font-bold text-gray-600 hover:border-green-500 hover:text-green-600 transition flex items-center justify-center"
        >
          −
        </button>
        <span className="text-3xl font-bold w-8 text-center">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-9 h-9 rounded-full border-2 border-gray-200 text-xl font-bold text-gray-600 hover:border-green-500 hover:text-green-600 transition flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  );
}
