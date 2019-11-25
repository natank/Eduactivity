
const express = require("express"),
      router = express.Router(),
      authController = require('../controllers/auth');

router.get('/signup', authController.getSignup);
router.get('/login', authController.getLogin);
router.get('/logout', authController.getLogout);
router.post('/signup', authController.postSignup);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);

module.exports = router;