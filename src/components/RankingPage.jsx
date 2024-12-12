import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

// Keepaグラフコンポーネント
const KeepaGraph = ({ asin, index, batchStart, autoLoadLimit = 50, enabled = false }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    // バッチ内でのインデックスを計算
    const batchIndex = index - (batchStart || 0);
    
    // 10件ごとにグループ化
    const groupIndex = Math.floor(batchIndex / 10);
    
    // グループごとの基本遅延（15秒 = 15000ミリ秒）
    const baseDelay = groupIndex * 15000;
    
    // グループ内での個別遅延（500ミリ秒ずつ）
    const individualDelay = (batchIndex % 10) * 500;
    
    const totalDelay = baseDelay + individualDelay;

    // 残り時間の表示用
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, totalDelay - elapsed);
      setRemainingTime(Math.ceil(remaining / 1000));
    }, 1000);

    // グラフ表示用タイマー
    const graphTimer = setTimeout(() => {
      setShowGraph(true);
      clearInterval(timer);
      setRemainingTime(null);
    }, totalDelay);

    return () => {
      clearTimeout(graphTimer);
      clearInterval(timer);
    };
  }, [enabled, index, batchStart]);

  if (!enabled) {
    return (
      <div className="flex items-center justify-center h-[150px] bg-gray-100">
        <span className="text-gray-500">グラフ未読み込み</span>
      </div>
    );
  }

  if (!showGraph) {
    return (
      <div className="flex items-center justify-center h-[150px] bg-gray-100">
        <div className="text-center">
          <div className="animate-pulse mb-2">グラフ読み込み中...</div>
          {remainingTime !== null && (
            <div className="text-sm text-gray-500">
              残り約{remainingTime}秒
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <img 
        src={`https://graph.keepa.com/pricehistory.png?asin=${asin}&domain=co.jp&new=1&used=1&salesrank=1&bb=1&fbm=1&range=31&width=450&height=150`}
        alt="Price History Graph"
        className="w-full h-auto"
      />
    </div>
  );
};

const RankingPage = () => {
  const location = useLocation();
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enabledBatches, setEnabledBatches] = useState(new Set([0])); // 最初のバッチは自動で有効

  // データ取得関数
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const baseUrl = 'https://yh546hgz2b.execute-api.ap-southeast-2.amazonaws.com/prod/products/ranking';

      console.log('Fetching products:', { url: baseUrl });

      const response = await fetch(baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const parsedData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;

      console.log('Received data:', parsedData);

      if (parsedData?.items) {
        setProducts(parsedData.items);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('データの取得中にエラーが発生しました。');
      setProducts([]);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // バッチ読み込み処理
  const handleLoadBatch = (batchIndex) => {
    setEnabledBatches(prev => new Set([...prev, batchIndex]));
  };

  // 初期データの取得
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">商品ランキング</h1>

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
          products.map((product, index) => {
            // バッチインデックスを計算
            const batchIndex = index < 50 ? 0 : Math.floor((index - 50) / 30) + 1;
            const isEnabled = enabledBatches.has(batchIndex);

            return (
              <React.Fragment key={product.asin}>
                <div className="border rounded p-4 shadow-sm hover:shadow-md transition-shadow">
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
                    <KeepaGraph 
                      asin={product.asin} 
                      index={index}
                      batchStart={batchIndex * 30 + (batchIndex === 0 ? 0 : 20)} 
                      enabled={isEnabled}
                    />

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

                {/* 30件毎にボタンを表示 */}
                {index >= 49 && // 最初の50件の後から
                 (index + 1) % 30 === 0 && // 30件毎
                 index + 1 < products.length && // 最後の商品でない
                 !enabledBatches.has(batchIndex + 1) && // 次のバッチがまだ有効でない
                (
                  <div className="my-8 text-center">
                    <div className="border-t border-gray-300 my-4"></div>
                    <button
                      onClick={() => handleLoadBatch(batchIndex + 1)}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      次の30件のグラフを読み込む
                    </button>
                  </div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RankingPage;
