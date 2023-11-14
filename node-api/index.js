const http = require('node:http');
const { Client } = require('pg');

const client = new Client({
  user: 'user',
  password: 'password',
  database: 'database',
  host: 'localhost',
  port: 54321,
});
const connect = async () => {
  await client.connect();
};
connect();
const hostname = '127.0.0.1';
const port = 3001;

const server = http.createServer(async (req, res) => {
  const { rows } = await client.query('SELECT * FROM drivers');
  const json = JSON.stringify(rows);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(json);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
