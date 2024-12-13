import React from 'react';

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">利用規約</h1>
      
      <section className="mb-8">
        <ol className="list-decimal list-outside ml-6 space-y-4">
          <li>本ウェブツールの利用は、ログインをもって提供完了とみなします。</li>
          <li>利用料金は月額制で、予告なく変更される場合があります。</li>
          <li>本ウェブツールの利用により発生した損害について、当社は一切責任を負いません。</li>
          <li>本ウェブツールは予告なくサービスを停止・終了することがあります。</li>
          <li>障害やメンテナンス等によりサービスが利用できない場合、当社は補償等を行いません。</li>
          <li>利用規約違反の場合、事前通知なくアカウントを停止・削除できます。</li>
          <li>アカウントの又貸しや不正な登録を行った場合、法的措置を取ることがあります。</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">免責事項</h2>
        <ul className="list-disc list-outside ml-6 space-y-4">
          <li>本ウェブツールの利用や内容変更により発生した損害について、当社は一切責任を負いません。</li>
          <li>コンテンツや情報の正確性、完全性、有用性等について、当社は保証しません。</li>
          <li>利用者間や第三者とのトラブルについて、当社は関与しません。</li>
          <li>利用者の不適切な利用により発生した損害について、当社は責任を負いません。</li>
        </ul>
      </section>
    </div>
  );
};

export default Terms;
