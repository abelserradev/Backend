'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HistoricalCryptoCurrency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HistoricalCryptoCurrency.init({
    cryptoId: DataTypes.INTEGER,
    currencyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'HistoricalCryptoCurrency',
  });
  return HistoricalCryptoCurrency;
};