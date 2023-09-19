const pool = require('../Conexion BD/conexion');

// Obtener todos los lotes ordenados por fecha (del más reciente al más antiguo)
exports.obtenerLotes = (req, res) => {
  pool.query(
    'SELECT * FROM LotesCafe ORDER BY fecha DESC',
    [],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          message: 'Error al obtener los lotes',
          error: error
        });
      }
      res.status(200).json(results);
    }
  );
};

// Crear un nuevo lote
exports.crearLote = (req, res) => {
  const { fecha, nombre_perfil, peso_inicial, peso_final, tiempo, temperatura, rpm } = req.body;

  pool.query(
    'INSERT INTO LotesCafe (fecha, nombre_perfil, peso_inicial, peso_final, tiempo, temperatura, rpm) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [fecha, nombre_perfil, peso_inicial, peso_final, tiempo, temperatura, rpm],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: 'Error al crear el lote',
          error: error
        });
      }
      res.status(201).json({
        message: 'Lote creado correctamente'
      });
    }
  );
};

// Eliminar un lote por ID
exports.eliminarLote = (req, res) => {
  const id = req.params.id;

  pool.query(
    'DELETE FROM LotesCafe WHERE id = ?',
    [id],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          message: 'Error al eliminar el lote',
          error: error
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: 'Lote no encontrado'
        });
      }
      res.status(200).json({
        message: 'Lote eliminado correctamente'
      });
    }
  );
};
