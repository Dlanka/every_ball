import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'umpire_counter_match_state_v1';

export function useUmpireCounter() {
  // Config State
  const [isConfigured, setIsConfigured] = useState(false);
  const [maxOvers, setMaxOvers] = useState(20);
  const [maxWickets, setMaxWickets] = useState(10);
  const [matchTitle, setMatchTitle] = useState('Standard T20 Match');

  // Match State
  const [completedOvers, setCompletedOvers] = useState(0);
  const [legalBallsInOver, setLegalBallsInOver] = useState(0);
  const [totalWickets, setTotalWickets] = useState(0);
  const [currentOverBalls, setCurrentOverBalls] = useState([]);
  
  // History of past overs for match review log
  const [pastOvers, setPastOvers] = useState([]);

  // Undo stack
  const [historyStack, setHistoryStack] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isConfigured) {
          setIsConfigured(parsed.isConfigured);
          setMaxOvers(parsed.maxOvers || 20);
          setMaxWickets(parsed.maxWickets || 10);
          setMatchTitle(parsed.matchTitle || 'Cricket Match');
          setCompletedOvers(parsed.completedOvers || 0);
          setLegalBallsInOver(parsed.legalBallsInOver || 0);
          setTotalWickets(parsed.totalWickets || 0);
          setCurrentOverBalls(parsed.currentOverBalls || []);
          setPastOvers(parsed.pastOvers || []);
          setHistoryStack(parsed.historyStack || []);
        }
      }
    } catch (e) {
      console.error('Failed to load saved state:', e);
    }
  }, []);

  // Save state on updates
  useEffect(() => {
    if (isConfigured) {
      try {
        const stateToSave = {
          isConfigured,
          maxOvers,
          maxWickets,
          matchTitle,
          completedOvers,
          legalBallsInOver,
          totalWickets,
          currentOverBalls,
          pastOvers,
          historyStack
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (e) {
        console.error('Failed to save state:', e);
      }
    }
  }, [isConfigured, maxOvers, maxWickets, matchTitle, completedOvers, legalBallsInOver, totalWickets, currentOverBalls, pastOvers, historyStack]);

  // Save snapshot to history stack before mutation
  const saveSnapshot = useCallback(() => {
    const snapshot = {
      completedOvers,
      legalBallsInOver,
      totalWickets,
      currentOverBalls: [...currentOverBalls],
      pastOvers: [...pastOvers]
    };
    setHistoryStack((prev) => [...prev, snapshot]);
  }, [completedOvers, legalBallsInOver, totalWickets, currentOverBalls, pastOvers]);

  // Setup match configuration
  const startMatch = (overs, wickets, title = 'Cricket Match') => {
    setMaxOvers(Number(overs));
    setMaxWickets(Number(wickets));
    setMatchTitle(title);
    setCompletedOvers(0);
    setLegalBallsInOver(0);
    setTotalWickets(0);
    setCurrentOverBalls([]);
    setPastOvers([]);
    setHistoryStack([]);
    setIsConfigured(true);
  };

  // Add Legal Ball (●)
  const addLegalBall = useCallback(() => {
    saveSnapshot();
    const newBall = { id: Date.now(), type: 'LEGAL', label: '●' };
    const updatedBalls = [...currentOverBalls, newBall];

    if (legalBallsInOver + 1 === 6) {
      // Over complete
      setCompletedOvers((prev) => prev + 1);
      setLegalBallsInOver(0);
      setPastOvers((prev) => [...prev, { overNum: completedOvers + 1, balls: updatedBalls }]);
      setCurrentOverBalls([]);
      return { overCompleted: true };
    } else {
      setLegalBallsInOver((prev) => prev + 1);
      setCurrentOverBalls(updatedBalls);
      return { overCompleted: false };
    }
  }, [currentOverBalls, legalBallsInOver, completedOvers, saveSnapshot]);

  // Add Wide (WD) - Does NOT count as legal ball
  const addWide = useCallback(() => {
    saveSnapshot();
    const newBall = { id: Date.now(), type: 'WD', label: 'WD' };
    setCurrentOverBalls((prev) => [...prev, newBall]);
    return { overCompleted: false };
  }, [saveSnapshot]);

  // Add No Ball (NB) - Does NOT count as legal ball
  const addNoBall = useCallback(() => {
    saveSnapshot();
    const newBall = { id: Date.now(), type: 'NB', label: 'NB' };
    setCurrentOverBalls((prev) => [...prev, newBall]);
    return { overCompleted: false };
  }, [saveSnapshot]);

  // Add Wicket (W)
  const addWicket = useCallback(() => {
    saveSnapshot();
    const newBall = { id: Date.now(), type: 'WICKET', label: 'W' };
    const updatedBalls = [...currentOverBalls, newBall];
    setTotalWickets((prev) => Math.min(maxWickets, prev + 1));

    if (legalBallsInOver + 1 === 6) {
      // Over complete on wicket
      setCompletedOvers((prev) => prev + 1);
      setLegalBallsInOver(0);
      setPastOvers((prev) => [...prev, { overNum: completedOvers + 1, balls: updatedBalls }]);
      setCurrentOverBalls([]);
      return { overCompleted: true };
    } else {
      setLegalBallsInOver((prev) => prev + 1);
      setCurrentOverBalls(updatedBalls);
      return { overCompleted: false };
    }
  }, [currentOverBalls, legalBallsInOver, completedOvers, maxWickets, saveSnapshot]);

  // Undo Last Action
  const undo = useCallback(() => {
    if (historyStack.length === 0) return false;

    const previousState = historyStack[historyStack.length - 1];
    setCompletedOvers(previousState.completedOvers);
    setLegalBallsInOver(previousState.legalBallsInOver);
    setTotalWickets(previousState.totalWickets);
    setCurrentOverBalls(previousState.currentOverBalls);
    setPastOvers(previousState.pastOvers);

    setHistoryStack((prev) => prev.slice(0, -1));
    return true;
  }, [historyStack]);

  // Reset current over
  const resetCurrentOver = useCallback(() => {
    saveSnapshot();
    setLegalBallsInOver(0);
    setCurrentOverBalls([]);
  }, [saveSnapshot]);

  // New Match / Reset All
  const resetMatch = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsConfigured(false);
    setCompletedOvers(0);
    setLegalBallsInOver(0);
    setTotalWickets(0);
    setCurrentOverBalls([]);
    setPastOvers([]);
    setHistoryStack([]);
  }, []);

  // Display formats
  const formattedOvers = `${completedOvers}.${legalBallsInOver}`;
  const totalBallsBowled = (completedOvers * 6) + legalBallsInOver;
  const maxMatchBalls = maxOvers * 6;
  const isInningsCompleted = totalBallsBowled >= maxMatchBalls || totalWickets >= maxWickets;

  return {
    isConfigured,
    maxOvers,
    maxWickets,
    matchTitle,
    completedOvers,
    legalBallsInOver,
    totalWickets,
    currentOverBalls,
    pastOvers,
    canUndo: historyStack.length > 0,
    formattedOvers,
    isInningsCompleted,
    startMatch,
    addLegalBall,
    addWide,
    addNoBall,
    addWicket,
    undo,
    resetCurrentOver,
    resetMatch
  };
}
