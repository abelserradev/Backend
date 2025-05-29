const { Currency } = require('../models');

const getAllCurrencies = async (req, res) => {
  try {
    const currencies = await Currency.findAll();
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener monedas' });
  }
};

const createCurrency = async (req, res) => {
  try {
    const { code, name } = req.body;
    const currency = await Currency.create({ code, name });
    res.status(201).json(currency);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear moneda' });
  }
};

module.exports = { getAllCurrencies, createCurrency };