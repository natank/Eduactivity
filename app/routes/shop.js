const isAuth = require('../middleware/is-auth').isLoggedIn;

const express = require("express");
const path = require('path')
const shopController = require('../controllers/shop')
const router = express.Router();

router.get('/', shopController.getHome);
router.get('/categories', shopController.getCategories);
router.get('/topic/:id', shopController.getTopic);
router.get('/product/:id', shopController.getProduct);
router.get('/category/:id', shopController.getCategory);
router.get('/my-products', shopController.getMyProducts);
router.get('/download/:id',
  shopController.validateProductOwnership,
  shopController.getDownloadProduct
)

router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/wishlist', shopController.postWishlist)
router.delete('/wishlist', shopController.deleteWishlist)

router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/create-order', isAuth, shopController.postOrder); // from cart
router.get('/orders', isAuth, shopController.getOrders);
router.get('/orders/:orderId',
  isAuth,
  shopController.findOrderToDownload,
  shopController.getInvoiceFile);

module.exports = router;  