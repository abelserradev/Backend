module.exports = (sequelize, DataTypes) => {
  const Crypto = sequelize.define('Crypto', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    symbol: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 10]
      }
    }
  }, {
    tableName: 'Cryptos', // Mantiene el nombre exacto de la tabla
    timestamps: true
  });

  Crypto.associate = (models) => {
    // Corrección importante: usa el MODELO CryptoCurrency, no el nombre de la tabla
    Crypto.belongsToMany(models.Currency, {
      through: models.CryptoCurrency, // Referencia al modelo, no al nombre de tabla
      foreignKey: 'cryptoId',         // Clave foránea en CryptoCurrencies
      otherKey: 'currencyId',         // Clave foránea para Currency
      as: 'Currencies'
    });
  };

  return Crypto;
};