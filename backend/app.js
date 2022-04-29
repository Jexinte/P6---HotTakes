const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const usersRoutes = require('./routes/users')
const saucesRoutes = require('./routes/sauces')
const path = require('path')


mongoose.connect(
  `${process.env.DB_ADDRESS}`,
  { 
     useNewUrlParser: true,
     useUnifiedTopology: true 
  },

 err => 
 {
   if(!err)
      console.log('MongoDb is connected')
   else 
      console.log(err)
 }

)
const app = express()
mongoose.set('debug',true)
app.use(helmet())
// Chemin spécifique pour l'inscription et la connexion
app.use('/api/auth',usersRoutes)
// Chemin spécifique pour l'affichage des sauces
app.use('/api/sauces',saucesRoutes)
app.use('/images', express.static(path.join(__dirname,'images')))





module.exports = app