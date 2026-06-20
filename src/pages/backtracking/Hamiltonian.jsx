import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

export default function Hamiltonian() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [steps, setSteps] = useState([]);

  const N = 5;
  // Adjacency Matrix
  const graph = [
    [0, 1, 1, 0, 1],
    [1, 0, 1, 1, 1],
    [1, 1, 0, 1, 0],
    [0, 1, 1, 0, 1],
    [1, 1, 0, 1, 0]
  ];

  // Coordinates for SVG (0 to 100 percentages)
  const nodesPos = [
    { x: 50, y: 10 }, // 0: Top
    { x: 90, y: 40 }, // 1: Right
    { x: 75, y: 90 }, // 2: Bottom Right
    { x: 25, y: 90 }, // 3: Bottom Left
    { x: 10, y: 40 }  // 4: Left
  ];

  useEffect(() => {
    generateSteps();
    setStepIdx(0);
    setIsPlaying(false);
  }, []);

  const generateSteps = () => {
    let currentSteps = [];
    let path = Array(N).fill(-1);
    let found = false;

    const isSafe = (v, pos) => {
      // Check if this vertex is an adjacent vertex of the previously added vertex
      if (graph[path[pos - 1]][v] === 0) return false;

      // Check if the vertex has already been included
      for (let i = 0; i < pos; i++) {
        if (path[i] === v) return false;
      }
      return true;
    };

    const hamCycleUtil = (pos) => {
      // Base case: If all vertices are included in the path
      if (pos === N) {
        currentSteps.push({
          line: 2,
          path: [...path],
          checkingNode: -1,
          isClash: false,
          log: `Semua node dikunjungi. Mengecek apakah node terakhir terhubung ke node awal...`
        });

        // And if there is an edge from the last included vertex to the first vertex
        if (graph[path[pos - 1]][path[0]] === 1) {
          found = true;
          currentSteps.push({
            line: 3,
            path: [...path, path[0]], // Close the cycle
            checkingNode: -1,
            isClash: false,
            log: `Sirkuit Hamilton ditemukan! Rute komplit.`
          });
          return true;
        } else {
          currentSteps.push({
            line: 16, // Return false
            path: [...path],
            checkingNode: -1,
            isClash: true,
            log: `Node terakhir (${path[pos-1]}) TIDAK terhubung ke node awal (${path[0]}). Bukan sirkuit. Mundur (Backtrack).`
          });
          return false;
        }
      }

      for (let v = 1; v < N; v++) { // Start from 1 because 0 is the starting point
        currentSteps.push({
          line: 7,
          path: [...path],
          checkingNode: v,
          isClash: false,
          log: `Mengecek apakah Node ${v} bisa ditambahkan ke posisi ${pos}...`
        });

        if (isSafe(v, pos)) {
          path[pos] = v;
          currentSteps.push({
            line: 9,
            path: [...path],
            checkingNode: -1,
            isClash: false,
            log: `Aman! Menambahkan Node ${v} ke path. Lanjut ke langkah berikutnya.`
          });

          if (hamCycleUtil(pos + 1) === true) return true;

          // If adding vertex v doesn't lead to a solution, then remove it
          path[pos] = -1;
          if (!found) {
             currentSteps.push({
               line: 13,
               path: [...path],
               checkingNode: -1,
               isClash: false,
               log: `Jalan buntu! Menghapus Node ${v} dari path (BACKTRACK).`
             });
          }
        } else {
          let reason = "";
          if (graph[path[pos - 1]][v] === 0) reason = `Tidak ada edge dari ${path[pos-1]} ke ${v}.`;
          else reason = `Node ${v} sudah dikunjungi.`;
          
          currentSteps.push({
            line: 8,
            path: [...path],
            checkingNode: v,
            isClash: true,
            log: `Tidak Aman (Pruning). ${reason}`
          });
        }
      }
      return false;
    };

    path[0] = 0; // Start at node 0
    currentSteps.push({
      line: 1,
      path: [...path],
      checkingNode: -1,
      isClash: false,
      log: `Memulai pencarian. Titik awal (Start) ditetapkan di Node 0.`
    });

    hamCycleUtil(1);

    if (!found) {
      currentSteps.push({
        line: 17,
        path: [...path],
        checkingNode: -1,
        isClash: false,
        log: `Pencarian selesai. Tidak ditemukan Sirkuit Hamilton pada graf ini.`
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

  const currentStep = steps[stepIdx] || { line: 1, path: [], checkingNode: -1, isClash: false, log: '' };

  const cCode = `bool hamCycleUtil(int path[], int pos) {
  if (pos == V) {
    // Jika node terakhir terhubung ke awal, return true
    return (graph[path[pos - 1]][path[0]] == 1);
  }

  for (int v = 1; v < V; v++) {
    if (isSafe(v, path, pos)) {
      path[pos] = v; // Ambil node v

      if (hamCycleUtil(path, pos + 1) == true)
        return true;

      path[pos] = -1; // BACKTRACK: Hapus node v
    }
  }
  return false;
}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Pencarian Sirkuit Hamilton</h1>
        <p className="page-description">
          Mencari lintasan (siklus) dalam sebuah graf yang mengunjungi <span style={{ color: 'var(--neon-green)'}}>setiap titik (node) tepat satu kali</span> dan kembali ke titik awal.
        </p>
      </div>

      <div className="visualizer-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ marginBottom: '1rem', width: '100%' }}>Graf (Visualisasi Path)</h3>
            
            <div style={{ position: 'relative', width: '100%', height: '300px', display: 'flex', justifyContent: 'center' }}>
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
                {/* Draw all static edges */}
                {graph.map((row, i) => 
                  row.map((val, j) => {
                    if (val === 1 && i < j) {
                      return (
                        <line 
                          key={`edge-${i}-${j}`}
                          x1={`${nodesPos[i].x}%`} y1={`${nodesPos[i].y}%`} 
                          x2={`${nodesPos[j].x}%`} y2={`${nodesPos[j].y}%`} 
                          style={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} 
                        />
                      );
                    }
                    return null;
                  })
                )}

                {/* Draw Active Path Edges */}
                {currentStep.path.map((node, idx) => {
                  if (node !== -1 && idx > 0 && currentStep.path[idx-1] !== -1) {
                    let prevNode = currentStep.path[idx-1];
                    return (
                      <line 
                        key={`path-${idx}`}
                        x1={`${nodesPos[prevNode].x}%`} y1={`${nodesPos[prevNode].y}%`} 
                        x2={`${nodesPos[node].x}%`} y2={`${nodesPos[node].y}%`} 
                        style={{ stroke: 'var(--neon-yellow)', strokeWidth: 4 }} 
                      />
                    );
                  }
                  return null;
                })}

                {/* Draw Checking Edge (if any) */}
                {currentStep.checkingNode !== -1 && currentStep.path.findIndex(n => n === -1) > 0 && (
                  <line 
                    x1={`${nodesPos[currentStep.path[currentStep.path.findIndex(n => n === -1) - 1]].x}%`} 
                    y1={`${nodesPos[currentStep.path[currentStep.path.findIndex(n => n === -1) - 1]].y}%`} 
                    x2={`${nodesPos[currentStep.checkingNode].x}%`} 
                    y2={`${nodesPos[currentStep.checkingNode].y}%`} 
                    style={{ 
                      stroke: currentStep.isClash ? 'var(--neon-red)' : 'var(--accent-primary)', 
                      strokeWidth: 3,
                      strokeDasharray: '5,5'
                    }} 
                  />
                )}
              </svg>

              <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}>
                {nodesPos.map((pos, i) => {
                  let isVisited = currentStep.path.includes(i);
                  let isChecking = currentStep.checkingNode === i;
                  
                  let bg = 'var(--bg-color)';
                  let border = '2px solid var(--text-secondary)';
                  let color = 'var(--text-primary)';

                  if (isVisited) {
                    bg = 'rgba(245, 158, 11, 0.2)';
                    border = '2px solid var(--neon-yellow)';
                    color = 'var(--neon-yellow)';
                  }
                  
                  if (isChecking) {
                    bg = currentStep.isClash ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)';
                    border = currentStep.isClash ? '2px solid var(--neon-red)' : '2px solid var(--accent-primary)';
                  }

                  return (
                    <div key={i} style={{ 
                      position: 'absolute', 
                      top: `calc(${pos.y}% - 20px)`, 
                      left: `calc(${pos.x}% - 20px)`, 
                      width: '40px', height: '40px', 
                      borderRadius: '50%', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontWeight: 'bold', 
                      background: bg, border: border, color: color,
                      transition: 'all 0.3s'
                    }}>
                      {i}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Path Terkini:</div>
              <div style={{ display: 'flex', gap: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                {currentStep.path.map((node, i) => (
                  <span key={i} style={{ color: node !== -1 ? 'var(--neon-yellow)' : 'var(--text-secondary)'}}>
                    {node !== -1 ? node : '_'} {i < (currentStep.path.length - 1) && '→'}
                  </span>
                ))}
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
          
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Pruning (isSafe)</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Pada masalah Sirkuit Hamilton, kita dapat memotong cabang percarian jika:
              <br/><br/>
              1. Tidak ada <i>edge</i> (garis) yang menghubungkan node saat ini dengan node kandidat selanjutnya.
              <br/>
              2. Node kandidat tersebut sudah ada di dalam lintasan (mencegah siklus prematur).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
