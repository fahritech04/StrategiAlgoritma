import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Fibonacci from './pages/Fibonacci';
import BinomialCoefficient from './pages/BinomialCoefficient';
import CoinRow from './pages/CoinRow';
import CoinChange from './pages/CoinChange';
import Knapsack from './pages/Knapsack';
import TSP from './pages/TSP';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fibonacci" element={<Fibonacci />} />
          <Route path="/binomial" element={<BinomialCoefficient />} />
          <Route path="/coin-row" element={<CoinRow />} />
          <Route path="/coin-change" element={<CoinChange />} />
          <Route path="/knapsack" element={<Knapsack />} />
          <Route path="/tsp" element={<TSP />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
