const isAuth = require('../middleware/is-auth');

const express = require("express");
const path = require('path')
const shopController = require('../controllers/shop')
const router = express.Router();

router.get('/', shopController.getHome)

router.get('/topic/:id', shopController.getTopic)
router.get('/product/:id', shopController.getProduct)

router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.get('/checkout', isAuth, shopController.getCheckout);

router.post('/create-order', isAuth, shopController.postOrder); // from cart
router.get('/orders', isAuth, shopController.getOrders);
router.get('/orders/:orderId',
  isAuth,
  shopController.findOrderToDownload,
  shopController.getInvoiceName,
  shopController.getInvoiceFile);

module.exports = router;