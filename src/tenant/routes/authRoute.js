const express = require('express');
const router = express.Router();
const  tenantLogin =require('src/tenant/controllers/auth.controller');

router.post('/tennat/auth', tenantLogin);
// router.get('/tenanat/users', getAllUser);
module.exports = router;
