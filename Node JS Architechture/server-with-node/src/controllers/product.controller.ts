import { IncomingMessage, ServerResponse } from 'http';
import { createProducts, productService } from '../service/product.service';
import type { IProduct } from '../types/product';
import { bodyParser } from '../utils/parseBody';

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
    const body = await bodyParser(req);

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
  } else if (method === 'PUT' && url !== null) {
    const body = await bodyParser(req);

    const products = productService();
    const index = products.findIndex((p: IProduct) => p.id === id);
    if (index < 0) {
      res.writeHead(404, { 'content-type': 'application/json' });
      res.end(
        JSON.stringify({
          message: 'Product not found',
        }),
      );
    }

    products[index] = { id: products[index].id, ...body };
    createProducts(products);

    res.writeHead(201, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify({
        message: 'Product updated successfully',
        data: products[index],
      }),
    );
  } else if (method === 'DELETE' && id !== null) {
    const products = productService();
    const index = products.findIndex((p: IProduct) => p.id === id);

    if (index < 0) {
      res.writeHead(404, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'Product not found' }));
      return;
    }

    products.splice(index, 1);
    createProducts(products);

    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify({
        message: 'Product deleted successfully',
        data: products,
      }),
    );
  }
};

export default productController;
