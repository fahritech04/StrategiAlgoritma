import React from 'react';

import { GitBranch, Map, ShieldAlert, Target } from 'lucide-react';

export default function BBIntro() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GitBranch size={32} color="var(--accent-primary)" />
          Branch and Bound
        </h1>
        <p className="page-description">
          Teknik algoritma untuk menyelesaikan masalah optimasi (minimasi/maksimasi) dengan menjelajahi ruang solusi (State Space Tree) secara lebih cerdas menggunakan heuristik dan batasan (Bound).
        </p>
      </div>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Target color="var(--neon-green)" /> Konsep Inti
        </h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Berbeda dengan <b>Backtracking</b> yang menggunakan penelusuran mendalam (<i>Depth-First Search / DFS</i>), <b>Branch and Bound</b> umumnya menggunakan penelusuran <i>Best-First Search</i> atau <i>Breadth-First Search (BFS)</i> yang dimodifikasi. Algoritma ini mencari solusi optimal dengan:
        </p>
        <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)', lineHeight: '1.8', marginLeft: '1rem' }}>
          <li><b>Branching:</b> Memecah masalah menjadi sub-masalah yang lebih kecil (membangun anak-anak di pohon solusi).</li>
          <li><b>Bounding:</b> Menghitung estimasi nilai batas (<em>Bound</em>) dari sebuah node untuk mengetahui apakah cabang tersebut berpotensi menghasilkan solusi optimal.</li>
          <li><b>Pruning:</b> Menghentikan penelusuran pada cabang yang nilai <em>Bound</em>-nya lebih buruk daripada solusi terbaik sementara (<em>Current Best</em>).</li>
        </ul>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div className="glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Map color="var(--accent-primary)" /> Best-First Search
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Daripada membabi-buta menelusuri cabang paling kiri seperti DFS, Branch and Bound memilih node yang memiliki nilai Bound terbaik dari <i>Priority Queue</i>. Ini membuatnya lebih cepat menemukan solusi optimal atau mendekati optimal di awal penelusuran, yang akan membantu proses <i>pruning</i> di cabang lainnya.
          </p>
        </div>

        <div className="glass-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ShieldAlert color="var(--neon-yellow)" /> Lower & Upper Bound
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Tergantung tipe masalahnya:
            <br/><br/>
            <b>Minimasi (contoh: TSP):</b> Kita menghitung <i>Lower Bound</i> (batas bawah). Jika Lower Bound node &ge; Cost minimum saat ini, pangkas!
            <br/><br/>
            <b>Maksimasi (contoh: Knapsack):</b> Kita menghitung <i>Upper Bound</i> (batas atas). Jika Upper Bound node &le; Profit maksimum saat ini, pangkas!
          </p>
        </div>
      </div>

      <div className="glass-panel">
        <h2 style={{ marginBottom: '1rem' }}>Perbandingan Karakteristik</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--text-secondary)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--text-primary)' }}>
                <th style={{ padding: '1rem' }}>Fitur</th>
                <th style={{ padding: '1rem' }}>Backtracking</th>
                <th style={{ padding: '1rem' }}>Branch and Bound</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--panel-border)' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Strategi Penelusuran</td>
                <td style={{ padding: '1rem' }}>Depth-First Search (DFS)</td>
                <td style={{ padding: '1rem' }}>Best-First Search (Priority Queue) / BFS / DFS</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--panel-border)' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Tujuan Utama</td>
                <td style={{ padding: '1rem' }}>Mencari semua solusi / salah satu solusi (Decision Problem)</td>
                <td style={{ padding: '1rem' }}>Mencari satu solusi terbaik (Optimization Problem)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--panel-border)' }}>
                <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Mekanisme Pruning</td>
                <td style={{ padding: '1rem' }}>Menggunakan kondisi kelayakan (Feasibility Check)</td>
                <td style={{ padding: '1rem' }}>Menggunakan estimasi batasan (Cost / Bound)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
