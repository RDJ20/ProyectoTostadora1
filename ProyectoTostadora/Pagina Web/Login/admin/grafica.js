var temperaturaMax = 180;
export let tiempo = 19;
let dataset = [];
var A = 100;
var mu = 9;
var sigma = 5;
var baseUrl = '';

//Aqui va la conexion con el websocket
const socket = new WebSocket('ws://raspberrypi.local:8765');

socket.addEventListener('open', (event) => {
    console.log('Connected to the WebSocket server');
});

socket.addEventListener('message', (event) => {
    document.getElementById('tempe1').textContent = event.data + "°C";
});





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
        fill: 'origin',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(0, 255, 212)',
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
            color: 'rgba(0, 0, 0, 0)'
          },
          ticks: {
            color: 'rgba(0, 0, 0, 0)'
          }
        },
        y: {
          beginAtZero: true,
          max: temperaturaMax,
          grid: {
            color: 'rgba(0, 0, 0, 0)'
          },
          ticks: {
            color: 'rgba(0, 0, 0, 0)'
          }
        }
      }
    }
  });
}

let realtimeChart = crearRealtimeChart();
let backgroundChart = crearBackgroundChart(dataset);

function obtenerDatos() {
  return fetch(`${baseUrl}/api/datos`)
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
    });
}

function agregarPunto(tiempo, dato) {
  realtimeChart.data.labels.push(tiempo);
  realtimeChart.data.datasets[0].data.push(dato);
  realtimeChart.update();
}



export function iniciarGrafica() {
  socket.addEventListener('message', (event) => {
    const dato = parseFloat(event.data); // Asumiendo que el dato es un número
    agregarPunto(realtimeChart.data.labels.length, dato);
  });
}

export function actualizarTiempo(nuevoTiempo, nuevaTempt ) {
  //Aqui tambien se actualiza la temperatura
  tiempo = nuevoTiempo;
  temperaturaMax = nuevaTempt
  const datosJSON = obtenerDatosJSON();
  if (realtimeChart) realtimeChart.destroy();
  if (backgroundChart) backgroundChart.destroy();
  realtimeChart = crearRealtimeChart();
  backgroundChart = crearBackgroundChart(dataset);
}

//Nueva funcion
export function tomarDatos()
{
   var slider = document.querySelector("#slider1 input[type='range']");
   return parseInt(slider.value, 10);
}
export function tomarDatos2()
{
   var slider = document.querySelector("#slider input[type='range']");
   return parseInt(slider.value, 10);
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

function enviarPerfil() {
  var nombre = document.getElementById("Nombreperfil").innerText;
  var temperatura = parseFloat(document.getElementById("tiempoFinal").innerText);
  var tiempo = parseFloat(document.getElementById("tempFinal").innerText);
  var RPM = parseInt(document.getElementById("rpmint").innerText);
  var datos = obtenerDatosJSON().datos;

  var postData = {
    "nombre": nombre,
    "temperatura": temperatura,
    "tiempo": tiempo,
    "datos": datos,
    "RPM": RPM
  };

  fetch(`${baseUrl}/api/perfiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Perfil enviado exitosamente:', data);
  })
  .catch(error => {
    console.error('Ocurrió un error al enviar el perfil:', error);
  });
}



function comenzarGrafica() {   
  iniciarGrafica();
}
function setear(){
actualizarTiempo(tomarDatos(), tomarDatos2());
}


document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("Guardar").addEventListener("click", enviarPerfil);
  document.getElementById("iniciar").addEventListener('click', comenzarGrafica);
  document.getElementById("setear").addEventListener('click', setear);
});
