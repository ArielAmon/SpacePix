var express = require('express');
var router = express.Router();
const db = require('../models');

const homeController = require("../controllers/home");

router.get('/', homeController.homePage);

router.get('/logout', homeController.userLogout);

router.get("/getImageComments", homeController.getImageComments);
router.post("/addImageComment", homeController.addComment);
router.delete("/deleteComment", homeController.deleteComment);



router.get('/DBcomments', (req, res) => {
    return db.Comments.findAll()
        .then((users) => res.send(users))
        .catch((err) => {
            console.log('There was an error querying contacts', JSON.stringify(err))
            err.error = 1; // some error code for client side
            return res.send(err)
        });
});



module.exports = router;