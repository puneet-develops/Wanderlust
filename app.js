const express =require("express");
const app=express();
const mongoose =require("mongoose");
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
const Listing=require("./models/listing");
const path = require("path");
const methodOverride=require("method-override"); 
const engine = require("ejs-mate");
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
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',engine);
app.use(express.static(path.join(__dirname,"/public"))); 
app.use(express.static('public'));   

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
// all listings (INDEX ROUTE)
app.get("/listings",async(req,res)=>{
    const allListing=await Listing.find();
    res.render("../views/listings/index.ejs",{allListing});
});
//new route 
app.get("/listings/new",(req,res)=>{
    res.render("../views/listings/new.ejs");
})
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    console.log(id)
   const listitem =await Listing.findById(id);
    res.render("../views/listings/show.ejs",{listitem});
});
// create route 
app.post("/listings",async(req,res)=>{
    const newlisting= new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");

});
//edit route 
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    console.log(listing);
    res.render("../views/listings/edit.ejs",{listing});
})
// update route put request 
app.put("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`);
});
//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}= req.params;
    let deleteditem =await Listing.findByIdAndDelete(id);
    console.log(deleteditem);
    res.redirect("/listings");
});

app.listen(8080,()=>{
    console.log("app is listening on port 8080");
});