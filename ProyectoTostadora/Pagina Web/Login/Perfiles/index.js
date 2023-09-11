let tiempo = 40;
let temperaturaMax = 40;
var datae = [null, 5.44, 2.43, 5.49, 2.49, 5.34];
let backgroundChart = crearBackgroundChart(datae);
let nombreGraf, temperatura1, rpm, tiempo1;

fetch('http://localhost:3000/api/perfiles')
  .then(response => response.json())
  .then(data => {
    let ulElement = document.getElementById('menu').getElementsByTagName('ul')[0];
    ulElement.innerHTML = '';

    data.data.forEach(perfil => {
      let liElement = document.createElement('li');
      liElement.textContent = perfil.nombre;

      // Guarda el ID del perfil como un atributo de datos en el elemento li
      liElement.dataset.perfilId = perfil.id;

      // Agrega un evento de clic al elemento li
      liElement.addEventListener('click', function() {
        let perfilId = this.dataset.perfilId;

        // Haces una nueva solicitud a la ruta específica de perfil usando el ID obtenido
        fetch(`http://localhost:3000/api/perfiles/${perfilId}`)
          .then(response => response.json())
          .then(perfilData => {
            console.log('Datos del perfil:', perfilData);
            datae = perfilData.data.datos;
            console.log(datae);
            // Destruye las gráficas actuales
            

            nombreGraf = perfilData.data.nombre
            document.getElementById('nombreGrafica').textContent = nombreGraf

            temperatura1 = perfilData.data.temperatura
            temperaturaMax = temperatura1;
            document.getElementById('Temperatura').textContent = temperatura1

            rpm = perfilData.data.rpm
            document.getElementById('RPM').textContent = rpm

            tiempo1 = perfilData.data.tiempo
            tiempo =  tiempo1;
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



  function crearBackgroundChart(datae) {
    var ctxBackground = document.getElementById('backgroundChart').getContext('2d');
    var labels = [];
    var data = datae;
  
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
            
          },
          y: {
            beginAtZero: true,
            max: temperaturaMax,
            
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
        console.log('Variables ingresadas');
  
        if (userRole === 1 ) {
          window.location.href = '../admin/admin.html';
        } else if (userRole === 2 ) {
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
