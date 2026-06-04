import { useState, useEffect } from 'react';
import api from '../lib/api';
import { flagUrl } from '../lib/flags';
import { BonusQuestion, BonusPick, BonusTeam } from '../types';

const TYPE_ICON: Record<string, string> = {
  SEMI_FINALIST: '🏅',
  FINALIST: '🥈',
  CHAMPION: '🏆',
};

export default function BonusPage() {
  const [questions, setQuestions] = useState<BonusQuestion[]>([]);
  const [picks, setPicks] = useState<BonusPick[]>([]);
  const [teams, setTeams] = useState<BonusTeam[]>([]);
  const [saving, setSaving] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    api.get('/bonus').then(({ data }) => {
      setQuestions(data.questions);
      setPicks(data.picks);
      setTeams(data.teams);
      setDeadline(data.deadline ? new Date(data.deadline) : null);
      setIsOpen(data.isOpen);
    }).finally(() => setLoading(false));
  }, []);

  function selectedFor(questionId: number): string[] {
    return picks.filter(p => p.question_id === questionId).map(p => p.team_name);
  }

  function pointsFor(questionId: number): number | null {
    const qPicks = picks.filter(p => p.question_id === questionId);
    if (qPicks.length === 0 || qPicks.every(p => p.points === null)) return null;
    return qPicks.reduce((sum, p) => sum + (p.points ?? 0), 0);
  }

  function toggle(question: BonusQuestion, teamName: string) {
    const current = selectedFor(question.id);
    let next: string[];
    if (current.includes(teamName)) {
      next = current.filter(t => t !== teamName);
    } else {
      if (current.length >= question.max_picks) {
        if (question.max_picks === 1) next = [teamName];
        else return; // max reached, ignore
      } else {
        next = [...current, teamName];
      }
    }
    // Optimistic update
    setPicks(prev => {
      const filtered = prev.filter(p => p.question_id !== question.id);
      return [...filtered, ...next.map(t => ({ id: 0, user_id: 0, question_id: question.id, team_name: t, points: null }))];
    });
    save(question.id, next);
  }

  async function save(questionId: number, teamNames: string[]) {
    setSaving(questionId);
    try {
      const { data } = await api.post(`/bonus/${questionId}/picks`, { teams: teamNames });
      if (data.evaluated) {
        // Re-fetch to get real points
        const res = await api.get('/bonus');
        setPicks(res.data.picks);
        setFeedback(prev => ({ ...prev, [questionId]: 'Bewertet!' }));
        setTimeout(() => setFeedback(prev => { const n = { ...prev }; delete n[questionId]; return n; }), 2000);
      }
    } catch {
      // ignore
    } finally {
      setSaving(null);
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Lädt...</div>;
  if (questions.length === 0) return (
    <div className="text-center py-20 text-gray-400 px-4">
      <div className="text-4xl mb-3">🎯</div>
      <div className="text-sm">Keine Bonus-Fragen für diesen Raum</div>
    </div>
  );

  return (
    <div className="px-4 py-4">
      {deadline && (
        <div className={`rounded-xl px-4 py-3 mb-4 text-sm text-center ${isOpen ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {isOpen
            ? `⏳ Abgabe bis ${deadline.toLocaleString('de-DE', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })} (30 Min. vor dem ersten Spiel)`
            : '🔒 Bonus-Abgabe geschlossen — das Turnier hat begonnen'}
        </div>
      )}
      {isOpen && <p className="text-xs text-gray-400 text-center mb-4">Tippe auf ein Team um es auszuwählen · Punkte werden sofort berechnet</p>}

      {questions.map(q => {
        const selected = selectedFor(q.id);
        const pts = pointsFor(q.id);
        const isEvaluated = picks.some(p => p.question_id === q.id && p.points !== null);

        return (
          <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{TYPE_ICON[q.type]}</span>
                <div>
                  <div className="font-bold text-gray-800">{q.label}</div>
                  <div className="text-xs text-gray-400">
                    {q.max_picks > 1 ? `${selected.length} / ${q.max_picks} gewählt` : selected.length === 1 ? '1 gewählt' : 'Noch nicht gewählt'}
                    {' · '}{q.points_per_pick} Pkt. {q.max_picks > 1 ? 'pro Treffer' : 'bei Treffer'}
                  </div>
                </div>
              </div>
              {pts !== null ? (
                <span className={`text-lg font-bold ${pts > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  +{pts} Pkt.
                </span>
              ) : feedback[q.id] ? (
                <span className="text-xs text-green-500 font-medium">{feedback[q.id]}</span>
              ) : saving === q.id ? (
                <span className="text-xs text-gray-400">Speichert…</span>
              ) : null}
            </div>

            {/* Team grid */}
            <div className="grid grid-cols-3 gap-2">
              {teams.map(team => {
                const isSelected = selected.includes(team.name);
                const teamPick = picks.find(p => p.question_id === q.id && p.team_name === team.name);
                const isCorrect = teamPick?.points != null && teamPick.points > 0;
                const isWrong = teamPick?.points === 0;
                const isDisabled = !isOpen || (!isSelected && selected.length >= q.max_picks && q.max_picks > 1);

                return (
                  <button
                    key={team.name}
                    onClick={() => isOpen ? toggle(q, team.name) : undefined}
                    disabled={isDisabled}
                    className={`flex flex-col items-center p-2 rounded-lg border-2 text-center transition text-xs font-medium
                      ${isCorrect  ? 'border-green-500 bg-green-100 text-green-700' :
                        isWrong    ? 'border-red-300 bg-red-50 text-red-500' :
                        isSelected ? 'border-green-500 bg-green-50 text-green-700' :
                        isDisabled ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed' :
                                     'border-gray-200 hover:border-green-400 text-gray-700'}`}
                  >
                    <img
                      src={flagUrl(team.short) ?? undefined}
                      alt={team.name}
                      className="w-8 h-5 object-contain mb-1"
                    />
                    <span className="leading-tight">{team.name}</span>
                    {isCorrect && <span className="text-green-600 font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
