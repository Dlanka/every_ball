import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'umpire_counter_match_state_v2';

export function useUmpireCounter() {
  // Config State
  const [isConfigured, setIsConfigured] = useState(false);
  const [maxOvers, setMaxOvers] = useState(20);
  const [maxWickets, setMaxWickets] = useState(10);
  const [matchTitle, setMatchTitle] = useState('T20 Match');

  // Match State
  const [totalRuns, setTotalRuns] = useState(0);
  const [completedOvers, setCompletedOvers] = useState(0);
  const [legalBallsInOver, setLegalBallsInOver] = useState(0);
  const [totalWickets, setTotalWickets] = useState(0);
  const [currentOverBalls, setCurrentOverBalls] = useState([]);
  const [pastOvers, setPastOvers] = useState([]);

  // Track last ball type: 'LEGAL' | 'NB' | 'WD' | null
  // Used to conditionally show Run Out button after NB/WD
  const [lastBallType, setLastBallType] = useState(null);

  // Undo stack
  const [historyStack, setHistoryStack] = useState([]);

  // ─── Persistence ──────────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const p = JSON.parse(saved);
        if (p.isConfigured) {
          setIsConfigured(p.isConfigured);
          setMaxOvers(p.maxOvers ?? 20);
          setMaxWickets(p.maxWickets ?? 10);
          setMatchTitle(p.matchTitle ?? 'Cricket Match');
          setTotalRuns(p.totalRuns ?? 0);
          setCompletedOvers(p.completedOvers ?? 0);
          setLegalBallsInOver(p.legalBallsInOver ?? 0);
          setTotalWickets(p.totalWickets ?? 0);
          setCurrentOverBalls(p.currentOverBalls ?? []);
          setPastOvers(p.pastOvers ?? []);
          setHistoryStack(p.historyStack ?? []);
          setLastBallType(p.lastBallType ?? null);
        }
      }
    } catch (e) {
      console.error('Failed to load saved state:', e);
    }
  }, []);

  useEffect(() => {
    if (!isConfigured) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        isConfigured, maxOvers, maxWickets, matchTitle,
        totalRuns, completedOvers, legalBallsInOver, totalWickets,
        currentOverBalls, pastOvers, historyStack, lastBallType,
      }));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }, [
    isConfigured, maxOvers, maxWickets, matchTitle,
    totalRuns, completedOvers, legalBallsInOver, totalWickets,
    currentOverBalls, pastOvers, historyStack, lastBallType,
  ]);

  // ─── Snapshot / Undo ──────────────────────────────────────────────────────

  const saveSnapshot = useCallback(() => {
    setHistoryStack(prev => [...prev, {
      totalRuns, completedOvers, legalBallsInOver, totalWickets,
      currentOverBalls: [...currentOverBalls],
      pastOvers: [...pastOvers],
      lastBallType,
    }]);
  }, [totalRuns, completedOvers, legalBallsInOver, totalWickets, currentOverBalls, pastOvers, lastBallType]);

  const undo = useCallback(() => {
    if (historyStack.length === 0) return false;
    const prev = historyStack[historyStack.length - 1];
    setTotalRuns(prev.totalRuns);
    setCompletedOvers(prev.completedOvers);
    setLegalBallsInOver(prev.legalBallsInOver);
    setTotalWickets(prev.totalWickets);
    setCurrentOverBalls(prev.currentOverBalls);
    setPastOvers(prev.pastOvers);
    setLastBallType(prev.lastBallType ?? null);
    setHistoryStack(h => h.slice(0, -1));
    return true;
  }, [historyStack]);

  // ─── Match Setup ──────────────────────────────────────────────────────────

  const startMatch = (overs, wickets, title = 'Cricket Match') => {
    setMaxOvers(Number(overs));
    setMaxWickets(Number(wickets));
    setMatchTitle(title);
    setTotalRuns(0);
    setCompletedOvers(0);
    setLegalBallsInOver(0);
    setTotalWickets(0);
    setCurrentOverBalls([]);
    setPastOvers([]);
    setHistoryStack([]);
    setLastBallType(null);
    setIsConfigured(true);
  };

  const resetMatch = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsConfigured(false);
    setTotalRuns(0);
    setCompletedOvers(0);
    setLegalBallsInOver(0);
    setTotalWickets(0);
    setCurrentOverBalls([]);
    setPastOvers([]);
    setHistoryStack([]);
    setLastBallType(null);
  }, []);

  const resetCurrentOver = useCallback(() => {
    saveSnapshot();
    setLegalBallsInOver(0);
    setCurrentOverBalls([]);
    setLastBallType(null);
  }, [saveSnapshot]);

  // ─── Ball Actions ─────────────────────────────────────────────────────────

  /**
   * Helper: complete an over if 6 legal balls have been bowled.
   * Returns { overCompleted: bool }
   */
  const _completeLegalBall = (ballEntry, updatedBalls, runs, withWicket) => {
    setTotalRuns(r => r + runs);
    if (withWicket) setTotalWickets(w => Math.min(maxWickets, w + 1));
    setLastBallType('LEGAL');

    if (legalBallsInOver + 1 === 6) {
      setCompletedOvers(c => c + 1);
      setLegalBallsInOver(0);
      setPastOvers(p => [...p, { overNum: completedOvers + 1, balls: updatedBalls }]);
      setCurrentOverBalls([]);
      return { overCompleted: true };
    } else {
      setLegalBallsInOver(l => l + 1);
      setCurrentOverBalls(updatedBalls);
      return { overCompleted: false };
    }
  };

  // Legal Ball (runs = 0..6, withWicket = false by default)
  const addLegalBall = useCallback((runs = 0, withWicket = false) => {
    saveSnapshot();
    const label = withWicket
      ? (runs > 0 ? `W+${runs}` : 'W')
      : (runs === 0 ? '●' : String(runs));
    const newBall = { id: Date.now(), type: withWicket ? 'WICKET' : 'LEGAL', label, runs, withWicket };
    const updatedBalls = [...currentOverBalls, newBall];
    return _completeLegalBall(newBall, updatedBalls, runs, withWicket);
  }, [currentOverBalls, legalBallsInOver, completedOvers, maxWickets, saveSnapshot]);

  // Wide — 1 run penalty is AUTOMATIC. User selects EXTRA runs on top.
  // extraRuns=0 → total 1 run (just the wide penalty)
  // extraRuns=1 → total 2 runs (wide + 1 extra)
  // extraRuns=4 → total 5 runs (wide + 4 boundary)
  const addWide = useCallback((extraRuns = 0, withWicket = false) => {
    saveSnapshot();
    const PENALTY = 1;
    const totalRuns = PENALTY + extraRuns;
    const label = withWicket
      ? 'WD+RO'
      : (extraRuns > 0 ? `WD+${extraRuns}` : 'WD');
    const newBall = { id: Date.now(), type: 'WD', label, runs: totalRuns, extraRuns, withWicket };
    setCurrentOverBalls(prev => [...prev, newBall]);
    setTotalRuns(r => r + totalRuns);
    if (withWicket) setTotalWickets(w => Math.min(maxWickets, w + 1));
    setLastBallType('WD');
    return { overCompleted: false };
  }, [saveSnapshot, maxWickets]);

  // No Ball — 1 run penalty is AUTOMATIC. User selects EXTRA runs on top.
  // extraRuns=0 → total 1 run (just the NB penalty)
  // extraRuns=4 → total 5 runs (NB penalty + 4 off the bat)
  const addNoBall = useCallback((extraRuns = 0, withWicket = false) => {
    saveSnapshot();
    const PENALTY = 1;
    const totalRuns = PENALTY + extraRuns;
    const label = withWicket
      ? 'NB+RO'
      : (extraRuns > 0 ? `NB+${extraRuns}` : 'NB');
    const newBall = { id: Date.now(), type: 'NB', label, runs: totalRuns, extraRuns, withWicket };
    setCurrentOverBalls(prev => [...prev, newBall]);
    setTotalRuns(r => r + totalRuns);
    if (withWicket) setTotalWickets(w => Math.min(maxWickets, w + 1));
    setLastBallType('NB');
    return { overCompleted: false };
  }, [saveSnapshot, maxWickets]);

  // ─── Computed ─────────────────────────────────────────────────────────────

  const formattedOvers = `${completedOvers}.${legalBallsInOver}`;
  const totalBallsBowled = completedOvers * 6 + legalBallsInOver;
  const maxMatchBalls = maxOvers * 6;
  const isInningsCompleted = totalBallsBowled >= maxMatchBalls || totalWickets >= maxWickets;

  return {
    // Config
    isConfigured, maxOvers, maxWickets, matchTitle,
    // Match state
    totalRuns, completedOvers, legalBallsInOver, totalWickets,
    currentOverBalls, pastOvers,
    // Computed
    formattedOvers, isInningsCompleted,
    canUndo: historyStack.length > 0,
    // Actions
    startMatch, resetMatch, resetCurrentOver,
    addLegalBall, addWide, addNoBall,
    undo,
  };
}
