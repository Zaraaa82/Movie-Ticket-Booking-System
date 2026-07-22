const Hall = require("../models/Hall");
const Showtime = require("../models/Showtime");

const timeSlots = [
  "10:00", "10:30",
  "11:00", "11:30",
  "12:00", "12:30",
  "13:00", "13:30",
  "14:00", "14:30",
  "15:00", "15:30",
  "16:00", "16:30",
  "17:00", "17:30",
  "18:00", "18:30",
  "19:00", "19:30",
  "20:00", "20:30",
  "21:00", "21:30",
  "22:00", "22:30",
  "23:00", "23:30",
];


/*
  Showtime availability rules:

  1. Showtimes can only start at one of the predefined time slots.
  2. Each showtime includes 15 minutes of advertisements.
  3. A showtime cannot be scheduled in the past.
  4. A showtime cannot be scheduled before the movie release date.
  5. Two showtimes in the same hall cannot overlap.
  6. The function returns only available hall and time combinations.

*/

async function getAvailableOptions(movie, date){
  const halls = await Hall.find();
  const existingShowtimes = await Showtime.find({isDeleted: false});

  const availableOptions = {};
  const ADS_Duration = 15 * 60 * 1000; // in ms
  const movieDuration = movie.duration * 60 * 1000; // in ms

  for(const time of timeSlots){

    // Combine the selected date with the current time
    const startTime = new Date(date +'T'+ time);
    
    // Ignore past times or times before the release date
    if(startTime < new Date() || startTime < movie.releaseDate){
      continue;
    }

    // Calculate the end time
    const endTime = new Date(startTime.getTime() + ADS_Duration + movieDuration);

    for(const hall of halls){
      // Check whether this hall is occupied during this period
      const hasConflict = existingShowtimes.some(show =>{
        const sameHall = hall._id.equals(show.hall);
        const overlap = show.startTime < endTime && startTime < show.endTime;
        return sameHall && overlap;
      })

      
      // Save this hall and time if there is no conflict
      if(!hasConflict){
        const hallId = hall._id;
        if(!availableOptions[hallId]){
          availableOptions[hallId]=({
            hallId : hall._id,
            hallName: hall.name,
            hallType: hall.type,
            availableTimes: []
          })
        }

        availableOptions[hallId].availableTimes.push({
          time,
          startTime,
          endTime
        })
        
      }
    }
  }
  // Conver it into an array
  return Object.values(availableOptions);
}




module.exports = getAvailableOptions;