import React, { useState } from 'react';
import { useUmpireCounter } from './hooks/useUmpireCounter';
import { MatchSetup } from './components/MatchSetup';
import { Header } from './components/Header';
import { ScoreDisplay } from './components/ScoreDisplay';
import { OverBallsVisual } from './components/OverBallsVisual';
import { UmpireControls } from './components/UmpireControls';
import { ExtraRunsModal } from './components/ExtraRunsModal';
import { OverHistory } from './components/OverHistory';
import { PocketLockOverlay } from './components/PocketLockOverlay';
import { ResetModal } from './components/ResetModal';

export default function App() {
  const counter = useUmpireCounter();

  const [isLocked, setIsLocked] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [wicketActive, setWicketActive] = useState(false);
  const [extraModal, setExtraModal] = useState({ open: false, ballType: null });

  const handleOpenExtra = (ballType) => {
    setExtraModal({ open: true, ballType });
  };

  const handleConfirmExtra = (extraRuns, withWicket) => {
    setExtraModal({ open: false, ballType: null });
    if (extraModal.ballType === 'WD') {
      counter.addWide(extraRuns, withWicket);
    } else {
      counter.addNoBall(extraRuns, withWicket);
    }
    setWicketActive(false);
  };

  const handleCloseExtra = () => {
    setExtraModal({ open: false, ballType: null });
  };

  const handleLegalBall = (runs, withWicket) => {
    const res = counter.addLegalBall(runs, withWicket);
    setWicketActive(false);
    return res;
  };

  if (!counter.isConfigured) {
    return <MatchSetup onStart={counter.startMatch} />;
  }

  return (
    <div className="min-h-screen bg-umpire-dark text-slate-100 flex flex-col max-w-md mx-auto relative">
      <Header
        matchTitle={counter.matchTitle}
        maxOvers={counter.maxOvers}
        maxWickets={counter.maxWickets}
        isLocked={isLocked}
        onToggleLock={() => setIsLocked(prev => !prev)}
        onOpenReset={() => setIsResetOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        completedOvers={counter.completedOvers}
      />

      <main className="p-4 space-y-3 flex-1 overflow-y-auto pb-6">
        <ScoreDisplay
          totalRuns={counter.totalRuns}
          formattedOvers={counter.formattedOvers}
          legalBallsInOver={counter.legalBallsInOver}
          totalWickets={counter.totalWickets}
          maxOvers={counter.maxOvers}
          maxWickets={counter.maxWickets}
          isInningsCompleted={counter.isInningsCompleted}
        />

        <OverBallsVisual
          currentOverBalls={counter.currentOverBalls}
          legalBallsInOver={counter.legalBallsInOver}
        />

        <UmpireControls
          onLegalBall={handleLegalBall}
          onOpenExtra={handleOpenExtra}
          onUndo={counter.undo}
          canUndo={counter.canUndo}
          isLocked={isLocked}
          isInningsCompleted={counter.isInningsCompleted}
          wicketActive={wicketActive}
          onToggleWicket={() => setWicketActive(prev => !prev)}
        />
      </main>

      {/* Extra Runs Tray (WD / NB) */}
      <ExtraRunsModal
        isOpen={extraModal.open}
        ballType={extraModal.ballType}
        withWicket={wicketActive}
        onConfirm={handleConfirmExtra}
        onClose={handleCloseExtra}
      />

      {/* Over History Sheet */}
      <OverHistory
        pastOvers={counter.pastOvers}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Safety Lock */}
      <PocketLockOverlay isLocked={isLocked} onUnlock={() => setIsLocked(false)} />

      {/* Reset / Settings Modal */}
      <ResetModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onResetOver={counter.resetCurrentOver}
        onNewMatch={counter.resetMatch}
      />
    </div>
  );
}
