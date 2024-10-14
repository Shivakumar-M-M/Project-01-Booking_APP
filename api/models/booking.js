const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    place: { type: mongoose.Schema.Types.ObjectId, ref: "places", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    price: { type: Number, default: 0 },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const BookingModel = mongoose.model("Booking", bookingSchema);

module.exports = BookingModel;
