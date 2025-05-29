// Debe tener este contenido:
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const { getAllCurrencies, createCurrency } = require('../controllers/currencyController');

// GET /moneda
router.get('/', verificarToken, getAllCurrencies);

// POST /moneda
router.post('/', verificarToken, createCurrency);

module.exports = router;