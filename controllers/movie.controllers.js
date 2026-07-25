const router = require("express").Router();
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');
const movieMetadata = require("../middleware/loadMovieMetadata");
const isAdmin = require("../middleware/is-admin");


router.get('/', async (req, res)=>{
    try{
        const selectedStatus = req.query.status || 'now-showing';
        const status = (selectedStatus === 'now-showing')? 'Now Showing' : 'Coming Soon';

        const allMovies = await Movie.find({isDeleted: false, status}).populate("genre");
        res.render('movies/all.ejs',{movies: allMovies, selectedStatus});
        
    }catch(error){
        console.log(error);
        res.status(500).send('Something went wrong.');
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
        const foundMovie = await Movie.findOne({_id: movieId, isDeleted: false}).populate("genre");
        if (!foundMovie) {
            return res.status(404).send('Movie not found.');
        }
        
        
        // Retrieve the movie's showtimes ordered from earliest to latest
        const allShowtimes = (await Showtime.find({movie: movieId, status: 'Upcoming'}).populate('hall').sort({startTime: 1})).filter(show=> {
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
        res.status(500).send('Something went wrong.');
    }
});

router.get('/:movieId/edit', isAdmin, movieMetadata, async(req, res)=>{
    try{
        const editedMovie = await Movie.findById(req.params.movieId).populate("genre");
        if(editedMovie){
            res.render('movies/edit.ejs', {movie: editedMovie});
        }else{
            return res.status(404).send('Movie not found.');
        }

    }catch(error){
        console.log('Error:', error);
        res.status(500).send('Something went wrong.');
    }
});



router.delete('/:movieId', isAdmin, async(req, res)=>{
    try{
        const movie = await Movie.findByIdAndUpdate(req.params.movieId, {isDeleted: true});
        if(!movie){
            return res.status(404).send("Movie not found.");
        }
        const showtimeIds = (await Showtime.find({movie: req.params.movieId})).map(showtime => showtime._id);
        await Showtime.updateMany({_id: {$in: showtimeIds}, status: {$in: ['Upcoming', 'Ongoing']}}, {status: 'Cancelled'});
        await Booking.updateMany({showtime: {$in: showtimeIds}, status: 'Upcoming'}, {status: 'Cancelled', cancellationReason: 'Movie removed'});

        res.redirect('/movies');

    }catch(error){
        console.log(error);
        res.status(500).send('Something went wrong.');
    }
});

router.put('/:movieId', isAdmin, async(req, res)=>{
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

        const updatedMovie = await Movie.findByIdAndUpdate(movieId, movie, { new: true });

        if(updatedMovie){
            res.redirect('/movies/'+movieId);
        }else{
            return res.status(404).send('Movie not found.');
        }

    }catch(error){
        console.log(error);
        res.status(500).send('Something went wrong.');
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
        res.status(500).send('Something went wrong.');
    }
})


module.exports = router;