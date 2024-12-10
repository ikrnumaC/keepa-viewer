import React, { useState, useEffect } from 'react'

const RankingPage = () => {
  const [products, setProducts] = useState([]); // 空配列で初期化
  const [pageSize, setPageSize] = useState(20);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const url = new URL('https://yh546hgz2b.execute-api.ap-southeast-2.amazonaws.com/prod/products/ranking');
      url.searchParams.append('page_size', pageSize);
      if (lastEvaluatedKey) {
        url.searchParams.append('last_evaluated_key', JSON.stringify(lastEvaluatedKey));
      }

      const response = await fetch(url);
      const data = await response.json();
      // レスポンスのbodyをパースする必要がある
      const parsedData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      setProducts(parsedData?.items || []); // items が undefined の場合は空配列を設定
      if (parsedData?.last_evaluated_key) {
        setLastEvaluatedKey(parsedData.last_evaluated_key);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // エラー時は空配列を設定
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pageSize]);

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">商品ランキング</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">商品ランキング</h1>
      
      {/* 表示件数選択 */}
      <div className="mb-4">
        <select 
          className="border p-2 rounded"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={20}>20件表示</option>
          <option value={50}>50件表示</option>
          <option value={100}>100件表示</option>
        </select>
      </div>

      {/* 商品リスト */}
      <div className="grid gap-4">
        {products.length === 0 ? (
          <div>商品がありません</div>
        ) : (
          products.map((product) => (
            <div key={product.asin} className="border rounded p-4">
              <h2 className="font-bold">{product.title}</h2>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p>ランキング: <span className="font-bold">{product.ranking}</span></p>
                  <p>新品価格: <span className="font-bold">¥{product.new_price}</span></p>
                  <p>中古価格: <span className="font-bold">¥{product.used_price}</span></p>
                </div>
                <div>
                  <p>新品出品数: <span className="font-bold">{product.new_count}</span></p>
                  <p>中古出品数: <span className="font-bold">{product.used_count}</span></p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ページネーション */}
      <div className="mt-6 flex justify-center">
        <button className="px-4 py-2 border rounded mr-2">&lt; 前へ</button>
        <button 
          className="px-4 py-2 border rounded"
          onClick={fetchProducts}
          disabled={!lastEvaluatedKey}
        >
          次へ &gt;
        </button>
      </div>
    </div>
  );
};

export default RankingPage
