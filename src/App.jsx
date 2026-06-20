import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DPIntro from './pages/DPIntro';

// DP Pages
import Fibonacci from './pages/Fibonacci';
import BinomialCoefficient from './pages/BinomialCoefficient';
import CoinRow from './pages/CoinRow';
import CoinChange from './pages/CoinChange';
import Knapsack from './pages/Knapsack';
import TSP from './pages/TSP';

// Backtracking Pages
import BacktrackingIntro from './pages/backtracking/BacktrackingIntro';
import NQueen from './pages/backtracking/NQueen';
import Hamiltonian from './pages/backtracking/Hamiltonian';
import GraphColoring from './pages/backtracking/GraphColoring';
import SubsetSum from './pages/backtracking/SubsetSum';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dp-intro" element={<DPIntro />} />
          
          <Route path="/fibonacci" element={<Fibonacci />} />
          <Route path="/binomial" element={<BinomialCoefficient />} />
          <Route path="/coin-row" element={<CoinRow />} />
          <Route path="/coin-change" element={<CoinChange />} />
          <Route path="/knapsack" element={<Knapsack />} />
          <Route path="/tsp" element={<TSP />} />

          <Route path="/bt-intro" element={<BacktrackingIntro />} />
          <Route path="/bt-nqueen" element={<NQueen />} />
          <Route path="/bt-hamiltonian" element={<Hamiltonian />} />
          <Route path="/bt-coloring" element={<GraphColoring />} />
          <Route path="/bt-subset" element={<SubsetSum />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
