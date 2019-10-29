const express = require('express'),
  router = express.Router();

router.get('/', (req, res, next) => res.send("<h1>Hi from admin</h1>"))

module.exports = router
