"use client";

import React, { useEffect } from "react";
import tocbot from "tocbot";

function Toc() {
  useEffect(() => {
    // Tocbotの初期化
    tocbot.init({
      tocSelector: ".toc", // 目次の表示部分のクラス
      contentSelector: ".post", // 目次を生成する対象のクラス
      headingSelector: "h2, h3", // 目次に表示する見出しのタグ

      scrollSmoothOffset: -100,
      headingsOffset: 350,
    });

    // コンポーネントがアンマウントされたときにTocbotを破棄
    return () => tocbot.destroy();
  }, []);

  return (
    <div className="order-2 pt-16 ml-8 sticky top-0 self-start">
      <h4 className="text-xl border-l-4 border-secondary pl-1">目次</h4>
      <div className="toc px-0 pt-4 pb-8 text-base [&_li]:pt-4"></div> {/* 目次の表示部分 */}
    </div>
  );
}

export default Toc;