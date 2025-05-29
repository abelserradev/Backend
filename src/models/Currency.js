
module.exports = (sequelize, DataTypes) => {

  const Currency = sequelize.define('Currency', {
    code: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'currencies'
  });

  Currency.associate = (models) => {
    Currency.belongsToMany(models.Crypto, {
      through: models.CryptoCurrency, // Modelo, no nombre de tabla
      foreignKey: 'currencyId',       // Clave foránea en CryptoCurrencies
      otherKey: 'cryptoId',           // Clave foránea para Crypto
      as: 'Cryptos'
    });
  };

  return Currency;
};