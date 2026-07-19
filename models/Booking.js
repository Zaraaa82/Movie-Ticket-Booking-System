const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const snackSchema = new mongoose.Schema({
  snack: {
    type: ObjectId,
    ref: "Snack",
    required: true,
  },
  quantity: {
    type: Number,
    min: 0,
    required: true
  },
});

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    selectedSeats: {
      type: [ObjectId],
      ref: "Seat",
      required: true,
    },
    snacks: [snacks],
    totalPrice: {
      type: Number,
      min: 0,
      required: true,
    },
    status: {
      type: String,
      enum: ["Confirmed" | "Cancelled"],
      required: true,
    },
    isDeleted:{
      type: Boolean,
      default: false
    }
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
