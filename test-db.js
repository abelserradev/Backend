const { sequelize } = require('./src/models');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Obtener información de la base de datos
    const [dbInfo] = await sequelize.query('SELECT current_database(), current_user, version()');
    console.log('📊 Información de la base de datos:');
    console.log(dbInfo[0]);
    
    // Verificar tablas existentes - CONSULTA ACTUALIZADA
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    `);
    
    console.log('📋 Tablas existentes:');
    if (tables && tables.length > 0) {
      console.log(tables.map(t => t.table_name));
    } else {
      console.log('No hay tablas en la base de datos.');
    }
  } catch (error) {
    console.error('❌ Error al conectar con PostgreSQL:', error.message);
  } finally {
    // Cerrar la conexión solo al final
    await sequelize.close();
    console.log('🔒 Conexión cerrada');
  }
}

testConnection();