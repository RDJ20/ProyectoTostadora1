var temperaturaMax = 180;
export let tiempo = 40;
let dataset = [];
var A = 100;
var mu = 20;
var sigma = 5;
var baseUrl = '';

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  baseUrl = 'http://localhost:3000';
} else {
  baseUrl = 'http://raspberrypi.local:3000';
}

for (var i = 0; i <= tiempo; i++) {
  var ft = A * Math.exp(-Math.pow(i - mu, 2) / (2 * Math.pow(sigma, 2)));
  dataset.push(ft);
}

function verificarVariablesLocales() {
  const nombre = localStorage.getItem('nombre');
  const datos = JSON.parse(localStorage.getItem('datos'));
  const temperatura = localStorage.getItem('temperatura');
  const tiempo1 = localStorage.getItem('tiempo');
  const rpm = localStorage.getItem('rpm');

  if (nombre && datos && temperatura && tiempo1 && rpm) {
    document.getElementById('nombreP').textContent = nombre;
    dataset = datos;
    document.getElementById('tiempoFinal').textContent = temperatura;
    document.getElementById('tempFinal').textContent = tiempo1;
    document.getElementById('rpmint').textContent = rpm;
    tiempo = parseInt(tiempo1);
    temperaturaMax = parseInt(temperatura);
    localStorage.removeItem('nombre');
    localStorage.removeItem('datos');
    localStorage.removeItem('temperatura');
    localStorage.removeItem('tiempo');
    localStorage.removeItem('rpm');
  }
}

verificarVariablesLocales();

function crearRealtimeChart() {
  var ctxRealtime = document.getElementById('realtimeChart').getContext('2d');

  return new Chart(ctxRealtime, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Datos Arduino',
        data: [],
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1,
        pointRadius: 1
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
          type: 'linear',
          min: 0,
          beginAtZero: true,
          max: tiempo,
        },
        y: {
          type: 'linear',
          display: true,
          min: 0,
          max: temperaturaMax
        }
      }
    }
  });
}

function crearBackgroundChart(dataset) {
  var ctxBackground = document.getElementById('backgroundChart').getContext('2d');
  var labels = [];
  var data = dataset;

  for (var i = 0; i <= tiempo; i++) {
    labels.push(i.toString());
  }

  return new Chart(ctxBackground, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Gráfica de fondo',
        data: data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        pointRadius: 1,
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
          type: 'linear',
          display: true,
          beginAtZero: true,
          max: tiempo,
          grid: {
            color: 'rgba(0, 0, 0, 0)' // cambia el color de la cuadrícula en el eje X
          },
          ticks: {
            color: 'rgba(0, 0, 0, 0)' // color de las etiquetas del eje X
          }
        },
        y: {
          beginAtZero: true,
          max: temperaturaMax,
          grid: {
            color: 'rgba(0, 0, 0, 0)' // cambia el color de la cuadrícula en el eje X
          },
          ticks: {
            color: 'rgba(0, 0, 0, 0)' // color de las etiquetas del eje X
          }
        }
      }
    } // Cierra la llave de las opciones
  }); // Cierra el paréntesis de new Chart
}

let realtimeChart = crearRealtimeChart();
let backgroundChart = crearBackgroundChart(dataset);

function obtenerDatos() {
  const token = localStorage.getItem('jwtToken');
  return fetch(`${baseUrl}/api/datos`, {
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Problema con la respuesta');
      }
      return response.json();
    })
    .then(data => {
      if (!data['data'] || data['data'].length === 0) {
        throw new Error('Datos inesperados');
      }
      return data['data'][data['data'].length - 1]['temperatura_aire'];
    })
    .catch(error => {
      console.error(error);
      // Manejar el error como lo necesites
    });
}

function agregarPunto(tiempo, dato) {
  realtimeChart.data.labels.push(tiempo);
  realtimeChart.data.datasets[0].data.push(dato);
  realtimeChart.update();
}

export function iniciarGrafica() {
  const duracionTotal = tiempo;
  const intervalo = setInterval(() => {
    const tiempoTranscurrido = realtimeChart.data.labels.length * 1;
    obtenerDatos().then(dato => {
      agregarPunto(tiempoTranscurrido, dato);
    });
    if (tiempoTranscurrido >= duracionTotal) {
      clearInterval(intervalo);
    }
  }, 1000);
}

export function actualizarTiempo(nuevoTiempo) {
  tiempo = nuevoTiempo;
  const datosJSON = obtenerDatosJSON();
  if (realtimeChart) realtimeChart.destroy();
  if (backgroundChart) backgroundChart.destroy();
  realtimeChart = crearRealtimeChart();
  backgroundChart = crearBackgroundChart(dataset);
}

function obtenerDatosRealtimeChart() {
  return realtimeChart.data.datasets[0].data;
}

function obtenerDatosLimpios() {
  const datosSucios = obtenerDatosRealtimeChart();
  const datosLimpios = datosSucios.slice(0, datosSucios.length);
  return datosLimpios;
}

function obtenerDatosJSON() {
  const datosLimpios = obtenerDatosLimpios();
  const json = {
    datos: datosLimpios
  };
  return json;
}

document.getElementById('botonUsar').addEventListener('click', function() {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    const decodedToken = jwt_decode(token);
    const userRole = decodedToken.role;
    try {
      localStorage.setItem('nombre', nombreGraf);
      localStorage.setItem('datos', JSON.stringify(datae));
      localStorage.setItem('temperatura', temperaturaMax.toString());
      localStorage.setItem('tiempo', tiempo.toString());
      localStorage.setItem('rpm', rpm.toString());
      if (userRole === 1) {
        window.location.href = '../admin/admin.html';
      } else if (userRole === 2) {
        window.location.href = '../user/user.html';
      } else {
        throw new Error('Rol de usuario desconocido');
      }
    } catch (error) {
      console.error('Ocurrió un error:', error);
    }
  } else {
    console.error('No hay token en localStorage');
  }
});

window.addEventListener('scroll', function() {
  let menu = document.getElementById('menu');
  let profiles = menu.getElementsByTagName('li');
  let middle = window.innerHeight / 2;

  for (let i = 0; i < profiles.length; i++) {
    let rect = profiles[i].getBoundingClientRect();
    if (rect.top < middle && rect.bottom > middle) {
      profiles[i].style.transform = 'scale(1.2)';
    } else {
      profiles[i].style.transform = 'scale(1.0)';
    }
  }
});
