const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const cryptoController = require('../controllers/cryptoController');

// Todas las rutas requieren autenticación JWT
router.use(authMiddleware);

// Endpoint: GET /crypto (con filtro opcional: ?currency=USD)
router.get('/', cryptoController.getAllCryptos);

// Endpoint: POST /crypto
router.post('/', cryptoController.createCrypto);

// Endpoint: PUT /crypto/:id
router.put('/:id', cryptoController.updateCrypto);

module.exports = router;