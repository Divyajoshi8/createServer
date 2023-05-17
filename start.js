const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/submit' && req.method === 'POST') {
    let data = '';

    // Collect the form data
    req.on('data', chunk => {
      data += chunk;
    });

    // Process the form submission
    req.on('end', () => {
      // Read the previous form data from the file
      fs.readFile('form-data.txt', (err, fileData) => {
        if (!err) {
          const previousData = fileData.toString();

          // Overwrite the file with the current form data
          fs.writeFile('form-data.txt', data, err => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Internal Server Error');
            } else {
              // Redirect to the home page
              res.writeHead(302, { Location: '/' });
              res.end();
            }
          });
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        }
      });
    });
  } else {
    let formData = '';

    // Read the previous form data from the file
    fs.readFile('form-data.txt', (err, fileData) => {
      if (!err) {
        formData = fileData.toString();
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <h1>Submitted Form Data:</h1>
        <p>${formData}</p>

        <form method="POST" action="/submit">
          <input type="text" name="" placeholder="Enter your name" />
          <button type="submit">Submit</button>
        </form>
      `);
    });
  }
});

server.listen(3100, () => {
  console.log('Server is listening on port 3100');
});
