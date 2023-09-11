const pool = require('../Conexion BD/conexion'); 

exports.comenzar = (req, res) => {

  new Promise((resolve, reject) => {
    pool.query(
      'UPDATE comenzar SET estado = 1 WHERE id = 1;',
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
      message: 'Comando insertado correctamente',
      data: result
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Error al insertar comando',
      error: error
    });
  });
};





exports.getComenzar = (req, res) => {
    new Promise((resolve, reject) => {
      pool.query(
        'SELECT * FROM comenzar',
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
        message: 'Datos recuperados correctamente',
        data: result
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error al recuperar datos',
        error: error
      });
    });
  };




  
  
  exports.resetComenzar = (req, res) => {
    new Promise((resolve, reject) => {
      pool.query(
        'UPDATE comenzar SET estado = 2 WHERE id = 1;',
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
        message: 'Tabla reiniciada correctamente',
        data: result
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error al reiniciar tabla',
        error: error
      });
    });
  };
  