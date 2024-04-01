const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL ="mongodb+srv://nikkuemwe:Rkrajput@123@cluster0.lz3bm7p.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0";
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
//const Review = require("./models/review.js");
const Review = require('./models/review');

// async function main(){
//     await mongoose.connect(MONGO_URL)
// };

async function main() {
  const uri =
    "mongodb+srv://nikkuemwe:Rkrajput%40123@cluster0.lz3bm7p.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0";
  // const client = new MongoClient(uri)
  try {
    await mongoose.connect(uri);
    console.log("connected to db");

    // Make the appropriate DB calls
    //await  listDatabases(client);
  } catch (e) {
    console.error(e);
  } finally {
    //await client.close();
    console.log("here is finally block");
  }
}
main();

// main().catch(console.error); 
async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("hi this is root page");
});
// validatoins--------------------------
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(".");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(".");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// all listings (INDEX ROUTE)
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find();

    res.render("../views/listings/index.ejs", { allListing });
  })
);
//new route
app.get("/listings/new", (req, res) => {
  res.render("../views/listings/new.ejs");
});
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    const listitem = await Listing.findById(id).populate("reviews");
    res.render("../views/listings/show.ejs", { listitem });
  })
);
// create route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
  })
);
//edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("../views/listings/edit.ejs", { listing });
  })
);
// update route put request
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);
//delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteditem = await Listing.findByIdAndDelete(id);
    console.log(deleteditem);
    res.redirect("/listings");
  })
);

//reviews
//post review route
app.post("/listings/:id/reviews", validateReview,wrapAsync( async (req, res) => {
  let listing = await Listing.findById(req.params.id); // perticular listing find kro

  let newReview = new Review(req.body.review); // uski review col me push krdo
  console.log(newReview);
  console.log(listing.reviews.push(newReview));
  await newReview.save();
  await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove the reviewId from the reviews array in the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review document
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));

// Express error handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});



//middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("../views/listings/error.ejs", { message });
});

app.listen(8000, () => {
  console.log("app is listening on port 8000");
});
