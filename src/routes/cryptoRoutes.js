const express = require('express');
const router = express.Router();
const { 
  getAllCryptos, 
  createCrypto, 
  updateCrypto 
} = require('../controllers/cryptoController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Rutas para criptomonedas
router.get('/criptomonedas', verificarToken, getAllCryptos);
router.post('/criptomonedas', verificarToken, createCrypto);
router.put('/criptomonedas/:id', verificarToken, updateCrypto);

module.exports = router;