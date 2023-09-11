const pool = require('../Conexion BD/conexion');

exports.obtenerDatos = (req, res) => {
  new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM ProcessControl',
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
      message: 'Datos obtenidos correctamente',
      data: result
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Error al obtener datos',
      error: error
    });
  });
};


exports.reiniciarDatos = (req, res) => {
  new Promise((resolve, reject) => {
    pool.query(
      'UPDATE ProcessControl SET comenzar = false, velocidad = 4000 WHERE id = 1',
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
      message: 'Datos reiniciados correctamente',
      data: result
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Error al reiniciar datos',
      error: error
    });
  });
};





exports.insertarDatosMotor = (req, res) => {
  const { comenzar, velocidad } = req.body;

  new Promise((resolve, reject) => {
    pool.query(
      'UPDATE ProcessControl SET comenzar = ?, velocidad = ? WHERE id = 1',
      [comenzar, velocidad],
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
      message: 'Datos actualizados correctamente',
      data: result
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Error al actualizar datos',
      error: error
    });
  });
};