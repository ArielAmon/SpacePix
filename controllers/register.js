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

exports.mainPage = (req, res) => {
    res.render('index',{
        error: "",
        hasError : false
    });
};


exports.addUserContact = (req, res) => {
    const cookies = new Cookies(req, res, {keys : keys});
    cookies.set('email',req.body.userEmail,{signed : true, maxage : 30000});
    cookies.set('firsName',req.body.firstName,{signed : true, maxage : 30000});
    cookies.set('lastName',req.body.lastName,{signed : true, maxage : 30000});
    try {
        const { userEmail, firstName, lastName} = req.body;
        const answer = db.User.create({ email:userEmail, firstName:firstName, lastName:lastName, password:""})
            .then((contact) => {
                console.log(contact.id);
            })
            .catch((err) => {
                console.log('*** error creating a contact', JSON.stringify(contact))
                return res.status(400).send(err)
            });


        res.redirect('/users/register-password');
    } catch (err) {
        res.render('register', {
            hasError: true,
            error: err,
            userEmail : '',
            userFirstName : '',
            userLastName : ''
        });
    }
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
    }


};