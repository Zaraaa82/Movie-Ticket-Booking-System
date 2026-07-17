const Genre = require("../models/Genre");

async function movieMetadata(req, res, next) {
    try{
        res.locals.genres = (await Genre.find());
        res.locals.languages = [
            "English",
            "Arabic",
            "French",
            "Spanish",
            "German",
            "Italian",
            "Japanese",
            "Korean",
            "Hindi",
            "Mandarin",
            "Russian",
            "Turkish"
        ];
        res.locals.ageRatings  = [
            "G",
            "PG",
            "PG-13", 
            "R", 
            "NC-17"
        ];
        next();
    }catch(error){
        console.log(error);
        res.send("Something went wrong.");
    }

};

module.exports = movieMetadata;