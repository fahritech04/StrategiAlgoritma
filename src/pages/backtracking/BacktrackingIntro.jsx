import React, { useState, useEffect } from 'react';
import useAutoPlay from '../../hooks/useAutoPlay';
import PlaybackControls from '../../components/PlaybackControls';
import ExecutionLog from '../../components/ExecutionLog';
import CodeBlock from '../../components/CodeBlock';

export default function BacktrackingIntro() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    generateSteps();
    setStepIdx(0);
    setIsPlaying(false);
  }, []);

  const generateSteps = () => {
    let currentSteps = [];
    
    // Abstract Tree for visual:
    // Root(0) -> Left(1), Mid(2), Right(3)
    // Left(1) -> 1.1(4) Dead End, 1.2(5) Dead End
    // Mid(2) -> 2.1(6) Solution!
    
    currentSteps.push({
      activeNode: 0,
      path: [0],
      pruned: [],
      solutions: [],
      log: `Memulai pencarian dari Root (Kondisi Awal).`
    });

    currentSteps.push({
      activeNode: 1,
      path: [0, 1],
      pruned: [],
      solutions: [],
      log: `Eksplorasi Cabang 1 (Depth-First Search).`
    });

    currentSteps.push({
      activeNode: 4,
      path: [0, 1, 4],
      pruned: [],
      solutions: [],
      log: `Eksplorasi Cabang 1.1.`
    });

    currentSteps.push({
      activeNode: 1,
      path: [0, 1],
      pruned: [4],
      solutions: [],
      log: `Cabang 1.1 melanggar batasan (DEAD END). Bounding function memotong cabang ini (Pruning). Mundur (BACKTRACK) ke Node 1.`
    });

    currentSteps.push({
      activeNode: 5,
      path: [0, 1, 5],
      pruned: [4],
      solutions: [],
      log: `Mencoba alternatif lain: Cabang 1.2.`
    });

    currentSteps.push({
      activeNode: 1,
      path: [0, 1],
      pruned: [4, 5],
      solutions: [],
      log: `Cabang 1.2 juga buntu. Mundur (BACKTRACK) ke Node 1.`
    });

    currentSteps.push({
      activeNode: 0,
      path: [0],
      pruned: [1, 4, 5],
      solutions: [],
      log: `Node 1 sudah tidak memiliki opsi lain. Mundur (BACKTRACK) ke Root.`
    });

    currentSteps.push({
      activeNode: 2,
      path: [0, 2],
      pruned: [1, 4, 5],
      solutions: [],
      log: `Mencoba alternatif dari Root: Cabang 2.`
    });

    currentSteps.push({
      activeNode: 6,
      path: [0, 2, 6],
      pruned: [1, 4, 5],
      solutions: [],
      log: `Eksplorasi Cabang 2.1.`
    });

    currentSteps.push({
      activeNode: 6,
      path: [0, 2, 6],
      pruned: [1, 4, 5],
      solutions: [6],
      log: `SOLUSI DITEMUKAN di Node 2.1!`
    });

    setSteps(currentSteps);
  };

  useAutoPlay(isPlaying, setIsPlaying, stepIdx, setStepIdx, steps.length, 1500);

  const currentStep = steps[stepIdx] || { activeNode: -1, path: [], pruned: [], solutions: [], log: '' };

  // Helper to render node in tree
  const getNodeStyle = (id) => {
    if (currentStep.solutions.includes(id)) return { background: 'rgba(16, 185, 129, 0.2)', border: '2px solid var(--neon-green)', color: 'var(--neon-green)' };
    if (currentStep.pruned.includes(id)) return { background: 'rgba(239, 68, 68, 0.2)', border: '2px dashed var(--neon-red)', color: 'var(--neon-red)', opacity: 0.5 };
    if (currentStep.activeNode === id) return { background: 'rgba(59, 130, 246, 0.3)', border: '2px solid var(--accent-primary)', boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' };
    if (currentStep.path.includes(id)) return { background: 'rgba(245, 158, 11, 0.2)', border: '2px solid var(--neon-yellow)' };
    return { background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--panel-border)' };
  };

  const getEdgeStyle = (parentId, childId) => {
    if (currentStep.pruned.includes(childId)) return { stroke: 'var(--neon-red)', strokeDasharray: '5,5', opacity: 0.5 };
    if (currentStep.path.includes(childId)) return { stroke: 'var(--neon-yellow)', strokeWidth: 3 };
    return { stroke: 'var(--panel-border)', strokeWidth: 2 };
  };

  const cCode = `void backtrack(state) {
  if (is_solution(state)) {
    process_solution(state);
    return; // atau simpan solusi dan lanjut mencari
  }
  
  for (option in possible_options(state)) {
    if (is_valid(state, option)) { // Bounding Function
      apply_option(state, option);
      
      backtrack(state); // Rekursi mendalam (DFS)
      
      undo_option(state, option); // BACKTRACK! Mundur selangkah
    }
  }
}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Pengantar Backtracking</h1>
        <p className="page-description">
          Algoritma penelusuran sistematis berbasis <span style={{ color: 'var(--neon-yellow)'}}>Depth-First Search (DFS)</span>. Ketika algoritma menyadari bahwa cabang saat ini tidak mungkin menghasilkan solusi yang valid, algoritma akan "memotong" cabang tersebut (<span style={{ color: 'var(--neon-red)'}}>Pruning</span>) dan melangkah mundur (<span style={{ color: 'var(--accent-primary)'}}>Backtrack</span>) untuk mencoba alternatif lain.
        </p>
      </div>

      <div className="visualizer-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <h3 style={{ marginBottom: '1rem', width: '100%' }}>Visualisasi State Space Tree</h3>
             
             <div style={{ position: 'relative', width: '100%', height: '300px', display: 'flex', justifyContent: 'center' }}>
               <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
                 {/* Root to Level 1 */}
                 <line x1="50%" y1="30" x2="25%" y2="100" style={getEdgeStyle(0, 1)} />
                 <line x1="50%" y1="30" x2="50%" y2="100" style={getEdgeStyle(0, 2)} />
                 <line x1="50%" y1="30" x2="75%" y2="100" style={getEdgeStyle(0, 3)} />
                 
                 {/* Level 1 to Level 2 (Left) */}
                 <line x1="25%" y1="100" x2="15%" y2="200" style={getEdgeStyle(1, 4)} />
                 <line x1="25%" y1="100" x2="35%" y2="200" style={getEdgeStyle(1, 5)} />

                 {/* Level 1 to Level 2 (Mid) */}
                 <line x1="50%" y1="100" x2="50%" y2="200" style={getEdgeStyle(2, 6)} />
               </svg>

               <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}>
                 {/* Root */}
                 <div style={{ position: 'absolute', top: '15px', left: 'calc(50% - 20px)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', transition: 'all 0.3s', ...getNodeStyle(0) }}>R</div>
                 
                 {/* Level 1 */}
                 <div style={{ position: 'absolute', top: '85px', left: 'calc(25% - 20px)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', transition: 'all 0.3s', ...getNodeStyle(1) }}>1</div>
                 <div style={{ position: 'absolute', top: '85px', left: 'calc(50% - 20px)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', transition: 'all 0.3s', ...getNodeStyle(2) }}>2</div>
                 <div style={{ position: 'absolute', top: '85px', left: 'calc(75% - 20px)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', transition: 'all 0.3s', ...getNodeStyle(3) }}>3</div>

                 {/* Level 2 */}
                 <div style={{ position: 'absolute', top: '185px', left: 'calc(15% - 20px)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', transition: 'all 0.3s', ...getNodeStyle(4) }}>1.1</div>
                 <div style={{ position: 'absolute', top: '185px', left: 'calc(35% - 20px)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', transition: 'all 0.3s', ...getNodeStyle(5) }}>1.2</div>
                 <div style={{ position: 'absolute', top: '185px', left: 'calc(50% - 20px)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', transition: 'all 0.3s', ...getNodeStyle(6) }}>S</div>
               </div>
             </div>

             <PlaybackControls isPlaying={isPlaying} setIsPlaying={setIsPlaying} stepIdx={stepIdx} setStepIdx={setStepIdx} stepsLength={steps.length} />
          </div>

          <ExecutionLog steps={steps} stepIdx={stepIdx} />

        </div>

        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h3>Template Pseudocode (C)</h3>
          <div style={{ marginTop: '1rem' }}>
            <CodeBlock code={cCode} />
          </div>

          <div className="complexity-cards" style={{ gridTemplateColumns: '1fr', marginTop: '2rem' }}>
            <div className="comp-card" style={{ borderTopColor: 'var(--neon-green)' }}>
              <h4>Keunggulan Backtracking</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Jauh lebih cepat daripada Brute Force karena tidak semua kombinasi dicoba. Jika suatu kondisi sudah melanggar syarat (melalui <i>Bounding Function</i>), seluruh sisa cabang di bawahnya tidak akan dieksekusi.
              </p>
            </div>
            <div className="comp-card" style={{ borderTopColor: 'var(--neon-yellow)' }}>
              <h4>Konsep <i>Undo</i></h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Kunci utama backtracking di kode adalah melakukan aksi (<i>apply option</i>), memanggil rekursi, lalu <strong style={{ color: 'white'}}>membatalkan aksi tersebut</strong> (<i>undo option</i>) ketika rekursi kembali, sehingga *state* kembali bersih untuk mencoba opsi sebelahnya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
