'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CryptoCurrency extends Model {
    static associate(models) {
      // Definir asociaciones
      CryptoCurrency.belongsTo(models.Crypto, {
        foreignKey: 'cryptoId',
        as: 'crypto'
      });
      CryptoCurrency.belongsTo(models.Currency, {
        foreignKey: 'currencyId',
        as: 'currency'
      });
    }
  }
  
 CryptoCurrency.init({
  cryptoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  currencyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'CryptoCurrency',
  tableName: 'CryptoCurrencies',
  freezeTableName: true,
  timestamps: true,
  underscored: false // ¡IMPORTANTE! Desactiva snake_case
});
  
  return CryptoCurrency;
};