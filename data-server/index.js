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

  const chartsKV = {
    'http.response_time': 'Http Response Time',
    'plugins.metrics-by-endpoint.response_time.GET /echo long query':
      'Get Echo Long Query Response Time',
    'plugins.metrics-by-endpoint.response_time.GET /echo':
      'Get Echo Response Time',
    'plugins.metrics-by-endpoint.response_time.POST /echo':
      'Post Echo Response Time',
    'plugins.metrics-by-endpoint.response_time.GET /etl':
      'Get ETL Response Time',
  };
  const chartData = {};
  for (const key in chartsKV) {
    const parsedData = filesDataArray.map((fileData) => {
      return {
        name: fileData.name.split('.')[0],
        median: fileData.aggregate.summaries[key].median,
        mean: fileData.aggregate.summaries[key].mean,
        min: fileData.aggregate.summaries[key].min,
        max: fileData.aggregate.summaries[key].max,
        count: fileData.aggregate.summaries[key].count,
      };
    });

    console.log(parsedData);
    chartData[key] = {
      labels: parsedData.map((data) => data.name),
      datasets: [
        {
          label: 'Median',
          data: parsedData.map((data) => data.median),
          borderWidth: 1,
        },
        {
          label: 'Mean',
          data: parsedData.map((data) => data.mean),
          borderWidth: 1,
        },
        {
          label: 'Min',
          data: parsedData.map((data) => data.min),
          borderWidth: 1,
        },
        {
          label: 'Max',
          data: parsedData.map((data) => data.max),
          borderWidth: 1,
        },
        {
          label: 'Count',
          data: parsedData.map((data) => data.count),
          borderWidth: 1,
        },
      ],
    };
    console.log(chartData);
  }

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
