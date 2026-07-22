const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in");
const Seat = require("../models/Seat");
const Showtime = require("../models/Showtime");
const Booking = require("../models/Booking");
const { render } = require("ejs");

router.get('/', async(req, res)=>{
    const selectedStatus = req.query.status || 'Upcoming';
    const bookings = await Booking.find({user: req.session.user._id, status: selectedStatus}).populate('selectedSeats').populate({
        path:'showtime',
        populate:[
            {path:'movie'},
            {path:'hall'}
        ]
    });


    res.render('booking/my-bookings.ejs',{bookings, selectedStatus})
    

})

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
            return res.json({
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
            redirectUrl: '/bookings'
        })
       
    }catch(error){
        console.log(error);
    }
});

router.post('/cancel/:bookingId', async(req, res)=>{
    try{
        const booking = await Booking.findOne({_id: req.params.bookingId, user: req.session.user._id});

        booking.status = 'Cancelled';

        if (!booking) {
            return res.send('Booking not found.');
        }

        await booking.save();
        await Seat.updateMany({_id: {$in: booking.selectedSeats}}, { isBooked: false });

        res.redirect('/bookings?status=Cancelled');

    }catch(error){
        console.log(error);
    }
})



module.exports = router;