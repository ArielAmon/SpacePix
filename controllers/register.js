const User = require('../models/user');

exports.startRegistration = (req, res) => {
    res.render('register',{
        error: "",
        hasError : false
    });
};

exports.choosePassword = (req, res) => {
    res.render('register-password');
};

exports.addUserContact = (req, res) => {
    try {
        console.log("Hande the post and body is : ",req.body);
        const user = new User(req.body.userEmail, req.body.firstName, req.body.lastName, '');
        user.addContactDetails();
        res.redirect('/users/register-password');
    } catch (err) {
        res.render('register', {
            error: err,
            hasError : true,
            });
        // TO DO! we must handle the error here and generate a EJS page to display the error.
        console.log(err)
    }


};