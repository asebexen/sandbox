const http = require('http');
const fs = require('fs');

const INDEX_HTML = fs.readFileSync('index.html', {encoding: 'ascii'});
const ROUTES = {
  '/': fs.readFileSync('index.html', {encoding: 'ascii'}),
  '/index.js': fs.readFileSync('index.js', {encoding: 'ascii'}),
  '/index.css': fs.readFileSync('index.css', {encoding: 'ascii'})
};
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*'
};
const PORT = 80;

function contentType(url) {
  url = url.toLowerCase();
  if (url === '/') return 'text/html';
  if (url.endsWith('.js')) return 'text/javascript';
  if (url.endsWith('.css')) return 'text/css';
  return null;
}

const server = http.createServer((request, response) => {
  const [method, url] = [request.method, request.url];

  if (!Object.keys(ROUTES).some(key => key === url)) {
    response.writeHead(404, 'Not found');
    response.end();
    return;
  } else if (method !== 'GET') {
    response.writeHead(405, 'Method not allowed');
    response.end();
    return;
  }

  const headers = {...CORS};
  if (contentType(url)) {
    headers['Content-Type'] = contentType(url);
  }
  response.writeHead(200, headers);
  response.end(ROUTES[url]);
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));