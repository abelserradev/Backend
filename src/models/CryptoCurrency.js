module.exports = (sequelize, DataTypes) => {
  const CryptoCurrency = sequelize.define('CryptoCurrency', {
    cryptoId: DataTypes.INTEGER,
    currencyId: DataTypes.INTEGER
  }, {});
  return CryptoCurrency;
};