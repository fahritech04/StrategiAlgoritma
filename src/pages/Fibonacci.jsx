import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';

export default function Fibonacci() {
  const [n, setN] = useState(6);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Simulation states
  const [stepIdx, setStepIdx] = useState(0);
  const [steps, setSteps] = useState([]);
  
  // Generate execution steps based on n
  useEffect(() => {
    generateSteps(n);
    setStepIdx(0);
    setIsPlaying(false);
  }, [n]);

  const generateSteps = (num) => {
    let currentSteps = [];
    let f = Array(num + 1).fill('?');
    
    // Step 1: Function call
    currentSteps.push({
      line: 1,
      array: [...f],
      activeIndices: [],
      log: `Memanggil fibonacci(${num})`
    });

    // Step 2: Array initialization
    currentSteps.push({
      line: 2,
      array: [...f],
      activeIndices: [],
      log: `Mengalokasikan memori untuk array f dengan ukuran ${num + 1}`
    });

    // Step 3: Base case 0
    f[0] = 0;
    currentSteps.push({
      line: 3,
      array: [...f],
      activeIndices: [0],
      log: `Set base case: f[0] = 0`
    });

    // Step 4: Base case 1
    if (num >= 1) {
      f[1] = 1;
      currentSteps.push({
        line: 4,
        array: [...f],
        activeIndices: [1],
        log: `Set base case: f[1] = 1`
      });
    }

    // Step 5: Loop
    for (let i = 2; i <= num; i++) {
      currentSteps.push({
        line: 5,
        array: [...f],
        activeIndices: [],
        log: `Mengevaluasi loop untuk i = ${i}`
      });

      f[i] = f[i-1] + f[i-2];
      currentSteps.push({
        line: 6,
        array: [...f],
        activeIndices: [i, i-1, i-2], // i is being written, i-1 and i-2 are read
        log: `Kalkulasi: f[${i}] = f[${i-1}] + f[${i-2}] = ${f[i-1]} + ${f[i-2]} = ${f[i]}`
      });
    }

    // Step 6: Return
    currentSteps.push({
      line: 8,
      array: [...f],
      activeIndices: [num],
      log: `Selesai! Mengembalikan nilai f[${num}] = ${f[num]}`
    });

    setSteps(currentSteps);
  };

  // Auto-play logic
  useEffect(() => {
    let timer;
    if (isPlaying && stepIdx < steps.length - 1) {
      timer = setTimeout(() => {
        setStepIdx(prev => prev + 1);
      }, 1000);
    } else if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, steps.length]);

  const currentStep = steps[stepIdx] || { line: 1, array: [], activeIndices: [], log: '' };

  const cCode = `int fibonacci(int n) {
  int f[n+1];
  f[0] = 0;
  f[1] = 1;
  for (int i = 2; i <= n; i++) {
    f[i] = f[i-1] + f[i-2];
  }
  return f[n];
}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Fibonacci (1D DP)</h1>
        <p className="page-description">
          Memvisualisasikan bagaimana array 1D menyimpan hasil perhitungan sebelumnya 
          sehingga kompleksitas turun dari <span style={{color: 'var(--neon-red)'}}>O(2ⁿ)</span> menjadi <span style={{color: 'var(--neon-green)'}}>O(n)</span>.
        </p>
      </div>
      
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label>Pilih nilai n:</label>
        <input 
          type="number" 
          min="2" max="15" 
          value={n} 
          onChange={(e) => setN(parseInt(e.target.value) || 2)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--panel-border)', background: 'transparent', color: 'white' }}
        />
      </div>

      <div className="visualizer-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel" style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '2rem' }}>State Memori (Array f)</h3>
            <div className="viz-canvas">
              <div className="array-container">
                {currentStep.array.map((val, idx) => {
                  let className = "array-cell";
                  if (currentStep.activeIndices.includes(idx)) {
                    if (idx === currentStep.activeIndices[0] && currentStep.line === 6) {
                      className += " cell-active"; // Being written
                    } else if (currentStep.line === 6) {
                      className += " cell-checking"; // Being read
                    } else if (currentStep.line === 3 || currentStep.line === 4 || currentStep.line === 8) {
                      className += " cell-active";
                    }
                  } else if (val !== '?') {
                    className += " cell-done";
                  }

                  return (
                    <div key={idx} className={className}>
                      <span className="array-cell-index">{idx}</span>
                      {val}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="controls">
              <button className="btn btn-secondary" onClick={() => setStepIdx(0)} disabled={stepIdx === 0}>
                <RotateCcw size={18} /> Reset
              </button>
              <button className="btn btn-secondary" onClick={() => setStepIdx(prev => Math.max(0, prev - 1))} disabled={stepIdx === 0}>
                <SkipBack size={18} /> Prev
              </button>
              <button className="btn" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Auto Play</>}
              </button>
              <button className="btn btn-secondary" onClick={() => setStepIdx(prev => Math.min(steps.length - 1, prev + 1))} disabled={stepIdx === steps.length - 1}>
                <SkipForward size={18} /> Next
              </button>
            </div>
          </div>
          
          <div className="glass-panel">
            <h3>Execution Log</h3>
            <div className="log-panel">
              {steps.slice(0, stepIdx + 1).map((s, i) => (
                <div key={i} className="log-entry" style={{ opacity: i === stepIdx ? 1 : 0.6 }}>
                  <span style={{ color: 'var(--accent-primary)', marginRight: '0.5rem' }}>Step {i+1}:</span>
                  {s.log}
                </div>
              ))}
              <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h3>Pseudocode (C)</h3>
          <div style={{ marginTop: '1rem' }}>
            <CodeBlock code={cCode} activeLine={currentStep.line} />
          </div>
          
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Kenapa ini efisien?</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Tanpa DP, <code>fibonacci(5)</code> akan menghitung <code>fibonacci(3)</code> berkali-kali (rekursif buta). 
              Dengan DP, hasil perhitungan disimpan di array <code>f</code>. Saat kita butuh <code>f[3]</code>, 
              kita tinggal melihat (look-up) ke array tanpa menghitung ulang.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
