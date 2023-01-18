const db = require('../models'); //contain the Contact model, which is accessible via db.Contact

exports.homePage = (req, res) => {
    res.render('home');
};