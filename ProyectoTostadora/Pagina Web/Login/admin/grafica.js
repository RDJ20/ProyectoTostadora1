var temperaturaMax = 180;
export let tiempo = 19;
let dataset = [];
var A = 100;
var mu = 9;
var sigma = 5;
var baseUrl = '';
let repeticion = 0;

//Aqui va la conexion con el websocket de la temperatura 
const socket = new WebSocket('ws://raspberrypi.local:8765');

socket.addEventListener('open', (event) => {
    console.log('Connected to the WebSocket server');
});

socket.addEventListener('message', (event) => {
    document.getElementById('tempe1').textContent = event.data + "°C";
});



const mostrarFormularioBtn = document.getElementById("crearusuario");
const cerrarFormularioBtn = document.getElementById("cerrarFormulario");
const cerrarFormularioBtn1 = document.getElementById("cerrarFormulario1");
const overlay = document.getElementById("overlay");

mostrarFormularioBtn.addEventListener("click", () => {
    overlay.style.display = "flex";
});

cerrarFormularioBtn.addEventListener("click", () => {
    overlay.style.display = "none";
});

cerrarFormularioBtn1.addEventListener("click", () => {
  overlay1.style.display = "none";
});


const overlay1 = document.getElementById("overlay1");

function mostrarRegistroLote(){
  overlay1.style.display = "flex";
  repeticion = 0;
  let fecha = new Date();
  let dia = ("0" + fecha.getDate()).slice(-2);
  let mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
  let año = fecha.getFullYear();
  let fechaFormateada = año + '-' + mes + '-' + dia;
  let perfilnombre = document.getElementById('nombreP').innerText;
  document.getElementById('fechaActual').value = fechaFormateada;
  document.getElementById('perfilname').value = perfilnombre;


  var temperaturaaaa = parseFloat(document.getElementById("slitemperatura").value);
  var tiempoooo = parseFloat(document.getElementById("slitiempo").value);
  var RPM = parseInt(document.getElementById("rpmslider").value);

  console.log("datos: "+temperaturaaaa+", "+tiempoooo+", "+RPM);

  document.getElementById("tiempoo").value = tiempoooo+"";
  document.getElementById("temperaturaa").value = temperaturaaaa+"";
  document.getElementById("rpmm").value = RPM+"";
}





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


    
    actualizarTiempo(tiempo,temperaturaMax);
  }
    
  
}




let realtimeChart = crearRealtimeChart();
let backgroundChart = crearBackgroundChart(dataset);

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





function agregarPunto(tiempo, dato) {
  realtimeChart.data.labels.push(tiempo);
  realtimeChart.data.datasets[0].data.push(dato);
  realtimeChart.update();
}


export function iniciarGrafica(tiempo) {
  const messageHandler = (event) => {
      const dato =  parseFloat(event.data);
      if (repeticion >= tiempo+1) {
        socket.removeEventListener('message', messageHandler);
        console.log("Evento 'message' detenido después de alcanzar el límite de etiquetas.");
        repeticion = 0;
        mostrarRegistroLote();
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






export function enviarPerfil() {
  var nombre = document.getElementById("nombreprofile").value;
  var temperatura = parseFloat(document.getElementById("slitemperatura").value);
  var tiempo = parseFloat(document.getElementById("slitiempo").value);
  var RPM = parseInt(document.getElementById("rpmslider").value);
  var datos = obtenerDatosJSON().datos;

  var postData = {
    "nombre": nombre,
    "temperatura": temperatura,
    "tiempo": tiempo,
    "datos": datos,
    "RPM": RPM
  };

  // Imprime el objeto postData en la consola antes de enviarlo
  console.log('Datos a enviar:', postData);

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



function crearUsuario() {
  // Obtén una referencia a los elementos del formulario
  const usernameInput = document.getElementById("username");
  const rolSelect = document.getElementById("rol");
  const passwordInput = document.getElementById("password");

  // Obtiene los valores de los campos
  const username = usernameInput.value;
  const rol = rolSelect.value; // Valor del rol seleccionado
  const password = passwordInput.value;

  // Mapea el valor del rol a 1 (admin) o 2 (user)
  let roleId;
  if (rol === "admin") {
    roleId = 1;
  } else if (rol === "user") {
    roleId = 2;
  }

  // Crea un objeto con los datos que se enviarán en la solicitud POST
  const userData = {
    username: username,
    roleId: roleId, // Asigna el valor del rol
    password: password,
  };

  // Realiza la solicitud POST a la API
  fetch("http://raspberrypi.local:3000/api/createUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      return response.json();
    })
    .then((data) => {
      // Procesa la respuesta de la API si es necesario
      console.log("Solicitud exitosa:", data);
      // Puedes mostrar un mensaje de éxito o realizar otras acciones aquí
    })
    .catch((error) => {
      console.error("Error:", error);
      // Puedes mostrar un mensaje de error al usuario aquí
    });
}



function parar(){
  repeticion =tiempo;
}




function registrarLote() {

  const fechaActual = document.getElementById('fechaActual').value;
  const perfilname = document.getElementById('perfilname').value;
  const pesoI = document.getElementById('pesoI').value;
  const pesoF = document.getElementById('pesoF').value;
  const tiempoo = document.getElementById('tiempoo').value;
  const temperaturaa = document.getElementById('temperaturaa').value;
  const rpmm = document.getElementById('rpmm').value;
  const tipocafe = document.getElementById('tipocafe').value;

  
  const data = {
      fecha: fechaActual,
      nombre_perfil: perfilname,
      peso_inicial: pesoI,
      peso_final: pesoF,
      tiempo: tiempoo,
      temperatura: temperaturaa,
      rpm: rpmm,
      tipo_cafe: tipocafe
  };

  
  fetch('http://raspberrypi.local:3000/api/lotes', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
      if (data.message) {
          alert(data.message);
      } else {
          alert('Error al registrar el lote.');
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Error al registrar el lote.');
  });
}






document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("registrar1").addEventListener("click", registrarLote);
  document.getElementById("parar").addEventListener("click", parar);
  document.getElementById("registrar").addEventListener("click", crearUsuario);
  document.getElementById("Guardar").addEventListener("click", enviarPerfil);
  document.getElementById("iniciar").addEventListener('click', comenzarGrafica);
  document.getElementById("setear") .addEventListener('click', setear         );
  document.getElementById('BotonCerrarSesion').addEventListener('click', cerrarSesion);
});

