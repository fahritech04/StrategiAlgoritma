import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';

export default function PlaybackControls({ isPlaying, setIsPlaying, stepIdx, setStepIdx, stepsLength }) {
  return (
    <div className="controls" style={{ marginTop: '2rem', width: '100%' }}>
      <button className="btn btn-secondary" onClick={() => setStepIdx(0)} disabled={stepIdx === 0}>
        <RotateCcw size={18} /> Reset
      </button>
      <button className="btn btn-secondary" onClick={() => setStepIdx(prev => Math.max(0, prev - 1))} disabled={stepIdx === 0}>
        <SkipBack size={18} /> Prev
      </button>
      <button className="btn" onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Auto Play</>}
      </button>
      <button className="btn btn-secondary" onClick={() => setStepIdx(prev => Math.min(stepsLength - 1, prev + 1))} disabled={stepIdx === stepsLength - 1}>
        <SkipForward size={18} /> Next
      </button>
    </div>
  );
}
