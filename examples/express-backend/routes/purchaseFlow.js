const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { route } = require('./auth');

router.post('/purchase-item', verifyToken, purchaseController.purchaseItem);

module.exports = router;
