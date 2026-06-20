import React, { useState, useEffect, useMemo } from 'react';
import CodeBlock from '../../components/CodeBlock';
import ExecutionLog from '../../components/ExecutionLog';
import PlaybackControls from '../../components/PlaybackControls';
import useAutoPlay from '../../hooks/useAutoPlay';
import { Backpack } from 'lucide-react';

export default function KnapsackBB() {
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Example data
  const capacity = 15;
  // Items must be sorted by value/weight descending
  const items = [
    { id: 1, v: 40, w: 4, r: 10 },
    { id: 2, v: 50, w: 7, r: 7.14 },
    { id: 3, v: 30, w: 5, r: 6 },
    { id: 4, v: 10, w: 3, r: 3.33 }
  ];
  const N = items.length;

  const pseudocode = `function KnapsackBB(capacity, items):
  // items sorted by v/w descending
  pq = new PriorityQueue() // Order by upper_bound (desc)
  maxProfit = 0
  
  root = Node(level=-1, profit=0, weight=0)
  root.ub = bound(root, capacity, items)
  pq.enqueue(root)

  while pq is not empty:
    curr = pq.dequeue()
    
    // Prune
    if curr.ub <= maxProfit: continue
    
    // Branch 1: Include next item
    nextLevel = curr.level + 1
    if nextLevel == N: continue

    left = Node(level=nextLevel)
    left.weight = curr.weight + items[nextLevel].w
    left.profit = curr.profit + items[nextLevel].v
    
    if left.weight <= capacity and left.profit > maxProfit:
      maxProfit = left.profit
      
    left.ub = bound(left, capacity, items)
    if left.ub > maxProfit: pq.enqueue(left)
    
    // Branch 2: Exclude next item
    right = Node(level=nextLevel)
    right.weight = curr.weight
    right.profit = curr.profit
    right.ub = bound(right, capacity, items)
    
    if right.ub > maxProfit: pq.enqueue(right)`;

  const steps = useMemo(() => {
    const generatedSteps = [];

    const bound = (node) => {
      if (node.weight >= capacity) return 0;
      let profitBound = node.profit;
      let j = node.level + 1;
      let totalWeight = node.weight;

      while (j < N && totalWeight + items[j].w <= capacity) {
        totalWeight += items[j].w;
        profitBound += items[j].v;
        j++;
      }

      if (j < N) {
        profitBound += (capacity - totalWeight) * items[j].r;
      }
      return parseFloat(profitBound.toFixed(2));
    };

    let maxProfit = 0;
    let pq = [];
    
    const root = { id: 'root', level: -1, profit: 0, weight: 0, included: [] };
    root.ub = bound(root);
    pq.push(root);

    generatedSteps.push({
      pq: [...pq],
      maxProfit,
      currentNode: null,
      activeItem: null,
      log: `Inisialisasi. Kapasitas=${capacity}. Root node (Kosong) dibuat dengan Upper Bound = ${root.ub}.`
    });

    let idCounter = 1;

    while (pq.length > 0) {
      pq.sort((a, b) => b.ub - a.ub); // Max-PQ
      const curr = pq.shift();

      generatedSteps.push({
        pq: [...pq],
        maxProfit,
        currentNode: curr,
        activeItem: curr.level + 1 < N ? curr.level + 1 : null,
        log: `Dequeue Node (Level ${curr.level}, P:${curr.profit}, W:${curr.weight}, UB:${curr.ub}).`
      });

      if (curr.ub <= maxProfit) {
        generatedSteps.push({
          pq: [...pq],
          maxProfit,
          currentNode: curr,
          activeItem: null,
          log: `Pruning! UB (${curr.ub}) <= Max Profit (${maxProfit}).`
        });
        continue;
      }

      const nextLevel = curr.level + 1;
      if (nextLevel === N) continue;

      // Left Child: Include item
      const left = {
        id: `L${idCounter++}`,
        level: nextLevel,
        profit: curr.profit + items[nextLevel].v,
        weight: curr.weight + items[nextLevel].w,
        included: [...curr.included, nextLevel]
      };

      generatedSteps.push({
        pq: [...pq],
        maxProfit,
        currentNode: curr,
        activeItem: nextLevel,
        log: `Evaluasi cabang KIRI (Ambil Barang ${nextLevel+1}). Weight=${left.weight}, Profit=${left.profit}.`
      });

      if (left.weight <= capacity && left.profit > maxProfit) {
        maxProfit = left.profit;
        generatedSteps.push({
          pq: [...pq],
          maxProfit,
          currentNode: curr,
          activeItem: nextLevel,
          log: `Max Profit baru ditemukan! Max Profit = ${maxProfit}.`
        });
      }

      left.ub = bound(left);
      if (left.ub > maxProfit) {
        pq.push(left);
        generatedSteps.push({
          pq: [...pq],
          maxProfit,
          currentNode: curr,
          activeItem: nextLevel,
          log: `Enqueue cabang KIRI karena UB (${left.ub}) > Max Profit (${maxProfit}).`
        });
      } else {
        generatedSteps.push({
          pq: [...pq],
          maxProfit,
          currentNode: curr,
          activeItem: nextLevel,
          log: `Pangkas (Prune) cabang KIRI. UB (${left.ub}) <= Max Profit (${maxProfit}).`
        });
      }

      // Right Child: Exclude item
      const right = {
        id: `R${idCounter++}`,
        level: nextLevel,
        profit: curr.profit,
        weight: curr.weight,
        included: [...curr.included]
      };
      right.ub = bound(right);

      generatedSteps.push({
        pq: [...pq],
        maxProfit,
        currentNode: curr,
        activeItem: nextLevel,
        log: `Evaluasi cabang KANAN (Abaikan Barang ${nextLevel+1}). Weight=${right.weight}, Profit=${right.profit}, UB=${right.ub}.`
      });

      if (right.ub > maxProfit) {
        pq.push(right);
        generatedSteps.push({
          pq: [...pq],
          maxProfit,
          currentNode: curr,
          activeItem: nextLevel,
          log: `Enqueue cabang KANAN karena UB (${right.ub}) > Max Profit (${maxProfit}).`
        });
      } else {
        generatedSteps.push({
          pq: [...pq],
          maxProfit,
          currentNode: curr,
          activeItem: nextLevel,
          log: `Pangkas (Prune) cabang KANAN. UB (${right.ub}) <= Max Profit (${maxProfit}).`
        });
      }
    }

    generatedSteps.push({
      pq: [],
      maxProfit,
      currentNode: null,
      activeItem: null,
      log: `Selesai! Solusi optimal Profit Maksimum = ${maxProfit}.`
    });

    return generatedSteps;
  }, []);

  useAutoPlay(isPlaying, setIsPlaying, stepIdx, setStepIdx, steps.length);

  const currentStep = steps[stepIdx];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Backpack size={32} color="var(--accent-primary)" />
          0/1 Knapsack (Branch and Bound)
        </h1>
        <p className="page-description">
          Mencari kombinasi barang untuk dimasukkan ke ransel agar profit maksimal. Ini dimodelkan sebagai pohon State Space. Upper bound dihitung menggunakan solusi Knapsack Pecahan (Fractional Knapsack).
        </p>
      </div>

      <div className="visualizer-container">
        <div>
          <div className="glass-panel" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '2rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-secondary)' }}>Kapasitas (W)</h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{capacity}</div>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-secondary)' }}>Max Profit</h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--neon-green)' }}>{currentStep.maxProfit}</div>
              </div>
            </div>

            <h4 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Daftar Barang (Diurutkan by Profit/Weight)</h4>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {items.map((item, idx) => {
                let bg = 'rgba(255,255,255,0.05)';
                let border = '1px solid var(--panel-border)';
                if (currentStep.activeItem === idx) {
                  bg = 'rgba(245, 158, 11, 0.2)';
                  border = '1px solid var(--neon-yellow)';
                } else if (currentStep.currentNode?.included?.includes(idx)) {
                  bg = 'rgba(16, 185, 129, 0.2)';
                  border = '1px solid var(--neon-green)';
                }

                return (
                  <div key={item.id} style={{ 
                    padding: '0.5rem 1rem', 
                    background: bg, 
                    border: border,
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <b>Item {idx+1}</b>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      v: {item.v} | w: {item.w}<br/>
                      ratio: {item.r}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '2rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
              <h4>Priority Queue (Live Nodes - Diurutkan by UB)</h4>
              {currentStep.pq.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Kosong</p>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {[...currentStep.pq].sort((a,b) => b.ub - a.ub).map((node, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                      Lvl: {node.level} | UB: <b style={{color: 'var(--neon-green)'}}>{node.ub}</b> | P:{node.profit} W:{node.weight}
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
