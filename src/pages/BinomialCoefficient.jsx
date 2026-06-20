import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';

export default function BinomialCoefficient() {
  const [n, setN] = useState(5);
  const [k, setK] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [stepIdx, setStepIdx] = useState(0);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    // Ensure k <= n visually
    let validK = Math.min(k, n);
    if (k !== validK) setK(validK);
    generateSteps(n, validK);
    setStepIdx(0);
    setIsPlaying(false);
  }, [n, k]);

  const generateSteps = (numN, numK) => {
    let currentSteps = [];
    
    // Initialize 2D array with '?'
    let C = Array(numN + 1).fill().map(() => Array(numK + 1).fill('?'));
    
    currentSteps.push({
      line: 2,
      grid: JSON.parse(JSON.stringify(C)),
      activeCell: null,
      readCells: [],
      log: `Alokasi tabel 2D ukuran [${numN+1}][${numK+1}]`
    });

    for (let i = 0; i <= numN; i++) {
      currentSteps.push({
        line: 3,
        grid: JSON.parse(JSON.stringify(C)),
        activeCell: null,
        readCells: [],
        log: `Loop luar: i = ${i}`
      });

      for (let j = 0; j <= Math.min(i, numK); j++) {
        currentSteps.push({
          line: 4,
          grid: JSON.parse(JSON.stringify(C)),
          activeCell: null,
          readCells: [],
          log: `Loop dalam: j = ${j}`
        });

        if (j === 0 || j === i) {
          C[i][j] = 1;
          currentSteps.push({
            line: 6,
            grid: JSON.parse(JSON.stringify(C)),
            activeCell: [i, j],
            readCells: [],
            log: `Base case (j==0 atau j==i): C[${i}][${j}] = 1`
          });
        } else {
          C[i][j] = C[i-1][j-1] + C[i-1][j];
          currentSteps.push({
            line: 8,
            grid: JSON.parse(JSON.stringify(C)),
            activeCell: [i, j],
            readCells: [[i-1, j-1], [i-1, j]],
            log: `Hitung C[${i}][${j}] = C[${i-1}][${j-1}] + C[${i-1}][${j}] = ${C[i-1][j-1]} + ${C[i-1][j]} = ${C[i][j]}`
          });
        }
      }
    }

    currentSteps.push({
      line: 11,
      grid: JSON.parse(JSON.stringify(C)),
      activeCell: [numN, numK],
      readCells: [],
      log: `Selesai! Mengembalikan C[${numN}][${numK}] = ${C[numN][numK]}`
    });

    setSteps(currentSteps);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && stepIdx < steps.length - 1) {
      timer = setTimeout(() => {
        setStepIdx(prev => prev + 1);
      }, 800);
    } else if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, steps.length]);

  const currentStep = steps[stepIdx] || { line: 1, grid: [], activeCell: null, readCells: [], log: '' };

  const cCode = `int binomialCoeff(int n, int k) {
  int C[n+1][k+1];
  for (int i = 0; i <= n; i++) {
    for (int j = 0; j <= min(i, k); j++) {
      if (j == 0 || j == i)
        C[i][j] = 1;
      else
        C[i][j] = C[i-1][j-1] + C[i-1][j];
    }
  }
  return C[n][k];
}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Binomial Coefficient (2D DP)</h1>
        <p className="page-description">
          Menghitung kombinasi <span style={{ fontFamily: 'var(--font-mono)' }}>C(n, k)</span> menggunakan tabel 2D. 
          Pola yang terbentuk di dalam tabel merupakan representasi dari Segitiga Pascal.
        </p>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label>n (Total items):</label>
          <input 
            type="number" min="1" max="10" value={n} 
            onChange={(e) => setN(parseInt(e.target.value) || 1)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--panel-border)', background: 'transparent', color: 'white', width: '70px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label>k (Selected):</label>
          <input 
            type="number" min="0" max={n} value={k} 
            onChange={(e) => setK(parseInt(e.target.value) || 0)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--panel-border)', background: 'transparent', color: 'white', width: '70px' }}
          />
        </div>
      </div>

      <div className="visualizer-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel" style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '1rem' }}>Tabel C[n][k]</h3>
            
            <div className="viz-canvas" style={{ alignItems: 'flex-start', minHeight: '300px' }}>
              <div className="grid-container">
                {/* Header row */}
                <div className="grid-row">
                  <div className="grid-cell" style={{ border: 'none', background: 'transparent' }}>i\\j</div>
                  {Array.from({length: k + 1}).map((_, j) => (
                    <div key={`header-${j}`} className="grid-cell grid-header">{j}</div>
                  ))}
                </div>
                
                {/* Data rows */}
                {currentStep.grid.map((row, i) => (
                  <div key={`row-${i}`} className="grid-row">
                    <div className="grid-cell grid-header">{i}</div>
                    {row.map((cellValue, j) => {
                      let isRead = currentStep.readCells.some(rc => rc[0] === i && rc[1] === j);
                      let isWrite = currentStep.activeCell && currentStep.activeCell[0] === i && currentStep.activeCell[1] === j;
                      
                      let className = "grid-cell";
                      if (isWrite) className += " cell-active";
                      else if (isRead) className += " cell-checking";
                      else if (cellValue !== '?') className += " cell-done";

                      // Hide cells that shouldn't be computed or don't exist yet visually
                      if (j > Math.min(i, k)) {
                        return <div key={`cell-${i}-${j}`} className="grid-cell" style={{ background: 'transparent', border: 'none' }}></div>;
                      }

                      return (
                        <div key={`cell-${i}-${j}`} className={className}>
                          {cellValue}
                        </div>
                      );
                    })}
                  </div>
                ))}
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

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <h4 style={{ color: 'var(--neon-yellow)', marginBottom: '0.5rem' }}>Identifikasi Subproblem</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Untuk memilih <code>k</code> barang dari <code>n</code>, kita bisa memecahnya menjadi 2 kasus dari barang terakhir:
              <br/><br/>
              1. Kita <strong>tidak memilih</strong> barang terakhir: berarti kita harus memilih <code>k</code> dari <code>n-1</code> barang. <code>C[i-1][j]</code>
              <br/>
              2. Kita <strong>memilih</strong> barang terakhir: berarti kita sisa memilih <code>k-1</code> dari <code>n-1</code> barang. <code>C[i-1][j-1]</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
