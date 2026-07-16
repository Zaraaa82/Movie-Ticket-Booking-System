const router = require("express").Router()


router.get('/',(req,res)=>{
    res.render('homepage.ejs')
})
module.exports = router;
