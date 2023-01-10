const User = require('../models/user');

let currUser;

exports.startRegistration = (req, res) => {
    res.render('register',{
        error: "",
        hasError : false
    });
};

exports.choosePassword = (req, res) => {
    res.render('register-password',{
        error: "",
        hasError : false
    });
};

exports.mainPage = (req, res) => {
    res.render('index',{
        error: "",
        hasError : false
    });
};


exports.addUserContact = (req, res) => {
    try {
        const user = new User(req.body.userEmail, req.body.firstName, req.body.lastName, '');
        currUser = user;
        user.addContactDetails();
        res.redirect('/users/register-password');
    } catch (err) {
        res.render('register', {
            hasError: true,
            error: err,
        });
    }
}

    exports.addUserPassword = (req, res) => {
        try {
            console.log(req.body.password, req.body.confirmPassword);
            currUser.matchPasswords(req.body.password, req.body.confirmPassword);
            currUser.password = req.body.password;
            console.log("All completed", currUser);
            res.render('index',{
                completed : true,
                message : "Congratulations ! You are now registered 🥳"
            });
        } catch (err) {
            res.render('register-password', {
                hasError : true,
                error: err,
            });
         }


};