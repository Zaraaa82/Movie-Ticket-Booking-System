const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in");
const Seat = require("../models/Seat");
const Showtime = require("../models/Showtime");
const Booking = require("../models/Booking");


router.get('/new/:showtimeId', async (req, res)=>{
    try{
        const showtimeId = req.params.showtimeId;
        const showtime = await Showtime.findById(showtimeId).populate('hall movie');

        // Retrive seats in ascending order
        const foundSeats = await Seat.find({showtime: showtimeId}).sort({ row: 1, number: 1 }).select('-showtime');

        const groupedSeats = {};
        foundSeats.forEach(seat =>{
            if(!groupedSeats[seat.row]){
                groupedSeats[seat.row] = [];
            }
            groupedSeats[seat.row].push(seat);
        })
        
        res.render('booking/seats-selection.ejs', {
            showtime,
            seats: groupedSeats
        });


    }catch(error){
        console.log(error);
    }
});


router.post('/new/:showtimeId', async (req, res)=>{
    try{
        const showtimeId = req.params.showtimeId;
        const selectedSeatIds = req.body.selectedSeatIds;
        
        if (!Array.isArray(selectedSeatIds) || selectedSeatIds.length == 0) {
            return res.status(400).json({
                message: 'Please select at least one seat.'
            });
        }

        const allBookedSeats = await Seat.find({showtime: showtimeId, isBooked: true});
        const validSelectedSeats = await Seat.find({_id: {$in: selectedSeatIds}, showtime: showtimeId, isBooked: false});

        const allBookedSeatIds = allBookedSeats.map(seat => seat._id.toString());
        const validSelectedSeatIds = validSelectedSeats.map(seat => seat._id.toString());
        const invalidSelectedSeatIds = selectedSeatIds.filter(seatId => !validSelectedSeatIds.includes(seatId));

        if(selectedSeatIds.length !== validSelectedSeatIds.length){
           return res.status(409).json({
                message: 'Some selected seats are no longer available.',
                invalidSelectedSeatIds,
                allBookedSeatIds
            }) 
        }

        const newBooking = await Booking.create({
            user: req.session.user._id,
            showtime: showtimeId,
            selectedSeats: validSelectedSeatIds,
            totalPrice: validSelectedSeats.reduce((total, seat)=> total+ seat.price, 0)           
        });

        await Seat.updateMany({_id: {$in: validSelectedSeatIds}}, {isBooked: true})

        return res.status(201).json({
            redirectUrl: '/bookings/' + newBooking._id
        })
       
    }catch(error){
        console.log(error);
    }
});



module.exports = router;