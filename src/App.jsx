import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import RankingPage from './components/RankingPage';
import RankingUpPage from './components/RankingUpPage';
import NewPriceUpPage from './components/NewPriceUpPage';
import UsedPriceUpPage from './components/UsedPriceUpPage';
import OutOfStockPage from './components/OutOfStockPage';

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex gap-4 flex-wrap">
          <Link to="/" className="text-white hover:text-gray-300">
            ランキング一覧
          </Link>
          <Link to="/ranking-up" className="text-white hover:text-gray-300">
            ランキング上昇
          </Link>
          <Link to="/new-price-up" className="text-white hover:text-gray-300">
            新品価格上昇
          </Link>
          <Link to="/used-price-up" className="text-white hover:text-gray-300">
            中古価格上昇
          </Link>
          <Link to="/out-of-stock" className="text-white hover:text-gray-300">
            在庫なし商品
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<RankingPage />} />
        <Route path="/ranking-up" element={<RankingUpPage />} />
        <Route path="/new-price-up" element={<NewPriceUpPage />} />
        <Route path="/used-price-up" element={<UsedPriceUpPage />} />
        <Route path="/out-of-stock" element={<OutOfStockPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
