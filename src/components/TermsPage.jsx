import React from 'react';

const Terms = () => {
  return (
    <div className="terms-container">
      <h1>利用規約</h1>
      <section className="terms-section">
        <ol>
          <li>本ウェブツールの利用は、ログインをもって提供完了とみなします。</li>
          <li>利用料金は月額制で、予告なく変更される場合があります。</li>
          <li>本ウェブツールの利用により発生した損害について、当社は一切責任を負いません。</li>
          <li>本ウェブツールは予告なくサービスを停止・終了することがあります。</li>
          <li>障害やメンテナンス等によりサービスが利用できない場合、当社は補償等を行いません。</li>
          <li>利用規約違反の場合、事前通知なくアカウントを停止・削除できます。</li>
          <li>アカウントの又貸しや不正な登録を行った場合、法的措置を取ることがあります。</li>
        </ol>
      </section>

      <section className="disclaimer-section">
        <h2>免責事項</h2>
        <ul>
          <li>本ウェブツールの利用や内容変更により発生した損害について、当社は一切責任を負いません。</li>
          <li>コンテンツや情報の正確性、完全性、有用性等について、当社は保証しません。</li>
          <li>利用者間や第三者とのトラブルについて、当社は関与しません。</li>
          <li>利用者の不適切な利用により発生した損害について、当社は責任を負いません。</li>
        </ul>
      </section>

      <style jsx>{`
        .terms-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }

        h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }

        h2 {
          font-size: 20px;
          margin: 30px 0 15px;
        }

        .terms-section ol {
          padding-left: 20px;
        }

        .disclaimer-section ul {
          list-style-type: disc;
          padding-left: 20px;
        }

        li {
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default Terms;
