const { Currency, Crypto, CryptoCurrency, HistoricalCurrency, HistoricalCrypto, HistoricalCryptoCurrency } = require('../models');

const replicateHistoricalData = async () => {
  const transaction = await sequelize.transaction();
  
  try {
    // Replicar monedas
    const currencies = await Currency.findAll({ transaction });
    await HistoricalCurrency.bulkCreate(currencies.map(c => c.toJSON()), { transaction });
    
    // Replicar criptomonedas
    const cryptos = await Crypto.findAll({ transaction });
    await HistoricalCrypto.bulkCreate(cryptos.map(c => c.toJSON()), { transaction });
    
    // Replicar relaciones
    const relations = await CryptoCurrency.findAll({ transaction });
    await HistoricalCryptoCurrency.bulkCreate(relations.map(r => r.toJSON()), { transaction });
    
    // Eliminar datos originales
    await CryptoCurrency.destroy({ where: {}, transaction });
    await Crypto.destroy({ where: {}, transaction });
    await Currency.destroy({ where: {}, transaction });
    
    await transaction.commit();
    console.log('Replicación histórica completada');
  } catch (error) {
    await transaction.rollback();
    console.error('Error en replicación histórica:', error);
  }
};

// Programar ejecución diaria (usar node-cron en producción)
replicateHistoricalData();