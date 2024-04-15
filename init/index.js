const mongoose=require("mongoose");
const initdata=require("./data");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb+srv://nikkuemwe:Rkrajput%40123@cluster0.lz3bm7p.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0";
main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}


const initDB=async ()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"661a605f3fa51673e7ff82e1"}))
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
};
initDB();

