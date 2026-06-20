import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

export default function NQueen() {
  const [N, setN] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    generateSteps(N);
    setStepIdx(0);
    setIsPlaying(false);
  }, [N]);

  const generateSteps = (size) => {
    let currentSteps = [];
    let board = Array(size).fill().map(() => Array(size).fill(0)); // 0: empty, 1: queen
    let solsFound = 0;

    const isSafe = (b, row, col) => {
      // Check column
      for (let i = 0; i < row; i++) {
        if (b[i][col] === 1) return false;
      }
      // Check upper diagonal left
      for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (b[i][j] === 1) return false;
      }
      // Check upper diagonal right
      for (let i = row, j = col; i >= 0 && j < size; i--, j++) {
        if (b[i][j] === 1) return false;
      }
      return true;
    };

    const solve = (row) => {
      if (row >= size) {
        solsFound++;
        currentSteps.push({
          line: 2,
          board: JSON.parse(JSON.stringify(board)),
          activeRow: -1,
          activeCol: -1,
          isClash: false,
          log: `Solusi ke-${solsFound} ditemukan! Semua ${size} ratu berhasil ditempatkan.`
        });
        return;
      }

      for (let col = 0; col < size; col++) {
        currentSteps.push({
          line: 7,
          board: JSON.parse(JSON.stringify(board)),
          activeRow: row,
          activeCol: col,
          isClash: false,
          log: `Mencoba menempatkan Ratu di Baris ${row}, Kolom ${col}...`
        });

        if (isSafe(board, row, col)) {
          board[row][col] = 1; // Place
          currentSteps.push({
            line: 9,
            board: JSON.parse(JSON.stringify(board)),
            activeRow: row,
            activeCol: col,
            isClash: false,
            log: `Aman! Ratu diletakkan di [${row}, ${col}]. Lanjut ke baris ${row + 1}.`
          });

          solve(row + 1);

          board[row][col] = 0; // Backtrack
          currentSteps.push({
            line: 13,
            board: JSON.parse(JSON.stringify(board)),
            activeRow: row,
            activeCol: col,
            isClash: false,
            log: `BACKTRACK! Mengambil kembali Ratu dari [${row}, ${col}] untuk mencari kemungkinan lain.`
          });
        } else {
          currentSteps.push({
            line: 8,
            board: JSON.parse(JSON.stringify(board)),
            activeRow: row,
            activeCol: col,
            isClash: true,
            log: `Tidak Aman (Pruning)! Posisi [${row}, ${col}] diserang oleh Ratu lain.`
          });
        }
      }
      
      currentSteps.push({
        line: 15,
        board: JSON.parse(JSON.stringify(board)),
        activeRow: row,
        activeCol: -1,
        isClash: false,
        log: `Baris ${row} sudah tidak ada kolom yang valid. Mundur ke baris ${row - 1}.`
      });
    };

    currentSteps.push({
      line: 1,
      board: JSON.parse(JSON.stringify(board)),
      activeRow: -1,
      activeCol: -1,
      isClash: false,
      log: `Memulai pencarian untuk papan ${size}x${size}.`
    });

    solve(0);
    
    currentSteps.push({
      line: 16,
      board: JSON.parse(JSON.stringify(board)),
      activeRow: -1,
      activeCol: -1,
      isClash: false,
      log: `Pencarian selesai. Total Solusi: ${solsFound}.`
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

  const currentStep = steps[stepIdx] || { line: 1, board: [], activeRow: -1, activeCol: -1, isClash: false, log: '' };

  const cCode = `bool solveNQueenUtil(int board[N][N], int row) {
  if (row >= N) {
    printSolution(board);
    return true; // (Atau return false jika ingin mencari solusi lain)
  }

  for (int col = 0; col < N; col++) {
    if (isSafe(board, row, col)) {
      board[row][col] = 1; // DO: Tempatkan Ratu

      solveNQueenUtil(board, row + 1); // RECURSE: Coba baris berikutnya

      board[row][col] = 0; // UNDO (BACKTRACK): Ambil kembali Ratu
    }
  }
  return false;
}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Permasalahan N-Queen</h1>
        <p className="page-description">
          Bagaimana cara menempatkan <span style={{ color: 'var(--neon-green)'}}>{N} Ratu (Queen)</span> di atas papan catur berukuran {N}x{N} 
          tanpa ada dua ratu yang saling menyerang (berada di baris, kolom, atau diagonal yang sama)?
        </p>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <label>Ukuran Papan (N):</label>
        <input 
          type="number" 
          min="4" max="8" 
          value={N} 
          onChange={(e) => setN(parseInt(e.target.value) || 4)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--panel-border)', background: 'transparent', color: 'white' }}
        />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>(Maksimal 8 agar browser tidak lag saat rendering)</span>
      </div>

      <div className="visualizer-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ marginBottom: '1rem', width: '100%' }}>Papan Catur</h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${N}, 45px)`, 
              gap: '2px', 
              background: 'var(--panel-border)', 
              padding: '4px',
              borderRadius: '8px'
            }}>
              {currentStep.board.map((row, rIdx) => 
                row.map((cell, cIdx) => {
                  let isDark = (rIdx + cIdx) % 2 === 1;
                  let bg = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.1)';
                  
                  let isActive = rIdx === currentStep.activeRow && cIdx === currentStep.activeCol;
                  let isClash = isActive && currentStep.isClash;
                  
                  if (isActive && !isClash) bg = 'rgba(59, 130, 246, 0.5)';
                  if (isClash) bg = 'rgba(239, 68, 68, 0.5)';

                  return (
                    <div key={`${rIdx}-${cIdx}`} style={{
                      width: '45px', height: '45px', background: bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem',
                      border: isActive ? '2px solid white' : 'none',
                      transition: 'background 0.3s'
                    }}>
                      {cell === 1 && <span style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>♛</span>}
                      {cell === 0 && isActive && <span style={{ color: 'rgba(255,255,255,0.5)' }}>♛</span>}
                    </div>
                  );
                })
              )}
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
          
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <h4 style={{ color: 'var(--neon-red)', marginBottom: '0.5rem' }}>Pruning (isSafe)</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Fungsi <code>isSafe()</code> bertindak sebagai <strong style={{color: 'white'}}>Bounding Function</strong>. Daripada kita meletakkan ratu secara sembarangan di seluruh papan dan baru mengecek di akhir (yang akan memakan waktu sangat lambat: N^N kombinasi), kita langsung menolak meletakkan ratu jika jalur kolom/diagonalnya sudah diblokir oleh ratu di baris sebelumnya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
