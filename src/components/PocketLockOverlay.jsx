import React, { useState } from 'react';
import { Lock, Unlock, ShieldAlert } from 'lucide-react';
import { useHaptics } from '../hooks/useHaptics';

export function PocketLockOverlay({ isLocked, onUnlock }) {
  const { vibrateTap } = useHaptics();
  const [unlockProgress, setUnlockProgress] = useState(0);

  if (!isLocked) return null;

  const handleUnlockClick = () => {
    vibrateTap();
    onUnlock();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-between p-6 text-center select-none">
      <div className="pt-10">
        <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Lock className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-wide">POCKET LOCK ACTIVE</h2>
        <p className="text-slate-400 text-xs mt-2 max-w-xs mx-auto">
          Touch controls are currently disabled to prevent accidental taps while holding or storing phone.
        </p>
      </div>

      <div className="w-full max-w-xs pb-10">
        <button
          onClick={handleUnlockClick}
          className="w-full py-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-base tracking-wider flex items-center justify-center gap-3 shadow-2xl glow-wicket btn-tactile"
        >
          <Unlock className="w-6 h-6" />
          <span>TAP TO UNLOCK COUNTER</span>
        </button>
      </div>
    </div>
  );
}
