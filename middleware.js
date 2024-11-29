const Listing  = require("./models/listing");



module.exports.isLoggedIn  = (req, res, next) => {
    if(!req.isAuthenticated()){
        console.log(req.user);
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be a Member to create a listing. Please Login !!!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let currUser;
    let listing = await Listing.findById(id);
    if(!currUser && listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "Sorry, you don't have permission to edit this Listing!!!");
        res.redirect(`/listings`);
    }

    next();
}