const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    
    upload.single('listing[image][url]'),
    validateListing,
    wrapAsync(listingController.createListings)
  );
  //checking depliyement
  router.get("/new", isLoggedIn, listingController.renderNewForm);
router
  .route("/:id")
  .get( wrapAsync(listingController.showListings))
  .put(
    
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListings)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListings)
  );
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;  