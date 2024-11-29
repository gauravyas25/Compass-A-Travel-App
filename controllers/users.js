const User = require("../models/user");



module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
}


module.exports.signup = async(req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
            console.log(registeredUser);
            req.flash("success", "Welcome to Compass !!!");
            res.redirect("/listings");
        });
        
    } catch(e){
        req.flash("error", e.message);
        res.redirect("signup");
    }
}


module.exports.renderLoginFrom = (req, res) => {
    res.render("users/login.ejs");
}


module.exports.login = async(req, res) => {
    req.flash("success", "Welcome to Compass, You are a Member Now !!!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            next(err);
        }else{
            req.flash("success", "Sorry to see you go. You are logged out now !");
            res.redirect("/lisitngs");
        }
        
    });
}