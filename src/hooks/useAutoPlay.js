import { useEffect } from 'react';

export default function useAutoPlay(isPlaying, setIsPlaying, stepIdx, setStepIdx, stepsLength, delay = 1000) {
  useEffect(() => {
    let timer;
    if (isPlaying && stepIdx < stepsLength - 1) {
      timer = setTimeout(() => {
        setStepIdx(prev => prev + 1);
      }, delay);
    } else if (stepIdx >= stepsLength - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, stepsLength, delay, setIsPlaying, setStepIdx]);
}
