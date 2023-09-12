const express = require('express');
const routes = require('./routes/routes');
const cors = require('cors');
const { exec } = require('child_process'); // Importar el módulo child_process

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log('Hola!');
  next();
});

app.use('/api', routes);
app.use(express.static('../Pagina Web/Login'));

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor iniciado en el puerto 3000');

  // Ejecutar el script de Python
  exec('python3 tu_archivo.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar el archivo Python: ${error}`);
      return;
    }
    console.log(`Salida del script Python: ${stdout}`);
    console.error(`Errores del script Python: ${stderr}`);
  });
});