import React from 'react';
import { X, RotateCcw, Settings, Trash2 } from 'lucide-react';
import { useHaptics } from '../hooks/useHaptics';

export function ResetModal({ isOpen, onClose, onResetOver, onNewMatch }) {
  const { vibrateTap } = useHaptics();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-umpire-card border border-umpire-border rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-400" />
            Match Settings & Reset
          </h3>
          <button
            onClick={() => {
              vibrateTap();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Reset Current Over */}
          <button
            onClick={() => {
              vibrateTap();
              onResetOver();
              onClose();
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 font-bold text-sm flex items-center gap-3 btn-tactile text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-amber-300">Reset Current Over</div>
              <div className="text-[11px] text-slate-400">Clear balls in the current over</div>
            </div>
          </button>

          {/* New Match / Reconfigure */}
          <button
            onClick={() => {
              vibrateTap();
              onNewMatch();
              onClose();
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 font-bold text-sm flex items-center gap-3 btn-tactile text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-rose-400">New Match / Setup</div>
              <div className="text-[11px] text-slate-400">Reconfigure overs and wickets</div>
            </div>
          </button>
        </div>

        <button
          onClick={() => {
            vibrateTap();
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-slate-900 text-slate-400 font-bold text-xs hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
