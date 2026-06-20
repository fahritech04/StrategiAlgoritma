import React, { useState, useEffect } from 'react';
import useAutoPlay from '../hooks/useAutoPlay';
import PlaybackControls from '../components/PlaybackControls';
import ExecutionLog from '../components/ExecutionLog';
import CodeBlock from '../components/CodeBlock';

export default function CoinRow() {
  const [coinsStr, setCoinsStr] = useState("5, 1, 2, 10, 6, 2");
  const [coins, setCoins] = useState([0, 5, 1, 2, 10, 6, 2]); // 1-indexed, C[0]=0
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [stepIdx, setStepIdx] = useState(0);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    let parsed = coinsStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (parsed.length > 0) {
      setCoins([0, ...parsed]); // 1-indexed for C
    }
  }, [coinsStr]);

  useEffect(() => {
    if (coins.length > 1) {
      generateSteps(coins);
      setStepIdx(0);
      setIsPlaying(false);
    }
  }, [coins]);

  const generateSteps = (C) => {
    let currentSteps = [];
    let n = C.length - 1;
    let F = Array(n + 1).fill('?');
    
    currentSteps.push({
      line: 2,
      array: [...F],
      activeIndices: [],
      checkIndices: [],
      log: `Inisialisasi array F ukuran ${n + 1}`
    });

    F[0] = 0;
    currentSteps.push({
      line: 3,
      array: [...F],
      activeIndices: [0],
      checkIndices: [],
      log: `Base case: F[0] = 0`
    });

    F[1] = C[1];
    currentSteps.push({
      line: 4,
      array: [...F],
      activeIndices: [1],
      checkIndices: [],
      log: `Base case: F[1] = C[1] = ${C[1]}`
    });

    for (let i = 2; i <= n; i++) {
      currentSteps.push({
        line: 5,
        array: [...F],
        activeIndices: [],
        checkIndices: [],
        log: `Evaluasi koin ke-${i} (Nilai: ${C[i]})`
      });

      let pick = C[i] + F[i-2];
      let skip = F[i-1];
      
      currentSteps.push({
        line: 6,
        array: [...F],
        activeIndices: [],
        checkIndices: [i-2, i-1],
        log: `Bandingkan: Ambil Koin (C[${i}] + F[${i-2}] = ${C[i]} + ${F[i-2]} = ${pick}) vs Lewati Koin (F[${i-1}] = ${skip})`
      });

      F[i] = Math.max(pick, skip);
      currentSteps.push({
        line: 6,
        array: [...F],
        activeIndices: [i],
        checkIndices: [],
        log: pick > skip ? `Keputusan: Ambil koin ke-${i}. F[${i}] = ${F[i]}` : `Keputusan: Lewati koin ke-${i}. F[${i}] = ${F[i]}`
      });
    }

    currentSteps.push({
      line: 8,
      array: [...F],
      activeIndices: [n],
      checkIndices: [],
      log: `Selesai! Nilai maksimum adalah F[${n}] = ${F[n]}`
    });

    setSteps(currentSteps);
  };

  useAutoPlay(isPlaying, setIsPlaying, stepIdx, setStepIdx, steps.length, 1500);

  const currentStep = steps[stepIdx] || { line: 1, array: [], activeIndices: [], checkIndices: [], log: '' };

  const cCode = `int coinRow(int C[], int n) {
  int F[n+1];
  F[0] = 0;
  F[1] = C[1];
  for (int i = 2; i <= n; i++) {
    F[i] = max(C[i] + F[i-2], F[i-1]);
  }
  return F[n];
}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Coin-Row Problem</h1>
        <p className="page-description">
          Memilih koin dengan total nilai maksimum dari sebuah baris, dengan syarat <span style={{ color: 'var(--neon-yellow)'}}>tidak boleh mengambil dua koin yang bersebelahan</span>.
        </p>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label>Nilai Koin (pisahkan koma):</label>
        <input 
          type="text" 
          value={coinsStr} 
          onChange={(e) => setCoinsStr(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--panel-border)', background: 'transparent', color: 'white', width: '300px' }}
        />
      </div>

      <div className="visualizer-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel" style={{ flex: 1 }}>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Barisan Koin (C)</h3>
              <div className="array-container">
                {coins.slice(1).map((val, idx) => (
                  <div key={idx} className="array-cell" style={{ borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', borderColor: 'var(--neon-yellow)' }}>
                    <span className="array-cell-index">C[{idx+1}]</span>
                    {val}
                  </div>
                ))}
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Array DP (F) - Nilai Maksimum per Tahap</h3>
            <div className="array-container" style={{ minHeight: '100px' }}>
              {currentStep.array.map((val, idx) => {
                let className = "array-cell";
                if (currentStep.activeIndices.includes(idx)) {
                  className += " cell-active";
                } else if (currentStep.checkIndices.includes(idx)) {
                  className += " cell-checking";
                } else if (val !== '?') {
                  className += " cell-done";
                }

                return (
                  <div key={idx} className={className}>
                    <span className="array-cell-index">F[{idx}]</span>
                    {val}
                  </div>
                );
              })}
            </div>

            <PlaybackControls isPlaying={isPlaying} setIsPlaying={setIsPlaying} stepIdx={stepIdx} setStepIdx={setStepIdx} stepsLength={steps.length} />
          </div>

          <ExecutionLog steps={steps} stepIdx={stepIdx} />
        </div>

        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h3>Pseudocode (C)</h3>
          <div style={{ marginTop: '1rem' }}>
            <CodeBlock code={cCode} activeLine={currentStep.line} />
          </div>
          
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <h4 style={{ color: 'var(--neon-green)', marginBottom: '0.5rem' }}>Logika Inti</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Pada setiap koin <code>i</code>, kita memiliki dua pilihan:
              <br/><br/>
              <strong>1. Ambil koin i:</strong> Kita dapatkan nilai <code>C[i]</code>, tapi kita tidak boleh ambil koin sebelumnya. Jadi kita tambahkan dengan solusi terbaik dari 2 langkah sebelumnya: <code>F[i-2]</code>.
              <br/><br/>
              <strong>2. Lewati koin i:</strong> Kita tidak dapat koin ini, artinya nilai kita sama dengan solusi terbaik dari langkah sebelumnya: <code>F[i-1]</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
