const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');

router.post('/', auth, isAdmin, userController.createUser);
router.get('/', auth, isAdmin, userController.getAllUsers);
router.get('/employees', auth, userController.getEmployees);
router.put('/:id', auth, isAdmin, userController.updateUser);
router.delete('/:id', auth, isAdmin, userController.deleteUser);

module.exports = router;
