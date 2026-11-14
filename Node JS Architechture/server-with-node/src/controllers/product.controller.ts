import type { IncomingMessage, ServerResponse } from 'http';

const productController = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'This is products route' }));
};

export default productController;
