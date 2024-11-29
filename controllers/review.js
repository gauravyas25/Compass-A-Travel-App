const Listing = require("../models/listing");
const Review  = require("../models/review");



module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id).populate("reviews");
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await Listing.reviews.push(newReview);
    await newReview.save();
    req.flash("success", "New Review Created !!!");

    console.log("new review saved");
    res.redirect(`/listings/${listing.id}`);
}