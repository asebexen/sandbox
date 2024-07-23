import * as http from 'http';
import * as fs from 'fs';
const indexHtml = fs.readFileSync('./build/index.html');
const indexJs = fs.readFileSync('./build/index.js');
const server = http.createServer((req, res) => {
    if (!req.url)
        throw new Error('what');
    if (!['/', '/index.js'].includes(req.url?.toLowerCase())) {
        res.writeHead(404, 'Not found');
        res.end();
        return;
    }
    if (req.method?.toUpperCase() !== 'GET') {
        res.writeHead(405, 'Method not allowed');
        res.end();
        return;
    }
    switch (req.url) {
        case '/':
            res.writeHead(200, 'Ok', { 'content-type': 'text/html' });
            res.end(indexHtml);
            break;
        case '/index.js':
            res.writeHead(200, 'Ok', { 'content-type': 'text/javascript' });
            res.end(indexJs);
    }
});
server.listen(80, () => console.log('Listening on port 80.'));
