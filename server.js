const crypto = require('crypto');

// express読み込み
const express = require('express');
// express初期化
const app = express();
// ポート指定
const port = 3000;

// EJSをテンプレートエンジンとして利用できるように設定
app.set('view engine', 'ejs');

// ルーティング用オブジェクト読み込み
const api = require('./routes/api');

// use関数でExpressのミドルウェアを設定。
// 頻繁に実行する関数はuse関数でミドルウェアに設定することで、毎回呼び出さないで済む。
// ここで言う「頻繁に実行する関数」とは、static関数。引数に静的ファイルを置いているパスを指定。静的ファイルを配信。
app.use(express.static('public'));

// /apiと言うパス名とルーティング用オブジェクトを紐づける
app.use('/api', api);

// サーバへGETメソッドでリクエストがあった場合の処理
app.get('/', (req, res, next) => {
  res.send('Top Page');
});

app.get('/csp', (req, res) => {
  // リクエストのたびにランダムな文字列を生成（nonce値）
  const nonceValue = crypto.randomBytes(16).toString('base64');
  // CSPヘッダの値に、nonce値を渡す
  // 動的なJavaScript読み込みをできるように、strict-dynamicキーワードも付与
  res.header(
    'Content-Security-Policy',
    `script-src 'nonce-${nonceValue}' 'strict-dynamic';` +
      "object-src 'none';" +
      "base-uri 'none';" +
      "require-trusted-types-for 'script';"
  );

  // HTMLにnonce値を渡すため、第2引数に入れる
  res.render('csp', { nonce: nonceValue });
});

// サーバ起動
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
