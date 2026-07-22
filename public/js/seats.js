
// Cached Elements
const selectedSeatListEl = document.querySelector('.selected-seats-list');
const regularSubtotalEl = document.querySelectorAll('.ticket-type-row.Regular span');
const VIPSubtotalEl = document.querySelectorAll('.ticket-type-row.VIP span');
const premiumSubtotalEl = document.querySelectorAll('.ticket-type-row.Premium span');
const accessibleSubtotalEl = document.querySelectorAll('.ticket-type-row.Accessible span');
const bookingTotalPriceEl = document.querySelector('#booking-total-price');
const bookingBtnEl = document.querySelector('#booking-btn');



const seatsMap = document.querySelector(".plan");
let selectedSeats = [];
let selectedSeatIds = [];
let totalPrice = 0;

let types = {
    Regular: {
        count: 0,
        price: 3,
        element: regularSubtotalEl
    },
    Premium: {
        count: 0,
        price: 4,
        element: premiumSubtotalEl
    },
    VIP: {
        count: 0,
        price: 6,
        element: VIPSubtotalEl
    },
    Accessible: {
        count: 0,
        price: 3,
        element: accessibleSubtotalEl
    }
}



seatsMap.addEventListener('click',(event)=>{
    const seatEl = event.target.closest('.seat');
    if(seatEl && (seatEl.classList.contains('available') || seatEl.classList.contains('selected'))){
        
        seatEl.classList.toggle('available');
        seatEl.classList.toggle('selected');
        
        const dataset = seatEl.dataset;
        const seat = {
            id: seatEl.id,
            row: dataset.row,
            number: dataset.number,
            type: dataset.type,
            price: Number(dataset.price)
        }
        toggleSeat(seat);
    }
    
    
})
function toggleSeat(seat){
    if(selectedSeatIds.includes(seat.id)){
        selectedSeats = selectedSeats.filter(s=> s.id != seat.id);
        selectedSeatIds = selectedSeatIds.filter(id=> id != seat.id);
        --types[seat.type].count;
    }else{
        selectedSeats.push(seat);      
        selectedSeatIds.push(seat.id);
        ++types[seat.type].count;
    }
        
        selectedSeats.sort((a,b)=>{
            if(a.row === b.row){
                return Number(a.number) - Number(b.number)
            }
            return a.row.localeCompare(b.row)
        });
        displaySummary();

}

function displaySummary(){
    selectedSeatListEl.style.opacity = (selectedSeats.length > 0) ? '1' : '0';
    
    selectedSeatListEl.textContent = selectedSeats.map(seat => seat.row + seat.number).join(', ');
    Object.entries(types).forEach(([key, value])=>{
        if(value.count ==0 ){
            value.element[0].classList.add('hide-ticket-type');
            value.element[1].classList.add('hide-ticket-type');          
        }else{
            value.element[0].classList.remove('hide-ticket-type');
            value.element[1].classList.remove('hide-ticket-type');          
        }
        value.element[0].textContent = key + ' × ' + value.count;
        value.element[1].textContent = formatPrice(value.count * value.price);
    })
    
    bookingTotalPriceEl.textContent = calculateTotalPrice();
}

function calculateTotalPrice(){
    let total = selectedSeats.reduce((total, seat)=>  seat.price + total , 0);
    return formatPrice(total);
}
function formatPrice(price){
    return 'BHD ' + Number.parseFloat(price).toFixed(3);
}
function handelReSelect(){

}

async function book(showtimeId){
    try{
        const response = await fetch('/bookings/new/'+ showtimeId, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({selectedSeatIds})
        })

        const result = await response.json();

        if(response.ok){
            window.location.href = result.redirectUrl;
        }else{
            
            const invalidSelectedSeatIds  = result.invalidSelectedSeatIds;
            const allBookedSeatIds = result.allBookedSeatIds;

            // Update all booked seats on the map
            allBookedSeatIds.forEach(bookedSeat => {
                const seatEl = document.getElementById(bookedSeat);
                if (seatEl) {
                    seatEl.classList.remove('available', 'selected');
                    seatEl.classList.add('booked');
                }
            });

            // toggleSeat removes invalid seats from the selection
            const invalidSelectedSeats = selectedSeats.filter(seat => invalidSelectedSeatIds.includes(seat.id));
            invalidSelectedSeats.forEach(seat => {
                toggleSeat(seat);
            });
        }


    }catch(error){
        console.log(error);
    }

}

bookingBtnEl.addEventListener('click', (event)=>{
    if (selectedSeatIds.length === 0) {
        return;
    }

    book(bookingBtnEl.dataset.showtime);
});

