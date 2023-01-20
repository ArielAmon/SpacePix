var express = require('express');
var router = express.Router();
const db = require('../models');

const loginController = require("../controllers/login");

router.get('/', loginController.mainPage);
router.post('/user-login', loginController.userLogin);

module.exports = router;
