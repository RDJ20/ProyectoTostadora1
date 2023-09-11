require('dotenv').config({ path: __dirname + '/../.env' });
const mysql = require('mysql2');

const connection = mysql.createConnection({
  // host: '127.0.0.1',
  // user: 'root',
  // password: 'pi',
  // database: 'prueba'

  host: 'raspberrypi.local',
  user: 'rafae',
  password: 'pi',
  database: 'prueba'
});





connection.connect((err) => {
  if (err) {
    console.error('Error al conectarse a la base de datos:', err);
    process.exit(1); 
  }
});

module.exports = connection;