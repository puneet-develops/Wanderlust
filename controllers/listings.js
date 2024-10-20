const { query } = require("express");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN
const geocodingClient=mbxGeocoding({accessToken:mapToken});

module.exports.index = async (req, res) => {
  const allListing = await Listing.find();
  res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;

  const listitem = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listitem) {
    req.flash("error", "Listing you Requested for does not exists!");
    res.redirect("/listings");
  }
  //console.log(listitem);
  res.render("../views/listings/show.ejs", { listitem });
};
module.exports.createListings=async (req, res, next) => {

  let response=await geocodingClient.forwardGeocode({
    query:req.body.listing.location,
    limit:1
  })
  .send();
 




  let url =req.file.path;
  let filename=req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry=response.body.features[0].geometry;
    let savedListing=await newlisting.save();
    console.log(savedListing);
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};
module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    if(!listing){
      req.flash("error","Listing you Requested for does not exists!");
      res.redirect("/listings");
    }
    res.render("../views/listings/edit.ejs", { listing });
};
module.exports.updateListings=async (req, res) => {

    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
      let url =req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
    }
    req.flash("success"," Listing Updated!");
    res.redirect(`/listings/${id}`);
};
module.exports.deleteListings=async (req, res) => {
    let { id } = req.params;
    let deleteditem = await Listing.findByIdAndDelete(id);
    console.log(deleteditem);
    req.flash("success","New Listing Deleted!");
    res.redirect("/listings");
};
