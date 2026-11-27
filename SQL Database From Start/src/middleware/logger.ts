import type { NextFunction, Request, Response } from 'express';
import fs from 'fs';

const logger = async (req: Request, res: Response, next: NextFunction) => {
  const log = `\n Method -> ${req.method} | URL -> ${req.url} | Time: ${Date.now()} \n`;

  fs.appendFile('logger.txt', log, err => {
    if (err) {
      console.error('Logger error:', err);
    }
  });

  next();
};

export default logger;
