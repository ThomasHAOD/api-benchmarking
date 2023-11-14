import { serve } from "https://deno.land/std@0.206.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
const client = new Client({
   user: Deno.env.get('PGUSER'),
   password: Deno.env.get('PGPASSWORD'),
   database: Deno.env.get('PGDATABASE'),
   hostname: Deno.env.get('PGHOST'),
   port: 54321,
})
await client.connect()
const handler = async (request: Request): Promise<Response> => {
   console.log(request.url);

   const url = new URL(request.url);

   if (url.pathname === "/") {
      return new Response("Hello World!");
   }
   if (url.pathname === "/echo") {
      console.log(url);

      const params = new URLSearchParams(url.search);

      const body = JSON.stringify(params)
      return new Response(body);
   }

   if (url.pathname === "/drivers") {
      const { rows } = await client.queryArray('SELECT * FROM drivers')
      const json = JSON.stringify(rows);
      return new Response(json);
   }
   return new Response("Not Found", { status: 404 });
};

serve(handler, { port: 3002 });
