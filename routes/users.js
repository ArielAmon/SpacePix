var express = require('express');
var router = express.Router();

/* GET users listing. */

const registerController = require('../controllers/register');

router.get('/register', registerController.startRegistration);
router.get('/register-password', registerController.choosePassword);
router.get('/index', registerController.mainPage);

router.post('/add-contact', registerController.addUserContact);
router.post('/add-password', registerController.addUserPassword);

module.exports = router;
