const connection = require('../Conexion BD/conexion');
const bcrypt = require('bcrypt');

const authenticateUser = (username, password) => {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT * FROM users WHERE username = ?',
      [username],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length === 0) {
          resolve(null);
        } else {
          const user = results[0];
          // Verificar la contraseña utilizando bcrypt
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              reject(err);
            } else if (isMatch) {
              resolve(user);
            } else {
              resolve(null); // Contraseña incorrecta
            }
          });
        }
      }
    );
  });
};

module.exports = {
  authenticateUser
};
