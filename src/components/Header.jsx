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
      // Fullscreen may not be supported (e.g. some iOS browsers)
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
    <header className="flex items-center justify-between bg-umpire-card border-b border-umpire-border px-3 py-2 sticky top-0 z-30 shadow-md">
      {/* Title & Target Info */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center font-black text-sky-400 text-xs font-mono shrink-0">
          UC
        </div>
        <div>
          <h2 className="text-xs font-bold text-white leading-tight truncate max-w-[100px] sm:max-w-[160px]">
            {matchTitle}
          </h2>
          <div className="text-[9px] font-bold text-slate-500 font-mono tracking-wider">
            {maxOvers} OVERS • {maxWickets} WKTS
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1">
        {/* History */}
        <button
          onClick={() => { vibrateTap(); onOpenHistory(); }}
          title="Over History"
          className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-sky-400 btn-tactile transition-colors"
        >
          <History className="w-4 h-4" />
          {completedOvers > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-sky-500 text-slate-950 text-[8px] font-black flex items-center justify-center">
              {completedOvers}
            </span>
          )}
        </button>

        {/* Settings / Reset */}
        <button
          onClick={() => { vibrateTap(); onOpenReset(); }}
          title="Match Settings & Reset"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white btn-tactile"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Pocket Lock */}
        <button
          onClick={() => { vibrateTap(); onToggleLock(); }}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold border transition-all btn-tactile ${
            isLocked
              ? 'bg-rose-500 text-white border-rose-400 ring-2 ring-rose-500/50 glow-wicket'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          {isLocked ? (
            <><Lock className="w-3.5 h-3.5" /><span>LOCKED</span></>
          ) : (
            <><Unlock className="w-3.5 h-3.5 text-emerald-400" /><span>LOCK</span></>
          )}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => { vibrateTap(); toggleFullscreen(); }}
          title={isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
          className={`p-2 rounded-xl border font-extrabold transition-all btn-tactile ${
            isFullscreen
              ? 'bg-sky-600 border-sky-400 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-sky-400 hover:border-sky-800'
          }`}
        >
          {isFullscreen
            ? <Minimize2 className="w-4 h-4" />
            : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
