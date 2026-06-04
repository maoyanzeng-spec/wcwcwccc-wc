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
  const [description, setDescription] = useState('');
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
    if (!roomName.trim() || !nickname.trim()) return setError('请输入房间名和昵称');
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/rooms', { roomName, nickname, tournament, bonusTypes, description });
      setSession(data);
      navigate('/matches');
    } catch (e: any) {
      setError(e.response?.data?.error ?? '创建失败');
    } finally { setLoading(false); }
  }

  async function handleJoin() {
    if (!joinCode.trim() || !nickname.trim()) return setError('请输入邀请码和昵称');
    setLoading(true); setError('');
    try {
      const { data } = await api.post(`/rooms/${joinCode.trim().toUpperCase()}/join`, { nickname });
      setSession(data);
      navigate('/matches');
    } catch (e: any) {
      setError(e.response?.data?.error ?? '加入失败，请检查邀请码');
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
        <h1 className="text-4xl font-black tracking-tight mb-3">我猜世界杯</h1>
        <p className="text-xl font-bold text-white mb-1 drop-shadow">
          和朋友家人一起竞猜
        </p>
        <p className="text-green-200 text-sm mb-4">FIFA 世界杯竞猜游戏</p>
        <div className="bg-white/10 rounded-2xl px-5 py-3 text-left space-y-1.5 text-xs text-green-100">
          <div className="text-white font-semibold text-xs uppercase tracking-wide mb-2 opacity-70">积分</div>
          <div className="flex justify-between gap-6">
            <span>✓ 猜对胜负</span>
            <span className="font-bold text-white">+1 分</span>
          </div>
          <div className="flex justify-between gap-6">
            <span>✓ 精确比分</span>
            <span className="font-bold text-white">+3 分</span>
          </div>
          <div className="border-t border-white/20 my-1" />
          <div className="text-white font-semibold text-xs uppercase tracking-wide mb-1 opacity-70">附加题</div>
          <div className="flex justify-between gap-6">
            <span>🏅 半决赛晋级队（每支）</span>
            <span className="font-bold text-white">+2 分</span>
          </div>
          <div className="flex justify-between gap-6">
            <span>🥈 决赛晋级队（每支）</span>
            <span className="font-bold text-white">+4 分</span>
          </div>
          <div className="flex justify-between gap-6">
            <span>🏆 世界杯冠军</span>
            <span className="font-bold text-white">+10 分</span>
          </div>
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
                继续游戏 →
              </button>
            )}
            <button
              onClick={() => { setMode('create'); setError(''); }}
              className="w-full mb-3 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition"
            >
              创建房间
            </button>
            <button
              onClick={() => { setMode('join'); setError(''); }}
              className="w-full py-3 border-2 border-green-600 text-green-700 font-bold rounded-xl hover:bg-green-50 transition"
            >
              加入房间
            </button>
          </>
        )}

        {mode === 'create' && (
          <>
            <h2 className="font-bold text-lg mb-4 text-gray-800">创建房间</h2>
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
                  世界杯 {t}
                  {t === '2022' && <span className="block text-xs font-normal opacity-75">卡塔尔 · 已结束</span>}
                  {t === '2026' && <span className="block text-xs font-normal opacity-75">美/加/墨 · 进行中</span>}
                </button>
              ))}
            </div>
            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">附加题</div>
              {[
                { type: 'SEMI_FINALIST', label: '🏅 半决赛队伍', sub: '选4支队 · 每支+2分' },
                { type: 'FINALIST',      label: '🥈 决赛队伍',   sub: '选2支队 · 每支+4分' },
                { type: 'CHAMPION',      label: '🏆 世界杯冠军', sub: '猜对+10分' },
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
              placeholder="房间名（例如：好友竞猜群）"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="你的昵称"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <div className="relative mb-4">
              <textarea
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                placeholder="简介（选填）– 例如：最后三名请客吃饭 🍕"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                rows={3}
              />
              <span className="absolute bottom-2 right-3 text-xs text-gray-300">{description.length}/200</span>
            </div>
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-xl transition mb-2"
            >
              {loading ? '创建中...' : '创建并开始'}
            </button>
            <button onClick={() => setMode('home')} className="w-full text-sm text-gray-500 py-2">← 返回</button>
          </>
        )}

        {mode === 'join' && (
          <>
            <h2 className="font-bold text-lg mb-4 text-gray-800">加入房间</h2>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-3 text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="6位邀请码"
              value={joinCode}
              maxLength={6}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            />
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="你的昵称"
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
              {loading ? '加入中...' : '加入房间'}
            </button>
            {!urlCode && (
              <button onClick={() => setMode('home')} className="w-full text-sm text-gray-500 py-2">← 返回</button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
