const express =  require('express')

app     = express.Router()

app.get('/sign_up',(req,res)=>
{
    res.render('sign_up')
    
})

app.post('/sign_up',(req,res)=>{

    let data=req.body
    console.log(data)
    if(data)
    {
     console.log(data)
     res.redirect('/sign_up')
    }
    else{
        console.log('error in server') 
        res.send("error")
    }
})


module.exports=app