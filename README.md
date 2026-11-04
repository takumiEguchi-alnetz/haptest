# Android STB / WebView Basic認証テスト

## 目的
HTTP Basic認証の画面を、Android STBのWebViewで認証情報入りURLから自動通過できるか確認するためのテストアプリです。**HTMLのログインフォームではなく、401 + WWW-Authenticate ヘッダーによる本物のHTTP Basic認証**です。

## テスト用認証情報
- ユーザー名：`stbtest`
- パスワード：`Test2026STB`

**注意：これらはコードに記載された公開検証用のダミー認証情報です。機密情報の保護には使えません。公開するURLやコードには本物のパスワードを使わないでください。**

## GitHubから公開する方法
1. このフォルダーの内容をGitHubリポジトリにアップロードします（`src/index.js` を含む）。
2. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログインし、**Workers & Pages → Create application** からGitHubリポジトリを接続します。
3. 対象リポジトリを選択し、Worker名 `stb-basic-auth-test` （既に使用されている場合は `wrangler.toml` も同じ名前に変更）でデプロイします。ビルド設定が求められた場合は、デプロイコマンドを `npx wrangler deploy` とします。
4. デプロイ後、Cloudflareで表示された `https://stb-basic-auth-test.<your-subdomain>.workers.dev/` にアクセスします。 **このURLは例であり、実際の公開URLはCloudflare画面に表示されます。**

Cloudflare公式手順：https://developers.cloudflare.com/workers/ci-cd/builds/

## WebViewに登録するURL
公開URLが `https://stb-basic-auth-test.<your-subdomain>.workers.dev/` だった場合：

```
https://stbtest:Test2026STB@stb-basic-auth-test.<your-subdomain>.workers.dev/
```

- PCブラウザで通常URLを開いたとき、Basic認証ダイアログが出ることをまず確認します。
- 正しい認証情報を入力すると「Basic認証に成功しました」と表示されます。
- STBのWebViewに上記の認証情報入りURLを登録し、認証ダイアログが出ずに表示できるか確認してください。
- STB再起動後・アプリ再起動後も確認してください。

## 期待される挙動
- 未認証：401 Unauthorized、`WWW-Authenticate: Basic realm="STB Basic Auth Test"`
- 正しい認証：200 OK、成功画面
- 誤った認証情報：401 Unauthorized

## 重要な制約
GitHub Pagesの静的HTMLだけでは、HTTP Basic認証を構成できません。Cloudflare Workers等のサーバー側処理が必要です。
また、認証情報をURLに埋め込んでもWebViewが自動認証に対応するとは限りません。URL方式の動作は実機で判断してください。
