require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { SYSTEM_TOKEN } = require('./controllers/authController');

// Middleware para mostrar el token del sistema
app.use((req, res, next) => {
  console.log('Token del sistema:', SYSTEM_TOKEN);
  next();
});

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const currencyRoutes = require('./routes/currencyRoutes');
const cryptoRoutes = require('./routes/cryptoRoutes');

// Usar rutas
app.use('/auth', authRoutes);
app.use('/currency', currencyRoutes);
app.use('/crypto', cryptoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Criptomonedas funcionando');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});