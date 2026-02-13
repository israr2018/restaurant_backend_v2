const express = require('express');
const router = express.Router();
const  {login,getAllUser} =require('../controllers/authController');

router.post('/', login);
router.get('/users', getAllUser);
module.exports = router;
