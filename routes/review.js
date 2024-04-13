const express = require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require('../models/review');
const Listing = require("../models/listing");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js")



//reviews
//post review route
router.post("/", isLoggedIn,validateReview,wrapAsync( async (req, res) => {
    let listing = await Listing.findById(req.params.id); // perticular listing find kro
  
    let newReview = new Review(req.body.review); // uski review col me push krdo

    newReview.author=req.user._id;
    console.log(newReview)
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    req.flash("success","New Review Created!");
      res.redirect(`/listings/${listing._id}`);
  }));
  
  //delete review route
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
      const { id, reviewId } = req.params;
  
      // Remove the reviewId from the reviews array in the listing
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  
      // Delete the review document
      await Review.findByIdAndDelete(reviewId);
      req.flash("success","Review Deleted!");
      res.redirect(`/listings/${id}`);
  }));
  
  module.exports=router;