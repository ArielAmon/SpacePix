
exports.homePage = (req, res) => {
    res.render('home',{
        userName: req.session.userName
    });
};