import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 価格表示のフォーマット関数
const formatPrice = (price) => {
  if (price === '-1' || price === -1) {
    return <span className="text-red-500 font-bold">在庫なし</span>;
  }
  return <span>¥{Number(price).toLocaleString()}</span>;
};

// 在庫数の表示フォーマット関数
const formatStock = (count) => {
  if (count === '-1' || count === -1) {
    return <span className="text-red-500 font-bold">在庫なし</span>;
  }
  return <span>{count.toString()}</span>;
};

// ランキング変動の表示コンポーネント
const RankingChange = ({ change }) => {
  if (change === '-1' || change === -1) return null;
  
  const numChange = Number(change);
  const className = `ml-2 ${numChange === 0 ? 'text-blue-500' : numChange < 0 ? 'text-red-500' : 'text-blue-500'}`;
  const symbol = numChange === 0 ? '→' : numChange < 0 ? '↑' : '↓';
  
  return (
    <span className={className}>
      {symbol}{Math.abs(numChange)}
    </span>
  );
};

// 価格変動の表示コンポーネント
const PriceChange = ({ change }) => {
  if (change === '-1' || change === -1) return null;
  
  const numChange = Number(change);
  const className = `ml-2 ${numChange === 0 ? 'text-blue-500' : numChange > 0 ? 'text-blue-500' : 'text-red-500'}`;
  const symbol = numChange === 0 ? '→' : numChange > 0 ? '+' : '';
  
  return (
    <span className={className}>
      {symbol}{numChange}
    </span>
  );
};

const RankingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const [previousKeys, setPreviousKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [hasMoreData, setHasMoreData] = useState(true);

  // データ取得関数
  const fetchProducts = async (lastKey = null, newPageSize = pageSize) => {
    try {
      setIsLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();
      searchParams.set('page_size', newPageSize.toString());
      if (lastKey) {
        searchParams.set('last_evaluated_key', JSON.stringify(lastKey));
      }

      const baseUrl = 'https://yh546hgz2b.execute-api.ap-southeast-2.amazonaws.com/prod/products/ranking';
      const url = `${baseUrl}?${searchParams.toString()}`;

      console.log('Fetching products:', { url, lastKey, pageSize: newPageSize });

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const parsedData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;

      console.log('Received data:', parsedData);

      if (parsedData?.items) {
        setProducts(parsedData.items);
        setLastEvaluatedKey(parsedData.last_evaluated_key || null);
        setHasMoreData(!!parsedData.last_evaluated_key);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('データの取得中にエラーが発生しました。');
      setProducts([]);
      setLastEvaluatedKey(null);
      setHasMoreData(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ページサイズ変更のハンドラ
  const handlePageSizeChange = async (newSize) => {
    if (newSize !== pageSize) {
      setPageSize(newSize);
      setPreviousKeys([]);
      setCurrentPage(1);
      await fetchProducts(null, newSize);
      navigate(`${location.pathname}?page_size=${newSize}`);
    }
  };

  // 次のページへの遷移
  const handleNextPage = async () => {
    if (lastEvaluatedKey && !isLoading) {
      // 現在のページの状態を保存
      setPreviousKeys(prev => [...prev, {
        data: products,
        key: lastEvaluatedKey,
        scrollPosition: window.scrollY
      }]);

      // 次のページのデータを取得
      const success = await fetchProducts(lastEvaluatedKey);
      if (success) {
        setCurrentPage(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  // 前のページへの遷移
  const handlePrevPage = async () => {
    if (previousKeys.length > 0 && !isLoading) {
      const newPreviousKeys = [...previousKeys];
      const prevPageState = newPreviousKeys.pop();
      setPreviousKeys(newPreviousKeys);

      if (prevPageState) {
        setProducts(prevPageState.data);
        setLastEvaluatedKey(prevPageState.key);
        setCurrentPage(prev => prev - 1);
        setHasMoreData(true);
        window.scrollTo(0, prevPageState.scrollPosition);
      }
    }
  };

  // 初期データの取得
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pageSizeParam = Number(searchParams.get('page_size')) || 20;
    if (pageSizeParam !== pageSize) {
      setPageSize(pageSizeParam);
    }
    fetchProducts(null, pageSizeParam);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">商品ランキング</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <select 
          className="border p-2 rounded"
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          disabled={isLoading}
        >
          <option value={20}>20件表示</option>
          <option value={50}>50件表示</option>
          <option value={100}>100件表示</option>
        </select>
        <span className="text-gray-600">ページ: {currentPage}</span>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {!isLoading && products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">商品がありません</div>
        ) : (
          products.map((product) => (
            <div key={product.asin} className="border rounded p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="grid grid-cols-5 gap-4">
                {/* 商品画像 */}
                <div className="flex items-center justify-center bg-gray-100 p-4">
                  <a 
                    href={`https://www.amazon.co.jp/dp/${product.asin}?&linkCode=ll1&tag=girlschanne07-22`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <span className="text-gray-500">No Image</span>
                  </a>
                </div>

                {/* Keepaグラフ */}
                <div className="flex items-center justify-center">
                  <img 
                    src={`https://graph.keepa.com/pricehistory.png?asin=${product.asin}&domain=co.jp&new=1&used=1&salesrank=1&bb=1&fbm=1&range=31&width=450&height=150`}
                    alt="Price History Graph"
                    className="w-full h-auto"
                  />
                </div>

                {/* 商品情報 */}
                <div className="col-span-3">
                  <a 
                    href={`https://www.amazon.co.jp/dp/${product.asin}?&linkCode=ll1&tag=girlschanne07-22`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-bold text-lg mb-4 block hover:text-blue-600"
                  >
                    {product.title}
                  </a>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {/* ランキング */}
                    <div>
                      <p className="font-semibold">ランキング</p>
                      <p className="mt-1">
                        <span className="text-xl">{product.ranking}</span>
                        <RankingChange change={product.ranking_change} />
                      </p>
                    </div>

                    {/* 新品価格 */}
                    <div>
                      <p className="font-semibold">新品価格</p>
                      <p className="mt-1">
                        <span className="text-xl">{formatPrice(product.new_price)}</span>
                        <PriceChange change={product.new_price_change} />
                      </p>
                      <p className="mt-1">
                        出品数: <span className="font-bold">{formatStock(product.new_count)}</span>
                      </p>
                    </div>

                    {/* 中古価格 */}
                    <div>
                      <p className="font-semibold">中古価格</p>
                      <p className="mt-1">
                        <span className="text-xl">{formatPrice(product.used_price)}</span>
                        <PriceChange change={product.used_price_change} />
                      </p>
                      <p className="mt-1">
                        出品数: <span className="font-bold">{formatStock(product.used_count)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button 
          className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
          onClick={handlePrevPage}
          disabled={currentPage === 1 || isLoading}
        >
          &lt; 前へ
        </button>
        <button 
          className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
          onClick={handleNextPage}
          disabled={!hasMoreData || isLoading}
        >
          次へ &gt;
        </button>
      </div>
    </div>
  );
};

export default RankingPage;
