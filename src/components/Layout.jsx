import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Activity, BookOpen, Coins, BarChart3, Backpack, Map, Home, Menu, 
  ChevronDown, ChevronRight, Puzzle, Crown, Network, Palette, PlusSquare 
} from 'lucide-react';

export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSection, setOpenSection] = useState('DP'); // 'DP' or 'BACKTRACKING' or null
  const location = useLocation();

  const toggleSection = (section) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
      if (isCollapsed) setIsCollapsed(false); // Auto expand sidebar if opening a section
    }
  };

  const navCategories = [
    {
      id: 'GENERAL',
      items: [
        { path: '/', label: 'Home', icon: <Home size={20} /> },
      ]
    },
    {
      id: 'DP',
      title: 'Dynamic Programming',
      icon: <Activity size={20} />,
      items: [
        { path: '/dp-intro', label: 'Penjelasan Umum', icon: <BookOpen size={16} /> },
        { path: '/fibonacci', label: 'Fibonacci', icon: <Activity size={16} /> },
        { path: '/binomial', label: 'Binomial Coef', icon: <BookOpen size={16} /> },
        { path: '/coin-row', label: 'Coin-Row', icon: <BarChart3 size={16} /> },
        { path: '/coin-change', label: 'Coin Change', icon: <Coins size={16} /> },
        { path: '/knapsack', label: '0/1 Knapsack', icon: <Backpack size={16} /> },
        { path: '/tsp', label: 'TSP', icon: <Map size={16} /> },
      ]
    },
    {
      id: 'BACKTRACKING',
      title: 'Backtracking',
      icon: <Puzzle size={20} />,
      items: [
        { path: '/bt-intro', label: 'Penjelasan Umum', icon: <BookOpen size={16} /> },
        { path: '/bt-nqueen', label: 'N-Queen', icon: <Crown size={16} /> },
        { path: '/bt-hamiltonian', label: 'Sirkuit Hamilton', icon: <Network size={16} /> },
        { path: '/bt-coloring', label: 'Pewarnaan Graf', icon: <Palette size={16} /> },
        { path: '/bt-subset', label: 'Subset Sum', icon: <PlusSquare size={16} /> },
      ]
    }
  ];

  return (
    <div className="app-container">
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!isCollapsed && (
            <div className="sidebar-logo">
              <Activity size={28} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
              <span className="logo-text" style={{ fontSize: '1.2rem' }}>Strategi Algoritma</span>
            </div>
          )}
          <button 
            className="collapse-btn" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
          >
            <Menu size={24} />
          </button>
        </div>
        
        <ul className="nav-menu">
          {navCategories.map((cat) => (
            <React.Fragment key={cat.id}>
              {cat.title && (
                <li className="nav-section-title">
                  {isCollapsed ? (
                    <div 
                      className="nav-icon" 
                      onClick={() => toggleSection(cat.id)}
                      style={{ padding: '0.75rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', color: openSection === cat.id ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
                      title={cat.title}
                    >
                      {cat.icon}
                    </div>
                  ) : (
                    <button 
                      onClick={() => toggleSection(cat.id)}
                      className="section-toggle"
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        color: openSection === cat.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                        padding: '0.75rem 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontWeight: '600',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                        {cat.icon}
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.title}</span>
                      </div>
                      {openSection === cat.id ? <ChevronDown size={16} style={{flexShrink: 0}} /> : <ChevronRight size={16} style={{flexShrink: 0}} />}
                    </button>
                  )}
                </li>
              )}
              
              {(!cat.title || openSection === cat.id) && cat.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li className="nav-item" key={item.path}>
                    <NavLink 
                      to={item.path} 
                      className={isActive ? 'active' : ''}
                      title={isCollapsed ? item.label : ""}
                      style={cat.title && !isCollapsed ? { paddingLeft: '2.5rem' } : {}}
                    >
                      <div className="nav-icon">{item.icon}</div>
                      {!isCollapsed && <span className="nav-label">{item.label}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </React.Fragment>
          ))}
        </ul>
      </aside>
      <main className={`main-content ${isCollapsed ? 'expanded' : ''}`}>
        {children}
      </main>
    </div>
  );
}
