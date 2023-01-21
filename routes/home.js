var express = require('express');
var router = express.Router();
const db = require('../models');

const homeController = require("../controllers/home");

router.get('/', homeController.homePage);

router.get('/logout', homeController.userLogout);



module.exports = router;