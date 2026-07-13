// 脑力竞技常驻静态服务 · launchd: com.jonasunzhu.brainarena · Funnel: /game
// 直接伺服 prototypes/single-engine 工作区——push 即上线,无需构建。
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'prototypes', 'single-engine');
const LOGDIR = path.join(__dirname, '..', 'telemetry');
const PORT = 8920;
try{ fs.mkdirSync(LOGDIR, {recursive:true}); }catch(e){}
const MIME = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp',
  '.woff2':'font/woff2', '.json':'application/json', '.svg':'image/svg+xml', '.ico':'image/x-icon',
};

http.createServer((req, res) => {
  // 测试遥测:战报自动上报(CORS 全开,方便 Vercel/gh-pages 端也能报)
  if (req.url === '/log' || req.url === '/log/') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
    if (req.method !== 'POST') { res.writeHead(405); return res.end(); }
    let body = '';
    req.on('data', c => { body += c; if (body.length > 64000) req.destroy(); });
    req.on('end', () => {
      try {
        const rec = JSON.parse(body);
        rec._at = new Date().toISOString();
        rec._ip = (req.socket.remoteAddress || '').replace('::ffff:', '');
        fs.appendFileSync(path.join(LOGDIR, 'runs.jsonl'), JSON.stringify(rec) + '\n');
        res.writeHead(204); res.end();
      } catch (e) { res.writeHead(400); res.end(); }
    });
    return;
  }
  let p = decodeURIComponent((req.url || '/').split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      // html 永不缓存(版本即时可见);资产缓存一天
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400',
    });
    res.end(buf);
  });
}).listen(PORT, '0.0.0.0', () => console.log(`brain-arena serving ${ROOT} on :${PORT}`));
