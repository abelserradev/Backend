const jwt = require('jsonwebtoken');

module.exports = (options = {}) => {
  return async (req, res, next) => {
    try {
      if (options.excludeMethods?.includes(req.method)) {
        return next();
      }
      
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'Acceso no autorizado' });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token inválido o expirado' });
    }
  };
};