import React from 'react'

const RankingPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">商品ランキング</h1>
      
      {/* 表示件数選択 */}
      <div className="mb-4">
        <select className="border p-2 rounded">
          <option value="20">20件表示</option>
          <option value="50">50件表示</option>
          <option value="100">100件表示</option>
        </select>
      </div>

      {/* 商品リスト */}
      <div className="grid gap-4">
        {/* サンプル商品カード */}
        <div className="border rounded p-4">
          <h2 className="font-bold">商品タイトル</h2>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p>ランキング: <span className="font-bold">1000</span></p>
              <p>新品価格: <span className="font-bold">¥2,000</span></p>
              <p>中古価格: <span className="font-bold">¥1,500</span></p>
            </div>
            <div>
              <p>新品出品数: <span className="font-bold">5</span></p>
              <p>中古出品数: <span className="font-bold">3</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* ページネーション */}
      <div className="mt-6 flex justify-center">
        <button className="px-4 py-2 border rounded mr-2">&lt; 前へ</button>
        <button className="px-4 py-2 border rounded">次へ &gt;</button>
      </div>
    </div>
  )
}

export default RankingPage
