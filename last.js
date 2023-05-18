const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/submit' && req.method === 'POST') {
    handleFormSubmission(req, res);
  } else {
    displayForm(req, res);
  }
});

function handleFormSubmission(req, res) {
  collectFormData(req, (err, formData) => {
    if (err) {
      handleError(res);
    } else {
      saveFormData(formData, (err) => {
        if (err) {
          handleError(res);
        } else {
          redirect(res, '/');
        }
      });
    }
  });
}

function collectFormData(req, callback) {
  let data = '';

  req.on('data', chunk => {
    data += chunk;
  });

  req.on('end', () => {
    callback(null, data);
  });
}

function saveFormData(formData, callback) {
  fs.writeFile('form-data.txt', formData, callback);
}

function displayForm(req, res) {
  readFormData((err, formData) => {
    if (err) {
      handleError(res);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <h1>Submitted Form Data:</h1>
        <p>${formData}</p>

        <form method="POST" action="/submit">
          <input type="text" name="name" placeholder="Enter your name" />
          <button type="submit">Submit</button>
        </form>
      `);
    }
  });
}

function readFormData(callback) {
  fs.readFile('form-data.txt', (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      callback(null, fileData.toString());
    }
  });
}

function redirect(res, location) {
  res.writeHead(302, { 'Location': location });
  res.end();
}

function handleError(res) {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Internal Server Error');
}

server.listen(3500, () => {
  console.log('Server is listening on port 3500');
});
