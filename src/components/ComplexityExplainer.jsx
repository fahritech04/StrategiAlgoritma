import React, { useState } from 'react';

export default function ComplexityExplainer() {
  const [activeTab, setActiveTab] = useState('O');

  const complexities = {
    'O': {
      title: 'Big O (O)',
      subtitle: 'Batas Atas / Skenario Terburuk',
      color: 'var(--neon-red)',
      description: 'Big O mengukur batas atas dari kompleksitas waktu. Ini menjawab pertanyaan: "Paling lambat, algoritma ini butuh waktu berapa lama?". Pada DP, kita sangat peduli dengan Big O karena kita mengubah solusi rekursif lambat (seperti O(2^n)) menjadi O(n) atau O(n^2).',
      example: 'Mencari kunci di tumpukan baju kotor. Skenario terburuk (O(n)): Kuncinya ada di baju paling bawah yang terakhir kita periksa.'
    },
    'Theta': {
      title: 'Big Theta (Θ)',
      subtitle: 'Batas Ketat / Ekspektasi Rata-rata',
      color: 'var(--neon-yellow)',
      description: 'Big Theta memberikan batas atas DAN batas bawah secara bersamaan. Ini berarti performa algoritma akan selalu tumbuh pada laju yang diprediksi oleh fungsi tersebut. Jika suatu algoritma memiliki kompleksitas waktu Θ(n), baik di skenario terbaik maupun terburuk pertumbuhannya sebanding dengan n.',
      example: 'Mencetak semua nama di daftar hadir (Θ(n)). Berapapun kondisinya, Anda pasti mengecek dari awal sampai akhir.'
    },
    'Omega': {
      title: 'Big Omega (Ω)',
      subtitle: 'Batas Bawah / Skenario Terbaik',
      color: 'var(--neon-green)',
      description: 'Big Omega mengukur batas bawah. Ini menjawab: "Paling cepat, algoritma ini butuh waktu berapa lama?". Secara praktis di DP ini jarang difokuskan karena kita biasanya bersiap untuk skenario terburuk.',
      example: 'Mencari kunci di tumpukan baju. Skenario terbaik (Ω(1)): Anda langsung menemukan kunci tersebut di baju pertama yang Anda ambil.'
    }
  };

  return (
    <div className="glass-panel">
      <h3>Memahami Kompleksitas Algoritma</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Mengapa DP membuat program menjadi sangat cepat? Rahasianya ada pada optimasi pemanggilan rekursif menjadi pengambilan data (look-up) dari memori yang kompleksitasnya $O(1)$.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {Object.keys(complexities).map(key => (
          <button 
            key={key}
            className={`btn ${activeTab !== key ? 'btn-secondary' : ''}`}
            style={activeTab === key ? { backgroundColor: complexities[key].color, color: '#000', fontWeight: 'bold' } : {}}
            onClick={() => setActiveTab(key)}
          >
            {complexities[key].title}
          </button>
        ))}
      </div>

      <div style={{ 
        padding: '1.5rem', 
        borderRadius: '8px', 
        borderLeft: `4px solid ${complexities[activeTab].color}`,
        background: 'rgba(0,0,0,0.2)'
      }}>
        <h4 style={{ color: complexities[activeTab].color }}>{complexities[activeTab].subtitle}</h4>
        <p style={{ margin: '1rem 0' }}>{complexities[activeTab].description}</p>
        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontStyle: 'italic' }}>
          <strong>Analogi Praktikal:</strong> {complexities[activeTab].example}
        </div>
      </div>
    </div>
  );
}
