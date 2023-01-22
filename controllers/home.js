
const db = require('../models');

exports.homePage = (req, res) => {
    res.render('home',{
        userName: req.session.userName
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
            console.log( `this is ${date} all comment:`)
            console.log( imageComments)
            res.json(imageComments);
        }).catch((err) => {
        console.log('error fetching all image comments', err);
        return res.status(404).json(err);
    });
};

exports.addComment = (req, res) => {
    const {imageID, user, comment} = req.body;
    console.log("Data recived",imageID, user, comment);
    db.Comments.create({ imageID:imageID, userName:user, comment:comment})
        .then((data) => {
            console.log(data);
            res.status(201).json(data);
        })
        .catch((err) => {
            console.log('error adding new comment to db');
            return res.status(404).json(err);
        });
}

exports.deleteComment = (req, res) => {
    const {id} = req.body;
    console.log('image to delete', id);
    db.Comments.destroy({ where: { id: id } })
        .then((count) =>{
            console.log(`deleted row(s): ${count}`);
            res.status(202).json(count);
        }).catch((err) => {
        console.log('error deleting the comment', err);
        return res.status(404).json(err);
    });
};