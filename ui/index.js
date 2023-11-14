const ctx = document.getElementById('myChart');
const getData = async () => {
  const response = await fetch('http://localhost:8000');
  const data = await response.json();
  console.log(data);
  return data;
};
getData().then((res) => {
  console.log(res);

  const chart = new Chart(ctx, {
    type: 'bar',
    data: res,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  console.log(chart);
});
