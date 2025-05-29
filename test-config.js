
const config = require('./src/config/database');
console.log('Configuración de base de datos:', config.development);
console.log('Tipo de dialect:', typeof config.development.dialect);