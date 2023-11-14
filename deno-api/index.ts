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
   if (request.method === 'GET' && url.pathname === "/echo") {
      const params = url.search.substring(1);
      const splitParams = params.split('&');
      const paramsObj: { [key: string]: string } = {};
      splitParams.forEach((param) => {
         const [key, value] = param.split('=');
         paramsObj[key] = value;
      });


      const body = JSON.stringify(paramsObj)
      return new Response(body);
   }
   if (request.method === 'POST' && url.pathname === "/echo") {
      console.log(url);

      const reqBody = request.json();
      const resBody = JSON.stringify(reqBody)

      return new Response(resBody);
   }

   if (url.pathname === "/etl") {
      const { rows } = await client.queryArray('SELECT * FROM drivers')
      const json = JSON.stringify(rows);
      return new Response(json);
   }
   return new Response("Not Found", { status: 404 });
};

serve(handler, { port: 3002 });
