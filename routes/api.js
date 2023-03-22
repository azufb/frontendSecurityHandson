// HTTPリクエストで受け取ったHTTPメソッドに応じて処理経路を選択することを「ルーティング」と呼ぶ。

const express = require('express');

// ルーティング用のオブジェクトを作る
const router = express.Router();

// アクセスを許可するオリジンのリスト
const allowList = ['http://localhost:3000', 'http://site.example:3000'];

// CORSヘッダを追加してクロスオリジンからのリクエストを許可
// useメソッドを使った記述した処理は、/apiへリクエストを送信すると必ず実行される
router.use((req, res, next) => {
  // アクセスを許可するオリジンのリストとOriginヘッダを比較し、Originヘッダが存在する/リストに存在するかを確認
  if (req.headers.origin && allowList.includes(req.headers.origin)) {
    // "*"は、どんなオリジンでもOKで、制限なし
    // 第2引数の許可するオリジンは複数指定できない
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  }
  /* 
  X-Tokenヘッダの送信を許可するために、
  プリフライトリクエスト(単純リクエスト以外)が送信された場合のみ、
  Access-Control-Allow-Originヘッダを追加する
  */
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', 'X-Token');
  }
  next();
});

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
