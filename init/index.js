const mongoose = require("mongoose");
const initData = require("./data.js");
const Listings = require("../models/listing.js");

main().then(()=> {
    console.log("connection successfull")}).catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/AirBnB');
}

const initDB = async () => {
    await Listings.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner : "67025a9400a497fff95be9c9" }));
    await Listings.insertMany(initData.data);
    console.log("data initialized");
}
initDB();