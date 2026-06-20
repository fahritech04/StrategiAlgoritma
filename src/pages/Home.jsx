import ComplexityExplainer from '../components/ComplexityExplainer';
import { Activity } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dynamic Programming Visualized</h1>
        <p className="page-description">
          Selamat datang di Visual DP. Platform ini akan membantu Anda menjembatani pemahaman teoritis 
          algoritma dengan visualisasi praktis langkah-demi-langkah.
        </p>
      </div>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
          <Activity size={24} /> Apa itu Dynamic Programming?
        </h2>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
          Dynamic Programming (DP) adalah teknik optimasi berlapis yang memecah masalah besar menjadi sub-masalah kecil yang tumpang tindih <i>(overlapping subproblems)</i>, lalu menyimpan hasil penyelesaian sub-masalah tersebut <i>(memoization/tabulation)</i> agar tidak perlu dihitung berulang kali.
        </p>
      </div>

      <ComplexityExplainer />
    </div>
  );
}
