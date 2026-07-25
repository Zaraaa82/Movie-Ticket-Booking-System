const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


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
    cancellationReason: {
      type: String,
      enum: ['Cancelled by user', 'Movie removed', 'Showtime cancelled'],
      default: null
    }
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
