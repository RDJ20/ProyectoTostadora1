const jwt = require('jsonwebtoken');

function validarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ error: 'No token provided', redirectToLogin: true });
  }

  const parts = authHeader.split(' ');

  if (!parts.length === 2) {
    return res.status(403).json({ error: 'Token error', redirectToLogin: true });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(403).json({ error: 'Token malformatted', redirectToLogin: true });
  }

  
  jwt.verify(token, 'UMG123', (err, decoded) => {
    if (err) {
      let errorMsg = 'Token invalid';
      if (err.name === 'TokenExpiredError') {
        errorMsg = 'Token expired';
      }

      return res.status(403).json({ error: errorMsg, redirectToLogin: true });
    }

    
    req.user = decoded;
    console.log("El siguiente usuario ingreso a la pagina Admin: ",decoded);
    
    if (decoded.role !== 2) {
      return res.status(403).json({ error: 'User is not an usuario', redirectToLogin: true });
    }

    next();
  });
}

module.exports = validarToken;