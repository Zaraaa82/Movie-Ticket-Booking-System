const router = require("express").Router();
const mongoose = require("mongoose");
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const Hall = require('../models/Hall');
const movieMetadata = require("../middleware/loadMovieMetadata");
const isSignedIn = require("../middleware/is-signed-in");
const isAdmin = require("../middleware/is-admin");
const getAvailableOptions = require("../services/showtimeAvailability");
const Seat = require("../models/Seat");


router.get('/:movieId', async (req, res)=>{
    try{
        const movie = await Movie.findById(req.params.movieId);
        const halls = await Hall.find();
        if(!movie){
            return res.send("Movie not found.");
        }
        const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
        const releaseDate = movie.releaseDate.toLocaleDateString('en-CA');

        // Prevent selecting a date before today or the release date
        const minimumDate = (today < releaseDate)? releaseDate : today;

        res.render('showtimes/select-date.ejs', {movie, minimumDate});

    }catch(error){
        console.log(error);
    }
})
router.get('/new/:movieId', async (req, res)=>{
    try{
        const movie = await Movie.findById(req.params.movieId);
        const halls = await Hall.find();
        if(!movie){
            return res.send("Movie not found.");
        }
        const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
        const releaseDate = movie.releaseDate.toLocaleDateString('en-CA');

        // Prevent selecting a date before today or the release date
        const minimumDate = (today < releaseDate)? releaseDate : today;

        res.render('showtimes/select-date.ejs', {movie, minimumDate});

    }catch(error){
        console.log(error);
    }
})

router.post('/new/:movieId', async (req, res)=>{
    try{
        const movie = req.params.movieId;
        let [hall, startTime, endTime] = req.body.selection.split('|');
        startTime = new Date(startTime);
        endTime = new Date(endTime);
        const foundHall = await Hall.findById(hall);
        if(!foundHall){
            return res.send('Hall not found.');
        }
        
        const showtime = await Showtime.create({movie, hall, startTime, endTime});
        const hallRows = foundHall.rows;
        const seats = [];
        hallRows.forEach(row=> {
            const rowName = row.name;
            const rowType = row.type;
            for(let i=1; i<=row.numberOfSeats; i++){
                seats.push({
                    showtime: showtime._id,
                    row: rowName,
                    type: rowType,  
                    number: i
                })
            }
        });

        await Seat.insertMany(seats);

        res.redirect('/movies/'+ movie);

    }catch(error){
        console.log(error);
    }
})
router.post('/:movieId', async (req, res)=>{
    try{
        const {date} = req.body;
        const movie = await Movie.findById(req.params.movieId);
        const availableOptions = await getAvailableOptions(movie, date);
        res.render('showtimes/select-option.ejs', {movie, date, availableOptions});
    }catch(error){
        console.log(error);
    }
})


module.exports = router;