const { Currency } = require('../models');

const getAllCurrencies = async (req, res) => {
  try {
    console.log('Ejecutando getAllCurrencies'); // Agrega este log
    const currencies = await Currency.findAll();
    res.json(currencies);
  } catch (error) {
    console.error('Error en getAllCurrencies:', error);
    res.status(500).json({ error: 'Error al obtener monedas' });
  }
};

const createCurrency = async (req, res) => {
  try {
    const { code, name } = req.body;
    
    if (!code || !name) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Verificar si el código ya existe
    const existingCurrency = await Currency.findOne({ where: { code } });
    if (existingCurrency) {
      return res.status(409).json({ 
        error: `El código '${code}' ya está registrado`,
        suggestion: 'Utilice otro código o actualice el registro existente'
      });
    }

    const currency = await Currency.create({ code, name });
    res.status(201).json(currency);
  } catch (error) {
    console.error('Error en createCurrency:', error);
    
    // Manejar específicamente el error de unicidad
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ 
        error: 'El código de moneda debe ser único',
        details: error.parent?.detail || error.message
      });
    }
    
    res.status(500).json({ error: 'Error al crear moneda' });
  }
};

module.exports = {
  getAllCurrencies,
  createCurrency
};