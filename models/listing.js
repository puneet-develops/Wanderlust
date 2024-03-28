const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema= new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1598210134170-3a1b887b4033?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
           // set:(v)=>v===""?"https://unsplash.com/photos/green-cactus-plant-on-green-table-gdpFdcrpMy0":v,
            required:true
        }
    },
    price:Number,
    location:String,
    country:String
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports=Listing;
