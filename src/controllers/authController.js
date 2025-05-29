const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Token de sistema para endpoints protegidos
const SYSTEM_TOKEN = jwt.sign(
  { system: true },
  process.env.JWT_SECRET,
  { expiresIn: '365d' }
);

const register = async (req, res) => {
  try {
    // Verificar si es una solicitud del sistema
    if (!req.user?.system) {
      return res.status(403).json({ error: 'Acceso prohibido' });
    }
    
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashedPassword });
    
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

const login = async (req, res) => {
  try {
    // Verificar si es una solicitud del sistema
    if (!req.user?.system) {
      return res.status(403).json({ error: 'Acceso prohibido' });
    }
    
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Exportar token del sistema para uso interno
module.exports = { 
  register, 
  login,
  SYSTEM_TOKEN
};