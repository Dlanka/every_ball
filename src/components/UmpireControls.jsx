import React from 'react';
import { RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useHaptics } from '../hooks/useHaptics';

export function UmpireControls({
  onLegalBall,
  onWide,
  onNoBall,
  onWicket,
  onRunOutWicket,
  onUndo,
  canUndo,
  canRunOut,
  isLocked,
  isInningsCompleted
}) {
  const { vibrateTap, vibrateExtra, vibrateWicket, vibrateOverComplete } = useHaptics();

  const handleLegal = () => {
    if (isLocked || isInningsCompleted) return;
    const res = onLegalBall();
    if (res?.overCompleted) {
      vibrateOverComplete();
    } else {
      vibrateTap();
    }
  };

  const handleWide = () => {
    if (isLocked || isInningsCompleted) return;
    vibrateExtra();
    onWide();
  };

  const handleNoBall = () => {
    if (isLocked || isInningsCompleted) return;
    vibrateExtra();
    onNoBall();
  };

  const handleWicket = () => {
    if (isLocked || isInningsCompleted) return;
    vibrateWicket();
    const res = onWicket();
    if (res?.overCompleted) {
      vibrateOverComplete();
    }
  };

  const handleRunOut = () => {
    if (isLocked || isInningsCompleted) return;
    vibrateWicket();
    onRunOutWicket();
  };

  const handleUndo = () => {
    if (isLocked) return;
    vibrateTap();
    onUndo();
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Primary Massive Legal Ball Button */}
      <button
        disabled={isLocked || isInningsCompleted}
        onClick={handleLegal}
        className={`w-full py-7 rounded-3xl border text-slate-950 font-black text-2xl tracking-wider flex items-center justify-center gap-3 shadow-2xl transition-all btn-tactile ${
          isLocked || isInningsCompleted
            ? 'bg-slate-800 border-slate-700 text-slate-500 opacity-50 cursor-not-allowed'
            : 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 border-emerald-300 shadow-emerald-950/50 glow-dot'
        }`}
      >
        <span className="w-5 h-5 rounded-full bg-slate-950 inline-block"></span>
        <span>LEGAL BALL (●)</span>
      </button>

      {/* Grid of Extras & Wicket */}
      <div className="grid grid-cols-3 gap-3">
        {/* WIDE Button */}
        <button
          disabled={isLocked || isInningsCompleted}
          onClick={handleWide}
          className={`py-5 rounded-2xl border text-slate-950 font-black text-lg flex flex-col items-center justify-center gap-1 shadow-lg transition-all btn-tactile ${
            isLocked || isInningsCompleted
              ? 'bg-slate-800 border-slate-700 text-slate-500 opacity-50 cursor-not-allowed'
              : 'bg-gradient-to-br from-amber-400 to-amber-500 border-amber-300 hover:from-amber-300'
          }`}
        >
          <span className="text-xl">WD</span>
          <span className="text-[10px] font-extrabold uppercase tracking-tight text-amber-950">WIDE BALL</span>
        </button>

        {/* NO BALL Button */}
        <button
          disabled={isLocked || isInningsCompleted}
          onClick={handleNoBall}
          className={`py-5 rounded-2xl border text-white font-black text-lg flex flex-col items-center justify-center gap-1 shadow-lg transition-all btn-tactile ${
            isLocked || isInningsCompleted
              ? 'bg-slate-800 border-slate-700 text-slate-500 opacity-50 cursor-not-allowed'
              : 'bg-gradient-to-br from-pink-600 to-rose-600 border-pink-400 hover:from-pink-500'
          }`}
        >
          <span className="text-xl">NB</span>
          <span className="text-[10px] font-extrabold uppercase tracking-tight text-pink-200">NO BALL</span>
        </button>

        {/* WICKET Button */}
        <button
          disabled={isLocked || isInningsCompleted}
          onClick={handleWicket}
          className={`py-5 rounded-2xl border text-white font-black text-lg flex flex-col items-center justify-center gap-1 shadow-lg transition-all btn-tactile ${
            isLocked || isInningsCompleted
              ? 'bg-slate-800 border-slate-700 text-slate-500 opacity-50 cursor-not-allowed'
              : 'bg-gradient-to-br from-red-600 to-rose-700 border-red-400 glow-wicket hover:from-red-500'
          }`}
        >
          <span className="text-xl">OUT (W)</span>
          <span className="text-[10px] font-extrabold uppercase tracking-tight text-red-200">+1 WICKET</span>
        </button>
      </div>

      {/* RUN OUT on NB/WD — contextual alert button */}
      {canRunOut && !isLocked && !isInningsCompleted && (
        <div className="animate-pulse">
          <button
            onClick={handleRunOut}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-rose-400 bg-rose-950/40 text-rose-300 font-black text-sm flex items-center justify-center gap-2 transition-all btn-tactile hover:bg-rose-900/50 glow-wicket"
          >
            <span className="text-base">☠️</span>
            <span>RUN OUT on NB / WD — +1 WICKET (No Ball Count)</span>
          </button>
        </div>
      )}

      {/* Undo Action Bar */}
      <div className="pt-1">
        <button
          disabled={!canUndo || isLocked}
          onClick={handleUndo}
          className={`w-full py-4 rounded-2xl border font-extrabold text-sm flex items-center justify-center gap-2 transition-all btn-tactile ${
            canUndo && !isLocked
              ? 'bg-slate-900 border-slate-700 text-sky-400 hover:bg-slate-800 hover:border-sky-500'
              : 'bg-slate-950 border-slate-900 text-slate-700 cursor-not-allowed opacity-50'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>UNDO LAST BALL (↩)</span>
        </button>
      </div>
    </div>
  );
}
