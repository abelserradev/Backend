const authRoutes = require('./routes/authRoutes');
const currencyRoutes = require('./routes/currencyRoutes');
const cryptoRoutes = require('./routes/cryptoRoutes');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { SYSTEM_TOKEN } = require('./controllers/authController');

// Middleware para parsear JSON
app.use(express.json());

// Usar rutas
app.use('/auth', authRoutes);
app.use('/moneda', currencyRoutes);
app.use('/', cryptoRoutes);

// Middleware para mostrar el token del sistema en cada solicitud
app.use((req, res, next) => {
  console.log('Token del sistema:', SYSTEM_TOKEN);
  next();
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Criptomonedas funcionando');
});

// Cargar modelos DESPUÉS de configurar dotenv
const { sequelize } = require('./models');

// Probar conexión y sincronizar
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a PostgreSQL establecida');
    return sequelize.sync({ force: false });
  })
  .then(() => console.log('✅ Modelos sincronizados'))
  .catch(err => console.error('❌ Error de base de datos:', err));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});