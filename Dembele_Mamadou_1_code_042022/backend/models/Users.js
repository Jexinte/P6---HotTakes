
const mongoose = require('mongoose')
// Package pour tester l'unicité d'une adresse mail
const uniqueValidator = require('mongoose-unique-validator')

const usersSchema = mongoose.Schema(
    {
        email:
        {
            type: String,
            required:true,
            // Permet l'unicité d'une adresse mail
            unique:true,
        },
        password : 
        {
            type: String,
            required:true,
        }
    }
)

usersSchema.plugin(uniqueValidator,{message:"L'adresse email saisi ne peut être utilisée , veuillez en saisir une autre"})
// Nom du Modèle \ Nom du Schema
module.exports = mongoose.model('Users',usersSchema)