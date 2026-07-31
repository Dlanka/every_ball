import React from 'react';
import { Lock, Unlock, RotateCcw, Settings, AlertCircle } from 'lucide-react';
import { useHaptics } from '../hooks/useHaptics';

export function Header({
  matchTitle,
  maxOvers,
  maxWickets,
  isLocked,
  onToggleLock,
  onOpenReset
}) {
  const { vibrateTap } = useHaptics();

  return (
    <header className="flex items-center justify-between bg-umpire-card border-b border-umpire-border px-4 py-3 sticky top-0 z-30 shadow-md">
      {/* Title & Target Info */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center font-black text-sky-400 text-sm font-mono">
          UC
        </div>
        <div>
          <h2 className="text-sm font-bold text-white leading-tight truncate max-w-[140px] sm:max-w-[200px]">
            {matchTitle}
          </h2>
          <div className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">
            LIMIT: {maxOvers} OVERS • {maxWickets} WKTS
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        {/* Reset / Settings */}
        <button
          onClick={() => {
            vibrateTap();
            onOpenReset();
          }}
          title="Match Settings & Reset"
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white btn-tactile"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Pocket Lock Switch */}
        <button
          onClick={() => {
            vibrateTap();
            onToggleLock();
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold border transition-all btn-tactile ${
            isLocked
              ? 'bg-rose-500 text-white border-rose-400 ring-2 ring-rose-500/50 shadow-lg glow-wicket'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          {isLocked ? (
            <>
              <Lock className="w-4 h-4" />
              <span>LOCKED</span>
            </>
          ) : (
            <>
              <Unlock className="w-4 h-4 text-emerald-400" />
              <span>LOCK</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
