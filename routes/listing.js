const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/expressError.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

const mongoose = require('mongoose');

const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js"); 
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const { index } = require("../controllers/listing.js");





const validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg());
    }else{
        next();
    }
}

//INDEX ROUTE
router.get("/", listingController.index);


//MAKE NEW LISTING
router.get("/new", isLoggedIn, listingController.renderNewForm);


//SHOW PARTICULAR LISTING
router.get("/:id", listingController.showListing);




//CREATE NEW LISTING
// router.post("/", isLoggedIn, validateListing, listingController.createListing);
router.post("/", upload.single("listing[image]"), (req, res) =>{
    res.send(req.file);
})

//EDIT LISTING
router.get("/:id/edit", isLoggedIn, listingController.editListing);


//UPDATE EDITTED LISTING
router.put("/:id", isLoggedIn, isOwner, validateListing, listingController.updateListing);



//DELETE ROUTE
router.delete("/:id", isLoggedIn, listingController.deleteListing);


module.exports = router;