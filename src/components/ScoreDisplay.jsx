import React from 'react';
import { AlertCircle, Target, Zap } from 'lucide-react';

export function ScoreDisplay({
  totalRuns,
  formattedOvers,
  legalBallsInOver,
  totalWickets,
  maxOvers,
  maxWickets,
  isInningsCompleted,
  // Target / Chase
  hasTarget,
  runsNeeded,
  ballsRemaining,
  targetScore,
  isChaseWon,
  isChaseLost,
}) {
  const overProgressPercent = Math.min(100, Math.round((legalBallsInOver / 6) * 100));
  const wicketProgressPercent = Math.min(100, Math.round((totalWickets / maxWickets) * 100));
  const isAllOut = totalWickets >= maxWickets;

  // For chase bar color
  const runsNeededPercent = hasTarget
    ? Math.min(100, Math.round(((targetScore - runsNeeded) / targetScore) * 100))
    : 0;
  const isUrgent = hasTarget && ballsRemaining > 0 && runsNeeded > 0
    && (runsNeeded / ballsRemaining) > 1.5; // RRR > 9 — danger zone

  return (
    <div className="space-y-2.5">
      {/* ── Chase Won Banner ───────────────────────────────────────── */}
      {isChaseWon && (
        <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border border-emerald-500/50 rounded-2xl p-3 text-center flex items-center justify-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-black text-emerald-300 tracking-wider uppercase">
            TARGET REACHED! 🏆
          </span>
        </div>
      )}

      {/* ── Innings Over / Chase Lost Banner ──────────────────────── */}
      {!isChaseWon && isInningsCompleted && (
        <div className="bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-500/40 rounded-2xl p-3 text-center flex items-center justify-center gap-2 animate-pulse">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs font-black text-amber-300 tracking-wider uppercase">
            {isChaseLost
              ? `CHASE FAILED — Lost by ${runsNeeded} run${runsNeeded !== 1 ? 's' : ''}!`
              : isAllOut
                ? 'INNINGS OVER — ALL OUT!'
                : 'INNINGS OVER — MAX OVERS REACHED!'}
          </span>
        </div>
      )}

      {/* ── Main Score Card ───────────────────────────────────────── */}
      <div className="bg-umpire-card border border-umpire-border rounded-3xl p-3 shadow-2xl">
        <div className="grid grid-cols-2 gap-2.5">

          {/* RUNS */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-3 py-2 flex flex-col justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">RUNS</span>
            <div className="py-0.5">
              <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight leading-none">
                {totalRuns}
              </span>
            </div>
            <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">TOTAL SCORE</div>
          </div>

          {/* WICKETS */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-3 py-2 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">WKTS</span>
              <span className="text-[9px] font-extrabold font-mono text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded-full border border-rose-800/60">
                MAX {maxWickets}
              </span>
            </div>
            <div className="flex items-baseline gap-1 py-0.5">
              <span className="text-4xl sm:text-5xl font-black font-mono text-rose-500 tracking-tight leading-none">
                {totalWickets}
              </span>
              <span className="text-slate-500 text-sm font-bold font-mono">/ {maxWickets}</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-rose-500 to-red-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${wicketProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Overs row */}
        <div className="mt-2.5 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black font-mono text-sky-300">{formattedOvers}</span>
            <span className="text-xs text-slate-500 font-bold font-mono">/ {maxOvers}.0 OVERS</span>
          </div>
          <div className="flex flex-col items-end gap-1 min-w-[80px]">
            <span className="text-[10px] text-slate-500 font-bold font-mono">LEGAL {legalBallsInOver}/6</span>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${overProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2nd Innings Chase Bar (only if target is set) ─────────── */}
      {hasTarget && !isChaseWon && (
        <div className={`rounded-2xl border p-3 space-y-2 ${
          isUrgent
            ? 'bg-rose-950/30 border-rose-700/50'
            : 'bg-amber-950/20 border-amber-700/30'
        }`}>
          {/* Target header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Target className={`w-4 h-4 ${isUrgent ? 'text-rose-400' : 'text-amber-400'}`} />
              <span className={`text-[11px] font-extrabold uppercase tracking-widest ${isUrgent ? 'text-rose-300' : 'text-amber-300'}`}>
                CHASING {targetScore}
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 font-mono">
              {ballsRemaining} ball{ballsRemaining !== 1 ? 's' : ''} left
            </span>
          </div>

          {/* Big remaining display */}
          <div className="flex items-end justify-between">
            <div>
              <div className={`text-3xl font-black font-mono leading-none ${
                isUrgent ? 'text-rose-400' : 'text-amber-300'
              }`}>
                {runsNeeded}
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                runs needed
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black font-mono text-slate-300 leading-none">
                {ballsRemaining}
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                balls rem.
              </div>
            </div>
          </div>

          {/* Chase progress bar */}
          <div className="w-full bg-slate-900/80 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isUrgent
                  ? 'bg-gradient-to-r from-rose-500 to-red-400'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400'
              }`}
              style={{ width: `${runsNeededPercent}%` }}
            />
          </div>

          {/* RRR */}
          {ballsRemaining > 0 && runsNeeded > 0 && (
            <div className="text-[10px] text-slate-500 font-mono text-right">
              RRR: {((runsNeeded / ballsRemaining) * 6).toFixed(2)} per over
            </div>
          )}
        </div>
      )}
    </div>
  );
}
