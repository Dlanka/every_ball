import React, { useState } from 'react';
import { useUmpireCounter } from './hooks/useUmpireCounter';
import { MatchSetup } from './components/MatchSetup';
import { Header } from './components/Header';
import { ScoreDisplay } from './components/ScoreDisplay';
import { OverBallsVisual } from './components/OverBallsVisual';
import { UmpireControls } from './components/UmpireControls';
import { PocketLockOverlay } from './components/PocketLockOverlay';
import { ResetModal } from './components/ResetModal';

export default function App() {
  const counter = useUmpireCounter();
  const [isLocked, setIsLocked] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  // If match is not yet configured, show Match Setup screen
  if (!counter.isConfigured) {
    return <MatchSetup onStart={counter.startMatch} />;
  }

  return (
    <div className="min-h-screen bg-umpire-dark text-slate-100 flex flex-col justify-between max-w-md mx-auto relative select-none">
      {/* Top Header Bar */}
      <Header
        matchTitle={counter.matchTitle}
        maxOvers={counter.maxOvers}
        maxWickets={counter.maxWickets}
        isLocked={isLocked}
        onToggleLock={() => setIsLocked((prev) => !prev)}
        onOpenReset={() => setIsResetOpen(true)}
      />

      {/* Main Content Area */}
      <main className="p-4 space-y-4 flex-1 flex flex-col justify-between">
        {/* Main Big Score Counter */}
        <ScoreDisplay
          formattedOvers={counter.formattedOvers}
          legalBallsInOver={counter.legalBallsInOver}
          totalWickets={counter.totalWickets}
          maxOvers={counter.maxOvers}
          maxWickets={counter.maxWickets}
          isInningsCompleted={counter.isInningsCompleted}
        />

        {/* Current Over Delivery Timeline */}
        <OverBallsVisual
          currentOverBalls={counter.currentOverBalls}
          legalBallsInOver={counter.legalBallsInOver}
        />

        {/* Large Tactile Touch Buttons */}
        <UmpireControls
          onLegalBall={counter.addLegalBall}
          onWide={counter.addWide}
          onNoBall={counter.addNoBall}
          onWicket={counter.addWicket}
          onRunOutWicket={counter.addRunOutWicket}
          onUndo={counter.undo}
          canUndo={counter.canUndo}
          canRunOut={counter.canRunOut}
          isLocked={isLocked}
          isInningsCompleted={counter.isInningsCompleted}
        />
      </main>

      {/* Pocket Touch Safety Screen Overlay */}
      <PocketLockOverlay
        isLocked={isLocked}
        onUnlock={() => setIsLocked(false)}
      />

      {/* Match Reset & Settings Modal */}
      <ResetModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onResetOver={counter.resetCurrentOver}
        onNewMatch={counter.resetMatch}
      />
    </div>
  );
}
