import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import RankingPage from './components/RankingPage';
import RankingUpPage from './components/RankingUpPage';
import NewPriceUpPage from './components/NewPriceUpPage';
import UsedPriceUpPage from './components/UsedPriceUpPage';
import OutOfStockPage from './components/OutOfStockPage'; // すべて在庫切れ用
import NewOutOfStockPage from './components/NewOutOfStockPage'; // 新品在庫切れ用
import UsedOutOfStockPage from './components/UsedOutOfStockPage'; // 中古在庫切れ用
import Terms from './components/Terms';

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
          <Link to="/out-of-stock" className="text-white hover:text-gray-300">
            すべて在庫切れ
          </Link>
          <Link to="/terms" className="text-white hover:text-gray-300">
            利用規約
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
        <Route path="/out-of-stock" element={<OutOfStockPage />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
