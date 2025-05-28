require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const app = express();

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

// Probar conexión a la base de datos al iniciar
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    
    // Sincronizar modelos con la base de datos
    return sequelize.sync({ alter: true }); // Usa { force: true } solo en desarrollo para recrear tablas
  })
  .then(() => {
    console.log('📊 Modelos sincronizados con la base de datos');
    
    // Iniciar servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('❌ Error al conectar con PostgreSQL:', error.message);
  });