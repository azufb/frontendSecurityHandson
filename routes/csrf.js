const express = require('express');
// セッション管理をするライブラリ
const session = require('express-session');
// Cookieの読み書きをするライブラリ
const cookieParser = require('cookie-parser');
// トークン生成のため入れる
const crypto = require('crypto');

const router = express.Router();

// セッション管理の設定
router.use(
  session({
    secret: 'session',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 1000 * 5,
    },
  })
);

// フォームのデータを読み取るためにURLエンコードを有効にする
router.use(express.urlencoded({ extended: true }));
// Cookie読み書きのためにcookie-parserをExpressに登録
router.use(cookieParser());

// セッションIDを保持
// セッションIDはフォームが送信されたときの検証で使う
let sessionData = {};

// ログインのPOSTリクエストを受け取る
router.post('/login', (req, res) => {
  // リクエストボディからusernameとpasswordを取り出す
  const { username, password } = req.body;

  // usernameがuser1ではない場合、もしくは、passwordがPassw0rd!#ではない場合はログイン失敗とする
  // 検証のため、固定値を使用
  if (username !== 'user1' || password !== 'Passw0rd!#') {
    // ステータスは403
    res.status(403);
    res.send('ログイン失敗');
    return;
  }

  // 変数sessionDataにセッションデータを入れる
  sessionData = req.session;
  // 変数sessionDataのusernameに、リクエストボディから取り出したusernameを入れる
  sessionData.username = username;

  // トークン生成
  const token = crypto.randomUUID();
  // レスポンスのcookieにcsrf_tokenを追加。
  res.cookie('csrf_token', token, {
    secure: true,
  });

  // CSRF検証用ページへリダイレクト
  res.redirect('/csrf_test.html');
});

// フォームから送信されたPOSTリクエストを受け取る
router.post('/remit', (req, res) => {
  // セッションに保存した情報からログイン済みか確認
  // セッションにusernameが保存されていない、
  // もしくは、セッションのusernameが変数sessionDataのusernameと異なる場合はログインしていない
  if (!req.session.username || req.session.username !== sessionData.username) {
    res.status(403);
    res.send('ログインしていません。');
    return;
  }

  // リクエストボディのトークンとcookieに保存されているトークンを検証
  // 異なっていれば、不正なリクエストだと判断
  if (req.cookies['csrf_token'] !== req.body['csrf_token']) {
    res.status(400);
    res.send('不正なリクエストです。');
    return;
  }

  // リクエストボディから、送金先と金額を取り出す
  const { to, amount } = req.body;
  res.send(`「${to}」へ${amount}円送金しました。`);
});

module.exports = router;
