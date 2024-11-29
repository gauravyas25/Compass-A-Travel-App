const express  = require("express");
const ExpressError = require("../utils/expressError.js");
const mongoose = require('mongoose');
const router = express.Router({mergeParams : true});
const Review = require("../models/review.js");
const {reviewSchema} = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/review.js");



const validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg());
    }else{
        next();
    }
}

//SHOWING REVIEWS ON PARTICULAR LISTING
router.post("/", isLoggedIn, validateReview, reviewController.createReview);

module.exports = router;