import { createServer } from 'http';

const server = createServer((req, res) => {
  console.log(req);
});

server.listen(5000, () => {
  console.log('server is running!!');
});
