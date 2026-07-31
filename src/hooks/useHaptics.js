import { useCallback } from 'react';

export function useHaptics() {
  const vibrateTap = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(40);
    }
  }, []);

  const vibrateExtra = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate([60, 40, 60]);
    }
  }, []);

  const vibrateWicket = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 150]);
    }
  }, []);

  const vibrateOverComplete = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }
  }, []);

  return {
    vibrateTap,
    vibrateExtra,
    vibrateWicket,
    vibrateOverComplete
  };
}
