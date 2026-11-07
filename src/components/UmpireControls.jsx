import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useHaptics } from '../hooks/useHaptics';

/**
 * Main umpire action panel.
 *
 * Full-height tactile button layout. Run buttons dynamically stretch vertically
 * so buttons are tall and big in both normal and wicket modes.
 */
export function UmpireControls({
  onLegalBall,         // (runs, withWicket) => { overCompleted }
  onOpenExtra,         // (ballType) => void  — opens the ExtraRunsModal
  onUndo,
  canUndo,
  isLocked,
  isInningsCompleted,
  wicketActive,        // boolean — controlled by parent
  onToggleWicket,      // () => void
}) {
  const { vibrateTap, vibrateExtra, vibrateWicket, vibrateOverComplete } = useHaptics();

  const RUN_OPTIONS = [
    { runs: 0, label: 'DOT', sub: '0' },
    { runs: 1, label: '1', sub: '' },
    { runs: 2, label: '2', sub: '' },
    { runs: 3, label: '3', sub: '' },
    { runs: 4, label: '4', sub: '●●' },
    { runs: 6, label: '6', sub: '●●●' },
  ];

  const handleLegal = (runs) => {
    if (isLocked || isInningsCompleted) return;
    if (wicketActive) vibrateWicket(); else vibrateTap();
    const res = onLegalBall(runs, wicketActive);
    if (res?.overCompleted) vibrateOverComplete();
  };

  const handleExtra = (type) => {
    if (isLocked || isInningsCompleted) return;
    vibrateExtra();
    onOpenExtra(type);
  };

  const handleUndo = () => {
    if (isLocked) return;
    vibrateTap();
    onUndo();
  };

  const disabled = isLocked || isInningsCompleted;

  return (
    <div className="flex-1 flex flex-col justify-between gap-2.5 h-full min-h-0">
      {/* Wicket Toggle */}
      <button
        disabled={disabled}
        onClick={() => { vibrateTap(); onToggleWicket(); }}
        className={`w-full py-3.5 rounded-2xl border font-black text-sm tracking-wider flex items-center justify-center gap-2 transition-all btn-tactile shrink-0 ${
          wicketActive
            ? 'bg-rose-600 border-rose-400 text-white glow-wicket animate-pulse'
            : disabled
              ? 'bg-slate-900 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-rose-500 hover:text-rose-400'
        }`}
      >
        <span className="text-lg">☠</span>
        {wicketActive ? 'WICKET ACTIVE — SELECT BALL TYPE BELOW' : '+WICKET (TAP TO ARM)'}
      </button>

      {/* Run Buttons Grid - tall and generous height in both modes */}
      <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-2.5 min-h-0">
        {RUN_OPTIONS.map(({ runs, label, sub }) => (
          <button
            key={runs}
            disabled={disabled}
            onClick={() => handleLegal(runs)}
            className={`flex flex-col items-center justify-center rounded-2xl border font-black transition-all btn-tactile h-full min-h-[66px] ${
              disabled
                ? 'bg-slate-800 border-slate-700 text-slate-500 opacity-50 cursor-not-allowed'
                : wicketActive
                  ? 'bg-gradient-to-b from-rose-700 to-rose-800 border-rose-500 text-white shadow-lg glow-wicket'
                  : runs === 0
                    ? 'bg-gradient-to-b from-slate-700 to-slate-800 border-slate-600 text-slate-200 hover:border-slate-500'
                    : runs === 4 || runs === 6
                      ? 'bg-gradient-to-b from-emerald-500 to-teal-600 border-emerald-400 text-slate-950 shadow-lg glow-dot'
                      : 'bg-gradient-to-b from-sky-600 to-sky-700 border-sky-400 text-white shadow-md'
            }`}
          >
            <span className="text-3xl font-black leading-tight">{label}</span>
            <span className={`text-[10px] font-mono mt-0.5 ${sub ? 'opacity-70' : 'opacity-0 select-none'}`}>
              {sub || '-'}
            </span>
            <span className={`text-[10px] font-black mt-0.5 ${wicketActive ? 'text-rose-300' : 'opacity-0 select-none'}`}>
              +W
            </span>
          </button>
        ))}
      </div>

      {/* Extras Row */}
      <div className="grid grid-cols-2 gap-2.5 shrink-0">
        {/* WIDE */}
        <button
          disabled={disabled}
          onClick={() => handleExtra('WD')}
          className={`py-4 sm:py-5 rounded-2xl border font-black flex flex-col items-center justify-center gap-1 shadow-lg transition-all btn-tactile ${
            disabled
              ? 'bg-slate-800 border-slate-700 text-slate-500 opacity-50 cursor-not-allowed'
              : wicketActive
                ? 'bg-gradient-to-br from-amber-500 to-orange-500 border-amber-300 text-slate-950'
                : 'bg-gradient-to-br from-amber-400 to-amber-500 border-amber-300 text-slate-950 hover:from-amber-300'
          }`}
        >
          <span className="text-2xl font-black">WD</span>
          <span className="text-[11px] font-extrabold uppercase tracking-tight text-amber-950">
            {wicketActive ? 'WIDE + RUN OUT' : 'WIDE BALL'}
          </span>
        </button>

        {/* NO BALL */}
        <button
          disabled={disabled}
          onClick={() => handleExtra('NB')}
          className={`py-4 sm:py-5 rounded-2xl border font-black flex flex-col items-center justify-center gap-1 shadow-lg transition-all btn-tactile ${
            disabled
              ? 'bg-slate-800 border-slate-700 text-slate-500 opacity-50 cursor-not-allowed'
              : wicketActive
                ? 'bg-gradient-to-br from-pink-500 to-rose-600 border-pink-300 text-white'
                : 'bg-gradient-to-br from-pink-600 to-rose-600 border-pink-400 text-white hover:from-pink-500'
          }`}
        >
          <span className="text-2xl font-black">NB</span>
          <span className="text-[11px] font-extrabold uppercase tracking-tight text-pink-200">
            {wicketActive ? 'NO BALL + RUN OUT' : 'NO BALL'}
          </span>
        </button>
      </div>

      {/* Undo */}
      <button
        disabled={!canUndo || isLocked}
        onClick={handleUndo}
        className={`w-full py-3.5 rounded-2xl border font-black text-sm flex items-center justify-center gap-2 transition-all btn-tactile shrink-0 ${
          canUndo && !isLocked
            ? 'bg-slate-900 border-slate-700 text-sky-400 hover:bg-slate-800 hover:border-sky-500'
            : 'bg-slate-950 border-slate-900 text-slate-700 cursor-not-allowed opacity-50'
        }`}
      >
        <RotateCcw className="w-4 h-4" />
        UNDO LAST BALL (↩)
      </button>
    </div>
  );
}
