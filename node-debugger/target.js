let net = require('net');
const server = net.createServer();
server.on('connection', (conn) => {
  console.log('connection');
});
server.listen(8080);
server.on('listening', () => {
  console.log('listening')
});