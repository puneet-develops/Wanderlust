const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

// all listings (INDEX ROUTE)
router.get("/", wrapAsync(listingController.index));
//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);
//show route
router.get("/:id", wrapAsync(listingController.showListings));
// create route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListings)
);
//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);
// update route put request
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListings)
);
//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListings)
);
module.exports = router;
