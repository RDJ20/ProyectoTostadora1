var ctxBackground = document.getElementById('backgroundChart').getContext('2d');

var backgroundChart = new Chart(ctxBackground, {
    type: 'line',
    data: {
      labels: ['0','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11','12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22','23', '24', '25', '26', '27', '28', '29', '30'],
      datasets: [{
        label: 'Gráfica de fondo',
        data: [25, 30, 35, 40, 35, 40, 50, 60, 65, 70,74,25, 30, 35, 40, 35, 40, 50, 60, 65, 70,74, 25, 30, 35, 40, 35, 40, 50, 60 ],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 2,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
          legend: {
            display: false 
          }
        },
      scales: {
        x: {
          display: true,
          beginAtZero: true,
          max: 30
        },
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });