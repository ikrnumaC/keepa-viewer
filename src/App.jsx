import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import RankingPage from './components/RankingPage';
import RankingUpPage from './components/RankingUpPage';

function App() {
  return (
    <BrowserRouter>
      {/* ナビゲーションメニュー */}
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex gap-4">
          <Link to="/" className="text-white hover:text-gray-300">
            ランキング一覧
          </Link>
          <Link to="/ranking-up" className="text-white hover:text-gray-300">
            ランキング上昇
          </Link>
          {/* 他のリンクは後で追加 */}
        </div>
      </nav>

      {/* ページコンテンツ */}
      <Routes>
        <Route path="/" element={<RankingPage />} />
        <Route path="/ranking-up" element={<RankingUpPage />} />
        {/* 他のルートは後で追加 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
