const http = require('node:http');
const { Client } = require('pg');

const client = new Client({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
});
const connect = async () => {
  await client.connect();
};
connect();
const hostname = 'localhost';
const port = 3001;

const server = http.createServer(async (req, res) => {
  const { url } = req;
  console.log('request recieved');
  if (url === '/drivers') {
    const { rows } = await client.query('SELECT * FROM drivers');
    const json = JSON.stringify(rows);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(json);
  }
  if (url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('Hello World!');
  }
  if (url !== '/drivers' && url !== '/') {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end('Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
