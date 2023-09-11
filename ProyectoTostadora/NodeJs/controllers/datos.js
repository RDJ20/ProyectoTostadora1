const pool = require('../Conexion BD/conexion'); 

exports.insertarDatos = (req, res) => {
  const { temperatura_aire, temperatura_cafe } = req.body;

  new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO Temperaturas (temperatura_aire, temperatura_cafe) VALUES (?, ?)',
      [temperatura_aire, temperatura_cafe],
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
      message: 'Datos insertados correctamente',
      data: result
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Error al insertar datos',
      error: error
    });
  });
};





exports.obtenerDatos = (req, res) => {
    new Promise((resolve, reject) => {
      pool.query(
        'SELECT temperatura_aire, temperatura_cafe FROM Temperaturas',
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
  }


  exports.obtenerDatosI = (req, res) => {
    new Promise((resolve, reject) => {
      pool.query(
        'SELECT temperatura_aire, temperatura_cafe FROM Temperaturas ORDER BY id DESC LIMIT 1',
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
      console.log(result[0].temperatura_cafe); 
      res.status(200).json({
       
          "temperatura_cafe": result[0].temperatura_cafe 
        
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error al recuperar datos',
        error: error
      });
    });
  }




  exports.eliminarDatos = (req, res) => {
    new Promise((resolve, reject) => {
      pool.query(
        'DELETE FROM Temperaturas',
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
        message: 'Datos eliminados correctamente',
        data: result
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Error al eliminar datos',
        error: error
      });
    });
  };