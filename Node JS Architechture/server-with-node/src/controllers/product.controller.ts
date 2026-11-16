import { IncomingMessage, ServerResponse } from 'http';
import { createProducts, productService } from '../service/product.service';
import type { IProduct } from '../types/product';
import { bodyParser } from '../utils/parseBody';
import { sendResponse } from '../utils/sendResponse';

const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  const urlParams = url?.split('/');

  const id =
    urlParams && urlParams[1] === 'products' && urlParams[2]
      ? Number(urlParams[2])
      : null;

  try {
    // GET
    if (url === '/products' && method === 'GET') {
      const products = productService();

      sendResponse(
        res,
        true,
        200,
        'Products retrieved  successfully',
        products,
      );
    } else if (method === 'GET' && id !== null) {
      const products = productService();
      const product = products.find((p: IProduct) => p.id === id);

      if (!product) {
        return sendResponse(res, false, 404, 'Product not found');
      }

      sendResponse(res, true, 200, 'Product retrived successfully', product);
    } else if (method === 'POST' && url === '/products') {
      const body = await bodyParser(req);

      const newData = {
        id: Date.now(),
        ...body,
      };

      const products = productService();
      products.push(newData);
      createProducts(products);

      sendResponse(res, true, 201, 'Product created successfully', newData);
    } else if (method === 'PUT' && id !== null) {
      const body = await bodyParser(req);

      const products = productService();
      const index = products.findIndex((p: IProduct) => p.id === id);
      if (index < 0) {
        return sendResponse(res, false, 404, 'Product not found');
      }

      products[index] = { id: products[index].id, ...body };
      createProducts(products);

      sendResponse(
        res,
        true,
        200,
        'Product updated successfully',
        products[index],
      );
    } else if (method === 'DELETE' && id !== null) {
      const products = productService();
      const index = products.findIndex((p: IProduct) => p.id === id);

      if (index < 0) {
        return sendResponse(res, false, 404, 'Product not found');
      }

      const [deletedProduct] = products.splice(index, 1);
      createProducts(products);

      sendResponse(
        res,
        true,
        200,
        'Product deleted successfully',
        deletedProduct,
      );
    } else {
      sendResponse(res, false, 404, 'Route not found');
    }
  } catch (error) {
    sendResponse(res, false, 500, 'Internal server error');
  }
};

export default productController;
