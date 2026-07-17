// Zero-dependency static server for the wasm_vCAD build.
// Serves ./dist with cross-origin isolation (COOP/COEP) so that
// replicad-opencascadejs / threaded WASM can use SharedArrayBuffer,
// correct MIME types (notably application/wasm), and SPA fallback.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';
const ROOT = path.join(__dirname, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.whl': 'application/octet-stream',
  '.data': 'application/octet-stream',
  '.wasm.map': 'application/json; charset=utf-8',
};

function setBaseHeaders(res) {
  // Cross-origin isolation — required for SharedArrayBuffer / threaded WASM.
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
}

function send(res, status, headers, stream) {
  res.writeHead(status, headers);
  if (stream) stream.pipe(res);
  else res.end();
}

function serveFile(res, filePath, isHtml) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  const headers = { 'Content-Type': type };
  setBaseHeaders(res);
  // Hashed asset files can be cached hard; html/config must stay fresh.
  if (isHtml || filePath.endsWith('config.json')) {
    headers['Cache-Control'] = 'no-cache';
  } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  }
  const stream = fs.createReadStream(filePath);
  stream.on('open', () => send(res, 200, headers, stream));
  stream.on('error', () => serveIndex(res));
}

function serveIndex(res) {
  const indexPath = path.join(ROOT, 'index.html');
  setBaseHeaders(res);
  fs.readFile(indexPath, (err, buf) => {
    if (err) {
      res.writeHead(500);
      res.end('dist/index.html not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME['.html'],
      'Cache-Control': 'no-cache',
    });
    res.end(buf);
  });
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  // Resolve against ROOT and block path traversal.
  const resolved = path.normalize(path.join(ROOT, urlPath));
  if (!resolved.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(resolved, (err, stat) => {
    if (!err && stat.isFile()) {
      serveFile(res, resolved, resolved.endsWith('.html'));
    } else if (!err && stat.isDirectory()) {
      serveFile(res, path.join(resolved, 'index.html'), true);
    } else {
      // SPA fallback — unknown non-asset route -> index.html
      serveIndex(res);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`wasm_vCAD static server on http://${HOST}:${PORT} (root: ${ROOT})`);
});
