import { iniciarGrafica } from './grafica.js';
import { tiempo, actualizarTiempo } from './grafica.js';

let intervalo = null; // Variable para almacenar el intervalo de tiempo

// Detecta si estás en la Raspberry Pi o en un entorno local
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Define la URL base según el entorno
const baseUrl = isLocal ? 'http://localhost:3000' : 'http://raspberrypi.local:3000';

function actualizarTemperatura() {
  const token = localStorage.getItem('jwtToken');

  if (intervalo) {
    // Si el intervalo de tiempo ya está en ejecución, lo detenemos
    clearInterval(intervalo);
    intervalo = null;

    fetch(`${baseUrl}/api/comenzar/reset`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        console.log('Comenzar enviado correctamente');
      })
      .catch(error => console.error('Error:', error));
  } else {
    // Si no, iniciamos un nuevo intervalo de tiempo

    fetch(`${baseUrl}/api/comenzar`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
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
        },
      })
        .then(response => response.json())
        .then(data => {
          // Imprimimos los datos que estamos recibiendo para ver su estructura
          console.log(data);

          // Luego, intentamos acceder a la propiedad
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
    velocidad = 4000; // Valor fijo si el botón ya fue presionado
  } else {
    velocidad = parseFloat(rpmElement.textContent);
  }

  if (isNaN(velocidad)) {
    console.log('La velocidad introducida no es un número válido');
    return;
  }

  // Añade la propiedad 'comenzar'
  const data = { comenzar: !yaPresionado, velocidad: velocidad };
  const token = localStorage.getItem('jwtToken');
  fetch(`${baseUrl}/api/motor`, {
    method: 'POST',
    headers: { 
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      console.log('Datos enviados correctamente');
    })
    .catch(error => console.error('Error:', error));

  yaPresionado = !yaPresionado; // Cambia el estado de la variable
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

  fetch(`${baseUrl}/api/admin`, {
    method: 'GET', 
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  })
  .then(response => {
    if(response.status === 403) {
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

 

  document.getElementById('BotonCerrarSesion').addEventListener('click', cerrarSesion);
  document.getElementById('botonTemperatura').addEventListener('click', actualizarTemperatura);
  document.getElementById('botonComenzarRPM').addEventListener('click', enviarRPM); 

  function preparar (){
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
});
