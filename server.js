// express読み込み
const express = require('express');
// express初期化
const app = express();
// ポート指定
const port = 3000;

// use関数でExpressのミドルウェアを設定。
// 頻繁に実行する関数はuse関数でミドルウェアに設定することで、毎回呼び出さないで済む。
// ここで言う「頻繁に実行する関数」とは、static関数。引数に静的ファイルを置いているパスを指定。静的ファイルを配信。
app.use(express.static('public'));

// サーバへGETメソッドでリクエストがあった場合の処理
app.get('/', (req, res, next) => {
    res.send('Top Page');
});

// サーバ起動
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});