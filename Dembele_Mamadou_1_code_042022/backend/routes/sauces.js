const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const saucesControllers = require('../controllers/sauces');
const multer = require('../middleware/multer-config');
router.use(express.json())

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next()
  });

  // Permet d'authentifier l'utilisateur qui se connecte puis affiche ensuite les sauces

  router.get('/', auth , saucesControllers.getAllSauces)
  router.get('/:id', auth, saucesControllers.getSauceById)
  router.put('/:id',auth,multer,saucesControllers.modifySauce)
  router.post('/', auth , multer , saucesControllers.createSauce)
  router.post('/:id/like',auth,saucesControllers.likesAndDislikes)
  router.delete('/:id',auth,saucesControllers.deleteSauce)
  module.exports = router
