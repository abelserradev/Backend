const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const currencyController = require('../controllers/currencyController');

// Todas las rutas requieren autenticación JWT
router.use(authMiddleware);

// Endpoint: GET /currency
router.get('/', currencyController.getAllCurrencies);

// Endpoint: POST /currency
router.post('/', currencyController.createCurrency);

module.exports = router;