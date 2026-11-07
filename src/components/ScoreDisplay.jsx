import React from 'react';
import { AlertCircle, Target, Zap } from 'lucide-react';

/**
 * Merged scoreboard + over balls + chase bar.
 * Designed with distinct gaps between RUNS, WICKETS and chase stats for fast on-field clarity.
 */
export function ScoreDisplay({
  totalRuns,
  formattedOvers,
  legalBallsInOver,
  totalWickets,
  maxOvers,
  maxWickets,
  isInningsCompleted,
  currentOverBalls,
  // Target / Chase
  hasTarget,
  runsNeeded,
  ballsRemaining,
  targetScore,
  isChaseWon,
  isChaseLost,
}) {
  const isAllOut = totalWickets >= maxWickets;

  // Over balls badge style
  const getBadgeStyle = (ball) => {
    if (!ball) return 'bg-slate-900 border-dashed border-slate-800 text-slate-700';
    if (ball.withWicket) return 'bg-rose-700 border-rose-400 text-white glow-wicket';
    switch (ball.type) {
      case 'LEGAL':
        if (ball.runs >= 4) return 'bg-emerald-500 border-emerald-300 text-slate-950';
        if (ball.runs > 0)  return 'bg-sky-600 border-sky-400 text-white';
        return 'bg-slate-700 border-slate-600 text-slate-300';
      case 'WD':  return 'bg-amber-500 border-amber-300 text-slate-950';
      case 'NB':  return 'bg-pink-600 border-pink-400 text-white';
      case 'WICKET': return 'bg-rose-600 border-rose-400 text-white glow-wicket';
      default:    return 'bg-slate-900 border-slate-800 text-slate-400';
    }
  };

  const slots = Array.from({ length: Math.max(6, currentOverBalls.length) });

  const isUrgent = hasTarget && ballsRemaining > 0 && runsNeeded > 0
    && (runsNeeded / ballsRemaining) > 1.5;

  const runsNeededPercent = hasTarget
    ? Math.min(100, Math.round(((targetScore - runsNeeded) / targetScore) * 100))
    : 0;

  return (
    <div className="space-y-2 shrink-0">

      {/* ── Banner (Chase won / Innings over) ────────────────── */}
      {(isChaseWon || isInningsCompleted) && (
        <div className={`rounded-xl p-2 text-center flex items-center justify-center gap-2 border ${
          isChaseWon
            ? 'bg-emerald-950/40 border-emerald-700/50'
            : 'bg-amber-950/30 border-amber-700/40 animate-pulse'
        }`}>
          {isChaseWon
            ? <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            : <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
          <span className={`text-[11px] font-black uppercase tracking-widest ${isChaseWon ? 'text-emerald-300' : 'text-amber-300'}`}>
            {isChaseWon
              ? 'TARGET REACHED! 🏆'
              : isChaseLost
                ? `CHASE FAILED — Lost by ${runsNeeded} run${runsNeeded !== 1 ? 's' : ''}!`
                : isAllOut ? 'INNINGS OVER — ALL OUT!' : 'INNINGS OVER — MAX OVERS!'}
          </span>
        </div>
      )}

      {/* ── Single Merged Card ───────────────────────────────── */}
      <div className="bg-umpire-card border border-umpire-border rounded-2xl shadow-lg overflow-hidden">

        {/* Row 1 — Runs | Wickets | (Chase if target) with clear gaps */}
        <div className={`grid gap-2.5 p-2.5 ${hasTarget && !isChaseWon ? 'grid-cols-3' : 'grid-cols-2'}`}>

          {/* RUNS Tile */}
          <div className="bg-slate-950/75 border border-slate-800/80 rounded-xl px-3 py-2 flex flex-col justify-between shadow-inner">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">RUNS</span>
            <div className="py-0.5">
              <span className="text-4xl font-black font-mono text-white tracking-tight leading-none">
                {totalRuns}
              </span>
            </div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">TOTAL SCORE</span>
          </div>

          {/* WICKETS Tile */}
          <div className="bg-slate-950/75 border border-slate-800/80 rounded-xl px-3 py-2 flex flex-col justify-between shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">WKTS</span>
              <span className="text-[9px] font-black text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded-full border border-rose-900/60 font-mono">
                /{maxWickets}
              </span>
            </div>
            <div className="py-0.5">
              <span className="text-4xl font-black font-mono text-rose-500 tracking-tight leading-none">
                {totalWickets}
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden border border-slate-800/60">
              <div
                className="bg-gradient-to-r from-rose-500 to-red-600 h-full transition-all"
                style={{ width: `${Math.min(100, (totalWickets / maxWickets) * 100)}%` }}
              />
            </div>
          </div>

          {/* CHASE Tile (only if target set and not won) */}
          {hasTarget && !isChaseWon && (
            <div className={`border rounded-xl px-3 py-2 flex flex-col justify-between shadow-inner ${
              isUrgent ? 'bg-rose-950/25 border-rose-700/40' : 'bg-amber-950/20 border-amber-700/40'
            }`}>
              <div className="flex items-center gap-1">
                <Target className={`w-3 h-3 ${isUrgent ? 'text-rose-400' : 'text-amber-400'}`} />
                <span className={`text-[9px] font-extrabold uppercase tracking-widest ${isUrgent ? 'text-rose-400' : 'text-amber-400'}`}>
                  NEED
                </span>
              </div>
              <div className="py-0.5">
                <span className={`text-4xl font-black font-mono tracking-tight leading-none ${isUrgent ? 'text-rose-400' : 'text-amber-300'}`}>
                  {runsNeeded}
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                {ballsRemaining} balls left
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/80" />

        {/* Row 2 — Overs + Ball Progress + (RRR if chase) */}
        <div className="px-3.5 py-1.5 flex items-center justify-between gap-2 bg-slate-950/40">
          {/* Overs */}
          <div className="flex items-baseline gap-1 shrink-0">
            <span className="text-xl font-black font-mono text-sky-300 leading-none">{formattedOvers}</span>
            <span className="text-[10px] text-slate-400 font-bold font-mono">/ {maxOvers}.0 OV</span>
          </div>

          {/* Ball dots */}
          <div className="flex items-center gap-1.5 flex-1 justify-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full border transition-all ${
                  i < legalBallsInOver
                    ? 'bg-emerald-400 border-emerald-300 glow-dot shadow-sm'
                    : 'bg-slate-800/80 border-slate-700'
                }`}
              />
            ))}
            <span className="text-[9px] text-slate-400 font-mono font-bold ml-1">{legalBallsInOver}/6</span>
          </div>

          {/* RRR (if chasing) */}
          {hasTarget && !isChaseWon && ballsRemaining > 0 && runsNeeded > 0 && (
            <div className={`text-[11px] font-black font-mono shrink-0 ${isUrgent ? 'text-rose-400' : 'text-amber-400'}`}>
              RRR {((runsNeeded / ballsRemaining) * 6).toFixed(1)}
            </div>
          )}
        </div>

        {/* Chase progress bar (thin, bottom of card) */}
        {hasTarget && !isChaseWon && (
          <div className={`h-1 w-full ${isUrgent ? 'bg-rose-950' : 'bg-amber-950/40'}`}>
            <div
              className={`h-full transition-all duration-500 ${isUrgent ? 'bg-rose-500' : 'bg-amber-400'}`}
              style={{ width: `${runsNeededPercent}%` }}
            />
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-slate-800/80" />

        {/* Row 3 — Current Over Balls */}
        <div className="px-3.5 py-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block animate-pulse" />
              CURRENT OVER
            </span>
            <span className="text-[9px] font-mono text-slate-400">{currentOverBalls.length} deliveries</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {slots.map((_, i) => {
              const ball = currentOverBalls[i];
              return (
                <div
                  key={ball ? ball.id : `e-${i}`}
                  className={`shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center font-mono font-black text-[11px] transition-all ${getBadgeStyle(ball)}`}
                >
                  {ball ? ball.label : <span className="text-[10px] opacity-40">{i + 1}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
