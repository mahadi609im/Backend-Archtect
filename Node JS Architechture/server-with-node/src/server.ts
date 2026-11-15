import { createServer, IncomingMessage, ServerResponse } from 'http';
import routerHendler from './routes/route';

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  routerHendler(req, res);
});

server.listen(5000, () => {
  console.log('server is running');
});
