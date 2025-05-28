const { Crypto, Currency, CryptoCurrency } = require('../models');

// Listar criptomonedas con filtro por moneda
const getAllCryptos = async (req, res) => {
  try {
    const { currency } = req.query;
    let where = {};
    
    if (currency) {
      where = { '$Currencies.code$': currency };
    }

    const cryptos = await Crypto.findAll({
      include: [{
        model: Currency,
        attributes: ['code', 'name'],
        through: { attributes: [] },
        where
      }]
    });
    
    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener criptomonedas' });
  }
};

// Crear criptomoneda con relación a moneda
const createCrypto = async (req, res) => {
  try {
    const { name, symbol, currencyId } = req.body;
    const crypto = await Crypto.create({ name, symbol });
    await CryptoCurrency.create({ cryptoId: crypto.id, currencyId });
    res.status(201).json(crypto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear criptomoneda' });
  }
};

module.exports = { getAllCryptos, createCrypto };