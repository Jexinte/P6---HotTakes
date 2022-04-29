const User = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()


/**************************** Sign Up **************************/

exports.signUp = (req,res)=>
{   
        // On se sert de la méthode hash
    bcrypt.hash(req.body.password,10)
    .then(hash =>
    {
        let bodyMail = req.body.email
        let regexMail = new RegExp(/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/)
    
        
        // Vérification du format de l'adresse mail
        if(regexMail.test(bodyMail) === true)
        {
            const users = new User({
                email : bodyMail,
                password:hash
            })
            
        
            users.save()
                .then(() => res.status(201).json({message:`L'utilisateur ${bodyMail} a bien été enregistré`}))
                .catch(error => res.status(400).json(error))
                
            }
        else{
        res.status(400).json({message:"Veuillez saisir une adresse mail correcte !"})
        }
    })

        .catch(error => res.status(500).json({error}))
}

/**************************** End of Sign Up **************************/

/**************************** Login **************************/

exports.login = (req,res) => {

    let bodyMail = req.body.email
    // Récupération de l'adresse mail envoyé
    User.findOne({email:bodyMail})

    .then(user =>
        {
            
            // Si l'utilisateur n'existe pas
            if(!user)
                return res.status(403).json({errorMsg:`L'utilisateur ${bodyMail} n'existe pas , veuillez crée un nouveau compte !`})
                // Comparaison du mot de passe entré avec le hash de la bdd
                bcrypt.compare(req.body.password,user.password)

        .then(compare =>
            {
                // Si la comparaison n'est pas bonne 
                if(!compare)
                    return res.status(403).json({errorMsg:"Mot de passe incorrect !"})

                // Dans le cas contraire 
                res.status(201).json(
                {
                    // La réponse renvoyée sera l'identifiant de l'utilisateur ainsi que son token
                    userId : user._id,
                    token: jwt.sign(
                        {userId:user._id},
                        `${process.env.TOKEN_KEY}`,
                        {expiresIn:'24h'}
                    )
                })
            })
            
            .catch(error => res.status(500).json({error}))
    })
    .catch(error => res.status(500).json({error}))
}
/**************************** End of Login **************************/