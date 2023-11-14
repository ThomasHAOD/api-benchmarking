import { Client } from 'pg'
const client = new Client({
   user: process.env.PGUSER,
   password: process.env.PGPASSWORD,
   database: process.env.PGDATABASE,
   host: process.env.PGHOST,
   port: 54321,
})
await client.connect()


const server = Bun.serve({
   port: 3000,
   async fetch(req) {
      const url = new URL(req.url);
      if (url.pathname === "/echo" && req.method === "GET") {
         const params = url.searchParams;
         const body = JSON.stringify(params)

         return new Response(body);
      }
      if (url.pathname === '/echo' && req.method === "POST") {
         const reqBody = await req.json();
         const resBody = JSON.stringify(reqBody)

         return new Response(resBody);
      }
      if (url.pathname === "/etl") {
         const { rows } = await client.query('SELECT * FROM drivers')
         const json = JSON.stringify(rows);
         return new Response(json);
      }
      return new Response("Not Found", { status: 404 });
   },
});

console.log(`Listening on http://localhost:${server.port} ...`);
