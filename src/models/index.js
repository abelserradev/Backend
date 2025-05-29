const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Importar las funciones de modelo
const defineUser = require('./user');
const defineCurrency = require('./currency');
const defineCrypto = require('./crypto');

// Inicializar modelos llamando a las funciones con sequelize y DataTypes
const User = defineUser(sequelize, DataTypes);
const Currency = defineCurrency(sequelize, DataTypes);
const Crypto = defineCrypto(sequelize, DataTypes);

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

// Sincronizar modelos
sequelize.sync({ force: false })
  .then(() => console.log('✅ Modelos sincronizados con la base de datos'))
  .catch(err => console.error('❌ Error al sincronizar modelos:', err));

module.exports = {
  User,
  Currency,
  Crypto,
  sequelize
};