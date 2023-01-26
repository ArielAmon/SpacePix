const Cookies = require('cookies');
const db = require('../models');
const {Sequelize} = require("sequelize"); //contain the Contact model, which is accessible via db.Contact
const keys = ['keyboard cat']

function getCookiesData(req, res){
    const cookies = new Cookies(req, res, {keys : keys});
    let email = cookies.get('email',{signed : true});
    let firstName = cookies.get('firsName',{signed : true});
    let lastName = cookies.get('lastName',{signed : true});
    return [email,firstName,lastName];
}

function areAllUndefined(arr){
    return arr.includes(undefined) || arr.includes(null);
}

function getErrorMessage(error) {
    if (error instanceof Sequelize.ValidationError) {
        return error.errors.map(err => err.message).join(', ');
    } else if (error instanceof Sequelize.UniqueConstraintError) {
        return error.message;
    } else if (error instanceof Sequelize.ForeignKeyConstraintError) {
        return error.message;
    } else if (error instanceof Sequelize.ExclusionConstraintError) {
        return error.message;
    } else if (error instanceof Sequelize.DatabaseError) {
        return error.original ? error.original.message : error.message;
    } else {
        return 'An unknown error occurred';
    }
}

exports.startRegistration = (req, res) => {
    const data = getCookiesData(req, res);
    if(!areAllUndefined(data)){
        data.forEach((elem)=>{
            elem = '';
        })
    }
    res.render('register',{
        error: "",
        hasError : false,
        userEmail : data[0],
        userFirstName : data[1],
        userLastName : data[2]
    });
};

exports.choosePassword = (req, res) => {
    const data = getCookiesData(req, res);
    if(areAllUndefined(data)){
        res.render('index',{
            completed : false,
            hasError : true,
            message : "Registration expired! please start again"
        });
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
        res.render('register', {
            hasError: true,
            error: getErrorMessage(err),
            userEmail : '',
            userFirstName : '',
            userLastName : ''
        });
    });
}

exports.addUserPassword = (req, res) => {
    const data = getCookiesData(req, res);
    if(areAllUndefined(data)){
        res.render('index',{
            completed : false,
            hasError : true,
            message : "Registration expired! please start again"
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
        db.User.create({ email:data[0], firstName:data[1], lastName:data[2], password:password})
            .then((contact) => {
                res.render('index',{
                    message: `Congratulations ${contact.dataValues.firstName} ${contact.dataValues.lastName} ! You are now registered 🥳`,
                    completed : true,
                    hasError : false,
                });
            })
            .catch((err) => {
                res.render('register', {
                    hasError: true,
                    error: getErrorMessage(err),
                    userEmail : '',
                    userFirstName : '',
                    userLastName : ''
                });
            });
    }
};