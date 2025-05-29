const { Crypto, Currency } = require('../models');

const getAllCryptos = async (req, res) => {
  try {
    const { currency } = req.query;
    const where = currency ? { '$Currencies.code$': currency } : {};
    
    const cryptos = await Crypto.findAll({
      include: [{
        model: Currency,
        attributes: ['id', 'code', 'name'],
        through: { attributes: [] },
        where
      }]
    });
    
    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener criptomonedas' });
  }
};

const createCrypto = async (req, res) => {
  try {
    const { name, symbol } = req.body;
    const crypto = await Crypto.create({ name, symbol });
    res.status(201).json(crypto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear criptomoneda' });
  }
};

const updateCrypto = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, symbol } = req.body;
    
    const crypto = await Crypto.findByPk(id);
    if (!crypto) {
      return res.status(404).json({ error: 'Criptomoneda no encontrada' });
    }
    
    await crypto.update({ name, symbol });
    res.json(crypto);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar criptomoneda' });
  }
};

module.exports = { getAllCryptos, createCrypto, updateCrypto };