const express = require('express');
const userController = require('../controllers/users');

const router = express.Router();

router.get('/', userController.getUser); 

router.post('/signup', userController.createUser);

router.post('/login', userController.loginUser);

module.exports = router;