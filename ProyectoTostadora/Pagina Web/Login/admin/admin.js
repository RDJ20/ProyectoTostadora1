import { iniciarGrafica } from './grafica.js';
import { tiempo, actualizarTiempo } from './grafica.js';

let intervalo = null; // Variable para almacenar el intervalo de tiempo

// Detecta si estás en la Raspberry Pi o en un entorno local
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Define la URL base según el entorno
const baseUrl = isLocal ? 'http://raspberrypi.local:3000' : 'http://raspberrypi.local:3000';




document.addEventListener('DOMContentLoaded', (event) => {
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

  function cerrarSesion() {
    localStorage.removeItem('jwtToken');
    window.location.href = 'http://raspberrypi.local:3000/index.html';
    console.log("Funciona el boton de cerrar sesion");
}

  document.getElementById('BotonCerrarSesion').addEventListener('click', cerrarSesion);
  document.getElementById("Guardar").addEventListener("click", enviarPerfil   );
  document.getElementById("iniciar").addEventListener('click', comenzarGrafica);
  document.getElementById("setear") .addEventListener('click', setear         );
  

});
