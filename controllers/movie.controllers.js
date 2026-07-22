const router = require("express").Router();
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const movieMetadata = require("../middleware/loadMovieMetadata");
const isSignedIn = require("../middleware/is-signed-in");
const isAdmin = require("../middleware/is-admin");


router.get('/', async (req, res)=>{
    try{
        const selectedStatus = req.query.status || 'now-showing';
        const status = (selectedStatus === 'now-showing')? 'Now Showing' : 'Coming Soon';

        const allMovies = await Movie.find({isDeleted: false, status}).populate("genre");
        res.render('movies/all.ejs',{movies: allMovies, selectedStatus});
        
    }catch(error){
        console.log(error);
    }
});

router.get('/new', isAdmin, movieMetadata, (req, res)=>{
    res.render('movies/add.ejs');
});


router.get('/:movieId', async(req, res)=>{
    try{
        const {movieId} = req.params;
        const {date} = req.query;

        const today = new Date().toLocaleDateString('en-CA');
        
        
        // Retrive the selected movie
        const foundMovie = await Movie.findById(movieId).populate("genre");
        if(!foundMovie){
            return res.send("Movie not found.");
        }
        
        
        // Retrieve the movie's showtimes ordered from earliest to latest
        const allShowtimes = (await Showtime.find({movie: movieId}).populate('hall').sort({startTime: 1})).filter(show=> {
            const showDate = show.startTime.toLocaleDateString("en-CA");
            return showDate >= today;
        })

        const firstDate = (allShowtimes.length > 0) ? allShowtimes[0].startTime.toLocaleDateString('en-CA'): null;
        const selectedDate = date || firstDate || today ; 

        // Get all showtimes available on the selected date
        const currentDateShowtimes = allShowtimes.filter(show=> selectedDate === show.startTime.toLocaleDateString("en-CA"));


        const showtimeDates = allShowtimes.map(show=> show.startTime);

        res.render('movies/details.ejs',{
            movie: foundMovie, 
            today,
            selectedDate,
            showtimeDates,
            showtimes: currentDateShowtimes
        });

    }catch(error){
        console.log('Error:', error);
    }
});

router.get('/:movieId/edit', isAdmin, movieMetadata, async(req, res)=>{
    try{
        const editedMovie = await Movie.findById(req.params.movieId).populate("genre");
        if(editedMovie){
            res.render('movies/edit.ejs', {movie: editedMovie});
        }else{
            res.send("Movie not found.");
        }

    }catch(error){
        console.log('Error:', error);
    }
});



router.delete('/:movieId', isAdmin, async(req, res)=>{
    try{
        
        const deletedMovie = await Movie.findByIdAndUpdate(req.params.movieId, {isDeleted: true});
        const deletedShowtimes = await Showtime.updateMany({movie: req.params.movieId}, {isDeleted: true})
        const showtimes = await Showtime.find({movie: req.params.movieId});
        for(let show of showtimes){
            const deletedSeats = await Seat.updateMany({showtime: show._id}, {isDeleted: true});
        }

        const updatedBooking = await Booking.updateMany({movie: req.params.movieId}, {isDeleted: true})
        

        if(deletedMovie){
           res.redirect('/movies');
        }else{
            res.send("Movie not found.");
        }

    }catch(error){
        console.log(error);
    }
});

router.put('/:movieId', async(req, res)=>{
    try{
        const movieId = req.params.movieId;
        const movie = req.body;

        if (!movie.genre) {
            movie.genre = [];
        } else if (!Array.isArray(movie.genre)) {
            movie.genre = [movie.genre];
        }

        movie.isTrending = Boolean(movie.isTrending);
        movie.isFeatured = Boolean(movie.isFeatured);

        const upbdatedMovie = await Movie.findByIdAndUpdate(movieId, movie, { new: true });

        if(upbdatedMovie){
            res.redirect('/movies/'+movieId);
        }else{
            res.send("Movie not found.");
        }

    }catch(error){
        console.log(error);
    }
})

router.post('/', isAdmin, async(req, res)=>{
    try{
        const movie = req.body;
        
        if (!movie.genre) {
            movie.genre = [];
        } else if (!Array.isArray(movie.genre)) {
            movie.genre = [movie.genre];
        }
        
        movie.isTrending = Boolean(movie.isTrending);
        movie.isFeatured = Boolean(movie.isFeatured);
        const createdMovie = await Movie.create(movie);
        
        if(createdMovie){
            res.redirect('/movies/'+createdMovie._id);
        }

    }catch(error){
        console.log(error);
    }
})


module.exports = router;