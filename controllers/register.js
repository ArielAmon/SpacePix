const Cookies = require('cookies');
const db = require('../models'); //contain the Contact model, which is accessible via db.Contact
const keys = ['keyboard cat']

exports.startRegistration = (req, res) => {
    const cookies = new Cookies(req, res, {keys : keys});
    let email = cookies.get('email',{signed : true});
    let firstName = cookies.get('firsName',{signed : true});
    let lastName = cookies.get('lastName',{signed : true});
    if(!email || !firstName || !lastName){
        email = '';
        firstName = '';
        lastName = '';
    }
    res.render('register',{
        error: "",
        hasError : false,
        userEmail : email,
        userFirstName : firstName,
        userLastName : lastName
    });
};

exports.choosePassword = (req, res) => {
    const cookies = new Cookies(req, res, {keys : keys});
    let email = cookies.get('email',{signed : true});
    let firstName = cookies.get('firsName',{signed : true});
    let lastName = cookies.get('lastName',{signed : true});
    if(!email || !firstName || !lastName){
        res.redirect('/users/register');
    }else {
        res.render('register-password',{
            error: "",
            hasError : false
        });
    }

};


exports.addUserContact = (req, res) => {
    const cookies = new Cookies(req, res, {keys : keys});
    cookies.set('email',req.body.userEmail,{signed : true, maxage : 30000});
    cookies.set('firsName',req.body.firstName,{signed : true, maxage : 30000});
    cookies.set('lastName',req.body.lastName,{signed : true, maxage : 30000});

    db.User.findOne({ where: { email: req.body.userEmail } })
        .then((email) =>{
            console.log("in the email exist check",email);
            if (!email) {
                res.redirect('/users/register-password');
            } else {
                res.render('register', {
                    hasError: true,
                    error: "This is Email is already taken! try use another one",
                    userEmail : '',
                    userFirstName : '',
                    userLastName : ''
                });
            }
        }).catch((err) => {
        console.log('error creating a new user in DB');
        return res.status(400).send(err)
    });


}

exports.addUserPassword = (req, res) => {
    const cookies = new Cookies(req, res, {keys : keys});
    let email = cookies.get('email',{signed : true});
    let firstName = cookies.get('firsName',{signed : true});
    let lastName = cookies.get('lastName',{signed : true});
    if(!email || !firstName || !lastName){
        res.render('index',{
            completed : true,
            message : "Registration expired ! please start again !"
        });
    }else{
        const { password, confirmPassword} = req.body;
        if (password !== confirmPassword){
            res.render('register-password', {
                hasError : true,
                error: "Your passwords dont match!",
            });
            return;
        }
        db.User.create({ email:email, firstName:firstName, lastName:lastName, password:password})
            .then((contact) => {
                console.log(contact);
                res.render('index',{
                    completed : true,
                    message : "Congratulations ! You are now registered 🥳"
                });
            })
            .catch((err) => {
                console.log('error creating a new user in DB');
                return res.status(400).send(err)
            });
    }
};