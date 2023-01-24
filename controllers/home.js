
const db = require('../models');

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
        return res.status(404).json({code:404,msg: err.message});
    });
};

exports.addComment = (req, res) => {
    const {imageID, user, comment} = req.body;
    db.Comments.create({ imageID:imageID, userName:user, comment:comment, userID:req.session.userID})
        .then((data) => {
            res.status(201).json(data);
        })
        .catch((err) => {
            return res.status(404).json({code:404,msg:err.message});
        });
}

exports.deleteComment = (req, res) => {
    const {id} = req.body;
    db.Comments.destroy({ where: { id: id } })
        .then((count) =>{
            res.status(202).json(count);
        }).catch((err) => {
        return res.status(404).json({code:404,msg:err.message});
    });
};