import type { IncomingMessage } from 'http';

export const bodyParse = (req: IncomingMessage): Promise<any> => {
  let body = '';
  return new Promise((resolve, reject) => {
    req.on('data', chank => {
      body += chank;
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
};
