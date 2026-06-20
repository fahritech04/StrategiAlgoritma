import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Puzzle, ArrowRight, Zap, Code, GitBranch } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
        <h1 className="page-title" style={{ fontSize: '3.5rem', background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Strategi Algoritma
        </h1>
        <p className="page-description" style={{ maxWidth: '800px', margin: '1.5rem auto', fontSize: '1.2rem' }}>
          Selamat datang di platform pembelajaran interaktif. Pelajari teknik-teknik pemecahan masalah komputasi tingkat lanjut melalui visualisasi <i>step-by-step</i>, <i>execution log</i>, dan <i>pseudocode</i>.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        
        {/* DP Card */}
        <div 
          className="glass-panel" 
          style={{ cursor: 'pointer', transition: 'all 0.3s ease', borderTop: '4px solid var(--accent-primary)' }}
          onClick={() => navigate('/dp-intro')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
              <Activity size={32} color="var(--accent-primary)" />
            </div>
            <ArrowRight size={24} color="var(--text-secondary)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Dynamic Programming</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '80px' }}>
            Teknik optimasi yang menyimpan hasil sub-masalah (*memoization/tabulation*) untuk menghindari perhitungan berulang. Sangat efisien untuk masalah optimasi.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Fibonacci</span>
            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Knapsack</span>
            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>TSP</span>
            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>+3 lainnya</span>
          </div>
        </div>

        {/* Backtracking Card */}
        <div 
          className="glass-panel" 
          style={{ cursor: 'pointer', transition: 'all 0.3s ease', borderTop: '4px solid var(--neon-yellow)' }}
          onClick={() => navigate('/bt-intro')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
              <Puzzle size={32} color="var(--neon-yellow)" />
            </div>
            <ArrowRight size={24} color="var(--text-secondary)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Backtracking</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '80px' }}>
            Teknik pencarian cerdas berbasis rekursi (*DFS*) yang segera memotong cabang pencarian (*Pruning*) jika sadar bahwa jalur tersebut salah.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>N-Queen</span>
            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Graph Coloring</span>
            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Hamiltonian</span>
            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Subset Sum</span>
          </div>
        </div>

        {/* Branch and Bound Card */}
        <div 
          className="glass-panel" 
          style={{ cursor: 'pointer', transition: 'all 0.3s ease', borderTop: '4px solid var(--neon-green)' }}
          onClick={() => navigate('/bb-intro')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
              <GitBranch size={32} color="var(--neon-green)" />
            </div>
            <ArrowRight size={24} color="var(--text-secondary)" />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Branch and Bound</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '80px' }}>
            Teknik optimasi pencarian dengan estimasi batas (Bound) untuk menyeleksi cabang (Branch) yang paling menjanjikan (Best-First Search).
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Job Assignment</span>
            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>0/1 Knapsack</span>
            <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>TSP</span>
          </div>
        </div>

      </div>

      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Zap color="var(--neon-green)" /> Materi Lainnya Menyusul...
        </h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Platform ini akan terus diperbarui dengan modul-modul lain seperti <b>Greedy Algorithms</b>, dan <b>Divide and Conquer</b> di pembaruan selanjutnya.
        </p>
      </div>

    </div>
  );
}
