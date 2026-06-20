import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

export default function SubsetSum() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [steps, setSteps] = useState([]);

  const setArr = [5, 10, 12, 13, 15, 18];
  const targetSum = 30;

  useEffect(() => {
    generateSteps();
    setStepIdx(0);
    setIsPlaying(false);
  }, []);

  const generateSteps = () => {
    let currentSteps = [];
    let subset = [];
    let found = false;

    const subsetSumUtil = (idx, currentSum) => {
      if (currentSum === targetSum) {
        found = true;
        currentSteps.push({
          line: 2,
          subset: [...subset],
          activeIdx: -1,
          sum: currentSum,
          isClash: false,
          log: `Total = ${currentSum} (Target tercapai!). Solusi ditemukan: [${subset.join(', ')}]`
        });
        return true;
      }

      // If we reach end of array or sum exceeds target
      if (idx >= setArr.length || currentSum > targetSum) {
        currentSteps.push({
          line: 5,
          subset: [...subset],
          activeIdx: idx,
          sum: currentSum,
          isClash: true,
          log: currentSum > targetSum ? 
            `Total ${currentSum} melebihi target ${targetSum}. PRUNING! Mundur (Backtrack).` : 
            `Habis elemen tapi target belum tercapai. Mundur.`
        });
        return false;
      }

      currentSteps.push({
        line: 9,
        subset: [...subset],
        activeIdx: idx,
        sum: currentSum,
        isClash: false,
        log: `Evaluasi Angka ${setArr[idx]}`
      });

      // 1. Ambil elemen ini
      subset.push(setArr[idx]);
      currentSteps.push({
        line: 11,
        subset: [...subset],
        activeIdx: idx,
        sum: currentSum + setArr[idx],
        isClash: false,
        log: `AMBIL ${setArr[idx]}. Total sementara = ${currentSum + setArr[idx]}.`
      });

      if (subsetSumUtil(idx + 1, currentSum + setArr[idx]) === true) {
        return true;
      }

      // Backtrack
      subset.pop();
      if (!found) {
        currentSteps.push({
          line: 15,
          subset: [...subset],
          activeIdx: idx,
          sum: currentSum,
          isClash: false,
          log: `BACKTRACK: Hapus ${setArr[idx]} dari himpunan.`
        });
      }

      // 2. Tidak ambil elemen ini
      if (!found) {
        currentSteps.push({
          line: 18,
          subset: [...subset],
          activeIdx: idx,
          sum: currentSum,
          isClash: false,
          log: `LEWATI ${setArr[idx]}. Total tetap = ${currentSum}.`
        });

        if (subsetSumUtil(idx + 1, currentSum) === true) {
          return true;
        }
      }

      return false;
    };

    currentSteps.push({
      line: 1,
      subset: [...subset],
      activeIdx: -1,
      sum: 0,
      isClash: false,
      log: `Memulai pencarian subset dengan target ${targetSum}.`
    });

    subsetSumUtil(0, 0);

    if (!found) {
       currentSteps.push({
        line: 21,
        subset: [...subset],
        activeIdx: -1,
        sum: 0,
        isClash: false,
        log: `Tidak ada kombinasi yang menghasilkan nilai ${targetSum}.`
      });
    }

    setSteps(currentSteps);
  };

  useEffect(() => {
    let timer;
    if (isPlaying && stepIdx < steps.length - 1) {
      timer = setTimeout(() => {
        setStepIdx(prev => prev + 1);
      }, 900);
    } else if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, steps.length]);

  const currentStep = steps[stepIdx] || { line: 1, subset: [], activeIdx: -1, sum: 0, isClash: false, log: '' };

  const cCode = `bool isSubsetSum(int set[], int n, int sum) {
  // Base Cases
  if (sum == 0) return true; // Target tercapai
  if (n == 0 && sum != 0) return false; // Elemen habis
  if (set[n-1] > sum) return false; // Bounding: Angka terlalu besar

  // Option 1: AMBIL elemen ini
  // Masukkan ke subset sementara
  if (isSubsetSum(set, n-1, sum - set[n-1])) {
    return true;
  }
  // BACKTRACK (Hapus elemen dari subset sementara)

  // Option 2: ABAIKAN elemen ini
  return isSubsetSum(set, n-1, sum);
}`;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Subset Sum Problem</h1>
        <p className="page-description">
          Diberikan sebuah himpunan angka, carilah apakah ada sebagian anggota (subset) yang total penjumlahannya persis sama dengan <span style={{ color: 'var(--neon-green)'}}>Target M</span>.
        </p>
      </div>

      <div className="visualizer-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Himpunan (Set)</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {setArr.map((val, i) => (
                    <div key={i} style={{ 
                      padding: '0.5rem', 
                      background: currentStep.activeIdx === i ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.05)', 
                      border: currentStep.activeIdx === i ? '1px solid var(--accent-primary)' : '1px solid var(--panel-border)',
                      borderRadius: '4px',
                      color: currentStep.subset.includes(val) ? 'var(--neon-yellow)' : 'white'
                    }}>
                      {val}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--neon-green)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ color: 'var(--neon-green)', fontSize: '0.9rem' }}>Target Sum</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{targetSum}</div>
              </div>
            </div>
            
            <div style={{ width: '100%', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', position: 'relative' }}>
               <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Subset Terpilih Saat Ini</h4>
               <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', minHeight: '50px' }}>
                 {currentStep.subset.length > 0 ? `{ ${currentStep.subset.join(', ')} }` : '{ }'}
               </div>
               
               <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ fontSize: '1.2rem' }}>Total:</div>
                 <div style={{ 
                   fontSize: '2rem', fontWeight: 'bold', 
                   color: currentStep.sum === targetSum ? 'var(--neon-green)' : (currentStep.sum > targetSum ? 'var(--neon-red)' : 'var(--neon-yellow)')
                 }}>
                   {currentStep.sum}
                 </div>
               </div>

               {currentStep.isClash && (
                 <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', zIndex: 10 }}>
                   MELEBIHI TARGET! (PRUNED)
                 </div>
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
        </div>
      </div>
    </div>
  );
}
