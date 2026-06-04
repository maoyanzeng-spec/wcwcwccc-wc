import { Match } from '../types';
import { flagUrl } from '../lib/flags';
import { getSession } from '../lib/storage';

interface Props {
  match: Match;
  onPredict: (match: Match) => void;
}

const STAGE_LABELS: Record<string, string> = {
  GROUP_STAGE: '小组赛',
  LAST_32: '32强赛',
  LAST_16: '16强赛',
  QUARTER_FINALS: '8强赛',
  SEMI_FINALS: '半决赛',
  THIRD_PLACE: '三四名决赛',
  FINAL: '决赛',
};

export default function MatchCard({ match, onPredict }: Props) {
  const now = new Date();
  const matchTime = new Date(match.match_time);
  const is2022 = getSession()?.tournament === '2022';
  const deadline = new Date(matchTime.getTime() - 30 * 60 * 1000);
  const canPredict = (is2022 || now < deadline) && match.status === 'SCHEDULED';
  const isFinished = match.status === 'FINISHED';
  const isLive = match.status === 'IN_PLAY';

  const pred = match.my_prediction;
  const isScored = pred?.points != null;

  // Show real result once scored (covers both FINISHED and historical test mode)
  const showResult = isFinished || isLive || (isScored && match.home_score != null);

  const stageLabel = STAGE_LABELS[match.stage] ?? match.stage;
  const groupLabel = match.group_name ? ` ${match.group_name.replace('GROUP_', '').replace('_', '')}组` : '';

  function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  // Card border + prediction row background based on points
  function predStyle(pts?: number | null): { border: string; bg: string; text: string; label: string } {
    if (pts === 3) return { border: 'border-green-400',      bg: 'bg-green-100',   text: 'text-green-700', label: '+3 精确' };
    if (pts === 1) return { border: 'border-green-200',      bg: 'bg-green-50',    text: 'text-green-600', label: '+1 正确' };
    if (pts === 0) return { border: 'border-red-300',        bg: 'bg-red-50',      text: 'text-red-600',   label: '0 错误' };
    return          { border: 'border-gray-100',             bg: '',               text: 'text-gray-500',  label: '' };
  }

  const style = predStyle(isScored ? pred!.points : undefined);

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-4 mb-3 ${style.border}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-3 text-xs text-gray-500">
        <span className="bg-gray-100 px-2 py-0.5 rounded-full font-medium">
          {stageLabel}{groupLabel}
        </span>
        <span>{formatTime(match.match_time)}</span>
        {isLive && (
          <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold animate-pulse">
            进行中
          </span>
        )}
      </div>

      {/* Teams + score */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 text-center">
          <img
            src={match.home_team_crest ?? flagUrl(match.home_team_short) ?? undefined}
            alt={match.home_team}
            className="w-10 h-7 mx-auto mb-1 object-contain"
          />
          <div className="font-semibold text-xs leading-tight">{match.home_team}</div>
        </div>

        <div className="text-center min-w-[80px]">
          {showResult ? (
            <div className={`text-2xl font-bold ${isLive ? 'text-red-600' : 'text-gray-800'}`}>
              {match.home_score} <span className="text-gray-400">-</span> {match.away_score}
            </div>
          ) : (
            <div className="text-gray-400 text-sm font-medium">VS</div>
          )}
        </div>

        <div className="flex-1 text-center">
          <img
            src={match.away_team_crest ?? flagUrl(match.away_team_short) ?? undefined}
            alt={match.away_team}
            className="w-10 h-7 mx-auto mb-1 object-contain"
          />
          <div className="font-semibold text-xs leading-tight">{match.away_team}</div>
        </div>
      </div>

      {/* Prediction area */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        {pred ? (
          <div className={`flex items-center justify-between rounded-lg px-3 py-2 ${style.bg}`}>
            <span className="text-xs text-gray-500">我的预测</span>
            <span className="font-semibold text-gray-800">
              {pred.home_score} – {pred.away_score}
            </span>
            {isScored ? (
              <span className={`text-sm font-bold ${style.text}`}>{style.label}</span>
            ) : canPredict ? (
              <button onClick={() => onPredict(match)} className="text-xs text-green-600 underline">
                修改
              </button>
            ) : null}
          </div>
        ) : canPredict ? (
          <button
            onClick={() => onPredict(match)}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition"
          >
            提交预测
          </button>
        ) : (
          <div className="text-center text-xs text-gray-400">
            {isFinished ? '未提交预测' : '预测已截止'}
          </div>
        )}
      </div>
    </div>
  );
}
