const express = require('express')

<<<<<<< HEAD
const app     = express.Router()
=======
app           = express.Router()
>>>>>>> e33b410e08076697145b8b47f464aeaf69fc7469

app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',(req,res)=>{
    let data=req.body
    console.log(data)
    if(data){
<<<<<<< HEAD
        if(data.id=='farmer') res.redirect('/farmer')
        else if(data.id=='customer')res.redirect('/customer')
        else res.send('Credintial Error') 
=======
        if(data.id=='farmer')
             res.redirect('/farmer')
        else if(data.id=='customer'){
            res.redirect('/customer')
        }
        else
           res.send('Credintial Error') 
>>>>>>> e33b410e08076697145b8b47f464aeaf69fc7469
    }
})

module.exports = app