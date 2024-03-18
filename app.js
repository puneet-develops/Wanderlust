const express =require("express");
const app=express();
const mongoose =require("mongoose");
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
const Listing=require("./models/listing");
const path = require("path");

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL)
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.get("/",(req,res)=>{
    res.send("hi this is root page");   
});

// app.get("/testListing",async(req,res)=>{
//     let samplelisting =new Listing({
//         title:"my new villa",
//         description:"by the beach best hotel",
//         price:20000,
//         location:"calangute,Goa",
//         country:"India",
//     });
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });
// all listings
app.get("/listings",async(req,res)=>{
    const allListing=await Listing.find({});
    res.render("index.ejs",{allListing});
});


app.listen(8080,()=>{
    console.log("app is listening on port 8080");
});