const express = require("express");
const path = require('path')
const shopController = require('../controllers/shop')
const router = express.Router();

router.get('/', shopController.getHome)

router.get('/topic', shopController.getTopic)
router.get('/product', shopController.getProduct)
module.exports = router;