import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, BookOpen, Coins, BarChart3, Backpack, Map, Home, Menu } from 'lucide-react';

export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/fibonacci', label: 'Fibonacci', icon: <Activity size={20} /> },
    { path: '/binomial', label: 'Binomial Coef', icon: <BookOpen size={20} /> },
    { path: '/coin-row', label: 'Coin-Row', icon: <BarChart3 size={20} /> },
    { path: '/coin-change', label: 'Coin Change', icon: <Coins size={20} /> },
    { path: '/knapsack', label: '0/1 Knapsack', icon: <Backpack size={20} /> },
    { path: '/tsp', label: 'TSP', icon: <Map size={20} /> },
  ];

  return (
    <div className="app-container">
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!isCollapsed && (
            <div className="sidebar-logo">
              <Activity size={28} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
              <span className="logo-text">Visual DP</span>
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
          {navItems.map((item) => (
            <li className="nav-item" key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'active' : ''}
                title={isCollapsed ? item.label : ""}
              >
                <div className="nav-icon">{item.icon}</div>
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
      <main className={`main-content ${isCollapsed ? 'expanded' : ''}`}>
        {children}
      </main>
    </div>
  );
}
