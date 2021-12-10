const express =  require('express')
const ejs     =  require('ejs')
const layouts =  require('express-ejs-layouts')
const sign_up = require('./route/sign_up')
const login   = require('./route/login')
const app     = express()

app.use(layouts)
app.use(express.urlencoded({limit:'10mb',extended:false }))

app.set('view engine','ejs')
app.set('views',__dirname+'/views')
app.set('layout','layouts')


app.use('/',login)
app.use('/',sign_up)

app.listen(3000,()=>console.log('app_started'))
