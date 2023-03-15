// HTTPリクエストで受け取ったHTTPメソッドに応じて処理経路を選択することを「ルーティング」と呼ぶ。

const express = require('express');

// ルーティング用のオブジェクトを作る
const router = express.Router();

// GETメソッドでリクエストを受け取った場合の処理
router.get('/', (req, res) => {
  // HTTPヘッダのレスポンスに追加する
  // サーバの現在時刻のタイムスタンプを、X-Timestampヘッダに格納
  res.setHeader('X-Timestamp', Date.now());

  // クエリ文字列を取得
  let message = req.query.message;

  // x-Langヘッダをリクエストヘッダから受け取る
  const lang = req.headers['x-lang'];

  // クエリ文字列のmessageの値が空文字だった場合は、ステータスコードを400にする
  if (message === '') {
    res.status(400);

    // x-Langヘッダが「en」であれば、messageを英語にする
    if (lang === 'en') {
      message = 'message is empty.';
    } else {
      message = 'messageの値が空です。';
    }
  }

  res.send({ message });
});

// ブラウザからJSONデータを受け取るための設定
router.use(express.json());

// POSTメソッドでリクエストを受け取った場合の処理
router.post('/', (req, res) => {
  // req.bodyにリクエストボディが入ってる
  const body = req.body;
  console.log(body);

  // これ以上書き込めないようにするendメソッド
  res.end();
});

// ほかのファイルからルーティング用のオブジェクトを読み込めるようにexport
module.exports = router;
