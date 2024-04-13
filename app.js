const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL ="mongodb+srv://nikkuemwe:Rkrajput@123@cluster0.lz3bm7p.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0";
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const User=require("./models/user.js");
const session= require("express-session");
const flash =require("connect-flash");
const passport=require('passport');
const LocalStratergy=require('passport-local');



// async function main(){
//     await mongoose.connect(MONGO_URL)

// };

async function main() {
  const uri ="mongodb+srv://nikkuemwe:Rkrajput%40123@cluster0.lz3bm7p.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0";
  // const client = new MongoClient(uri)
  try {
    await mongoose.connect(uri);
    console.log("connected to db");

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


const sessionOption={
  secret:"thisismysecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly:true,
  },
}

app.get("/", (req, res) => {
  res.send("hi this is root page");
});

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error")
  res.locals.currUser=req.user;
  next();
});


//listing related routes
app.use("/listings",listingRouter);
// review related routes
app.use("/listings/:id/reviews",reviewRouter);
//user router
app.use("/",userRouter);

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