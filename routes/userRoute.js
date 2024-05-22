const express = require('express');
const { showUsers, aUser, update, deleteUser, profile } = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();


router.get('/all', showUsers);
router.get('/profile',isAuthenticated, profile);
router.get('/show/:id', aUser);
router.put('/edit/:id', update);
router.delete('/delete/:id', deleteUser)


module.exports= router;

