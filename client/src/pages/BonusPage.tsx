import { useState, useEffect } from 'react';
import api from '../lib/api';
import { flagUrl } from '../lib/flags';
import { BonusQuestion, BonusPick } from '../types';

const TYPE_CONFIG: Record<string, { icon: string; groupLabel: string; color: string }> = {
  SEMI_FINALIST: { icon: '🏅', groupLabel: '半决赛队伍', color: 'blue' },
  FINALIST:      { icon: '🥈', groupLabel: '决赛队伍',   color: 'purple' },
  CHAMPION:      { icon: '🏆', groupLabel: '世界杯冠军', color: 'yellow' },
};

export default function BonusPage() {
  const [questions, setQuestions] = useState<BonusQuestion[]>([]);
  const [savedPicks, setSavedPicks] = useState<BonusPick[]>([]);
  const [draftPicks, setDraftPicks] = useState<BonusPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    api.get('/bonus').then(({ data }) => {
      setQuestions(data.questions);
      setSavedPicks(data.picks);
      setDraftPicks(data.picks);
      setDeadline(data.deadline ? new Date(data.deadline) : null);
      setIsOpen(data.isOpen);
    }).finally(() => setLoading(false));
  }, []);

  function draftFor(questionId: number): string[] {
    return draftPicks.filter(p => p.question_id === questionId).map(p => p.team_name);
  }

  function savedFor(questionId: number): string[] {
    return savedPicks.filter(p => p.question_id === questionId).map(p => p.team_name);
  }

  function pointsFor(questionId: number): number | null {
    const qPicks = savedPicks.filter(p => p.question_id === questionId);
    if (qPicks.length === 0 || qPicks.every(p => p.points === null)) return null;
    return qPicks.reduce((sum, p) => sum + (p.points ?? 0), 0);
  }

  const hasChanges = questions.some(q => {
    return draftFor(q.id).slice().sort().join(',') !== savedFor(q.id).slice().sort().join(',');
  });

  function toggle(question: BonusQuestion, teamName: string) {
    if (!isOpen) return;
    const current = draftFor(question.id);
    let next: string[];
    if (current.includes(teamName)) {
      next = current.filter(t => t !== teamName);
    } else {
      if (current.length >= question.max_picks) {
        if (question.max_picks === 1) next = [teamName];
        else return;
      } else {
        next = [...current, teamName];
      }
    }
    setDraftPicks(prev => [
      ...prev.filter(p => p.question_id !== question.id),
      ...next.map(t => ({ id: 0, user_id: 0, question_id: question.id, team_name: t, points: null })),
    ]);
    setSubmitResult(null);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitResult(null);
    try {
      for (const q of questions) {
        await api.post(`/bonus/${q.id}/picks`, { teams: draftFor(q.id) });
      }
      const { data } = await api.get('/bonus');
      setSavedPicks(data.picks);
      setDraftPicks(data.picks);
      setIsOpen(data.isOpen);
      setSubmitResult('success');
      setTimeout(() => setSubmitResult(null), 3000);
    } catch {
      setSubmitResult('error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">加载中...</div>;
  if (questions.length === 0) return (
    <div className="text-center py-20 text-gray-400 px-4">
      <div className="text-4xl mb-3">🎯</div>
      <div className="text-sm">此房间暂无附加题</div>
    </div>
  );

  const types = ['SEMI_FINALIST', 'FINALIST', 'CHAMPION'] as const;
  const grouped = types.map(type => ({
    type,
    config: TYPE_CONFIG[type],
    questions: questions.filter(q => q.type === type),
  })).filter(g => g.questions.length > 0);

  return (
    <div className="px-4 py-4">
      {/* Deadline banner */}
      {deadline && (
        <div className={`rounded-xl px-4 py-3 mb-4 text-sm text-center ${isOpen ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {isOpen
            ? `⏳ 截止时间 ${deadline.toLocaleString('zh-CN', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })}（首场比赛前30分钟）`
            : '🔒 附加题已截止 — 赛事已开始'}
        </div>
      )}

      {/* Questions */}
      {grouped.map(({ type, config, questions: qs }) => (
        <div key={type} className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{config.icon}</span>
            <h2 className="font-bold text-gray-800">{config.groupLabel}</h2>
            <span className="text-xs text-gray-400 ml-auto">每猜中+{qs[0].points_per_pick}分</span>
          </div>

          {qs.map(q => {
            const selected = isOpen ? draftFor(q.id) : savedFor(q.id);
            const pts = pointsFor(q.id);

            return (
              <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{q.label}</span>
                    {isOpen && q.max_picks > 1 && (
                      <span className="text-xs text-gray-400 ml-2">{selected.length}/{q.max_picks}</span>
                    )}
                  </div>
                  {pts !== null && (
                    <span className={`text-sm font-bold ${pts > 0 ? 'text-green-600' : 'text-red-500'}`}>+{pts} 分</span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {q.teams.map(team => {
                    const isSelected = selected.includes(team.name);
                    const savedPick = savedPicks.find(p => p.question_id === q.id && p.team_name === team.name);
                    const isCorrect = savedPick?.points != null && savedPick.points > 0;
                    const isWrong   = savedPick?.points === 0;

                    return (
                      <button
                        key={team.name}
                        onClick={() => toggle(q, team.name)}
                        disabled={!isOpen || (!isSelected && selected.length >= q.max_picks)}
                        className={`flex flex-col items-center p-2 rounded-lg border-2 text-center transition text-xs font-medium
                          ${isCorrect  ? 'border-green-500 bg-green-100 text-green-700' :
                            isWrong    ? 'border-red-300 bg-red-50 text-red-500' :
                            isSelected && !isOpen ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed' :
                            isSelected ? 'border-green-500 bg-green-50 text-green-700' :
                            !isOpen    ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed' :
                                         'border-gray-200 hover:border-green-400 text-gray-700'}`}
                      >
                        <img src={flagUrl(team.short) ?? undefined} alt={team.name} className="w-8 h-5 object-contain mb-1" />
                        <span className="leading-tight">{team.name}</span>
                        {isCorrect && <span className="text-green-600 font-bold text-xs">✓</span>}
                        {isWrong   && <span className="text-red-400 text-xs">✗</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* Summary + Submit */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <h3 className="font-bold text-gray-700 mb-3">
          {isOpen ? '你的选择' : '🔒 已提交的选择'}
        </h3>

        {questions.map(q => {
          const display = isOpen ? draftFor(q.id) : savedFor(q.id);
          return (
            <div key={q.id} className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0 gap-2">
              <span className="text-xs text-gray-500 w-28 shrink-0 pt-0.5">{q.label}</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {display.length > 0
                  ? display.map(t => (
                      <span key={t} className={`text-xs px-2 py-0.5 rounded-full ${isOpen ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {t}
                      </span>
                    ))
                  : <span className="text-xs text-gray-300">未选择</span>
                }
              </div>
            </div>
          );
        })}

        <div className="mt-4">
          {isOpen ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || !hasChanges}
              className={`w-full py-3 rounded-xl font-bold text-sm transition
                ${submitting
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : hasChanges
                    ? 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              {submitting ? '保存中…' : hasChanges ? '提交选择' : '已保存 ✓'}
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
            >
              🔒 已截止
            </button>
          )}

          {submitResult === 'success' && (
            <p className="text-center text-green-600 text-sm mt-2">选择已保存！</p>
          )}
          {submitResult === 'error' && (
            <p className="text-center text-red-500 text-sm mt-2">保存失败 — 请重试。</p>
          )}
        </div>
      </div>
    </div>
  );
}
