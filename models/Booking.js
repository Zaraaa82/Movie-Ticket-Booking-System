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
    showtime: {
      type: ObjectId,
      ref: "Showtime",
      required: true,
    },
    selectedSeats: {
      type: [ObjectId],
      ref: "Seat",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["Upcoming", "Previous", "Cancelled"],
      default: "Upcoming"
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
