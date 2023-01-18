var express = require('express');
var router = express.Router();
const db = require('../models');
/* GET users listing. */

const registerController = require('../controllers/register');

router.get('/register', registerController.startRegistration);
router.get('/register-password', registerController.choosePassword);
router.get('/index', registerController.mainPage);

router.post('/add-contact', registerController.addUserContact);
router.post('/add-password', registerController.addUserPassword);

router.get('/DBtset', (req, res) => {
    return db.User.findAll()
        .then((contacts) => res.send(contacts))
        .catch((err) => {
            console.log('There was an error querying contacts', JSON.stringify(err))
            err.error = 1; // some error code for client side
            return res.send(err)
        });
});

module.exports = router;