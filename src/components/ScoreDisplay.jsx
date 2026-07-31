import React from 'react';
import { Flag, AlertCircle } from 'lucide-react';

export function ScoreDisplay({
  formattedOvers,
  legalBallsInOver,
  totalWickets,
  maxOvers,
  maxWickets,
  isInningsCompleted
}) {
  const overProgressPercent = Math.min(100, Math.round((legalBallsInOver / 6) * 100));
  const isAllOut = totalWickets >= maxWickets;

  return (
    <div className="bg-umpire-card border border-umpire-border rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Top Warning Banner if completed */}
      {isInningsCompleted && (
        <div className="bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-500/40 rounded-2xl p-3 text-center flex items-center justify-center gap-2 animate-pulse">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-black text-amber-300 tracking-wider uppercase">
            {isAllOut ? 'INNINGS OVER - ALL OUT!' : 'INNINGS OVER - MAX OVERS REACHED!'}
          </span>
        </div>
      )}

      {/* Main Scoreboard Counters */}
      <div className="grid grid-cols-2 gap-3">
        {/* Overs Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-center z-10">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">OVERS</span>
            <span className="text-[10px] font-extrabold font-mono text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-800/60">
              TARGET {maxOvers}.0
            </span>
          </div>

          <div className="my-2 z-10">
            <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              {formattedOvers}
            </div>
          </div>

          {/* Legal Ball Count Progress */}
          <div className="z-10 pt-1">
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 mb-1">
              <span>LEGAL BALLS</span>
              <span className="text-emerald-400">{legalBallsInOver} / 6</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${overProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Wickets Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-center z-10">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">WICKETS</span>
            <span className="text-[10px] font-extrabold font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-800/60">
              MAX {maxWickets}
            </span>
          </div>

          <div className="my-2 z-10 flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-black font-mono text-rose-500 tracking-tight glow-wicket">
              {totalWickets}
            </span>
            <span className="text-slate-500 text-sm font-bold font-mono">/ {maxWickets}</span>
          </div>

          <div className="z-10 pt-1">
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 mb-1">
              <span>WKTS REMAINING</span>
              <span className="text-rose-400">{Math.max(0, maxWickets - totalWickets)}</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-rose-500 to-red-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, (totalWickets / maxWickets) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
