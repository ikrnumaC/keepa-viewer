import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

// 価格表示のフォーマット関数
const formatPrice = (price) => {
  if (price === '-1' || price === -1) {
    return <span className="text-red-500 font-bold">在庫なし</span>;
  }
  return <span>¥{Number(price).toLocaleString()}</span>;
}

// 在庫数の表示フォーマット関数
const formatStock = (count) => {
  if (count === '-1' || count === -1) {
    return <span className="text-red-500 font-bold">在庫なし</span>;
  }
  return <span>{count.toString()}</span>;
}

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
}

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
}

const RankingPage = () => {
  const history = useHistory();
  const location = useLocation();
  
  const [products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const [previousKeys, setPreviousKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async (useLastKey = null) => {
    try {
      setIsLoading(true);
      
      // URLのクエリパラメータを更新
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('page_size', pageSize);
      if (useLastKey) {
        searchParams.set('last_evaluated_key', JSON.stringify(useLastKey));
      }
      
      // 更新したURLで fetch
      const url = `${location.pathname}?${searchParams.toString()}`;
      const response = await fetch(url);
      const data = await response.json();

      const parsedData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      const sortedItems = (parsedData?.items || []).sort((a, b) => Number(a.ranking) - Number(b.ranking));
      
      setProducts(sortedItems);
      
      if (parsedData?.last_evaluated_key) {
        setLastEvaluatedKey(parsedData.last_evaluated_key);
      } else {
        setLastEvaluatedKey(null);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // URLのクエリパラメータを監視して fetchProducts を呼び出す
    const searchParams = new URLSearchParams(location.search);
    const page_size = searchParams.get('page_size');
    const last_evaluated_key = searchParams.get('last_evaluated_key');
    
    setPageSize(page_size ? Number(page_size) : 20);
    setLastEvaluatedKey(last_evaluated_key ? JSON.parse(last_evaluated_key) : null);
    setCurrentPage(1);
    setPreviousKeys([]);
    
    fetchProducts(last_evaluated_key ? JSON.parse(last_evaluated_key) : null);
  }, [location.search]);

  const handleNextPage = () => {
    if (lastEvaluatedKey) {
      setPreviousKeys([...previousKeys, products[0]?.asin]);
      
      // URLを更新してから fetchProducts を呼び出す
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('page_size', pageSize);
      searchParams.set('last_evaluated_key', JSON.stringify(lastEvaluatedKey));
      history.push(`${location.pathname}?${searchParams.toString()}`);
      
      fetchProducts(lastEvaluatedKey);
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (previousKeys.length > 0) {
      const newPreviousKeys = [...previousKeys];
      const lastKey = newPreviousKeys.pop();
      setPreviousKeys(newPreviousKeys);
      const lastAsin = products.find(product => product.asin === lastKey)?.asin;
      
      // URLを更新してから fetchProducts を呼び出す
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('page_size', pageSize);
      searchParams.set('last_evaluated_key', JSON.stringify(lastAsin || null));
      history.push(`${location.pathname}?${searchParams.toString()}`);
      
      fetchProducts(lastAsin || null);
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... (その他の UI 要素は省略) ... */}
    </div>
  );
};

export default RankingPage;
