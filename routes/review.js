const express = require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require('../models/review');
const Listing = require("../models/listing");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(".");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

//reviews
//post review route
router.post("/", validateReview,wrapAsync( async (req, res) => {
    let listing = await Listing.findById(req.params.id); // perticular listing find kro
  
    let newReview = new Review(req.body.review); // uski review col me push krdo
    console.log(newReview);
    console.log(listing.reviews.push(newReview));
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
      res.redirect(`/listings/${listing._id}`);
  }));
  
  //delete review route
  router.delete("/:reviewId", wrapAsync(async (req, res) => {
      const { id, reviewId } = req.params;
  
      // Remove the reviewId from the reviews array in the listing
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  
      // Delete the review document
      await Review.findByIdAndDelete(reviewId);
      req.flash("success","Review Deleted!");
      res.redirect(`/listings/${id}`);
  }));
  
  module.exports=router;