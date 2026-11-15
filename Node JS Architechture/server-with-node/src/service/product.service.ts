import fs from 'fs';
import path, { join } from 'path';
import type { IProduct } from '../types/product';

const filePath = path.join(process.cwd(), './src/database/db.json');

export const productService = () => {
  const result = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(result);
};

export const createProducts = (payload: IProduct[]) => {
  fs.writeFileSync(filePath, JSON.stringify(payload));
};
