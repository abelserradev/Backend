const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllCryptos, createCrypto } = require('../controllers/cryptoController');

router.use(authMiddleware);

router.get('/', getAllCryptos);
router.post('/', createCrypto);

module.exports = router;