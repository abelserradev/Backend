const { sequelize, Currency, Crypto, CryptoCurrency } = require('../models');


const getAllCryptos = async (req, res) => {
  try {
    const { currency } = req.query;
    
    // Configurar filtro si se especifica moneda
    const currencyFilter = currency ? { '$Currencies.code$': currency } : {};
    
    const cryptos = await Crypto.findAll({
      include: [{
        model: Currency,
        as: 'Currencies',
        attributes: ['id', 'code', 'name'],
        through: {
          attributes: ['price'] 
        },
        where: currencyFilter
      }]
    });
    
    res.json(cryptos);
  } catch (error) {
    console.error('Error en getAllCryptos:', error);
    res.status(500).json({ error: 'Error al obtener criptomonedas' });
  }
};

const createCrypto = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, symbol, currencyId, price } = req.body;

    // Validación mejorada con normalización
    const normalizedSymbol = symbol.trim().toUpperCase();
    if (!name || !normalizedSymbol || !currencyId || !price) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: name, symbol, currencyId, price' 
      });
    }

    // Verificar moneda - más eficiente
    const currencyExists = await Currency.count({
      where: { id: currencyId },
      transaction
    });
    
    if (!currencyExists) {
      await transaction.rollback();
      return res.status(404).json({ 
        error: `Moneda con ID ${currencyId} no encontrada`,
        suggestion: 'Primero crea la moneda usando POST /moneda'
      });
    }

    // Búsqueda case-insensitive para evitar duplicados
    const existingCrypto = await Crypto.findOne({ 
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('symbol')),
        normalizedSymbol.toLowerCase()
      ),
      transaction
    });
    
    if (existingCrypto) {
      await transaction.rollback();
      return res.status(409).json({ 
        error: `El símbolo '${symbol}' ya está en uso`,
        existingId: existingCrypto.id
      });
    }

    // Crear criptomoneda con símbolo normalizado
    const crypto = await Crypto.create({ 
      name, 
      symbol: normalizedSymbol 
    }, { transaction });
    
    // Crear relación con precio usando el método directo
    await crypto.addCurrency(currencyId, {
      through: { price },
      transaction
    });
    
    // Commit y obtener respuesta sin nueva consulta
    await transaction.commit();
    
    // Respuesta optimizada
    res.status(201).json({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      createdAt: crypto.createdAt,
      updatedAt: crypto.updatedAt,
      Currencies: [{
        id: currencyId,
        CryptoCurrency: { price }
      }]
    });
    
  } catch (error) {
    await transaction.rollback();
    console.error('Error en createCrypto:', error);
    
    // Manejo específico de errores de Sequelize
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ 
        error: 'El símbolo ya existe',
        details: error.errors.map(e => e.message)
      });
    }
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        error: 'Error de referencia: La moneda especificada no existe',
        details: error.parent?.detail 
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno al crear criptomoneda',
      details: error.message 
    });
  }
};

const updateCrypto = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { name, symbol, currencyId, price } = req.body;
    
    const crypto = await Crypto.findByPk(id, { transaction });
    if (!crypto) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Criptomoneda no encontrada' });
    }
    
    // Actualizar con normalización
    const updateData = {};
    if (name) updateData.name = name;
    if (symbol) updateData.symbol = symbol.trim().toUpperCase();
    
    await crypto.update(updateData, { transaction });
    
    // Actualizar precio si se proporciona
    if (price && currencyId) {
      await CryptoCurrency.update(
        { price },
        {
          where: { cryptoId: id, currencyId },
          transaction
        }
      );
    }
    
    await transaction.commit();
    
    // Obtener datos actualizados
    const updatedCrypto = await Crypto.findByPk(id, {
      include: [{
        model: Currency,
        as: 'Currencies',
        through: { attributes: ['price'] }
      }]
    });
    
    res.json(updatedCrypto);
  } catch (error) {
    await transaction.rollback();
    console.error('Error en updateCrypto:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ 
        error: 'El nuevo símbolo ya está en uso'
      });
    }
    
    res.status(500).json({ error: 'Error al actualizar criptomoneda' });
  }
};

module.exports = { getAllCryptos, createCrypto, updateCrypto };