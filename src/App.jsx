import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RankingPage from './components/RankingPage';
import RankingUpPage from './components/RankingUpPage';
import NewPriceUpPage from './components/NewPriceUpPage';
import UsedPriceUpPage from './components/UsedPriceUpPage';
import NewOutOfStockPage from './components/NewOutOfStockPage';
import UsedOutOfStockPage from './components/UsedOutOfStockPage';
import AllOutOfStockPage from './components/AllOutOfStockPage';

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-800 p-4 sticky top-0 z-50">
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
          <Link to="/new-out-of-stock" className="text-white hover:text-gray-300">
            新品在庫切れ
          </Link>
          <Link to="/used-out-of-stock" className="text-white hover:text-gray-300">
            中古在庫切れ
          </Link>
          <Link to="/all-out-of-stock" className="text-white hover:text-gray-300">
            すべて在庫切れ
          </Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<RankingPage />} />
        <Route path="/ranking-up" element={<RankingUpPage />} />
        <Route path="/new-price-up" element={<NewPriceUpPage />} />
        <Route path="/used-price-up" element={<UsedPriceUpPage />} />
        <Route path="/new-out-of-stock" element={<NewOutOfStockPage />} />
        <Route path="/used-out-of-stock" element={<UsedOutOfStockPage />} />
        <Route path="/all-out-of-stock" element={<AllOutOfStockPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
