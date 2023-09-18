const express = require('express');
const router = express.Router();
const controllerUser = require('../controllers/user');
const mValidarTokenAdmin = require('../middlewares/validarTokenAdmin');
const mValidarTokenUser = require('../middlewares/validarTokenUsuario');
const controllerDatos = require('../controllers/datos');
const controllerComenzar = require('../controllers/comenzar');
const controllerMotor = require('../controllers/motor'); 
const controllerPerfiles = require('../controllers/perfiles'); 
const users = require("../controllers/users");

router.post('/login', controllerUser.login);

router.post('/datos',          controllerDatos.insertarDatos);
router.get('/datos',           controllerDatos.obtenerDatos);
router.get('/datosI',          controllerDatos.obtenerDatosI);
router.post('/comenzar',       controllerComenzar.comenzar);
router.get('/comenzar',        controllerComenzar.getComenzar);
router.post('/comenzar/reset', controllerComenzar.resetComenzar);
router.post('/datos/reset',    controllerDatos.eliminarDatos);


router.get('/motor',           controllerMotor.obtenerDatos);      
router.post('/motor',          controllerMotor.insertarDatosMotor);
router.delete('/motor/reiniciar', controllerMotor.reiniciarDatos);   


router.get('/perfiles',        controllerPerfiles.obtenerNombresPerfiles);
router.get('/perfiles/:id',    controllerPerfiles.obtenerPerfil);
router.delete('/perfiles/:id', controllerPerfiles.eliminarPerfil);
router.post('/perfiles', controllerPerfiles.insertarPerfil);

router.post('/createUser', users.crearUsuario);



router.get('/admin', mValidarTokenAdmin, (req, res) => {
    res.status(200).json({ message: 'Token válido' });
  });

router.get('/user', mValidarTokenUser, (req, res) => {
    res.status(200).json({ message: 'Token válido' });
  });




module.exports = router;