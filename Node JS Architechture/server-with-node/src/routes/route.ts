import { createServer, IncomingMessage, ServerResponse } from 'http';
import productController from '../controllers/product.controller';

const routerHendler = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'this is root route' }));
  } else if (url?.startsWith('/products')) {
    productController(req, res);
  } else {
    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'this route is not found' }));
  }
};

export default routerHendler;
