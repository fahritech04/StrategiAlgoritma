import React, { useState, useEffect, useMemo } from 'react';
import CodeBlock from '../../components/CodeBlock';
import ExecutionLog from '../../components/ExecutionLog';
import PlaybackControls from '../../components/PlaybackControls';
import useAutoPlay from '../../hooks/useAutoPlay';
import { Briefcase } from 'lucide-react';

export default function JobAssignment() {
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // N=4 Matrix Cost (Workers x Jobs)
  const costMatrix = [
    [9, 2, 7, 8],
    [6, 4, 3, 7],
    [5, 8, 1, 8],
    [7, 6, 9, 4]
  ];
  const N = costMatrix.length;

  const pseudocode = `function JobAssignmentBB(costMatrix):
  pq = new PriorityQueue() // Order by lower_bound
  bestCost = INFINITY
  bestAssignment = []

  // Create root node
  root = Node(worker=0, assigned=[], cost=0)
  root.lb = calculateLowerBound(root, costMatrix)
  pq.enqueue(root)

  while pq is not empty:
    curr = pq.dequeue() // Get node with smallest lb

    if curr.lb >= bestCost:
      continue // Pruning

    if curr.worker == N: // All workers assigned
      if curr.cost < bestCost:
        bestCost = curr.cost
        bestAssignment = curr.assigned
      continue

    for each job j from 0 to N-1:
      if j not in curr.assigned:
        child = Node(worker = curr.worker + 1)
        child.assigned = curr.assigned + [j]
        child.cost = curr.cost + costMatrix[curr.worker][j]
        child.lb = calculateLowerBound(child, costMatrix)
        
        if child.lb < bestCost:
          pq.enqueue(child)`;

  // Generate steps
  const steps = useMemo(() => {
    const generatedSteps = [];
    
    // Simple lower bound: cost so far + sum of min of remaining rows
    const calcLB = (worker, assignedJobs, currentCost) => {
      let lb = currentCost;
      for (let w = worker; w < N; w++) {
        let minCost = Infinity;
        for (let j = 0; j < N; j++) {
          if (!assignedJobs.includes(j)) {
            minCost = Math.min(minCost, costMatrix[w][j]);
          }
        }
        lb += minCost;
      }
      return lb;
    };

    let bestCost = Infinity;
    let bestAssignment = [];
    
    // For visualizer, we just use a simple array to act as PQ, sorting by lb
    let pq = [];
    
    const root = { id: 'root', worker: 0, assigned: [], cost: 0, path: [] };
    root.lb = calcLB(0, [], 0);
    pq.push(root);

    generatedSteps.push({
      pq: [...pq],
      bestCost,
      bestAssignment: [...bestAssignment],
      currentNode: null,
      matrixActive: null, // [row, col]
      log: `Inisialisasi antrean prioritas. Node akar dibuat dengan Lower Bound = ${root.lb}`
    });

    let nodeIdCounter = 1;

    while (pq.length > 0) {
      // Sort to simulate PQ (ascending by lb)
      pq.sort((a, b) => a.lb - b.lb);
      const curr = pq.shift(); // Dequeue best

      generatedSteps.push({
        pq: [...pq],
        bestCost,
        bestAssignment: [...bestAssignment],
        currentNode: curr,
        matrixActive: null,
        log: `Mengambil node dari antrean (Pekerja ${curr.worker}, LB: ${curr.lb}).`
      });

      if (curr.lb >= bestCost) {
        generatedSteps.push({
          pq: [...pq],
          bestCost,
          bestAssignment: [...bestAssignment],
          currentNode: curr,
          matrixActive: null,
          log: `Pruning: Lower Bound node (${curr.lb}) >= Best Cost (${bestCost}). Cabang ini dibuang.`
        });
        continue;
      }

      if (curr.worker === N) {
        if (curr.cost < bestCost) {
          bestCost = curr.cost;
          bestAssignment = [...curr.assigned];
          generatedSteps.push({
            pq: [...pq],
            bestCost,
            bestAssignment: [...bestAssignment],
            currentNode: curr,
            matrixActive: null,
            log: `Solusi Baru Ditemukan! Semua pekerja telah ditugaskan. Total Biaya = ${bestCost}.`
          });
        }
        continue;
      }

      // Branching
      const children = [];
      for (let j = 0; j < N; j++) {
        if (!curr.assigned.includes(j)) {
          const childCost = curr.cost + costMatrix[curr.worker][j];
          const childAssigned = [...curr.assigned, j];
          const childLb = calcLB(curr.worker + 1, childAssigned, childCost);
          
          const child = {
            id: `n${nodeIdCounter++}`,
            worker: curr.worker + 1,
            assigned: childAssigned,
            cost: childCost,
            lb: childLb,
            path: [...curr.path, { w: curr.worker, j: j }]
          };
          children.push(child);
        }
      }

      for (const child of children) {
        generatedSteps.push({
          pq: [...pq],
          bestCost,
          bestAssignment: [...bestAssignment],
          currentNode: curr,
          evaluatingChild: child,
          matrixActive: [curr.worker, child.assigned[child.assigned.length-1]],
          log: `Evaluasi menugaskan Pekerja ${curr.worker + 1} ke Job ${child.assigned[child.assigned.length-1] + 1}. Cost=${child.cost}, LB=${child.lb}`
        });

        if (child.lb < bestCost) {
          pq.push(child);
          generatedSteps.push({
            pq: [...pq],
            bestCost,
            bestAssignment: [...bestAssignment],
            currentNode: curr,
            evaluatingChild: child,
            matrixActive: null,
            log: `Menambahkan cabang ini ke Antrean Prioritas karena LB (${child.lb}) < Best Cost (${bestCost === Infinity ? '∞' : bestCost}).`
          });
        } else {
          generatedSteps.push({
            pq: [...pq],
            bestCost,
            bestAssignment: [...bestAssignment],
            currentNode: curr,
            evaluatingChild: child,
            matrixActive: null,
            log: `Memotong cabang ini. LB (${child.lb}) >= Best Cost (${bestCost}).`
          });
        }
      }
    }

    generatedSteps.push({
      pq: [],
      bestCost,
      bestAssignment,
      currentNode: null,
      matrixActive: null,
      log: `Penelusuran selesai! Penugasan optimal menghasilkan total biaya minimum = ${bestCost}.`
    });

    return generatedSteps;
  }, []);

  useAutoPlay(isPlaying, setIsPlaying, stepIdx, setStepIdx, steps.length);

  const currentStep = steps[stepIdx];

  const renderMatrix = () => {
    return (
      <div className="grid-container" style={{ margin: '1rem auto' }}>
        <div className="grid-row">
          <div className="grid-cell grid-header" style={{ width: '80px' }}>Pekerja \ Job</div>
          {[1, 2, 3, 4].map(j => (
            <div key={`h-${j}`} className="grid-cell grid-header">J{j}</div>
          ))}
        </div>
        {costMatrix.map((row, i) => (
          <div key={`r-${i}`} className="grid-row">
            <div className="grid-cell grid-header" style={{ width: '80px' }}>W{i+1}</div>
            {row.map((val, j) => {
              let cellClass = "grid-cell";
              // Highlight active evaluation
              if (currentStep.matrixActive && currentStep.matrixActive[0] === i && currentStep.matrixActive[1] === j) {
                cellClass += " cell-checking";
              }
              // Highlight current node's path
              else if (currentStep.currentNode && currentStep.currentNode.path.some(p => p.w === i && p.j === j)) {
                cellClass += " cell-active";
              }
              // Highlight best assignment at the end
              else if (stepIdx === steps.length - 1 && currentStep.bestAssignment[i] === j) {
                cellClass += " cell-done";
              }

              return (
                <div key={`c-${i}-${j}`} className={cellClass}>
                  {val}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase size={32} color="var(--accent-primary)" />
          Job Assignment Problem (B&B)
        </h1>
        <p className="page-description">
          Menugaskan N pekerja ke N pekerjaan dengan total biaya minimum. Visualisasi ini menggunakan Best-First Search dengan pembatasan Lower Bound (total biaya minimum yang mungkin dicapai dari sebuah node).
        </p>
      </div>

      <div className="visualizer-container">
        <div>
          <div className="glass-panel" style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Matriks Biaya</h3>
            {renderMatrix()}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', flex: 1, marginRight: '1rem' }}>
                <h4>Antrean Prioritas (Live Nodes)</h4>
                {currentStep.pq.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Kosong</p>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {/* Sort PQ for display so user sees the lowest LB first */}
                    {[...currentStep.pq].sort((a,b) => a.lb - b.lb).map((node, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                        W{node.worker} | LB: <b>{node.lb}</b>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', width: '200px' }}>
                <h4>Best Cost</h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--neon-green)', marginTop: '0.5rem' }}>
                  {currentStep.bestCost === Infinity ? '∞' : currentStep.bestCost}
                </div>
              </div>
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
          <div className="complexity-cards" style={{ gridTemplateColumns: '1fr', marginTop: '1rem' }}>
            <div className="comp-card" style={{ borderColor: 'var(--accent-primary)' }}>
              <h4>Time Complexity</h4>
              <p>O(N!) worst case</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Berkat pruning, rata-rata jauh lebih cepat dari pencarian naif.</p>
            </div>
            <div className="comp-card" style={{ borderColor: 'var(--neon-yellow)' }}>
              <h4>Space Complexity</h4>
              <p>O(N!) worst case</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Untuk menyimpan live nodes di Priority Queue (BFS/Best-First).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
