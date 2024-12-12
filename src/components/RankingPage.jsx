import React, { useState, useEffect } from 'react'

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
 const [products, setProducts] = useState([]);
 const [pageSize, setPageSize] = useState(20);
 const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
 const [previousKeys, setPreviousKeys] = useState([]);
 const [isLoading, setIsLoading] = useState(false);
 const [currentPage, setCurrentPage] = useState(1);

 const fetchProducts = async (useLastKey = null) => {
   try {
     setIsLoading(true);
     const url = new URL('https://yh546hgz2b.execute-api.ap-southeast-2.amazonaws.com/prod/products/ranking');
     url.searchParams.append('page_size', pageSize);
     if (useLastKey) {
       url.searchParams.append('last_evaluated_key', JSON.stringify(useLastKey));
     }

     const response = await fetch(url);
     const data = await response.json();
     console.log('API Response:', data); // デバッグ用

     const parsedData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
     console.log('Parsed Data:', parsedData); // デバッグ用
     
     // ランキング順（昇順）でソート
     const sortedItems = (parsedData?.items || []).sort((a, b) => Number(a.ranking) - Number(b.ranking));
     
     // 新しいページを取得する場合は既存のデータを置き換え
     setProducts(sortedItems);
     console.log('Sorted Items:', sortedItems); // デバッグ用
     
     if (parsedData?.last_evaluated_key) {
       setLastEvaluatedKey(parsedData.last_evaluated_key);
       console.log('Next Page Token:', parsedData.last_evaluated_key); // デバッグ用
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
   fetchProducts();
   setCurrentPage(1);
   setPreviousKeys([]);
 }, [pageSize]);

 const handleNextPage = () => {
   if (lastEvaluatedKey) {
     setPreviousKeys([...previousKeys, products[0]?.asin]);
     fetchProducts(lastEvaluatedKey);
     setCurrentPage(prev => prev + 1);
   }
 };

 const handlePrevPage = () => {
   if (previousKeys.length > 0) {
     const newPreviousKeys = [...previousKeys];
     const lastKey = newPreviousKeys.pop();
     setPreviousKeys(newPreviousKeys);
     fetchProducts(lastKey || null);
     setCurrentPage(prev => prev - 1);
   }
 };

 return (
   <div className="container mx-auto px-4 py-8">
     <h1 className="text-3xl font-bold mb-6">商品ランキング</h1>
     
     <div className="mb-4 flex justify-between items-center">
       <select 
         className="border p-2 rounded"
         value={pageSize}
         onChange={(e) => setPageSize(Number(e.target.value))}
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

     <div className="grid gap-4">
       {!isLoading && products.length === 0 ? (
         <div className="text-center py-8 text-gray-500">商品がありません</div>
       ) : (
         products.map((product) => (
           <div key={product.asin} className="border rounded p-4 shadow-sm hover:shadow-md transition-shadow">
             <div className="grid grid-cols-5 gap-4">
               {/* 商品画像 (一時的にプレースホルダーとして) */}
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
                 {/* 商品名 */}
                 <a 
                   href={`https://www.amazon.co.jp/dp/${product.asin}?&linkCode=ll1&tag=girlschanne07-22`}
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="font-bold text-lg mb-4 block hover:text-blue-600"
                 >
                   {product.title}
                 </a>

                 {/* 商品データ */}
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
         disabled={currentPage === 1}
       >
         &lt; 前へ
       </button>
       <button 
         className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white"
         onClick={handleNextPage}
         disabled={!lastEvaluatedKey}
       >
         次へ &gt;
       </button>
     </div>
   </div>
 );
};

export default RankingPage;
