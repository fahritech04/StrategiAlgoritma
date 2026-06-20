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

// Branch and Bound Pages
import BBIntro from './pages/branch-bound/BBIntro';
import JobAssignment from './pages/branch-bound/JobAssignment';
import KnapsackBB from './pages/branch-bound/KnapsackBB';
import TSPBB from './pages/branch-bound/TSPBB';

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

          <Route path="/bb-intro" element={<BBIntro />} />
          <Route path="/bb-job" element={<JobAssignment />} />
          <Route path="/bb-knapsack" element={<KnapsackBB />} />
          <Route path="/bb-tsp" element={<TSPBB />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
