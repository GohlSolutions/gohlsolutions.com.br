// Göhl Solutions - servidor local seguro sem dependências externas.
// Rode com: node server.js
// Ele serve o site público, salva pedidos de orçamento e protege /admin com sessão HttpOnly.

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 8080);
const ROOT = __dirname;
const SITE = path.join(ROOT, 'site');
const DATA = path.join(ROOT, 'data');
const CONFIG = path.join(DATA, 'admin_config.json');
const LEADS = path.join(DATA, 'leads.json');
const sessions = new Map();

fs.mkdirSync(DATA, { recursive: true });

function b64(buf){ return Buffer.from(buf).toString('base64'); }
function hashPassword(password, salt){ return new Promise((resolve, reject) => {
  crypto.scrypt(password, salt, 64, (err, key) => err ? reject(err) : resolve(b64(key)));
});}
async function ensureConfig(){
  if (fs.existsSync(CONFIG)) return JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
  const tempPassword = crypto.randomBytes(9).toString('base64url');
  const salt = crypto.randomBytes(16).toString('base64');
  const hash = await hashPassword(tempPassword, salt);
  const cfg = { salt, hash, createdAt: new Date().toISOString() };
  fs.writeFileSync(CONFIG, JSON.stringify(cfg, null, 2));
  console.log('\n======================================================');
  console.log('Senha inicial do ADMIN da Göhl Solutions: ' + tempPassword);
  console.log('Guarde essa senha. Para resetar, apague data/admin_config.json e rode de novo.');
  console.log('======================================================\n');
  return cfg;
}
function readJson(file, fallback){ try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; } }
function writeJson(file, data){ fs.writeFileSync(file, JSON.stringify(data, null, 2)); }
function send(res, status, body, headers={}){ res.writeHead(status, headers); res.end(body); }
function sendJson(res, status, obj){ send(res, status, JSON.stringify(obj), {'Content-Type':'application/json; charset=utf-8', ...securityHeaders()}); }
function securityHeaders(){ return {
  'X-Content-Type-Options':'nosniff',
  'X-Frame-Options':'SAMEORIGIN',
  'Referrer-Policy':'strict-origin-when-cross-origin',
  'Permissions-Policy':'geolocation=(), microphone=(), camera=()',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'self'; frame-ancestors 'self'"
};}
function parseCookies(req){
  return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map(v => {
    const i = v.indexOf('='); return [decodeURIComponent(v.slice(0,i).trim()), decodeURIComponent(v.slice(i+1).trim())];
  }));
}
function isAuthed(req){ const sid = parseCookies(req).gohl_admin; return sid && sessions.has(sid); }
function contentType(file){
  const ext = path.extname(file).toLowerCase();
  return {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8'}[ext] || 'application/octet-stream';
}
function safeFile(urlPath){
  let requested = decodeURIComponent(urlPath.split('?')[0]);
  if (requested === '/') requested = '/index.html';
  const file = path.normalize(path.join(SITE, requested));
  if (!file.startsWith(SITE)) return null;
  return file;
}
function readBody(req){ return new Promise((resolve, reject)=>{
  let body = ''; req.on('data', c => { body += c; if(body.length > 1_000_000){ req.destroy(); reject(new Error('Payload grande demais')); }});
  req.on('end', () => resolve(body)); req.on('error', reject);
});}

(async () => {
  const cfg = await ensureConfig();
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const method = req.method || 'GET';

      if (url.pathname === '/api/login' && method === 'POST') {
        const body = JSON.parse(await readBody(req) || '{}');
        const attempt = await hashPassword(String(body.password || ''), cfg.salt);
        if (crypto.timingSafeEqual(Buffer.from(attempt), Buffer.from(cfg.hash))) {
          const sid = crypto.randomBytes(32).toString('base64url');
          sessions.set(sid, { createdAt: Date.now() });
          res.setHeader('Set-Cookie', `gohl_admin=${sid}; HttpOnly; SameSite=Lax; Path=/; Max-Age=7200`);
          return sendJson(res, 200, { ok: true, redirect: '/admin/painel.html' });
        }
        return sendJson(res, 401, { error: 'Senha incorreta.' });
      }

      if (url.pathname === '/api/logout' && method === 'POST') {
        const sid = parseCookies(req).gohl_admin; if(sid) sessions.delete(sid);
        res.setHeader('Set-Cookie', 'gohl_admin=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
        return sendJson(res, 200, { ok: true });
      }

      if (url.pathname === '/api/contact' && method === 'POST') {
        const body = JSON.parse(await readBody(req) || '{}');
        const lead = {
          createdAt: new Date().toISOString(),
          name: String(body.name || '').slice(0,120),
          phone: String(body.phone || '').slice(0,80),
          email: String(body.email || '').slice(0,120),
          service: String(body.service || '').slice(0,120),
          message: String(body.message || '').slice(0,1500)
        };
        if (!lead.name || !lead.message) return sendJson(res, 400, { error: 'Nome e mensagem são obrigatórios.' });
        const leads = readJson(LEADS, []); leads.unshift(lead); writeJson(LEADS, leads.slice(0, 1000));
        return sendJson(res, 200, { ok: true });
      }

      if (url.pathname === '/api/leads' && method === 'GET') {
        if (!isAuthed(req)) return sendJson(res, 401, { error: 'Sessão expirada.' });
        return sendJson(res, 200, { leads: readJson(LEADS, []) });
      }

      if (url.pathname.startsWith('/admin/') && url.pathname !== '/admin/login.html' && !isAuthed(req)) {
        res.writeHead(302, {'Location':'/admin/login.html', ...securityHeaders()}); return res.end();
      }

      const file = safeFile(url.pathname);
      if (!file || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return send(res, 404, 'Página não encontrada', {'Content-Type':'text/plain; charset=utf-8', ...securityHeaders()});
      send(res, 200, fs.readFileSync(file), {'Content-Type': contentType(file), 'Cache-Control': file.endsWith('.html') ? 'no-cache' : 'public, max-age=3600', ...securityHeaders()});
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { error: 'Erro interno no servidor.' });
    }
  });

  server.listen(PORT, () => {
    console.log(`Göhl Solutions rodando em http://localhost:${PORT}`);
    console.log(`Admin: http://localhost:${PORT}/admin/login.html`);
  });
})();
