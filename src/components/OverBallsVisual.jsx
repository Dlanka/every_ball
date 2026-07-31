import React from 'react';

export function OverBallsVisual({ currentOverBalls, legalBallsInOver }) {
  // We want to render up to 6 slots or dynamically list all balls bowled in this over
  const totalSlots = Math.max(6, currentOverBalls.length);
  const slots = Array.from({ length: totalSlots });

  const getBallBadgeStyle = (type, runOut) => {
    if (runOut) {
      return 'bg-rose-700 text-white font-black border-rose-400 glow-wicket scale-105';
    }
    switch (type) {
      case 'LEGAL':
        return 'bg-emerald-500 text-slate-950 font-black border-emerald-400 glow-dot scale-105';
      case 'WD':
        return 'bg-amber-500 text-slate-950 font-black border-amber-400';
      case 'NB':
        return 'bg-pink-600 text-white font-black border-pink-400';
      case 'WICKET':
        return 'bg-rose-600 text-white font-black border-rose-400 glow-wicket scale-105';
      default:
        return 'bg-slate-900 border-slate-800 text-slate-600';
    }
  };

  return (
    <div className="bg-umpire-card border border-umpire-border rounded-2xl p-4 shadow-md space-y-2.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          CURRENT OVER BALLS
        </span>
        <span className="text-[11px] font-mono text-slate-500 font-semibold">
          {currentOverBalls.length} TOTAL DELIVERIES
        </span>
      </div>

      {/* Balls Sequence Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        {slots.map((_, index) => {
          const ball = currentOverBalls[index];
          if (ball) {
            // Clean display: NB+RO shows as two lines, others single label
            const displayLabel = ball.runOut
              ? ball.label.replace('+RO', '')
              : ball.label;
            return (
              <div
                key={ball.id || index}
                className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl border flex flex-col items-center justify-center text-[11px] font-mono transition-all btn-tactile ${getBallBadgeStyle(
                  ball.type, ball.runOut
                )}`}
              >
                <span>{displayLabel}</span>
                {ball.runOut && (
                  <span className="text-[8px] font-black leading-none text-rose-200">RO</span>
                )}
              </div>
            );
          }

          return (
            <div
              key={`empty-${index}`}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 flex items-center justify-center text-slate-700 font-mono text-xs font-bold"
            >
              {index + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}
