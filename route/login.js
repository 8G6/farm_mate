const express = require('express')

app           = express.Router()

app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',(req,res)=>{
    let data=req.body
    console.log(data)
    if(data){
        if(data.id=='farmer')
             res.redirect('/farmer')
        else if(data.id=='customer'){
            res.redirect('/customer')
        }
        else
           res.send('Credintial Error') 
    }
})

module.exports = app