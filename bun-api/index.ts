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
      const url = new URL(req.url);
      if (url.pathname === "/") {
         return new Response("Hello World!");
      }
      if (url.pathname === "/drivers") {
         const { rows } = await client.query('SELECT * FROM drivers')
         const json = JSON.stringify(rows);
         return new Response(json);
      }
      return new Response("Not Found", { status: 404 });
   },
});

console.log(`Listening on http://localhost:${server.port} ...`);