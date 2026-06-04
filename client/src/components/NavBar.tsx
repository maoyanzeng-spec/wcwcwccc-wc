import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getSession, clearSession } from '../lib/storage';

const TABS = [
  { to: '/matches',     icon: '⚽', label: 'Tippen'    },
  { to: '/bonus',       icon: '🎯', label: 'Bonus'     },
  { to: '/leaderboard', icon: '🏆', label: 'Rangliste' },
  { to: '/room',        icon: '👥', label: 'Raum'      },
];

export default function NavBar() {
  const session = getSession();
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  // Close share panel when clicking outside
  useEffect(() => {
    if (!showShare) return;
    function handle(e: MouseEvent) {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShowShare(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [showShare]);

  function copyCode() {
    if (!session) return;
    navigator.clipboard.writeText(session.code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1500);
    });
  }

  function getInviteUrl() {
    return `${window.location.origin}/join/${session!.code}`;
  }

  function getInviteText() {
    const base = `🏆 Komm in meine WM-Tipp Runde "${session!.roomName}"!`;
    const desc = session!.description ? `\n\n${session!.description}` : '';
    return `${base}${desc}\n\nEinladungscode: ${session!.code}`;
  }

  function copyLink() {
    navigator.clipboard.writeText(getInviteUrl()).then(() => {
      setCopiedLink(true);
      setTimeout(() => { setCopiedLink(false); setShowShare(false); }, 1500);
    });
  }

  function logout() {
    clearSession();
    navigate('/');
  }

  return (
    <>
      {/* ── Top bar ── */}
      <header className="bg-green-700 text-white shadow-md">
        <div className="max-w-lg mx-auto px-4 flex items-center justify-between h-14">
          <span className="font-bold text-base flex-shrink-0">⚽ WM-Tipp</span>

          <div className="flex items-center gap-2 flex-shrink-0">
            {session && (
              <div className="relative" ref={shareRef}>
                <button
                  onClick={() => setShowShare(v => !v)}
                  className="flex items-center gap-1.5 bg-white text-green-700 font-bold text-sm px-4 py-2 rounded-full active:bg-green-100 transition"
                >
                  ↗ Einladen
                </button>

                {showShare && (
                  <div className="absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(getInviteText() + '\n' + getInviteUrl())}`}
                      target="_blank" rel="noreferrer"
                      onClick={() => setShowShare(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                      </div>
                      <span className="text-sm font-medium text-gray-800">WhatsApp</span>
                    </a>

                    {/* Telegram */}
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(getInviteUrl())}&text=${encodeURIComponent(getInviteText())}`}
                      target="_blank" rel="noreferrer"
                      onClick={() => setShowShare(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition border-t border-gray-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#2AABEE] flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                      </div>
                      <span className="text-sm font-medium text-gray-800">Telegram</span>
                    </a>

                    {/* WeChat */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getInviteText() + '\n' + getInviteUrl()).then(() => {
                          setCopiedLink(true);
                          setTimeout(() => { setCopiedLink(false); setShowShare(false); }, 2500);
                        });
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition border-t border-gray-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#07C160] flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.148 1.67-1.44 1.187-2.148 2.939-1.604 4.985.88 3.313 4.944 5.145 8.766 4.027a7.152 7.152 0 0 0 2.158-.981.872.872 0 0 1 .556-.1l1.374.907a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1 .181-.559c1.496-1.1 2.442-2.738 2.442-4.564 0-3.453-3.199-6.243-8.34-5.775zm-2.177 3.244c.532 0 .963.441.963.983a.973.973 0 0 1-.963.983.973.973 0 0 1-.963-.983c0-.542.43-.983.963-.983zm4.33 0c.533 0 .963.441.963.983a.973.973 0 0 1-.963.983.973.973 0 0 1-.963-.983c0-.542.43-.983.963-.983z"/></svg>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-800">WeChat</div>
                        <div className="text-xs text-gray-400">
                          {copiedLink ? '✓ Kopiert — in WeChat einfügen!' : 'Nachricht kopieren → in WeChat einfügen'}
                        </div>
                      </div>
                    </button>

                    {/* Email */}
                    <a
                      href={`mailto:?subject=${encodeURIComponent('WM-Tipp Einladung')}&body=${encodeURIComponent(getInviteText() + '\n' + getInviteUrl())}`}
                      onClick={() => setShowShare(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition border-t border-gray-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
                      </div>
                      <span className="text-sm font-medium text-gray-800">E-Mail</span>
                    </a>

                    {/* Copy link */}
                    <button
                      onClick={copyLink}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition border-t border-gray-100"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-gray-600"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {copiedLink ? '✓ Link kopiert!' : 'Link kopieren'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={logout}
              className="text-xs text-green-200 hover:text-white px-2 py-1 rounded-full hover:bg-green-600 transition"
            >
              Neues Spiel
            </button>
          </div>
        </div>

        {session && (
          <div className="bg-green-800 text-center text-xs text-green-200 py-1 flex items-center justify-center gap-2">
            <span className="truncate max-w-[200px]">{session.nickname} · {session.roomName}</span>
            <span>·</span>
            <button
              onClick={copyCode}
              className="font-mono tracking-widest text-white underline decoration-dotted hover:text-green-100 transition flex-shrink-0"
              title="Code kopieren"
            >
              {copiedCode ? 'Kopiert!' : session.code}
            </button>
          </div>
        )}
      </header>

      {/* ── Bottom tab bar ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-lg mx-auto flex">
          {TABS.map(tab => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors
                 ${isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`text-xl leading-none ${isActive ? 'scale-110' : ''} transition-transform`}>
                    {tab.icon}
                  </span>
                  <span className={isActive ? 'text-green-600' : 'text-gray-400'}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-green-600 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
        {/* iOS safe area */}
        <div className="h-safe-bottom bg-white" style={{ height: 'env(safe-area-inset-bottom)' }} />
      </nav>
    </>
  );
}
