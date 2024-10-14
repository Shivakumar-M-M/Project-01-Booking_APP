const mongoose =require("mongoose");

const placeSchema=mongoose.Schema({
    owner:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    title:String,
    address:String,
    addedPhotos:[String],
    description:String,
    perks:[String],
    extraInfo:String,
    checkIn:Number,
    checkOut:Number,
    MaxGuest:Number,
    price:Number
});

const PlaceModel=mongoose.model("places",placeSchema);

module.exports=PlaceModel;