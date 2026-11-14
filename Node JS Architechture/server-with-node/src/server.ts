import { createServer, IncomingMessage, Server, ServerResponse } from 'http';

const server: Server = createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    //   console.log('request', req);
    //  console.log('response', res);
    //  console.log(req.url);
    //  console.log(req.method);

    const url = req.url;
    const method = req.method;

    if (url === '/' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'This is root route' }));
    } else if (url?.startsWith('/products') && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'This is products route' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'This route is not defined' }));
    }
  },
);

server.listen(5000, () => {
  console.log('server is running!!');
});
