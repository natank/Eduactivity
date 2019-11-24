const express = require("express");
const path = require('path')
const shopController = require('../controllers/shop')
const router = express.Router();

router.get('/', shopController.getHome)

router.get('/topic/:id', shopController.getTopic)
router.get('/product/:id', shopController.getProduct)
module.exports = router;