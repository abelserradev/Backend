const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Importar las funciones de modelo
const defineUser = require('./user');
const defineCurrency = require('./currency');
const defineCrypto = require('./crypto');
const defineCryptoCurrency = require('./cryptoCurrency');

// Inicializar modelos llamando a las funciones con sequelize y DataTypes
const User = defineUser(sequelize, DataTypes);
const Currency = defineCurrency(sequelize, DataTypes);
const Crypto = defineCrypto(sequelize, DataTypes);
const CryptoCurrency = defineCryptoCurrency(sequelize, DataTypes);

// Definir relaciones
Currency.belongsToMany(Crypto, { 
  through: 'CryptoCurrencies',
  foreignKey: 'currencyId',
  otherKey: 'cryptoId'
});
Crypto.belongsToMany(Currency, { 
  through: 'CryptoCurrencies',
  foreignKey: 'cryptoId',
  otherKey: 'currencyId'
});

// Y luego otra vez:
Currency.belongsToMany(Crypto, { 
  through: CryptoCurrency,
  foreignKey: 'currencyId',
  otherKey: 'cryptoId'
});
Crypto.belongsToMany(Currency, { 
  through: CryptoCurrency,
  foreignKey: 'cryptoId',
  otherKey: 'currencyId'
});

// Sincronizar modelos
sequelize.sync({ alter: false, force: false })
  .then(() => console.log('✅ Modelos sincronizados (si corresponden al schema existente)'))
  .catch(err => console.error('❌ Error al sincronizar modelos:', err));

async function syncDatabase() {
  try {
    await sequelize.sync({ force: false });
    console.log('✅ Base de datos sincronizada');
  } catch (error) {
    console.error('❌ Error al sincronizar base de datos:', error);
  }
}

module.exports = {
  sequelize,
  User,
  Currency,
  Crypto,
  CryptoCurrency,
  syncDatabase
};