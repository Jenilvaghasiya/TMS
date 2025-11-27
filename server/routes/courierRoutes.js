const express = require('express');
const router = express.Router();
const courierController = require('../controllers/courierController');
const { auth } = require('../middleware/auth');

router.post('/', auth, courierController.createCourier);
router.get('/', auth, courierController.getAllCouriers);
router.put('/:id', auth, courierController.updateCourier);
router.delete('/:id', auth, courierController.deleteCourier);

module.exports = router;
