import React, { useState } from 'react';
import { ChevronDown, ChevronRight, History } from 'lucide-react';

/**
 * Ball badge color by type/wicket
 */
function BallBadge({ ball }) {
  const base = 'w-9 h-9 shrink-0 rounded-xl border flex flex-col items-center justify-center font-black font-mono text-[11px] leading-tight';

  let style = '';
  if (ball.withWicket) {
    style = 'bg-rose-700 border-rose-400 text-white';
  } else {
    switch (ball.type) {
      case 'LEGAL':
        style = ball.runs >= 4
          ? 'bg-emerald-500 border-emerald-300 text-slate-950'
          : ball.runs > 0
            ? 'bg-sky-600 border-sky-400 text-white'
            : 'bg-slate-700 border-slate-600 text-slate-300';
        break;
      case 'WD':
        style = 'bg-amber-500 border-amber-300 text-slate-950';
        break;
      case 'NB':
        style = 'bg-pink-600 border-pink-400 text-white';
        break;
      case 'WICKET':
        style = 'bg-rose-600 border-rose-400 text-white';
        break;
      default:
        style = 'bg-slate-800 border-slate-700 text-slate-400';
    }
  }

  return (
    <div className={`${base} ${style}`}>
      <span>{ball.label}</span>
    </div>
  );
}

/**
 * Single over row — collapsible
 */
function OverRow({ over, overIndex }) {
  const [expanded, setExpanded] = useState(false);

  const overRuns = over.balls.reduce((sum, b) => sum + (b.runs || 0), 0);
  const overWickets = over.balls.filter(b => b.withWicket || b.type === 'WICKET').length;
  const legalBalls = over.balls.filter(b => b.type === 'LEGAL' || b.type === 'WICKET' || b.withWicket).length;
  const extras = over.balls.filter(b => b.type === 'WD' || b.type === 'NB').length;

  return (
    <div className="border border-slate-800 rounded-2xl overflow-hidden">
      {/* Over Header Row */}
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/80 hover:bg-slate-800/80 transition-colors btn-tactile"
      >
        <div className="flex items-center gap-3">
          {expanded
            ? <ChevronDown className="w-4 h-4 text-sky-400 shrink-0" />
            : <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
          }
          <span className="text-sm font-extrabold text-sky-300 font-mono">
            OVER {over.overNum}
          </span>
          {overWickets > 0 && (
            <span className="text-[10px] font-black text-rose-400 bg-rose-900/40 border border-rose-800/50 px-1.5 py-0.5 rounded-full">
              {overWickets}W
            </span>
          )}
        </div>

        {/* Over summary */}
        <div className="flex items-center gap-3 text-right">
          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            {legalBalls} balls {extras > 0 ? `· ${extras} extras` : ''}
          </div>
          <div className="text-lg font-black font-mono text-white">
            {overRuns}
            <span className="text-xs text-slate-400 font-bold ml-0.5">runs</span>
          </div>
        </div>
      </button>

      {/* Expanded Ball-by-Ball */}
      {expanded && (
        <div className="bg-slate-950/60 px-4 py-3 space-y-3 border-t border-slate-800">
          {/* Ball badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            {over.balls.map((ball, idx) => (
              <BallBadge key={ball.id || idx} ball={ball} />
            ))}
          </div>

          {/* Detailed breakdown table */}
          <div className="space-y-1.5">
            {over.balls.map((ball, idx) => {
              const isExtra = ball.type === 'WD' || ball.type === 'NB';
              const isWicket = ball.withWicket || ball.type === 'WICKET';
              const ballNum = isExtra ? '−' : over.balls.slice(0, idx + 1).filter(b => b.type !== 'WD' && b.type !== 'NB').length;

              return (
                <div
                  key={ball.id || idx}
                  className={`flex items-center justify-between text-xs px-3 py-1.5 rounded-xl border ${
                    isWicket
                      ? 'border-rose-800/40 bg-rose-950/30'
                      : isExtra
                        ? ball.type === 'WD'
                          ? 'border-amber-800/40 bg-amber-950/20'
                          : 'border-pink-800/40 bg-pink-950/20'
                        : 'border-slate-800/60 bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-500 w-4">{ballNum}</span>
                    <span className={`font-extrabold ${
                      isWicket ? 'text-rose-300'
                      : ball.type === 'WD' ? 'text-amber-300'
                      : ball.type === 'NB' ? 'text-pink-300'
                      : ball.runs >= 4 ? 'text-emerald-300'
                      : ball.runs > 0 ? 'text-sky-300'
                      : 'text-slate-400'
                    }`}>
                      {ball.label}
                    </span>
                    {isExtra && (
                      <span className="text-slate-500 text-[10px]">
                        (1 penalty{ball.extraRuns > 0 ? ` + ${ball.extraRuns} extra` : ''})
                      </span>
                    )}
                    {isWicket && (
                      <span className="text-rose-400 font-bold text-[10px]">WICKET</span>
                    )}
                  </div>
                  <span className="font-black font-mono text-white">
                    +{ball.runs}
                  </span>
                </div>
              );
            })}

            {/* Over total footer */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-sky-950/40 border border-sky-800/40 mt-1">
              <span className="text-xs font-extrabold text-sky-400 uppercase tracking-wider">Over {over.overNum} Total</span>
              <span className="text-base font-black font-mono text-white">{overRuns} runs</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Full Over History panel
 */
export function OverHistory({ pastOvers, isOpen, onClose }) {
  if (!isOpen) return null;

  const totalMatchRuns = pastOvers.reduce((sum, o) => sum + o.balls.reduce((s, b) => s + (b.runs || 0), 0), 0);
  const totalMatchWickets = pastOvers.reduce((sum, o) => sum + o.balls.filter(b => b.withWicket || b.type === 'WICKET').length, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-umpire-dark border-t-2 border-umpire-border rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh]">

        {/* Sheet header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-extrabold text-white">OVER HISTORY</h2>
            <span className="text-xs font-bold text-slate-400 font-mono">
              {pastOvers.length} over{pastOvers.length !== 1 ? 's' : ''} bowled
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-extrabold text-sky-400 px-3 py-1.5 rounded-xl border border-sky-800/50 hover:bg-sky-950/40 btn-tactile"
          >
            CLOSE
          </button>
        </div>

        {/* Match totals row */}
        {pastOvers.length > 0 && (
          <div className="flex gap-3 px-5 py-3 border-b border-slate-800 shrink-0">
            <div className="flex-1 bg-slate-900 rounded-xl px-3 py-2 text-center border border-slate-800">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Runs (past overs)</div>
              <div className="text-xl font-black font-mono text-white">{totalMatchRuns}</div>
            </div>
            <div className="flex-1 bg-slate-900 rounded-xl px-3 py-2 text-center border border-slate-800">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Wickets (past overs)</div>
              <div className="text-xl font-black font-mono text-rose-400">{totalMatchWickets}</div>
            </div>
          </div>
        )}

        {/* Scrollable over list */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2.5">
          {pastOvers.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-semibold">No completed overs yet.</p>
              <p className="text-xs mt-1 opacity-60">Complete an over to see ball-by-ball history here.</p>
            </div>
          ) : (
            // Show most recent over first
            [...pastOvers].reverse().map((over, i) => (
              <OverRow key={over.overNum} over={over} overIndex={i} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
