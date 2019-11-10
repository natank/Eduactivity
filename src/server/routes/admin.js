const express = require('express'),
  router = express.Router(),
  adminController = require('../controllers/admin');
const uploadFile = require('../middleware/uploadProductFiles')

router.get('/', adminController.getDashboard);
router.get('/createProduct', adminController.getCreateProduct);
router.get('/createCategory', adminController.getCreateCategory);
router.get('/createTopic', adminController.getCreateTopic);
router.get('/editProduct', adminController.getEditProduct);
router.get('/editCategory', adminController.getEditCategory);
router.get('/editTopic', adminController.getEditTopic);

router.get('/topics', adminController.getTopics);
router.get('/categories', adminController.getCategories);
router.get('/products', adminController.getProducts);

router.post('/deleteProduct', adminController.postDeleteProduct);
router.post('/deleteCategory', adminController.postDeleteCategory);
router.post('/deleteTopic', adminController.postDeleteTopic);

router.post('/createProduct', uploadFile, adminController.postCreateProduct);
router.post('/editProduct', adminController.postEditProduct);
router.post('/createCategory', adminController.postCreateCategory);
router.post('/editCategory', adminController.postEditCategory);
router.post('/createTopic', adminController.postCreateTopic);
router.post('/editTopic', adminController.postEditTopic);
router.post('/filterTopics', adminController.postFilterTopics);
router.post('/filterProducts', adminController.postFilterProducts);

module.exports = router;
