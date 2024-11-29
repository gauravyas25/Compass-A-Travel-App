const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usersController = require("../controllers/users.js");
const user = require("../models/user.js");


router.get("/signup", usersController.renderSignupForm);

router.post("/signup", usersController.signup);


router.get("/login", usersController.renderLoginFrom
);


router.post("/login",
    saveRedirectUrl,
    passport.authenticate(
    "local", 
    {
        failureRedirect : "/login" , 
        failureFlash : true
    }), 
    usersController.login);

router.get("/logout", usersController.logout);



module.exports = router;