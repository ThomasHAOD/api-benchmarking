const Koa = require('koa');
const Router = require('@koa/router');
const CORS = require('@koa/cors');

const fs = require('fs');
const path = require('path');

const port = 8000;

const app = new Koa();
const router = new Router();

const parseData = async () => {
  const testFolderPath =
    __dirname.split('/').slice(0, -1).join('/') + '/test/reports';

  const files = fs.readdirSync(testFolderPath);
  const filesDataArray = files.map((file) => {
    const filePath = path.join(testFolderPath, file);
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const parsedData = JSON.parse(fileData);
    parsedData.name = file;
    return parsedData;
  });
  const parsedData = filesDataArray.map((fileData) => {
    return {
      name: fileData.name,
      responseTime: fileData.aggregate.summaries['http.response_time'].median,
    };
  });
  console.log(parsedData);
  const chartData = {
    labels: parsedData.map((data) => data.name),
    datasets: [
      {
        label: 'Median HTTP Response Time',
        data: parsedData.map((data) => data.responseTime),
        borderWidth: 1,
      },
    ],
  };
  console.log(chartData);

  return chartData;
};

router.get('/', async (ctx) => {
  const data = await parseData();
  ctx.body = data;
  ctx.status = 200;
});
app.use(CORS());
app.use(router.routes()).use(router.allowedMethods());
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
