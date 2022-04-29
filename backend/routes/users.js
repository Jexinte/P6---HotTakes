const express  = require('express')
const router = express.Router()
const usersControllers = require('../controllers/users')
const passwordCheck = require('../middleware/password-validator')
router.use(express.json())

// Permet l'application front-end de se connecter à l'api
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next()
  });

  // Requête d'inscription
router.post('/signup',passwordCheck,usersControllers.signUp)
  // Requête de connexion
router.post('/login',usersControllers.login)


module.exports = router