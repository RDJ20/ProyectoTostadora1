import { iniciarGrafica } from './grafica.js';
import { tiempo, actualizarTiempo } from './grafica.js';

let intervalo = null; // Variable para almacenar el intervalo de tiempo

// Detecta si estás en la Raspberry Pi o en un entorno local
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Define la URL base según el entorno
const baseUrl = isLocal ? 'http://raspberrypi.local:3000' : 'http://raspberrypi.local:3000';


function cerrarSesion() {
  localStorage.removeItem('jwtToken');
  window.location.href = 'http://raspberrypi.local:3000/index.html';
  console.log("Funciona el boton de cerrar sesion");
}



document.addEventListener('DOMContentLoaded', (event) => {


  document.getElementById('BotonCerrarSesion').addEventListener('click', cerrarSesion);


});
