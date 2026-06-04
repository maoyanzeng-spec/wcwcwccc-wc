import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../lib/api';
import { Match } from '../types';
import MatchCard from '../components/MatchCard';
import PredictionModal from '../components/PredictionModal';

const STAGES = [
  { key: '', label: '全部' },
  { key: 'GROUP_STAGE', label: '小组赛' },
  { key: 'LAST_32', label: '32强赛' },
  { key: 'LAST_16', label: '16强赛' },
  { key: 'QUARTER_FINALS', label: '8强赛' },
  { key: 'SEMI_FINALS', label: '半决赛' },
  { key: 'FINAL', label: '决赛' },
];

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [stage, setStage] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [predicting, setPredicting] = useState<Match | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/matches', { params: stage ? { stage } : {} });
      setMatches(data);
      setFetchError(false);
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [stage]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const timer = setInterval(load, 30_000);
    return () => clearInterval(timer);
  }, [load]);

  const availableStages = STAGES.filter(
    (s) => s.key === '' || matches.some((m) => m.stage === s.key)
  );

  const groupedMatches = useMemo(() => {
    if (stage !== 'GROUP_STAGE') return null;
    const groups: Record<string, Match[]> = {};
    for (const m of matches) {
      const key = m.group_name ?? 'OTHER';
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [matches, stage]);

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-around bg-white border border-gray-100 rounded-xl shadow-sm px-4 py-3 mb-4 text-center">
        <div>
          <div className="text-lg font-black text-red-500">0</div>
          <div className="text-xs text-gray-500">错误</div>
        </div>
        <div className="w-px h-8 bg-gray-100" />
        <div>
          <div className="text-lg font-black text-green-400">+1</div>
          <div className="text-xs text-gray-500">猜对胜负</div>
          <div className="text-xs text-gray-400">（胜/平/负）</div>
        </div>
        <div className="w-px h-8 bg-gray-100" />
        <div>
          <div className="text-lg font-black text-green-600">+3</div>
          <div className="text-xs text-gray-500">精确比分</div>
          <div className="text-xs text-gray-400">（如 2:1 完全相同）</div>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {availableStages.map((s) => (
          <button
            key={s.key}
            onClick={() => setStage(s.key)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition ${
              stage === s.key
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">加载中...</div>
      ) : fetchError ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">⚠️</div>
          <div className="text-gray-700 text-sm font-semibold">无法连接服务器</div>
          <div className="text-gray-400 text-xs mt-2">请启动服务器后刷新页面</div>
          <button
            onClick={load}
            className="mt-4 px-4 py-2 bg-green-600 text-white text-sm rounded-lg"
          >
            重试
          </button>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">📅</div>
          <div className="text-gray-500 text-sm">暂无比赛数据</div>
        </div>
      ) : groupedMatches ? (
        groupedMatches.map(([groupKey, groupMatches]) => (
          <div key={groupKey}>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 mt-5 first:mt-0 px-1">
              {groupKey.replace('GROUP_', '')} 组
            </h2>
            {groupMatches.map((m) => (
              <MatchCard key={m.id} match={m} onPredict={setPredicting} />
            ))}
          </div>
        ))
      ) : (
        matches.map((m) => (
          <MatchCard key={m.id} match={m} onPredict={setPredicting} />
        ))
      )}

      {predicting && (
        <PredictionModal
          match={predicting}
          onClose={() => setPredicting(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}
