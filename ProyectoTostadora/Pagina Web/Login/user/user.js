import { iniciarGrafica } from './grafica.js';
import { tiempo, actualizarTiempo } from './grafica.js';

let intervalo = null;
let baseUrl = '';

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  baseUrl = 'http://raspberrypi.local:3000';
} else {
  baseUrl = 'http://raspberrypi.local:3000';
}

function actualizarTemperatura() {
  const token = localStorage.getItem('jwtToken');
  if (intervalo) {
    clearInterval(intervalo);
    intervalo = null;

    fetch(`${baseUrl}/api/comenzar/reset`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        console.log('Comenzar enviado correctamente');
      })
      .catch(error => console.error('Error:', error));
  } else {
    fetch(`${baseUrl}/api/comenzar`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        console.log('Comenzar enviado correctamente');
      })
      .catch(error => console.error('Error:', error));

    intervalo = setInterval(() => {
      fetch(`${baseUrl}/api/datosI`, {
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          document.getElementById('tiempo').textContent = data.temperatura_cafe;
        })
        .catch(error => console.error('Error:', error));
    }, 1000);
  }
}

let yaPresionado = false;

function enviarRPM() {
  const rpmElement = document.getElementById('rpmint');
  let velocidad;

  if (yaPresionado) {
    velocidad = 4000;
  } else {
    velocidad = parseFloat(rpmElement.textContent);
  }

  if (isNaN(velocidad)) {
    console.log('La velocidad introducida no es un número válido');
    return;
  }

  const data = { comenzar: !yaPresionado, velocidad: velocidad };

  fetch(`${baseUrl}/api/motor`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      console.log('Datos enviados correctamente');
    })
    .catch(error => console.error('Error:', error));

  yaPresionado = !yaPresionado;
}

document.getElementById('botonTiempo').addEventListener('click', () => {
  const nuevoTiempo = parseFloat(document.getElementById('tempFinal').textContent);
  if (!isNaN(nuevoTiempo)) {
    actualizarTiempo(nuevoTiempo);
    console.log('Tiempo actualizado a', nuevoTiempo);
  } else {
    console.log('El tiempo introducido no es un número válido');
  }
});

document.addEventListener('DOMContentLoaded', (event) => {
  var token = localStorage.getItem('jwtToken');

  fetch(`${baseUrl}/api/user`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  })
    .then(response => {
      if (response.status === 403) {
        window.location.href = '../index.html';
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
    window.location.href = '../index.html';
  }

  function comenzarGrafica() {
    preparar();
    iniciarGrafica();
  }

  function preparar() {
    fetch(`${baseUrl}/api/datos/reset`, {
      method: 'POST'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        console.log('Reset de datos enviado correctamente');
      })
      .catch(error => console.error('Error:', error));

    fetch(`${baseUrl}/api/comenzar`, {
      method: 'POST'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        console.log('Comenzar enviado correctamente');
      })
      .catch(error => console.error('Error:', error));
  }

  document.getElementById('BotonCerrarSesion').addEventListener('click', cerrarSesion);
  document.getElementById('botonComenzar').addEventListener('click', comenzarGrafica);

  document.getElementById('botonTemperatura').addEventListener('click', actualizarTemperatura);
  document.getElementById('botonComenzarRPM').addEventListener('click', enviarRPM);
});
