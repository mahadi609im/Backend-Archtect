import { createServer, IncomingMessage, ServerResponse } from 'http';
import routerHendler from './routes/route';
import config from './config';

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  routerHendler(req, res);
});

server.listen(config.port, () => {
  console.log(`server is running on ${config.port}`);
});
