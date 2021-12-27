const server = require('./');

const host = '0.0.0.0';
const port = '8080'
server.start({
  port,
  host,
  // domain,
});
