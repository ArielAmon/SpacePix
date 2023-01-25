
const db = require('../models');
const {Sequelize, Op} = require("sequelize");

function getErrorMessage(error) {
    if (error instanceof Sequelize.ValidationError) {
        console.log(error.errors.map(err => err.message).join(', '))
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


exports.homePage = (req, res) => {
    res.render('home',{
        userName: req.session.userName,
        userID: req.session.userID,
    });
};

exports.userLogout = (req, res) => {
    req.session.isConnected = false;
    res.redirect('/');
};

exports.getImageComments = (req, res) => {
    const date = req.query.date;
    db.Comments.findAll({ where: { imageID: date } })
        .then((imageComments) =>{
            res.json(imageComments);
        }).catch((err) => {
        return res.status(404).json({code:404,msg: getErrorMessage(err)});
    });
};

exports.checkPolling = (req, res) => {
    const date = req.query.date;
    const time = req.query.currTime.replace(/\([^()]*\)/g, "");
    console.log("====================================",time);
    db.Comments.findAll({
        paranoid : false,
        force: true,
        where: { updatedAt: {[Op.gt]: time}, imageID:date } })
        .then((imageComments) =>{
            if(imageComments.length > 0){
                db.Comments.findAll({ where: { imageID: date } })
                    .then((Comments) =>{
                        res.json({ modify:true , comment:Comments});
                    }).catch((err) => {
                    return res.status(404).json({code:404,msg: getErrorMessage(err)});
                });
            }
            else{
                res.json({ modify:false , comment:[]});
            }
        }).catch((err) => {
        return res.status(404).json({code:404,msg: getErrorMessage(err)});
    });
};










exports.addComment = (req, res) => {
    const {imageID, user, comment} = req.body;
    db.Comments.create({ imageID:imageID, userName:user, comment:comment, userID:req.session.userID})
        .then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => {
            return res.status(404).json({code:404,msg:getErrorMessage(err)});
        });
}

exports.deleteComment = (req, res) => {
    const {id} = req.body;
    db.Comments.findOne({ where: { id: id } })
        .then((comment) =>{
            if(comment){
                comment.destroy();
                res.status(202).json(comment.dataValues.id);
            }
        })
        .catch((err) => {
        return res.status(404).json({code:404,msg:getErrorMessage(err)});
    });
};


