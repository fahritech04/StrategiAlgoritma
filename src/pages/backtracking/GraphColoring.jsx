import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

export default function GraphColoring() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [steps, setSteps] = useState([]);

  const N = 5;
  const m = 3; // Number of colors
  const colorPalette = ['transparent', '#ef4444', '#10b981', '#3b82f6']; // 0: None, 1: Red, 2: Green, 3: Blue
  const colorNames = ['None', 'Merah', 'Hijau', 'Biru'];

  // Adjacency Matrix
  const graph = [
    [0, 1, 1, 1, 0],
    [1, 0, 1, 0, 0],
    [1, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [0, 0, 0, 1, 0]
  ];

  // Coordinates for SVG
  const nodesPos = [
    { x: 50, y: 20 }, // 0
    { x: 20, y: 50 }, // 1
    { x: 50, y: 80 }, // 2
    { x: 80, y: 50 }, // 3
    { x: 80, y: 90 }  // 4
  ];

  useEffect(() => {
    generateSteps();
    setStepIdx(0);
    setIsPlaying(false);
  }, []);

  const generateSteps = () => {
    let currentSteps = [];
    let color = Array(N).fill(0);
    let found = false;

    const isSafe = (v, c) => {
      for (let i = 0; i < N; i++) {
        if (graph[v][i] === 1 && c === color[i]) {
          return false;
        }
      }
      return true;
    };

    const graphColoringUtil = (v) => {
      if (v === N) {
        found = true;
        currentSteps.push({
          line: 2,
          color: [...color],
          activeNode: -1,
          checkingColor: 0,
          isClash: false,
          log: `Semua ${N} node berhasil diwarnai! Solusi ditemukan.`
        });
        return true;
      }

      for (let c = 1; c <= m; c++) {
        currentSteps.push({
          line: 7,
          color: [...color],
          activeNode: v,
          checkingColor: c,
          isClash: false,
          log: `Mencoba mewarnai Node ${v} dengan warna ${colorNames[c]}...`
        });

        if (isSafe(v, c)) {
          color[v] = c;
          currentSteps.push({
            line: 9,
            color: [...color],
            activeNode: v,
            checkingColor: c,
            isClash: false,
            log: `Aman! Node ${v} diwarnai ${colorNames[c]}. Lanjut ke Node ${v+1}.`
          });

          if (graphColoringUtil(v + 1) === true) return true;

          // Backtrack
          color[v] = 0;
          if (!found) {
            currentSteps.push({
              line: 13,
              color: [...color],
              activeNode: v,
              checkingColor: 0,
              isClash: false,
              log: `Jalan buntu! BACKTRACK: Menghapus warna Node ${v} dan mencoba warna lain.`
            });
          }
        } else {
          currentSteps.push({
            line: 8,
            color: [...color],
            activeNode: v,
            checkingColor: c,
            isClash: true,
            log: `Tidak Aman (Pruning). Warna ${colorNames[c]} bentrok dengan tetangga Node ${v}.`
          });
        }
      }

      return false;
    };

    currentSteps.push({
      line: 1,
      color: [...color],
      activeNode: -1,
      checkingColor: 0,
      isClash: false,
      log: `Memulai pewarnaan graf dengan ${m} warna.`
    });

    graphColoringUtil(0);

    if (!found) {
       currentSteps.push({
        line: 16,
        color: [...color],
        activeNode: -1,
        checkingColor: 0,
        isClash: false,
        log: `Tidak ada solusi yang mungkin dengan ${m} warna.`
      });
    }

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

  const currentStep = steps[stepIdx] || { line: 1, color: [], activeNode: -1, checkingColor: 0, isClash: false, log: '' };

  const cCode = `bool graphColoringUtil(int m, int color[], int v) {
  if (v == V) {
    return true; // Semua node telah diwarnai
  }

  for (int c = 1; c <= m; c++) {
    if (isSafe(v, color, c)) { // Bounding function
      color[v] = c; // Warnai node v dengan c

      if (graphColoringUtil(m, color, v + 1) == true)
        return true;

      color[v] = 0; // BACKTRACK: Hapus warna
    }
  }
  return false;
}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Pewarnaan Graf (m-Coloring)</h1>
        <p className="page-description">
          Diberikan sebuah graf dan <span style={{ color: 'var(--neon-green)'}}>{m} warna</span>. Algoritma harus mewarnai setiap *node* sedemikian rupa sehingga <span style={{ color: 'var(--neon-yellow)'}}>tidak ada dua *node* yang bertetangga (terhubung langsung) memiliki warna yang sama</span>.
        </p>
      </div>

      <div className="visualizer-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div>Palette ({m} warna):</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ width: '20px', height: '20px', background: colorPalette[1], borderRadius: '4px' }}></div>
                <div style={{ width: '20px', height: '20px', background: colorPalette[2], borderRadius: '4px' }}></div>
                <div style={{ width: '20px', height: '20px', background: colorPalette[3], borderRadius: '4px' }}></div>
              </div>
            </div>
            
            <div style={{ position: 'relative', width: '100%', height: '300px', display: 'flex', justifyContent: 'center' }}>
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
                {graph.map((row, i) => 
                  row.map((val, j) => {
                    if (val === 1 && i < j) {
                      let isBentrok = false;
                      if (currentStep.activeNode === i && currentStep.isClash && currentStep.color[j] === currentStep.checkingColor) isBentrok = true;
                      if (currentStep.activeNode === j && currentStep.isClash && currentStep.color[i] === currentStep.checkingColor) isBentrok = true;

                      return (
                        <line 
                          key={`edge-${i}-${j}`}
                          x1={`${nodesPos[i].x}%`} y1={`${nodesPos[i].y}%`} 
                          x2={`${nodesPos[j].x}%`} y2={`${nodesPos[j].y}%`} 
                          style={{ 
                            stroke: isBentrok ? 'var(--neon-red)' : 'rgba(255,255,255,0.2)', 
                            strokeWidth: isBentrok ? 4 : 2 
                          }} 
                        />
                      );
                    }
                    return null;
                  })
                )}
              </svg>

              <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}>
                {nodesPos.map((pos, i) => {
                  let nodeColor = currentStep.color[i];
                  let isActive = currentStep.activeNode === i;
                  
                  let bg = nodeColor !== 0 ? colorPalette[nodeColor] : 'var(--bg-color)';
                  let border = '2px solid var(--text-secondary)';
                  
                  if (isActive) {
                    if (currentStep.isClash) {
                      border = '4px solid var(--neon-red)';
                      bg = colorPalette[currentStep.checkingColor];
                    } else {
                      border = '4px solid white';
                      if (currentStep.checkingColor !== 0) bg = colorPalette[currentStep.checkingColor];
                    }
                  }

                  return (
                    <div key={i} style={{ 
                      position: 'absolute', 
                      top: `calc(${pos.y}% - 25px)`, 
                      left: `calc(${pos.x}% - 25px)`, 
                      width: '50px', height: '50px', 
                      borderRadius: '50%', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontWeight: 'bold', fontSize: '1.2rem',
                      background: bg, border: border, color: 'white',
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                      transition: 'all 0.3s'
                    }}>
                      {i}
                    </div>
                  );
                })}
              </div>
            </div>

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
              <button className="btn btn-secondary" onClick={() => setStepIdx(prev => Math.min(steps.length - 1, prev + 1))} disabled={stepIdx === steps.length - 1}>
                <SkipForward size={18} /> Next
              </button>
            </div>
          </div>

          <div className="glass-panel">
            <h3>Execution Log</h3>
            <div className="log-panel" style={{ maxHeight: '180px' }}>
              {steps.slice(Math.max(0, stepIdx - 10), stepIdx + 1).map((s, i) => (
                <div key={i} className="log-entry" style={{ opacity: i === Math.min(10, stepIdx) ? 1 : 0.6 }}>
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
        </div>
      </div>
    </div>
  );
}
