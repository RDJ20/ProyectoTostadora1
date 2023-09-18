let tiempo = 40;
let dataset = [];
let temperaturaMax = 40;
let datae = [null, 5.44, 2.43, 5.49, 2.49, 5.34];
let backgroundChart = crearBackgroundChart(datae);
let nombreGraf, temperatura1, rpm, tiempo1;
let baseUrl = '';

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  baseUrl = 'http://raspberrypi.local:3000';
} else {
  baseUrl = 'http://raspberrypi.local:3000';
}

fetch(`${baseUrl}/api/perfiles`)
  .then(response => response.json())
  .then(data => {
    let ulElement = document.getElementById('menu').getElementsByTagName('ul')[0];
    ulElement.innerHTML = '';

    data.data.forEach(perfil => {
      let liElement = document.createElement('li');
      liElement.textContent = perfil.nombre;
      liElement.dataset.perfilId = perfil.id;

      liElement.addEventListener('click', function() {
        let perfilId = this.dataset.perfilId;

        fetch(`${baseUrl}/api/perfiles/${perfilId}`)
          .then(response => response.json())
          .then(perfilData => {
            datae = perfilData.data.datos;

            nombreGraf = perfilData.data.nombre
            document.getElementById('nombreGrafica').textContent = nombreGraf

            temperatura1 = perfilData.data.temperatura
            temperaturaMax = temperatura1;
            document.getElementById('Temperatura').textContent = temperatura1

            rpm = perfilData.data.rpm
            document.getElementById('RPM').textContent = rpm

            tiempo1 = perfilData.data.tiempo
            tiempo = tiempo1;
            document.getElementById('Tiempo').textContent = tiempo1

            if (backgroundChart) backgroundChart.destroy();
            backgroundChart = crearBackgroundChart(datae);
          })
          .catch(error => {
            console.error('Ocurrió un error al obtener el perfil:', error);
          });
      });

      ulElement.appendChild(liElement);
    });
  })
  .catch(error => {
    console.error('Ocurrió un error al obtener los perfiles:', error);
  });

  function crearBackgroundChart(dataset) {
    var ctxBackground = document.getElementById('backgroundChart').getContext('2d');
    var labels = [];
    
    var data = dataset;
    console.log(data);
   
  
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
        window.location.href = 'http://raspberrypi.local:3000/admin/admin.html';
      } else if (userRole === 2) {
        window.location.href = 'http://raspberrypi.local:3000/user/user.html';
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
