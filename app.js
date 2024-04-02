const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL ="mongodb+srv://nikkuemwe:Rkrajput@123@cluster0.lz3bm7p.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0";
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
//const Review = require("./models/review.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js")

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


//listing related routes
app.use("/listings",listings)
// review related routes
app.use("/listings/:id/reviews",reviews);

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
