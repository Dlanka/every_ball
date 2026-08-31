import React from 'react';
import { AlertCircle } from 'lucide-react';

export function ScoreDisplay({
  totalRuns,
  formattedOvers,
  legalBallsInOver,
  totalWickets,
  maxOvers,
  maxWickets,
  isInningsCompleted,
}) {
  const overProgressPercent = Math.min(100, Math.round((legalBallsInOver / 6) * 100));
  const wicketProgressPercent = Math.min(100, Math.round((totalWickets / maxWickets) * 100));
  const isAllOut = totalWickets >= maxWickets;

  return (
    <div className="space-y-3">
      {/* Innings Over Banner */}
      {isInningsCompleted && (
        <div className="bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-500/40 rounded-2xl p-3 text-center flex items-center justify-center gap-2 animate-pulse">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs font-black text-amber-300 tracking-wider uppercase">
            {isAllOut ? 'INNINGS OVER — ALL OUT!' : 'INNINGS OVER — MAX OVERS REACHED!'}
          </span>
        </div>
      )}

      {/* Main Score Row: Runs big, Wickets next to it */}
      <div className="bg-umpire-card border border-umpire-border rounded-3xl p-4 shadow-2xl">
        <div className="grid grid-cols-2 gap-3">

          {/* RUNS — Primary big display */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">RUNS</span>
            <div className="py-1">
              <span className="text-5xl sm:text-6xl font-black font-mono text-white tracking-tight leading-none">
                {totalRuns}
              </span>
            </div>
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">TOTAL SCORE</div>
          </div>

          {/* WICKETS */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">WKTS</span>
              <span className="text-[10px] font-extrabold font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-800/60">
                MAX {maxWickets}
              </span>
            </div>
            <div className="flex items-baseline gap-1 py-1">
              <span className="text-5xl sm:text-6xl font-black font-mono text-rose-500 tracking-tight leading-none">
                {totalWickets}
              </span>
              <span className="text-slate-500 text-base font-bold font-mono">/ {maxWickets}</span>
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
        <div className="mt-3 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-sky-300">{formattedOvers}</span>
            <span className="text-xs text-slate-500 font-bold font-mono">/ {maxOvers}.0 OVERS</span>
          </div>
          <div className="flex flex-col items-end gap-1 min-w-[90px]">
            <span className="text-[10px] text-slate-500 font-bold font-mono">LEGAL {legalBallsInOver}/6</span>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${overProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
