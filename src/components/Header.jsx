import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Settings, History, Maximize2, Minimize2 } from 'lucide-react';
import { useHaptics } from '../hooks/useHaptics';

function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggle = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.warn('Fullscreen not supported:', e);
    }
  };

  return { isFullscreen, toggle };
}

export function Header({
  matchTitle,
  maxOvers,
  maxWickets,
  isLocked,
  onToggleLock,
  onOpenReset,
  onOpenHistory,
  completedOvers,
}) {
  const { vibrateTap } = useHaptics();
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

  return (
    <header className="flex items-center justify-between bg-umpire-card border-b border-umpire-border px-3.5 py-2.5 sticky top-0 z-30 shadow-md">
      {/* Title & Target Info - roomy left side */}
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center font-black text-sky-400 text-xs font-mono shrink-0">
          UC
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-extrabold text-white leading-tight truncate">
            {matchTitle}
          </h2>
          <div className="text-[10px] font-bold text-slate-400 font-mono tracking-wider truncate">
            {maxOvers} OVERS • {maxWickets} WKTS
          </div>
        </div>
      </div>

      {/* Header Actions - 4 uniform, beautifully spaced square icon buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* History */}
        <button
          onClick={() => { vibrateTap(); onOpenHistory(); }}
          title="Over History"
          className="relative w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-sky-400 flex items-center justify-center btn-tactile transition-colors"
        >
          <History className="w-4.5 h-4.5 text-slate-300" />
          {completedOvers > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-sm">
              {completedOvers}
            </span>
          )}
        </button>

        {/* Settings / Reset */}
        <button
          onClick={() => { vibrateTap(); onOpenReset(); }}
          title="Match Settings & Reset"
          className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center btn-tactile transition-colors"
        >
          <Settings className="w-4.5 h-4.5 text-slate-300" />
        </button>

        {/* Pocket Lock */}
        <button
          onClick={() => { vibrateTap(); onToggleLock(); }}
          title={isLocked ? "Screen Locked (Tap to Unlock)" : "Pocket Lock (Prevent Accidental Taps)"}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all btn-tactile ${
            isLocked
              ? 'bg-rose-600 text-white border-rose-400 shadow-md glow-wicket'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          {isLocked ? (
            <Lock className="w-4.5 h-4.5 text-white" />
          ) : (
            <Unlock className="w-4.5 h-4.5 text-emerald-400" />
          )}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => { vibrateTap(); toggleFullscreen(); }}
          title={isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all btn-tactile ${
            isFullscreen
              ? 'bg-sky-600 border-sky-400 text-white shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-sky-400 hover:border-sky-800'
          }`}
        >
          {isFullscreen
            ? <Minimize2 className="w-4.5 h-4.5" />
            : <Maximize2 className="w-4.5 h-4.5" />}
        </button>
      </div>
    </header>
  );
}
