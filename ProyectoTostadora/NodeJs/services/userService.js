const connection = require('../Conexion BD/conexion');

const authenticateUser = (username, password) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
};

module.exports = {
  authenticateUser
};