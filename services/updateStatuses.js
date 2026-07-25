const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');

// Updates movie, showtime, and booking statuses based on the current time
const updateStatuses = async () => {
    const now = new Date();

    // Retrieve showtimes whose statuses may still change
    const showtimes = await Showtime.find({status: {$in: ['Upcoming', 'Ongoing']}});

    for(const show of showtimes){
  
      const startTime = show.startTime;
      const endTime = show.endTime;
  
      if(endTime <= now){
        show.status = 'Completed';
      }else if(startTime <= now){
        show.status = 'Ongoing';
      }

      // Move upcoming bookings to previous once their showtime starts
      if( show.status === 'Ongoing' || show.status === 'Completed'){
        await Booking.updateMany({showtime: show._id, status: 'Upcoming'}, {status: "Previous"});
      }
      
      await show.save();
    }

    // Update movie statuses
    const comingSoonMovies = await Movie.find({status: 'Coming Soon', isDeleted: false});
    
    for(const movie of comingSoonMovies){
        if(movie.releaseDate > now){
            continue;
        }

        const activeShowtime = await Showtime.findOne({movie: movie._id, status: {$in : ['Upcoming', 'Ongoing']}});

        if(activeShowtime){
            movie.status = 'Now Showing';
            await movie.save();
        }
    }

};

module.exports = updateStatuses;
