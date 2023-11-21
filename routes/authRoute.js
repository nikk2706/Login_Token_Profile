const express = require('express');
const authController = require('../controllers/authController');
const {auth_Token} = require('../middleware/authToken');
const hashPasswordMiddleware = require('../middleware/Hashpassword');
const router = express.Router();

router.post('/register', hashPasswordMiddleware, authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/usersdata', authController.getUsersData);
router.get('/profile/:id', auth_Token, authController.getprofile);

module.exports = router;
