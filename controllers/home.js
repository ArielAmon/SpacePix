
exports.homePage = (req, res) => {
    res.render('home',{
        userName: req.session.userName
    });
};

exports.userLogout = (req, res) => {
    req.session.isConnected = false;
    res.redirect('/');
};