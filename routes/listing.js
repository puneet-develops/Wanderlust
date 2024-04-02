const express = require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing");
//validation
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(".");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };
// all listings (INDEX ROUTE)
router.get(
    "/",
    wrapAsync(async (req, res) => {
      const allListing = await Listing.find();
  
      res.render("../views/listings/index.ejs", { allListing });
    })
  );
  //new route
  router.get("/new", (req, res) => {
    res.render("../views/listings/new.ejs");
  });
  router.get(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      console.log(id);
      const listitem = await Listing.findById(id).populate("reviews");
      res.render("../views/listings/show.ejs", { listitem });
    })
  );
  // create route
  router.post(
    "/",
    validateListing,wrapAsync(async (req, res, next) => {
      const newlisting = new Listing(req.body.listing);
      await newlisting.save();
      res.redirect("/listings");
    })
  );
  //edit route
  router.get(
    "/:id/edit",wrapAsync(async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      console.log(listing);
      res.render("../views/listings/edit.ejs", { listing });
    })
  );
  // update route put request
  router.put(
    "/:id",validateListing,wrapAsync(async (req, res) => {
      let { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      res.redirect(`/listings/${id}`);
    })
  );
  //delete route
  router.delete("/:id",wrapAsync(async (req, res) => {
      let { id } = req.params;
      let deleteditem = await Listing.findByIdAndDelete(id);
      console.log(deleteditem);
      res.redirect("/listings");
    })
  );
  module.exports=router;