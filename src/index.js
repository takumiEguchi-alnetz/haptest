const USERNAME = 'stbtest';
const PASSWORD = 'Test2026STB';
const REALM = 'STB Basic Auth Test';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const unauthorized = () => new Response(
      '<!doctype html><html lang="ja"><meta charset="UTF-8"><title>401 Unauthorized</title><h1>401 Unauthorized</h1><p>Basic認証が必要です。</p></html>',
      {
        status: 401,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );

    const auth = request.headers.get('Authorization') || '';
    if (!auth.startsWith('Basic ')) return unauthorized();

    let decoded;
    try {
      decoded = atob(auth.substring(6).trim());
    } catch {
      return unauthorized();
    }
    const colon = decoded.indexOf(':');
    if (colon < 0 || decoded.slice(0, colon) !== USERNAME || decoded.slice(colon + 1) !== PASSWORD) {
      return unauthorized();
    }

    if (url.pathname === '/favicon.ico') {
      return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
    }
    return new Response(`<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>STB Basic認証テスト</title>
  <style>
    body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f7fb;font-family:system-ui,-apple-system,sans-serif;color:#152238}
    main{max-width:680px;margin:20px;padding:36px;background:white;border-radius:18px;box-shadow:0 8px 26px #0001;text-align:center}
    h1{font-size:clamp(24px,4vw,36px)}.ok{color:#13844a;font-weight:700;font-size:1.25rem}code{background:#eef2f6;padding:4px 8px;border-radius:5px}
  </style>
</head>
<body><main><p class="ok">✓ Basic認証に成功しました</p><h1>Android STB WebView 認証テスト</h1><p>この画面が表示された場合、HTTP Basic認証を通過できています。</p><p>ページURL：<code>${url.pathname.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</code></p><p>再起動後も認証ダイアログなしで表示されるか確認してください。</p></main></body></html>`, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  },
};
