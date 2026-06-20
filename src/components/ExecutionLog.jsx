import React, { useEffect, useRef } from 'react';

export default function ExecutionLog({ steps, stepIdx, maxHeight = '180px' }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [stepIdx]);

  const startIdx = Math.max(0, stepIdx - 10);
  const visibleSteps = steps.slice(startIdx, stepIdx + 1);

  return (
    <div className="glass-panel">
      <h3>Execution Log</h3>
      <div className="log-panel" style={{ maxHeight }}>
        {visibleSteps.map((s, i) => {
          const isCurrent = (startIdx + i) === stepIdx;
          return (
            <div key={startIdx + i} className="log-entry" style={{ opacity: isCurrent ? 1 : 0.6 }}>
              <span style={{ color: 'var(--accent-primary)', marginRight: '0.5rem' }}>Step {startIdx + i + 1}:</span>
              {s.log}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
    </div>
  );
}
