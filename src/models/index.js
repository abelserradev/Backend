const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(require('../config/database').development);

// Importar funciones de modelo
const userModel = require('./User');
const currencyModel = require('./currency');
const cryptoModel = require('./Crypto');

// Crear instancias de modelo
const User = userModel(sequelize, DataTypes);
const Currency = currencyModel(sequelize, DataTypes);
const Crypto = cryptoModel(sequelize, DataTypes);

// Definir relaciones
Currency.belongsToMany(Crypto, { through: 'CryptoCurrencies' });
Crypto.belongsToMany(Currency, { through: 'CryptoCurrencies' });

module.exports = {
  User,
  Currency,
  Crypto,
  sequelize
};