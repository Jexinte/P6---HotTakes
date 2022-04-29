
const Sauces = require('../models/Sauces')
const fs = require('fs')

// Récupère l'ensemble des sauces
exports.getAllSauces = (req,res) => 
{
    Sauces.find()
          .then(sauces => res.status(200).json(sauces))
          .catch(error => res.status(400).json(error))
         
}
// Récupère une sauce en fonction de son id
exports.getSauceById = (req,res) => 
{
    
    Sauces.findOne({_id:req.params.id},)
  
     .then(sauce=> res.status(200).json(sauce)) 
    .catch(error => res.status(400).json({error}))
    
}


// Création d'une sauce
exports.createSauce = (req,res) => 
{
    const sauceObject = JSON.parse(req.body.sauce)
    const sauces = new Sauces (
    {
        ...sauceObject,
        // Chemin de l'image
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    })
    
    sauces.save()

        .then(() => res.status(201).json({message : "La sauce a bien été enregistrée "}))
        .catch(error => res.status(400).json(error))

}
// Modification d'une sauce
exports.modifySauce = (req,res) => 
{   
    // Cette condition permet de vérifier si une image est téléchargée si oui elle est prise en compte sinon on récupère le reste des informations de la sauce !
    const saucesObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }

  Sauces.updateOne
  (
      { _id: req.params.id }, 
    { ...saucesObject, _id: req.params.id }
    
  )
    .then(() => res.status(200).json({ message: 'La sauce a bien été modifiée'}))
    .catch(error => res.status(400).json({ error }));
    
}
// Suppression d'une sauce
exports.deleteSauce = (req,res) => 
{
    Sauces.findOne({_id:req.params.id})
  
    .then(sauce =>
    {
        // Permet de récupérer le nom de l'image
        const filename = sauce.imageUrl.split('/images/')[1]
       // Dans le dossier images supprime le fichier concerné
        fs.unlink(`images/${filename}`,() =>
        {
            Sauces.deleteOne
            (
                {_id:req.params.id}
            )
        
            .then(()=> res.status(200).json({message:"La sauce a bien été supprimé !"}))
            .catch(error => res.status(400).json(error))
        })
    })
  .catch(error => res.status(500).json(error))
}

// Prend en compte le like / dislike de l'utilisateur (avec modification)
exports.likesAndDislikes = (req,res) => {
 
    let userId = req.body.userId
    let likeStatus = req.body.like

    Sauces.findOne({_id:req.params.id})

 
    .then(sauce => 
    {
        // Si l'utilisateur n'est pas dans la base de données et que like est égale à 1 alors on ajoute l'utilisateur dans le tableau approprié et on incrémente le like à 1
        if(!sauce.usersLiked.includes(userId) && likeStatus === 1){
            Sauces.updateOne
            (
                {_id:req.params.id},
                {
                    $inc:{likes:1},
                    $push:{usersLiked:userId}
                }
            )
            .then(() => res.status(201).json({message:"Likes updated"}))
            .catch(error => res.status(400).json(error))
        }
        // Si l'utilisateur n'aime plus la sauce  et qu'il est déja présent dans le tableau approprié et que like 0 alors on le retire et on décrémente le like
        else if(sauce.usersLiked.includes(userId) && likeStatus === 0){
            Sauces.updateOne
            (
                {_id:req.params.id},
                { 
                $inc:{likes:-1},
                $pull:{usersLiked:userId}
                }
            )
            .then(() => res.status(201).json({message:"Likes updated"}))
            .catch(error => res.status(400).json(error))
        }
        
        // Si l'utilisateur veut retirer son dislike alors on le retire aussi du tableau appropié
        else if(sauce.usersDisliked.includes(userId) && req.body.like === 0){
                Sauces.updateOne
                (
                    {_id:req.params.id},
                    {
                        $inc:{dislikes:-1},
                        $pull:{usersDisliked:userId}}
                )
                .then(() => res.status(201).json({message:"Dislikes updated"}))
                .catch(error => res.status(400).json(error))
            }
        
        // Si l'utilisateur n'aime pas la sauce alors on l'ajoute au tableau approprié puis on prend en compte son dislike
        
        else if(!sauce.usersDisliked.includes(userId) && likeStatus === -1)
        {
            Sauces.updateOne
            (
                {_id:req.params.id},
                {
                $inc:{dislikes:1},
                $push:{usersDisliked:userId}
                }
            )
            .then(() => res.status(201).json({message:"Dislikes updated"}))
            .catch(error => res.status(400).json(error))
        }

        })
        // Si rien ne fonctionne
        .catch(err => res.status(500).json(err))
}

     
  