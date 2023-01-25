var express = require('express');
var router = express.Router();

const homeController = require("../controllers/home");

router.get('/', homeController.homePage);
router.get('/logout', homeController.userLogout);

router.get("/getImageComments", homeController.getImageComments);
router.get("/pollingComments", homeController.checkPolling);
router.post("/addImageComment", homeController.addComment);
router.delete("/deleteComment", homeController.deleteComment);

module.exports = router;