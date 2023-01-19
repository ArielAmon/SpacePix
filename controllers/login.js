const Cookies = require('cookies');
const db = require('../models'); //contain the Contact model, which is accessible via db.Contact
const keys = ['keyboard cat']

exports.mainPage = (req, res) => {
    res.render('index',{
        error: "",
        completed : false
    });
};

exports.userLogin = (req, res) => {
    const { userEmail, userPassword } = req.body;
    try {
        db.User.findOne({ where: { email: userEmail, password: userPassword} })
            .then((data) =>{
                console.log()
                if (data) {
                    req.session.userName = `${data.firstName} ${data.lastName}`;
                    req.session.isConnected = true;
                    res.redirect('/home');
                } else {
                    res.render('index',{
                        message: "User dosent exsit",
                        completed : true
                    });
                }
            }).catch((err) => {
            console.log('error login', err);
            return res.status(400).send(err)
        });
    }
    catch (err){

    }

};
