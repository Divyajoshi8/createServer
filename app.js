const http = require('http');

const server = http.createServer((request, response) => {
  console.log('My name is Divya');
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('My name has been logged on the server console.');
});

server.listen(4000, () => {
  console.log('Server is listening on port 4000');
});
