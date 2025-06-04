const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Token de sistema para endpoints protegidos
const SYSTEM_TOKEN = jwt.sign(
  { system: true },
  process.env.JWT_SECRET,
  { expiresIn: '365d' }
);

const verifySystemToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ error: 'Token no provisto' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(403).json({ error: 'Formato de token inválido' });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(403).json({ error: 'Token mal formateado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(403).json({ error: 'Token inválido' });
  }
};

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    // 1. Validación básica de campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // 2. Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // 3. Crear usuario usando tu modelo
    const user = await User.create({ 
      email, 
      password: hashedPassword 
    });
    console.log(user);
    
    
    // 4. Respuesta exitosa
    res.status(201).json({ id: user.id, email: user.email });
    
  } catch (error) {
    // 5. Manejo específico de errores
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    
    console.error('Error en auth/register:', error);
    res.status(500).json({ error: 'Error en el servidor al registrar usuario' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Datos de login recibidos:", { email, password });

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("No se encontró usuario con email:", email);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    console.log("Resultado de la comparación de contraseña:", isValid);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respuesta exitosa con mensaje y token
    res.status(200).json({ 
      success: true,
      message: 'Inicio de sesión exitoso',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name 
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error en el servidor' 
    });
  }
};




// Exportar token del sistema para uso interno
module.exports = { 
  register, 
  login,
  SYSTEM_TOKEN,
  verifySystemToken
};