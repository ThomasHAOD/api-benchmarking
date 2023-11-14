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
const handler = async (_request: Request): Promise<Response> => {
   const { rows } = await client.queryArray('SELECT * FROM drivers')
   const json = JSON.stringify(rows);


   return new Response(json, {
      status: 200,
      headers: {
         "content-type": "application/json",
      },
   });
};

serve(handler);
