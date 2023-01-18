const db = require('../models'); //contain the Contact model, which is accessible via db.Contact

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
                if (data) {
                    // use session to save name
                    res.redirect('/home');
                } else {
                    res.render('index',{
                        message: "User dosent exsit",
                        completed : true
                    });
                }
            }).catch((err) => {
            console.log('error creating a new user in DB');
            return res.status(400).send(err)
        });
    }
    catch (err){

    }

};
