const db = require('../models'); //contain the Contact model, which is accessible via db.Contact

exports.mainPage = (req, res) => {
    res.render('index',{
        message: "",
        completed : false,
        hasError : false
    });
};

exports.userLogin = (req, res) => {
    const { userEmail, userPassword } = req.body;
    db.User.findOne({ where: { email: userEmail.toLowerCase()} })
        .then(async function (user) {
            if(!user){
                res.render('index',{
                    message: "Sorry, User doesn't exist",
                    completed : false,
                    hasError : true
                });
            }
            else if(!await user.validPassword(userPassword)){
                res.render('index',{
                    message: "Wrong password! try again",
                    completed : false,
                    hasError : true
                });
            }
            else{
                req.session.userID = user.id;
                req.session.userName = `${user.firstName} ${user.lastName}`;
                req.session.isConnected = true;
                res.redirect('/home');
            }
        }).catch((err) => {
        res.render('index',{
            message: err.message,
            completed : false,
            hasError : true
        });
    });
};
