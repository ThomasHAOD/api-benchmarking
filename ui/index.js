const httpResponseTime = document.getElementById('http.response_time');
const httpGetEchoLongQueryResponseTime = document.getElementById(
  'get-echo-long-query.response_time'
);
const httpGetEchoResponseTime = document.getElementById(
  'get-echo.response_time'
);
const httpPostEchoResponseTime = document.getElementById(
  'post-echo.response_time'
);
const httpGetEtlResponseTime = document.getElementById('get-etl.response_time');

const getData = async () => {
  const response = await fetch('http://localhost:8000');
  const data = await response.json();
  console.log(data);
  return data;
};
getData().then((res) => {
  console.log(res);

  new Chart(httpResponseTime, {
    type: 'bar',
    data: res['http.response_time'],
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  new Chart(httpGetEchoLongQueryResponseTime, {
    type: 'bar',
    data: res['plugins.metrics-by-endpoint.response_time.GET /echo long query'],
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  new Chart(httpGetEchoResponseTime, {
    type: 'bar',
    data: res['plugins.metrics-by-endpoint.response_time.GET /echo'],
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  new Chart(httpPostEchoResponseTime, {
    type: 'bar',
    data: res['plugins.metrics-by-endpoint.response_time.POST /echo'],
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  new Chart(httpGetEtlResponseTime, {
    type: 'bar',
    data: res['plugins.metrics-by-endpoint.response_time.GET /etl'],
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
