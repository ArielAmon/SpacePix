var express = require('express');
var router = express.Router();

/* GET users listing. */

const registerController = require('../controllers/register');

router.get('/register', registerController.startRegistration);
router.get('/register-password', registerController.choosePassword);


router.post('/add-contact', registerController.addUserContact);



module.exports = router;
