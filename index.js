const express =  require('express')
const layouts =  require('express-ejs-layouts')
const app      = express()

app.use(layouts)
app.use(express.urlencoded({limit:'10mb',extended:false }))
app.use(express.static('public'))

app.set('view engine','ejs')
app.set('views',__dirname+'/views')
app.set('layout','layouts')

app.listen(3000,()=>console.log('app started'))