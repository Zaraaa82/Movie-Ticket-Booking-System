const router = require("express").Router();
const Movie = require('../models/Movie');
const movieMetadata = require("../middleware/loadMovieMetadata");
const isSignedIn = require("../middleware/is-signed-in");
const isAdmin = require("../middleware/is-admin");


router.get('/', async (req, res)=>{
    try{
        const allMovies = await Movie.find().populate("genre");
        res.render('movies/all.ejs',{movies: allMovies});
        
    }catch(error){
        console.log(error);
    }
});

router.get('/new', isAdmin, movieMetadata, (req, res)=>{
    res.render('movies/add.ejs');
});


router.get('/:movieId', async(req, res)=>{
    try{
        const foundMovie = await Movie.findById(req.params.movieId).populate("genre");
        if(foundMovie){
            res.render('movies/details.ejs',{movie: foundMovie});
        }else{
            res.send("Movie not found.");
        }

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
        const deletedMovie = await Movie.findByIdAndDelete(req.params.movieId);
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