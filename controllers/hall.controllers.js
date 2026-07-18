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

router.post('/new', async (req, res)=>{
    try{
        const {name, type, numberOfRows} = req.body;

        const foundSameName = await Hall.findOne({name});
        if(foundSameName){
            return res.send('A hall with this name already exists.');
        }

        if(numberOfRows < 1 || numberOfRows > 20 ){
            res.redirect('/halls/new');
        }else{
            res.render('halls/configure-rows.ejs',{name, type, numberOfRows: Number(numberOfRows)});
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
        const rowNames = Array.isArray(req.body.rowNames) ? req.body.rowNames : [req.body.rowNames];
        const numberOfSeats = Array.isArray(req.body.numberOfSeats) ? req.body.numberOfSeats : [req.body.numberOfSeats];
        const rowTypes = Array.isArray(req.body.rowTypes) ? req.body.rowTypes : [req.body.rowTypes];

        
        const rows = rowNames.map((row,i) => ({
            name: row,
            numberOfSeats: Number(numberOfSeats[i]),
            type: rowTypes[i]
        }));

        await Hall.findByIdAndUpdate(req.params.hallId, {rows})
        res.redirect('/halls');
        
    }catch(error){
        console.log(error);
    }
});



router.post('/', async (req, res)=>{
    try{
        const {name, type} = req.body;

        const rowNames = Array.isArray(req.body.rowNames) ? req.body.rowNames : [req.body.rowNames];
        const numberOfSeats = Array.isArray(req.body.numberOfSeats) ? req.body.numberOfSeats : [req.body.numberOfSeats];
        const rowTypes = Array.isArray(req.body.rowTypes) ? req.body.rowTypes : [req.body.rowTypes];

        
        const rows = rowNames.map((row,i) => ({
            name: row,
            numberOfSeats: Number(numberOfSeats[i]),
            type: rowTypes[i]
        }));
        await Hall.create({name, type, rows});
        res.redirect('/halls');

    }catch(error){
        console.log(error);
    }
});





module.exports = router;
