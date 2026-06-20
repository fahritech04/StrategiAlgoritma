import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';

export default function CoinChange() {
  const [targetStr, setTargetStr] = useState("6");
  const [denominationsStr, setDenominationsStr] = useState("1, 3, 4");
  
  const [n, setN] = useState(6);
  const [D, setD] = useState([1, 3, 4]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    let t = parseInt(targetStr);
    let denoms = denominationsStr.split(',').map(s => parseInt(s.trim())).filter(num => !isNaN(num) && num > 0);
    
    if (!isNaN(t) && t > 0 && denoms.length > 0) {
      setN(t);
      setD(denoms);
    }
  }, [targetStr, denominationsStr]);

  useEffect(() => {
    generateSteps(n, D);
    setStepIdx(0);
    setIsPlaying(false);
  }, [n, D]);

  const generateSteps = (amount, coins) => {
    let currentSteps = [];
    let F = Array(amount + 1).fill('?');
    
    currentSteps.push({
      line: 2,
      array: [...F],
      activeIndices: [],
      checkIndices: [],
      coinIdx: -1,
      log: `Inisialisasi array F ukuran ${amount + 1}`
    });

    F[0] = 0;
    currentSteps.push({
      line: 3,
      array: [...F],
      activeIndices: [0],
      checkIndices: [],
      coinIdx: -1,
      log: `Base case: F[0] = 0 (Butuh 0 koin untuk nilai 0)`
    });

    for (let i = 1; i <= amount; i++) {
      currentSteps.push({
        line: 4,
        array: [...F],
        activeIndices: [],
        checkIndices: [],
        coinIdx: -1,
        log: `Mencari minimum koin untuk target = ${i}`
      });

      F[i] = Infinity;
      currentSteps.push({
        line: 5,
        array: [...F],
        activeIndices: [i],
        checkIndices: [],
        coinIdx: -1,
        log: `Set F[${i}] = ∞ (sebagai nilai awal / belum ada solusi)`
      });

      for (let j = 0; j < coins.length; j++) {
        let coinVal = coins[j];
        
        currentSteps.push({
          line: 6,
          array: [...F],
          activeIndices: [i],
          checkIndices: [],
          coinIdx: j,
          log: `Coba koin: ${coinVal}`
        });

        if (i >= coinVal) {
          currentSteps.push({
            line: 7,
            array: [...F],
            activeIndices: [i],
            checkIndices: [i - coinVal],
            coinIdx: j,
            log: `Cek F[${i - coinVal}] + 1 = ${F[i - coinVal]} + 1 = ${F[i - coinVal] + 1}`
          });

          if (F[i - coinVal] + 1 < F[i]) {
            F[i] = F[i - coinVal] + 1;
            currentSteps.push({
              line: 8,
              array: [...F],
              activeIndices: [i],
              checkIndices: [i - coinVal],
              coinIdx: j,
              log: `Ditemukan nilai lebih kecil! Update F[${i}] = ${F[i]}`
            });
          } else {
            currentSteps.push({
              line: 7,
              array: [...F],
              activeIndices: [i],
              checkIndices: [],
              coinIdx: j,
              log: `Tidak lebih kecil dari ${F[i]}, abaikan.`
            });
          }
        } else {
          currentSteps.push({
            line: 7,
            array: [...F],
            activeIndices: [i],
            checkIndices: [],
            coinIdx: j,
            log: `Koin ${coinVal} lebih besar dari target ${i}, lewati.`
          });
        }
      }
    }

    currentSteps.push({
      line: 12,
      array: [...F],
      activeIndices: [amount],
      checkIndices: [],
      coinIdx: -1,
      log: `Selesai! Jumlah koin minimum untuk target ${amount} adalah ${F[amount] === Infinity ? 'Tidak ada solusi' : F[amount]}`
    });

    setSteps(currentSteps);
  };

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

  const currentStep = steps[stepIdx] || { line: 1, array: [], activeIndices: [], checkIndices: [], coinIdx: -1, log: '' };

  const formatVal = (val) => val === Infinity ? '∞' : val;

  const cCode = `int coinChange(int D[], int m, int n) {
  int F[n+1];
  F[0] = 0;
  for (int i = 1; i <= n; i++) {
    F[i] = INFINITY;
    for (int j = 0; j < m; j++) {
      if (i >= D[j] && F[i - D[j]] + 1 < F[i]) {
        F[i] = F[i - D[j]] + 1;
      }
    }
  }
  return F[n];
}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Coin Change Problem</h1>
        <p className="page-description">
          Mencari jumlah <span style={{ color: 'var(--neon-green)' }}>minimum koin</span> yang diperlukan untuk mencapai target nilai tertentu (Optimization Problem).
        </p>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label>Target (n):</label>
          <input 
            type="number" min="1" max="20" 
            value={targetStr} 
            onChange={(e) => setTargetStr(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--panel-border)', background: 'transparent', color: 'white', width: '80px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label>Koin (D):</label>
          <input 
            type="text" 
            value={denominationsStr} 
            onChange={(e) => setDenominationsStr(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--panel-border)', background: 'transparent', color: 'white', width: '200px' }}
          />
        </div>
      </div>

      <div className="visualizer-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel" style={{ flex: 1 }}>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Denominasi Koin (D)</h3>
              <div className="array-container" style={{ justifyContent: 'flex-start' }}>
                {D.map((val, idx) => (
                  <div key={idx} className={`array-cell ${currentStep.coinIdx === idx ? 'cell-checking animate-pulse' : ''}`} style={{ borderRadius: '50%' }}>
                    {val}
                  </div>
                ))}
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Memori (Array F) - Minimal koin untuk target i</h3>
            <div className="viz-canvas" style={{ minHeight: '150px' }}>
              <div className="array-container">
                {currentStep.array.map((val, idx) => {
                  let className = "array-cell";
                  if (currentStep.activeIndices.includes(idx)) {
                    className += " cell-active";
                  } else if (currentStep.checkIndices.includes(idx)) {
                    className += " cell-checking"; // looking back at previous subproblems
                  } else if (val !== '?') {
                    className += " cell-done";
                  }

                  return (
                    <div key={idx} className={className}>
                      <span className="array-cell-index">{idx}</span>
                      {formatVal(val)}
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
            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Overlapping Subproblems</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Jika kita ingin membuat kembalian 6 dengan koin (1,3,4), maka kita harus tahu mana yang lebih baik antara:
              <br/>- Tambahkan koin 1 pada solusi terbaik kembalian 5. <code>(F[5] + 1)</code>
              <br/>- Tambahkan koin 3 pada solusi terbaik kembalian 3. <code>(F[3] + 1)</code>
              <br/>- Tambahkan koin 4 pada solusi terbaik kembalian 2. <code>(F[2] + 1)</code>
              <br/><br/>
              Ketergantungan ini adalah alasan mengapa kita mengisi tabel dari indeks terkecil (bottom-up).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
