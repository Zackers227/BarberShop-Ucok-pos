const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { auth, isOwner } = require('../middleware/auth');

router.post('/', auth, transactionController.create);
router.get('/', auth, transactionController.getAll);
router.get('/:id', auth, transactionController.getById);
router.post('/:id/void', auth, isOwner, transactionController.void);

module.exports = router;
