const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const bcrypt = require('bcrypt'); 

const SECRET_KEY = 'UMG123'; 

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userService.authenticateUser(username, password);

    if (!user) {
      res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
      return;
    }

    const token = jwt.sign({ username: user.username, role: user.roleId }, SECRET_KEY, { expiresIn: '1h' });
    console.log(token)
    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login
};