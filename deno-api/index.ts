import { serve } from "https://deno.land/std@0.206.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
const client = new Client({
   user: 'user',
   password: 'password',
   database: 'database',
   hostname: 'localhost',
   port: 54321,
})
await client.connect()
const handler = async (request: Request): Promise<Response> => {
   const url = new URL(request.url);

   if (url.pathname === "/") {
      return new Response("Hello World!");
   }

   if (url.pathname === "/drivers") {
      const { rows } = await client.queryArray('SELECT * FROM drivers')
      const json = JSON.stringify(rows);
      return new Response(json);
   }
   return new Response("Not Found", { status: 404 });
};

serve(handler);
