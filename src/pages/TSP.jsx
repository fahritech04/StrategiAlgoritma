import React, { useState, useEffect } from 'react';
import useAutoPlay from '../hooks/useAutoPlay';
import PlaybackControls from '../components/PlaybackControls';
import ExecutionLog from '../components/ExecutionLog';
import CodeBlock from '../components/CodeBlock';

export default function TSP() {
  const N = 4;
  const initialDist = [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]
  ];
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    generateSteps(initialDist);
    setStepIdx(0);
    setIsPlaying(false);
  }, []);

  const generateSteps = (dist) => {
    let currentSteps = [];
    const numStates = 1 << N;
    let dp = Array(numStates).fill().map(() => Array(N).fill('∞'));
    
    currentSteps.push({
      line: 2,
      dp: JSON.parse(JSON.stringify(dp)),
      activeMask: -1,
      activeCity: -1,
      nextMask: -1,
      nextCity: -1,
      log: `Inisialisasi memori dp[${numStates}][${N}] dengan tak terhingga (∞)`
    });

    dp[1][0] = 0;
    currentSteps.push({
      line: 5,
      dp: JSON.parse(JSON.stringify(dp)),
      activeMask: 1,
      activeCity: 0,
      nextMask: -1,
      nextCity: -1,
      log: `Base case: Mulai dari kota 0. Masker = 0001 (Desimal: 1). Cost = 0.`
    });

    for (let mask = 1; mask < numStates; mask++) {
      for (let i = 0; i < N; i++) {
        if (mask & (1 << i)) { // City i is in the mask
          if (dp[mask][i] === '∞') continue; // Optimization for visualization
          
          for (let j = 0; j < N; j++) {
            if (!(mask & (1 << j))) { // City j is NOT in the mask
              let nextMask = mask | (1 << j);
              let currentCost = dp[mask][i];
              let travelCost = dist[i][j];
              let newTotal = currentCost + travelCost;
              
              currentSteps.push({
                line: 13,
                dp: JSON.parse(JSON.stringify(dp)),
                activeMask: mask,
                activeCity: i,
                nextMask: nextMask,
                nextCity: j,
                log: `Dari State [Mask: ${mask.toString(2).padStart(4,'0')}, Akhir: Kota ${i}] ke [Kota ${j}]. Biaya: ${currentCost} + ${travelCost} = ${newTotal}`
              });

              if (dp[nextMask][j] === '∞' || newTotal < dp[nextMask][j]) {
                dp[nextMask][j] = newTotal;
                currentSteps.push({
                  line: 13,
                  dp: JSON.parse(JSON.stringify(dp)),
                  activeMask: -1,
                  activeCity: -1,
                  nextMask: nextMask,
                  nextCity: j,
                  log: `Update! Rute lebih cepat ditemukan. dp[${nextMask}][${j}] = ${newTotal}`
                });
              } else {
                 currentSteps.push({
                  line: 13,
                  dp: JSON.parse(JSON.stringify(dp)),
                  activeMask: -1,
                  activeCity: -1,
                  nextMask: nextMask,
                  nextCity: j,
                  log: `Abaikan. Sudah ada rute lebih cepat atau sama ke state ini (${dp[nextMask][j]}).`
                });
              }
            }
          }
        }
      }
    }

    let minAns = Infinity;
    let finalLog = "";
    for (let i = 1; i < N; i++) {
      if (dp[numStates - 1][i] !== '∞') {
        let returnCost = dp[numStates - 1][i] + dist[i][0];
        if (returnCost < minAns) {
          minAns = returnCost;
          finalLog = `Rute terbaik: Berakhir di Kota ${i} (Cost: ${dp[numStates - 1][i]}) lalu kembali ke Kota 0 (Cost: ${dist[i][0]}). Total = ${minAns}`;
        }
      }
    }

    currentSteps.push({
      line: 20,
      dp: JSON.parse(JSON.stringify(dp)),
      activeMask: numStates - 1,
      activeCity: -1,
      nextMask: -1,
      nextCity: -1,
      log: `Kembali ke kota asal. ${finalLog}`
    });

    setSteps(currentSteps);
  };

  useAutoPlay(isPlaying, setIsPlaying, stepIdx, setStepIdx, steps.length, 800);

  const currentStep = steps[stepIdx] || { line: 1, dp: [], activeMask: -1, activeCity: -1, nextMask: -1, nextCity: -1, log: '' };

  const getCityName = (idx) => String.fromCharCode(65 + idx); // A, B, C, D

  const cCode = `int tsp(int dist[N][N]) {
  int dp[1<<N][N];
  // inisialisasi dp dengan tak terhingga...
  
  dp[1][0] = 0; // Mulai dari kota 0
  
  for(int mask = 1; mask < (1<<N); mask++) {
    for(int i = 0; i < N; i++) {
      if(mask & (1<<i)) { // Kota i sudah dikunjungi
        for(int j = 0; j < N; j++) {
          if(!(mask & (1<<j))) { // Kota j belum dikunjungi
            int nextMask = mask | (1<<j);
            dp[nextMask][j] = min(dp[nextMask][j], 
                                  dp[mask][i] + dist[i][j]);
          }
        }
      }
    }
  }
  // cari rute minimum kembali ke awal...
  return ans;
}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Travelling Salesperson Problem</h1>
        <p className="page-description">
          Menyelesaikan TSP menggunakan DP dengan <span style={{ color: 'var(--neon-yellow)'}}>Bitmasking</span> (Algoritma Held-Karp). Memori menyimpan state himpunan kota yang telah dikunjungi.
        </p>
      </div>

      <div className="visualizer-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="glass-panel" style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Jarak Antar Kota</h3>
              <div className="grid-container" style={{ fontSize: '0.8rem' }}>
                <div className="grid-row">
                  <div className="grid-cell" style={{ border: 'none' }}></div>
                  {Array.from({length: N}).map((_, i) => <div key={i} className="grid-cell grid-header">{getCityName(i)}</div>)}
                </div>
                {initialDist.map((row, i) => (
                  <div key={i} className="grid-row">
                    <div className="grid-cell grid-header">{getCityName(i)}</div>
                    {row.map((val, j) => (
                      <div key={j} className="grid-cell" style={{ background: i===j ? 'rgba(0,0,0,0.3)' : '' }}>
                        {val}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
               <h3 style={{ marginBottom: '1rem' }}>Logika Bitmask</h3>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                 Setiap angka integer dapat direpresentasikan sebagai biner. Kita gunakan biner ini untuk mengingat kota mana yang sudah dikunjungi.<br/><br/>
                 Contoh: Mask <code>5</code> = Biner <code>0101</code><br/>
                 Artinya: Kita sudah mengunjungi Kota A (Bit ke-0 bernilai 1) dan Kota C (Bit ke-2 bernilai 1).
               </p>
            </div>
          </div>

          <div className="glass-panel" style={{ flex: 1, overflowX: 'auto', maxHeight: '500px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Tabel dp[mask][kota_terakhir]</h3>
            
            <div className="grid-container" style={{ fontSize: '0.8rem' }}>
              <div className="grid-row">
                <div className="grid-cell" style={{ border: 'none', width: '120px' }}>Mask (Biner)</div>
                {Array.from({length: N}).map((_, i) => (
                  <div key={i} className="grid-cell grid-header">Akhir {getCityName(i)}</div>
                ))}
              </div>
              
              {currentStep.dp.map((row, mask) => (
                <div key={mask} className="grid-row">
                  <div className="grid-cell grid-header" style={{ width: '120px', fontFamily: 'var(--font-mono)' }}>
                    {mask} ({mask.toString(2).padStart(N, '0')})
                  </div>
                  {row.map((cellValue, city) => {
                    let isSource = currentStep.activeMask === mask && currentStep.activeCity === city;
                    let isTarget = currentStep.nextMask === mask && currentStep.nextCity === city;
                    
                    let className = "grid-cell";
                    if (isTarget) className += " cell-active";
                    else if (isSource) className += " cell-checking";
                    else if (cellValue !== '∞') className += " cell-done";

                    return (
                      <div key={`${mask}-${city}`} className={className}>
                        {cellValue}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <PlaybackControls isPlaying={isPlaying} setIsPlaying={setIsPlaying} stepIdx={stepIdx} setStepIdx={setStepIdx} stepsLength={steps.length} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ExecutionLog steps={steps} stepIdx={stepIdx} />

          <div className="glass-panel">
            <h3>Pseudocode (C)</h3>
            <div style={{ marginTop: '1rem' }}>
              <CodeBlock code={cCode} activeLine={currentStep.line} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
