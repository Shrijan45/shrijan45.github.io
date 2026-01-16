const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 4000;
const cwd = process.cwd();
const root = fs.existsSync(path.join(cwd, '_site')) ? path.join(cwd, '_site') : cwd;

const mime = {
  '.html':'text/html', '.css':'text/css', '.js':'application/javascript',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml',
  '.json':'application/json', '.woff':'font/woff', '.woff2':'font/woff2', '.ttf':'font/ttf',
  '.ico':'image/x-icon'
};

http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(root, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const idx = path.join(root, 'index.html');
      fs.readFile(idx, (err2, data2) => {
        if (err2) { res.statusCode = 404; res.end('Not found'); return; }
        res.setHeader('Content-Type', 'text/html');
        res.end(data2);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = mime[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', type);
    fs.createReadStream(filePath).pipe(res);
  });
}).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}`));
