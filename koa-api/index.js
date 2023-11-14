const Koa = require('koa');
const Router = require('@koa/router');
const { koaBody } = require('koa-body')
const { Client } = require('pg');

const port = 3004;
const app = new Koa();
const router = new Router();

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

router.get('/echo', (ctx) => {
  ctx.body = ctx.request.query;
  ctx.status = 200;
});

router.post('/echo', koaBody(), (ctx) => {
  ctx.body = ctx.request.body;
  ctx.status = 200;
});

router.get('/etl', async (ctx) => {
  const { rows } = await client.query('SELECT * FROM drivers');
	ctx.body = JSON.stringify(rows);
	ctx.status = 200;
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
