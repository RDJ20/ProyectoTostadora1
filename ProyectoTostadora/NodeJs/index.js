const express = require('express');
const routes = require('./routes/routes'); 
const app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors());

app.use((req, res, next) => {
  console.log('Hola!');
  next();
});

app.use('/api', routes); 




app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});