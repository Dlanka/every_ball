import React from 'react';

export function OverBallsVisual({ currentOverBalls, legalBallsInOver }) {
  const totalSlots = Math.max(6, currentOverBalls.length);
  const slots = Array.from({ length: totalSlots });

  const getBadgeStyle = (ball) => {
    if (!ball) return 'bg-slate-900 border-dashed border-slate-800 text-slate-700';

    if (ball.withWicket) {
      return 'bg-rose-700 border-rose-400 text-white glow-wicket';
    }
    switch (ball.type) {
      case 'LEGAL':
        if (ball.runs >= 4) return 'bg-emerald-500 border-emerald-300 text-slate-950';
        if (ball.runs > 0)  return 'bg-sky-600 border-sky-400 text-white';
        return 'bg-slate-700 border-slate-600 text-slate-300'; // dot
      case 'WD':
        return 'bg-amber-500 border-amber-300 text-slate-950';
      case 'NB':
        return 'bg-pink-600 border-pink-400 text-white';
      case 'WICKET':
        return 'bg-rose-600 border-rose-400 text-white glow-wicket';
      default:
        return 'bg-slate-900 border-slate-800 text-slate-400';
    }
  };

  return (
    <div className="bg-umpire-card border border-umpire-border rounded-2xl p-4 shadow-md space-y-2.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
          CURRENT OVER
        </span>
        <span className="text-[11px] font-mono text-slate-500 font-semibold">
          {currentOverBalls.length} DELIVERIES
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        {slots.map((_, index) => {
          const ball = currentOverBalls[index];
          return (
            <div
              key={ball ? ball.id : `empty-${index}`}
              className={`shrink-0 w-12 h-12 rounded-xl border flex flex-col items-center justify-center font-mono font-black transition-all text-[11px] ${getBadgeStyle(ball)}`}
            >
              {ball ? (
                <>
                  <span className="leading-none">{ball.label}</span>
                </>
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
