const http = require('node:http');
const urlLib = require('url');
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
  const { pathname, query } = urlLib.parse(req.url, true);
  if (pathname === '/etl') {
    const { rows } = await client.query('SELECT * FROM drivers');
    const json = JSON.stringify(rows);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(json);
  }
  if (pathname === '/echo' && req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(Buffer.from(JSON.stringify(query)));
  }
  if (pathname === '/echo' && req.method === 'POST') {
		let body = '';
		req.on('data', (data) => {
			body += data;
		})
		req.on('end', () => {
			res.statusCode = 200;
			const bodyData = Buffer.from(body);
			res.setHeader('Content-Type', 'application/json');
			res.end(bodyData);
		})
  }
});

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
