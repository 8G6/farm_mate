<<<<<<< HEAD
const express = require('express')
const layouts = require('express-ejs-layouts')
const app     = express()
=======
const express =  require('express')
const layouts =  require('express-ejs-layouts')
const app      = express()
>>>>>>> e33b410e08076697145b8b47f464aeaf69fc7469

app.use(layouts)
app.use(express.urlencoded({limit:'10mb',extended:false }))
app.use(express.static('public'))

app.set('view engine','ejs')
app.set('views',__dirname+'/views')
app.set('layout','layouts')

<<<<<<< HEAD

=======
>>>>>>> e33b410e08076697145b8b47f464aeaf69fc7469
app.listen(3000,()=>console.log('app started'))