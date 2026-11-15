import { createServer, IncomingMessage, ServerResponse } from 'http';
import { createProducts, productService } from '../service/product.service';
import type { IProduct } from '../types/product';
import { bodyParse } from '../utils/parseBody';

const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  const urlParams = url?.split('/');
  const id =
    urlParams && urlParams[1] === 'products' ? Number(urlParams[2]) : null;

  // GET
  if (url === '/products' && method === 'GET') {
    const products = productService();
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify({ message: 'this is products route', data: products }),
    );
  } else if (method === 'GET' && id !== null) {
    const products = productService();
    const product = products.find((p: IProduct) => p.id === id);
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify({ message: 'this is products route', data: product }),
    );
  } else if (method === 'POST' && url === '/products') {
    const body = await bodyParse(req);

    const newData = {
      id: Date.now(),
      ...body,
    };

    const products = productService();
    products.push(newData);
    createProducts(products);

    res.writeHead(201, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify({
        message: 'Product created successfully',
        data: products,
      }),
    );
  }
};

export default productController;
