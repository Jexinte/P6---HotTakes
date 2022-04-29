// Importation du package
const multer = require('multer')
// Dictionnaire d'extension
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg':'jpeg',
    'image/png':'png'
}
// Configuration des fichiers entrants avec les fonction destination et filename
const storage = multer.diskStorage(
{
    destination : (req,file,callback) => {
        // Destination des fichiers entrants dans le dossier images
        callback(null,'images')
    },
    
    filename : (req,file,callback) => {
       
        // Appel du dictionnaire d'extension puis utilisation du paramètre file et de la méthode mimetype qui définira le type d'image du fichier enregistré !
        const extension = MIME_TYPES[file.mimetype]
        // Le callback prend en compte l'erreur , le nom du fichier , sa date de création et son extension
        callback(null,  Date.now() + '.'+ extension)
    }
})
// La configuration terminé , on l'exporte en faisant appel à multer puis le middleware single qui indique le type de fichier attendu !
module.exports = multer({storage}).single('image')