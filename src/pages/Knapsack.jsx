import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';

export default function Knapsack() {
  const [W, setW] = useState(5);
  const items = [
    { wt: 2, val: 12 },
    { wt: 1, val: 10 },
    { wt: 3, val: 20 },
    { wt: 2, val: 15 }
  ];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    generateSteps(W, items);
    setStepIdx(0);
    setIsPlaying(false);
  }, [W]);

  const generateSteps = (capacity, itemsArr) => {
    let currentSteps = [];
    let n = itemsArr.length;
    
    // Initialize 2D array with '?'
    let K = Array(n + 1).fill().map(() => Array(capacity + 1).fill('?'));
    
    currentSteps.push({
      line: 2,
      grid: JSON.parse(JSON.stringify(K)),
      activeCell: null,
      readCells: [],
      log: `Inisialisasi tabel K ukuran [${n+1}][${capacity+1}]`
    });

    for (let i = 0; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        
        currentSteps.push({
          line: i===0 || w===0 ? 5 : 7,
          grid: JSON.parse(JSON.stringify(K)),
          activeCell: [i, w],
          readCells: [],
          log: `Evaluasi Item ke-${i}, Kapasitas Tas = ${w}`
        });

        if (i === 0 || w === 0) {
          K[i][w] = 0;
          currentSteps.push({
            line: 6,
            grid: JSON.parse(JSON.stringify(K)),
            activeCell: [i, w],
            readCells: [],
            log: `Base case: Jika tidak ada barang (i=0) atau kapasitas 0 (w=0), profit = 0.`
          });
        } else {
          let currentWt = itemsArr[i-1].wt;
          let currentVal = itemsArr[i-1].val;

          if (currentWt <= w) {
            let includeVal = currentVal + K[i-1][w - currentWt];
            let excludeVal = K[i-1][w];
            
            currentSteps.push({
              line: 8,
              grid: JSON.parse(JSON.stringify(K)),
              activeCell: [i, w],
              readCells: [[i-1, w], [i-1, w - currentWt]],
              log: `Berat muat. Bandingkan Ambil vs Tidak Ambil: max(${excludeVal}, ${currentVal} + ${K[i-1][w - currentWt]})`
            });

            K[i][w] = Math.max(excludeVal, includeVal);
            
            currentSteps.push({
              line: 8,
              grid: JSON.parse(JSON.stringify(K)),
              activeCell: [i, w],
              readCells: [],
              log: `Disimpan: K[${i}][${w}] = ${K[i][w]}`
            });
          } else {
            K[i][w] = K[i-1][w];
            currentSteps.push({
              line: 10,
              grid: JSON.parse(JSON.stringify(K)),
              activeCell: [i, w],
              readCells: [[i-1, w]],
              log: `Barang terlalu berat (${currentWt} > ${w}). Ambil nilai tanpa barang ini: K[${i-1}][${w}] = ${K[i][w]}`
            });
          }
        }
      }
    }

    currentSteps.push({
      line: 13,
      grid: JSON.parse(JSON.stringify(K)),
      activeCell: [n, capacity],
      readCells: [],
      log: `Selesai! Nilai maksimum adalah K[${n}][${capacity}] = ${K[n][capacity]}`
    });

    setSteps(currentSteps);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && stepIdx < steps.length - 1) {
      timer = setTimeout(() => {
        setStepIdx(prev => prev + 1);
      }, 500); // Faster for 2D loops
    } else if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, steps.length]);

  const currentStep = steps[stepIdx] || { line: 1, grid: [], activeCell: null, readCells: [], log: '' };

  const cCode = `int knapsack(int W, int wt[], int val[], int n) {
  int K[n+1][W+1];
  for (int i = 0; i <= n; i++) {
    for (int w = 0; w <= W; w++) {
      if (i == 0 || w == 0)
        K[i][w] = 0;
      else if (wt[i-1] <= w)
        K[i][w] = max(K[i-1][w], val[i-1] + K[i-1][w-wt[i-1]]);
      else
        K[i][w] = K[i-1][w];
    }
  }
  return K[n][W];
}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">0/1 Knapsack Problem (2D DP)</h1>
        <p className="page-description">
          Memilih kombinasi barang untuk dimasukkan ke dalam tas dengan <span style={{ color: 'var(--neon-green)'}}>kapasitas terbatas (W)</span> agar mendapatkan <span style={{ color: 'var(--neon-yellow)'}}>total nilai maksimum</span>.
        </p>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 'bold' }}>Kapasitas Tas (W):</label>
          <input 
            type="number" min="1" max="10" 
            value={W} 
            onChange={(e) => setW(parseInt(e.target.value) || 1)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--panel-border)', background: 'transparent', color: 'white', width: '80px', fontSize: '1.2rem' }}
          />
        </div>
        
        <div className="glass-panel" style={{ padding: '1rem', flex: 1 }}>
          <label style={{ fontWeight: 'bold' }}>Daftar Barang Tersedia:</label>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            {items.map((item, idx) => (
              <div key={idx} style={{ 
                border: '1px solid var(--panel-border)', 
                padding: '0.5rem', 
                borderRadius: '8px', 
                background: currentStep.activeCell && currentStep.activeCell[0] === idx + 1 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                borderColor: currentStep.activeCell && currentStep.activeCell[0] === idx + 1 ? 'var(--accent-primary)' : 'var(--panel-border)',
                transition: 'all 0.3s'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Item {idx + 1}</div>
                <div><span style={{color: 'var(--neon-yellow)'}}>Berat: {item.wt}</span></div>
                <div><span style={{color: 'var(--neon-green)'}}>Nilai: {item.val}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="visualizer-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel" style={{ flex: 1, overflowX: 'auto' }}>
            <h3 style={{ marginBottom: '1rem' }}>Tabel Profit Maksimal (K)</h3>
            
            <div className="grid-container">
              {/* Header row for Weights */}
              <div className="grid-row">
                <div className="grid-cell" style={{ border: 'none', background: 'transparent', width: '80px' }}>Item \\ W</div>
                {Array.from({length: W + 1}).map((_, w) => (
                  <div key={`header-${w}`} className="grid-cell grid-header">{w}</div>
                ))}
              </div>
              
              {/* Data rows */}
              {currentStep.grid.map((row, i) => (
                <div key={`row-${i}`} className="grid-row">
                  <div className="grid-cell grid-header" style={{ width: '80px', justifyContent: 'flex-start', paddingLeft: '0.5rem' }}>
                    {i === 0 ? '0 (None)' : `i=${i} (w:${items[i-1].wt})`}
                  </div>
                  {row.map((cellValue, w) => {
                    let isRead = currentStep.readCells.some(rc => rc[0] === i && rc[1] === w);
                    let isWrite = currentStep.activeCell && currentStep.activeCell[0] === i && currentStep.activeCell[1] === w;
                    
                    let className = "grid-cell";
                    if (isWrite) className += " cell-active";
                    else if (isRead) className += " cell-checking";
                    else if (cellValue !== '?') className += " cell-done";

                    return (
                      <div key={`cell-${i}-${w}`} className={className}>
                        {cellValue}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="controls" style={{ marginTop: '2rem' }}>
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
              {steps.slice(Math.max(0, stepIdx - 10), stepIdx + 1).map((s, i) => (
                <div key={i} className="log-entry" style={{ opacity: i === Math.min(10, stepIdx) ? 1 : 0.6 }}>
                  <span style={{ color: 'var(--accent-primary)', marginRight: '0.5rem' }}>{s.log}</span>
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
        </div>
      </div>
    </div>
  );
}
