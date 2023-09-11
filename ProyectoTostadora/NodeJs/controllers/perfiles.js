const pool = require('../Conexion BD/conexion'); 

// Extraer el nombre de todos los perfiles
exports.obtenerNombresPerfiles = (req, res) => {
  new Promise((resolve, reject) => {
    pool.query(
      'SELECT id, nombre FROM perfiles',
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  })
  .then(result => {
    res.status(200).json({
      message: 'Nombres de perfiles recuperados correctamente',
      data: result
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Error al recuperar los nombres de los perfiles',
      error: error
    });
  });
};

// Obtener el nombre, la temperatura, el tiempo, los datos y el RPM de un perfil específico
exports.obtenerPerfil = (req, res) => {
  const id = req.params.id;

  new Promise((resolve, reject) => {
    pool.query(
      'SELECT nombre, temperatura, tiempo, datos, rpm FROM perfiles WHERE id = ?',
      [id],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  })
  .then(result => {
    res.status(200).json({
      message: 'Perfil recuperado correctamente',
      data: result[0]
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Error al recuperar el perfil',
      error: error
    });
  });
};

// Eliminar un perfil
exports.eliminarPerfil = (req, res) => {
  const id = req.params.id;

  new Promise((resolve, reject) => {
    pool.query(
      'DELETE FROM perfiles WHERE id = ?',
      [id],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  })
  .then(result => {
    res.status(200).json({
      message: 'Perfil eliminado correctamente',
      data: result
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Error al eliminar el perfil',
      error: error
    });
  });
};


exports.insertarPerfil = (req, res) => {
    const { nombre, temperatura, tiempo, datos, RPM } = req.body;
  
    new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO perfiles (nombre, temperatura, tiempo, datos, rpm) VALUES (?, ?, ?, ?, ?)',
        [nombre, temperatura, tiempo, JSON.stringify(datos), RPM],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    })
    .then(result => {
      res.status(201).json({
        message: 'Perfil insertado correctamente',
        data: result
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error al insertar perfil',
        error: error
      });
    });
  };