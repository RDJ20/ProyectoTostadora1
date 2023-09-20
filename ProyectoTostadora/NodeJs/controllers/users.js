const pool = require('../Conexion BD/conexion');
const bcrypt = require('bcrypt');

// Crear un nuevo usuario
exports.crearUsuario = (req, res) => {
  const { username, password, roleId } = req.body;

  // Verificar si el nombre de usuario ya existe en la base de datos
  pool.query(
    'SELECT username FROM users WHERE username = ?',
    [username],
    (error, resultsUsername) => {
      if (error) {
        return res.status(500).json({
          message: 'Error al verificar el nombre de usuario',
          error: error
        });
      }

      if (resultsUsername.length > 0) {
        // El nombre de usuario ya existe en la base de datos, devuelve un error
        return res.status(400).json({
          message: 'El nombre de usuario ya existe en la base de datos'
        });
      } else {
        // Nombre de usuario no existe, proceder a crear el usuario
        // Encriptar la contraseña antes de almacenarla
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              message: 'Error al encriptar la contraseña',
              error: err
            });
          }

          // Almacenar el nuevo usuario en la base de datos
          pool.query(
            'INSERT INTO users (username, password, roleId) VALUES (?, ?, ?)',
            [username, hash, roleId],
            (error, result) => {
              if (error) {
                return res.status(500).json({
                  message: 'Error al crear el usuario',
                  error: error
                });
              }

              res.status(201).json({
                message: 'Usuario creado correctamente'
              });
            }
          );
        });
      }
    }
  );
};



exports.getUsuarios = (req, res) => {
  pool.query(
    'SELECT * FROM users',
    [],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          message: 'Error al obtener los usuarios',
          error: error
        });
      }

      res.status(200).json({
        message: 'Usuarios obtenidos correctamente',
        data: results
      });
    }
  );
};