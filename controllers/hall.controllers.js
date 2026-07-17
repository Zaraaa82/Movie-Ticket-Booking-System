const router = require("express").Router();
const Hall = require('../models/Hall');


router.get('/', async (req, res)=>{
    try{
        const halls = await Hall.find();
        res.render('halls/all.ejs',{halls});
        
    }catch(error){
        console.log(error);
    }
});

router.get('/new', async (req, res)=>{
    try{
        res.render('halls/add.ejs');
        
    }catch(error){
        console.log(error);
    }
});

router.get('/:hallId/edit', async (req, res)=>{
    try{
        const updatedhall = await Hall.findById(req.params.hallId);
        if(updatedhall){
            res.render('halls/edit.ejs', {hall: updatedhall});
        }else{
            res.send("hall not found.");
        }
        
    }catch(error){
        console.log(error);
    }
});

router.delete('/:hallId', async (req, res)=>{
    try{
        await Hall.findByIdAndDelete(req.params.hallId);
        res.redirect('/halls');

    }catch(error){
        console.log(error);
    }
});

router.put('/:hallId', async (req, res)=>{
    try{
        const {name, type, totalSeats} = req.body;

        const foundSameName = await Hall.findOne({name});
        console.log(foundSameName)
        if(foundSameName && !foundSameName._id.equals(req.params.hallId)){
            return res.send('A hall with this name already exists.');
        }

        await Hall.findByIdAndUpdate(req.params.hallId, {name, type, totalSeats})
        res.redirect('/halls');
        
    }catch(error){
        console.log(error);
    }
});



router.post('/', async (req, res)=>{
    try{
        const {name, type, totalSeats} = req.body;
        const foundSameName = await Hall.findOne({name});
        if(foundSameName){
            return res.send('A hall with this name already exists.');
        }

        await Hall.create({name, type, totalSeats})
        res.redirect('/halls');

    }catch(error){
        console.log(error);
    }
});





module.exports = router;
