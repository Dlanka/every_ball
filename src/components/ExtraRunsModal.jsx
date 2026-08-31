import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useHaptics } from '../hooks/useHaptics';

/**
 * Slide-up tray for selecting EXTRA runs on a Wide or No Ball.
 *
 * Cricket rule:
 *   WD / NB always carries a 1-run PENALTY automatically.
 *   User selects ADDITIONAL runs (off bat, byes, or boundary) on top of that penalty.
 *
 *   e.g.  WD + 0 extra  = 1 run total
 *         WD + 1 extra  = 2 runs total
 *         WD + 4 extra  = 5 runs total (wide + boundary)
 *         NB + 4 extra  = 5 runs total (NB penalty + 4 off bat)
 */
export function ExtraRunsModal({ isOpen, ballType, withWicket, onConfirm, onClose }) {
  const { vibrateTap } = useHaptics();
  const [extraRuns, setExtraRuns] = useState(0);

  if (!isOpen) return null;

  const PENALTY = 1;
  const totalRuns = PENALTY + extraRuns;
  const label = ballType === 'WD' ? 'WIDE BALL' : 'NO BALL';

  // Extra run options above the automatic penalty
  const EXTRA_OPTIONS = [
    { extra: 0, display: 'None', sub: `Total ${PENALTY} run` },
    { extra: 1, display: '+1', sub: `Total ${PENALTY + 1} runs` },
    { extra: 2, display: '+2', sub: `Total ${PENALTY + 2} runs` },
    { extra: 3, display: '+3', sub: `Total ${PENALTY + 3} runs` },
    { extra: 4, display: '+4', sub: `Total ${PENALTY + 4} runs` },
    { extra: 6, display: '+6', sub: `Total ${PENALTY + 6} runs` },
  ];

  const handleConfirm = () => {
    vibrateTap();
    onConfirm(extraRuns, withWicket);
    setExtraRuns(0);
  };

  const handleClose = () => {
    vibrateTap();
    setExtraRuns(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={handleClose} />

      {/* Tray */}
      <div className="relative w-full max-w-md bg-umpire-card border-t-2 border-umpire-border rounded-t-3xl p-5 pb-8 shadow-2xl space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
              ballType === 'WD' ? 'bg-amber-500 text-amber-950' : 'bg-pink-600 text-white'
            }`}>
              {label}
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              (+{PENALTY} run automatic penalty)
            </span>
            {withWicket && (
              <div className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-widest animate-pulse">
                ☠ RUN OUT
              </div>
            )}
          </div>
          <button onClick={handleClose} className="p-1 text-slate-400 hover:text-white ml-2 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Runs Preview */}
        <div className={`rounded-2xl px-4 py-2.5 flex items-center justify-between border ${
          ballType === 'WD'
            ? 'bg-amber-500/10 border-amber-500/30'
            : 'bg-pink-600/10 border-pink-500/30'
        }`}>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">TOTAL RUNS THIS BALL</span>
          <span className={`text-2xl font-black font-mono ${
            ballType === 'WD' ? 'text-amber-400' : 'text-pink-400'
          }`}>
            {totalRuns}
          </span>
        </div>

        {/* Extra run options */}
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            EXTRA RUNS (above {PENALTY} run penalty)
          </p>
          <div className="grid grid-cols-3 gap-2">
            {EXTRA_OPTIONS.map(({ extra, display, sub }) => (
              <button
                key={extra}
                onClick={() => { vibrateTap(); setExtraRuns(extra); }}
                className={`py-3 rounded-2xl border font-black text-base flex flex-col items-center justify-center gap-0.5 transition-all btn-tactile ${
                  extraRuns === extra
                    ? ballType === 'WD'
                      ? 'bg-amber-500 text-amber-950 border-amber-300 scale-105 shadow-lg'
                      : 'bg-pink-600 text-white border-pink-300 scale-105 shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-600'
                }`}
              >
                <span>{display}</span>
                <span className={`text-[9px] font-bold leading-none ${
                  extraRuns === extra ? 'opacity-80' : 'text-slate-500'
                }`}>{sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Confirm */}
        <button
          onClick={handleConfirm}
          className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all btn-tactile shadow-xl ${
            ballType === 'WD'
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-amber-950'
              : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          CONFIRM — {label}: {totalRuns} RUN{totalRuns !== 1 ? 'S' : ''} TOTAL
          {withWicket ? ' + WICKET (RUN OUT)' : ''}
        </button>
      </div>
    </div>
  );
}
