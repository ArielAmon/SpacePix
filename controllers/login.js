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
    db.User.findOne({ where: { email: userEmail, password: userPassword} })
        .then((data) =>{
            if (data) {
                req.session.userName = `${data.firstName} ${data.lastName}`;
                req.session.isConnected = true;
                res.redirect('/home');
            } else {
                res.render('index',{
                    message: "Sorry, User doesn't exist",
                    completed : false,
                    hasError : true
                });
            }
        }).catch((err) => {
        // console.log('error login', err);
        // return res.status(400).send(err)
        res.render('index',{
            message: err,
            completed : false,
            hasError : true
        });
    });
};
