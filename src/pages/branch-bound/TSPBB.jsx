import React, { useState, useEffect, useMemo } from 'react';
import CodeBlock from '../../components/CodeBlock';
import ExecutionLog from '../../components/ExecutionLog';
import PlaybackControls from '../../components/PlaybackControls';
import useAutoPlay from '../../hooks/useAutoPlay';
import { Map as MapIcon } from 'lucide-react';

export default function TSPBB() {
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const INF = Infinity;
  // 4 Cities: A, B, C, D
  const initialMatrix = [
    [INF, 10, 15, 20],
    [10, INF, 35, 25],
    [15, 35, INF, 30],
    [20, 25, 30, INF]
  ];
  const N = initialMatrix.length;
  const cityNames = ['A', 'B', 'C', 'D'];

  const pseudocode = `function TSP_BranchAndBound(matrix):
  pq = new PriorityQueue() // Order by lower_bound (asc)
  bestCost = INFINITY
  bestPath = []

  root = Node(path=[0], matrix=matrix)
  root.matrix, reductionCost = reduceMatrix(root.matrix)
  root.lb = reductionCost
  pq.enqueue(root)

  while pq is not empty:
    curr = pq.dequeue()
    
    if curr.lb >= bestCost: continue

    if curr.path.length == N:
      // Return to start
      finalCost = curr.lb + curr.matrix[curr.last][0]
      if finalCost < bestCost:
        bestCost = finalCost
        bestPath = curr.path + [0]
      continue

    for nextCity in 0 to N-1:
      if nextCity not in curr.path:
        child = Node(path = curr.path + [nextCity])
        
        // Buat matrix baru untuk anak
        child.matrix = copy(curr.matrix)
        
        // Path dari current ke nextCity
        edgeCost = child.matrix[curr.last][nextCity]
        
        // Set baris current dan kolom nextCity ke INF
        setRowToINF(child.matrix, curr.last)
        setColToINF(child.matrix, nextCity)
        // Hindari sub-tour
        child.matrix[nextCity][0] = INF 
        
        child.matrix, redCost = reduceMatrix(child.matrix)
        child.lb = curr.lb + edgeCost + redCost
        
        if child.lb < bestCost:
          pq.enqueue(child)`;

  const steps = useMemo(() => {
    const generatedSteps = [];

    const reduceMatrix = (matrix) => {
      let cost = 0;
      const newMatrix = matrix.map(row => [...row]);
      
      // Row reduction
      for (let i = 0; i < N; i++) {
        let min = INF;
        for (let j = 0; j < N; j++) min = Math.min(min, newMatrix[i][j]);
        if (min !== INF && min > 0) {
          cost += min;
          for (let j = 0; j < N; j++) {
            if (newMatrix[i][j] !== INF) newMatrix[i][j] -= min;
          }
        }
      }
      
      // Col reduction
      for (let j = 0; j < N; j++) {
        let min = INF;
        for (let i = 0; i < N; i++) min = Math.min(min, newMatrix[i][j]);
        if (min !== INF && min > 0) {
          cost += min;
          for (let i = 0; i < N; i++) {
            if (newMatrix[i][j] !== INF) newMatrix[i][j] -= min;
          }
        }
      }
      return { reducedMatrix: newMatrix, reductionCost: cost };
    };

    let bestCost = INF;
    let pq = [];
    
    const { reducedMatrix: rootMatrix, reductionCost: rootRedCost } = reduceMatrix(initialMatrix);
    const root = { 
      id: 'root', 
      path: [0], 
      matrix: rootMatrix, 
      lb: rootRedCost 
    };
    
    pq.push(root);

    generatedSteps.push({
      pq: [...pq],
      bestCost,
      currentNode: null,
      matrix: rootMatrix,
      log: `Inisialisasi. Reduksi matriks awal menghasilkan Cost = ${rootRedCost}. Root Node ditambahkan ke antrean (Path: A, LB: ${root.lb}).`
    });

    let idCounter = 1;

    while (pq.length > 0) {
      pq.sort((a, b) => a.lb - b.lb);
      const curr = pq.shift();

      const pathStr = curr.path.map(i => cityNames[i]).join(' -> ');

      generatedSteps.push({
        pq: [...pq],
        bestCost,
        currentNode: curr,
        matrix: curr.matrix,
        log: `Dequeue Node (Path: ${pathStr}). LB = ${curr.lb}.`
      });

      if (curr.lb >= bestCost) {
        generatedSteps.push({
          pq: [...pq],
          bestCost,
          currentNode: curr,
          matrix: curr.matrix,
          log: `Pruning! LB (${curr.lb}) >= Best Cost (${bestCost}).`
        });
        continue;
      }

      if (curr.path.length === N) {
        // Evaluate returning to start
        const lastCity = curr.path[curr.path.length - 1];
        // Note: the original matrix cost is used to find the return cost, but in reduced matrix B&B it's already accounted for,
        // Wait, actually the return to start edge is already forced to INF in previous steps, so it's included in LB.
        // If length == N, the LB is the actual tour cost.
        if (curr.lb < bestCost) {
          bestCost = curr.lb;
          generatedSteps.push({
            pq: [...pq],
            bestCost,
            currentNode: curr,
            matrix: curr.matrix,
            log: `Tour Selesai! Menemukan Cost Minimum Baru = ${bestCost}. Path: ${pathStr} -> A.`
          });
        }
        continue;
      }

      const currentCity = curr.path[curr.path.length - 1];

      for (let nextCity = 0; nextCity < N; nextCity++) {
        if (!curr.path.includes(nextCity)) {
          const edgeCost = curr.matrix[currentCity][nextCity];
          if (edgeCost === INF) continue;

          const childMatrix = curr.matrix.map(r => [...r]);
          
          // Set row i and col j to INF
          for (let k = 0; k < N; k++) {
            childMatrix[currentCity][k] = INF;
            childMatrix[k][nextCity] = INF;
          }
          // Prevent sub-tour (set back edge to INF)
          childMatrix[nextCity][0] = INF;

          const { reducedMatrix: childReduced, reductionCost: childRedCost } = reduceMatrix(childMatrix);
          const childLb = curr.lb + edgeCost + childRedCost;
          
          const child = {
            id: `n${idCounter++}`,
            path: [...curr.path, nextCity],
            matrix: childReduced,
            lb: childLb
          };

          const childPathStr = child.path.map(i => cityNames[i]).join(' -> ');

          generatedSteps.push({
            pq: [...pq],
            bestCost,
            currentNode: curr,
            matrix: childReduced,
            log: `Evaluasi cabang ke ${cityNames[nextCity]}. Cost Edge = ${edgeCost}. Cost Reduksi Matriks = ${childRedCost}. Total LB = ${curr.lb} + ${edgeCost} + ${childRedCost} = ${childLb}.`
          });

          if (childLb < bestCost) {
            pq.push(child);
            generatedSteps.push({
              pq: [...pq],
              bestCost,
              currentNode: curr,
              matrix: childReduced,
              log: `Enqueue (Path: ${childPathStr}). LB (${childLb}) < Best Cost (${bestCost === INF ? '∞' : bestCost}).`
            });
          } else {
            generatedSteps.push({
              pq: [...pq],
              bestCost,
              currentNode: curr,
              matrix: childReduced,
              log: `Pangkas (Prune) cabang ini karena LB (${childLb}) >= Best Cost (${bestCost}).`
            });
          }
        }
      }
    }

    generatedSteps.push({
      pq: [],
      bestCost,
      currentNode: null,
      matrix: rootMatrix, // reset view
      log: `Selesai! Rute TSP terpendek memiliki biaya = ${bestCost}.`
    });

    return generatedSteps;
  }, []);

  useAutoPlay(isPlaying, setIsPlaying, stepIdx, setStepIdx, steps.length);

  const currentStep = steps[stepIdx];

  const renderMatrix = () => {
    if (!currentStep.matrix) return null;
    return (
      <div className="grid-container" style={{ margin: '1rem auto' }}>
        <div className="grid-row">
          <div className="grid-cell grid-header"></div>
          {cityNames.map(c => (
            <div key={`h-${c}`} className="grid-cell grid-header">{c}</div>
          ))}
        </div>
        {currentStep.matrix.map((row, i) => (
          <div key={`r-${i}`} className="grid-row">
            <div className="grid-cell grid-header">{cityNames[i]}</div>
            {row.map((val, j) => (
              <div key={`c-${i}-${j}`} className="grid-cell" style={{ color: val === INF ? 'var(--neon-red)' : 'inherit' }}>
                {val === INF ? '∞' : val}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapIcon size={32} color="var(--accent-primary)" />
          TSP (Branch and Bound)
        </h1>
        <p className="page-description">
          Mencari rute terpendek mengunjungi semua kota tepat sekali dan kembali ke awal. Menggunakan metode Reduksi Matriks (Matrix Reduction) untuk menghitung Lower Bound.
        </p>
      </div>

      <div className="visualizer-container">
        <div>
          <div className="glass-panel" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', minWidth: '150px', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--text-secondary)' }}>Best Cost</h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--neon-green)' }}>
                  {currentStep.bestCost === INF ? '∞' : currentStep.bestCost}
                </div>
              </div>
            </div>

            <h3 style={{ textAlign: 'center', marginTop: '1rem' }}>Cost Matrix (Direduksi)</h3>
            {renderMatrix()}

            <div style={{ marginTop: '2rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
              <h4>Priority Queue (Live Nodes - Diurutkan by LB)</h4>
              {currentStep.pq.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Kosong</p>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {[...currentStep.pq].sort((a,b) => a.lb - b.lb).map((node, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                      Path: {node.path.map(idx => cityNames[idx]).join('→')} | LB: <b style={{color: 'var(--accent-primary)'}}>{node.lb}</b>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <PlaybackControls 
            isPlaying={isPlaying} setIsPlaying={setIsPlaying}
            stepIdx={stepIdx} setStepIdx={setStepIdx}
            stepsLength={steps.length}
          />
          <ExecutionLog steps={steps} stepIdx={stepIdx} />
        </div>

        <div>
          <div className="glass-panel" style={{ height: 'fit-content' }}>
            <h3>Pseudocode</h3>
            <div style={{ marginTop: '1rem' }}>
              <CodeBlock code={pseudocode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
