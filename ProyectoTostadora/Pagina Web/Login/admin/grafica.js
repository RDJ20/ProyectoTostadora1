var temperaturaMax = 180;
export let tiempo = 19;
let dataset = [];
var A = 100;
var mu = 9;
var sigma = 5;
var baseUrl = '';

//Aqui va la conexion con el websocket de la temperatura 
const socket = new WebSocket('ws://raspberrypi.local:8765');

socket.addEventListener('open', (event) => {
    console.log('Connected to the WebSocket server');
});

socket.addEventListener('message', (event) => {
    document.getElementById('tempe1').textContent = event.data + "°C";
});







var token = localStorage.getItem('jwtToken');

  fetch(`${baseUrl}/api/admin`, {
    method: 'GET', 
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  })
  .then(response => {
    if(response.status === 403) {
      window.location.href = 'http://raspberrypi.local:3000/index.html';
    }
    return response.json();
  })
  .then(data => {
    document.getElementById('mensaje').textContent = '¡Hola Admin!';
  })
  .catch((error) => {
    console.error('Error:', error);
  });






  const socket2 = new WebSocket('ws:raspberrypi.local:5678');

  document.getElementById('rangeInput').addEventListener('change', (event) => {
      const value = event.target.value;
      console.log(`Enviando valor al servidor: ${value}`);  // Imprimir el valor que se está enviando
      socket2.send(value);
  });
  
  socket2.addEventListener('open', (event) => {
    console.log('Connected to the WebSocket2 server');
  });




  const motorSocket = new WebSocket('ws:raspberrypi.local:5675');

  document.getElementById('rpmslider').addEventListener('change', (event) => {
      const value = event.target.value;
      console.log(`Enviando valor al servidor del motor: ${value}`);  // Imprimir el valor que se está enviando
      motorSocket.send(value);
  });
  
  motorSocket.addEventListener('open', (event) => {
    console.log('Conectado al servidor WebSocket del motor');
  });

  

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  baseUrl = 'http://raspberrypi.local:3000';
} else {
  baseUrl = 'http://raspberrypi.local:3000';
}

for (var i = 0; i <= tiempo; i++) {
  var ft = A * Math.exp(-Math.pow(i - mu, 2) / (2 * Math.pow(sigma, 2)));
  dataset.push(ft);
}


// function limpiarLocalStorage() {
//   localStorage.removeItem('nombre');
//   localStorage.removeItem('datos');
//   localStorage.removeItem('temperatura');
//   localStorage.removeItem('tiempo');
//   localStorage.removeItem('rpm');
// }

// limpiarLocalStorage();

function verificarVariablesLocales() {
  const nombre = localStorage.getItem('nombre');
  const datos = JSON.parse(localStorage.getItem('datos'));
  const temperatura = localStorage.getItem('temperatura');
  const tiempo1 = localStorage.getItem('tiempo');
  const rpm = localStorage.getItem('rpm');

  if (nombre && datos && temperatura && tiempo1 && rpm) {

    document.getElementById('nombreP').textContent = nombre;

    dataset = datos;

    const tiempoSlider = document.getElementById('slitiempo');
        tiempo = parseInt(tiempo1);
        tiempoSlider.value = tiempo;

    const tempSlider = document.getElementById('slitemperatura');
        temperaturaMax = parseInt(temperatura);
        tempSlider.value = temperaturaMax;

    const rpmSlider = document.getElementById('rpmslider');
        rpmSlider.value = rpm;
        


    localStorage.removeItem('nombre');
    localStorage.removeItem('datos');
    localStorage.removeItem('temperatura');
    localStorage.removeItem('tiempo');
    localStorage.removeItem('rpm');


    realtimeChart = crearRealtimeChart();
    backgroundChart = crearBackgroundChart(dataset);
    // actualizarTiempo(tiempo1,temperatura);
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
        fill: 'origin',
        backgroundColor: 'rgba(113, 32, 255, 0.5)',
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



function agregarPunto(tiempo, dato) {
  realtimeChart.data.labels.push(tiempo);
  realtimeChart.data.datasets[0].data.push(dato);
  realtimeChart.update();
}


export function iniciarGrafica(tiempo) {
  let repeticion = 0;
  const messageHandler = (event) => {
      const dato =  parseFloat(event.data);
      if (repeticion >= tiempo+1) {
        socket.removeEventListener('message', messageHandler);
        console.log("Evento 'message' detenido después de alcanzar el límite de etiquetas."); // Mensaje en consola
        return;
      }

      agregarPunto(realtimeChart.data.labels.length, dato);
      repeticion++;
  };

  socket.addEventListener('message', messageHandler);
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

//Funciones para que tome los datos de los sliders y los envie a las graficas
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


//Esta funcion necesita arreglo
export function enviarPerfil() {
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



export function comenzarGrafica() {   
  iniciarGrafica(tiempo);
}
export function setear(){
actualizarTiempo(tomarDatos(), tomarDatos2());
}

function cerrarSesion() {
  localStorage.removeItem('jwtToken');
  window.location.href = 'http://raspberrypi.local:3000/index.html';
  console.log("Funciona el boton de cerrar sesion");
}

document.addEventListener("DOMContentLoaded", function() {

  document.getElementById("Guardar").addEventListener("click", enviarPerfil);
  document.getElementById("iniciar").addEventListener('click', comenzarGrafica);
  document.getElementById("setear") .addEventListener('click', setear         );
  document.getElementById('BotonCerrarSesion').addEventListener('click', cerrarSesion);
});

