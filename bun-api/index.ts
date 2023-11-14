import { Client } from 'pg'
const client = new Client({
   user: 'user',
   password: 'password',
   database: 'database',
   host: 'localhost',
   port: 54321,
})
await client.connect()


const server = Bun.serve({
   port: 3000,
   async fetch(req) {
      const { rows } = await client.query('SELECT * FROM drivers')
      const json = JSON.stringify(rows);
      return new Response(json);
   },
});

console.log(`Listening on http://localhost:${server.port} ...`);