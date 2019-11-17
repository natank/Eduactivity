const express = require('express'),
  router = express.Router(),
  adminController = require('../controllers/admin');
const uploadProductFiles = require('../middleware/uploadProductFiles')
const uploadTopicFiles = require('../middleware/uploadTopicFiles');
const uploadSingleFile = require('../middleware/uploadSingleFile');

router.get('/', adminController.getDashboard);
router.get('/createProduct', adminController.getCreateProduct);
router.get('/createCategory', adminController.getCreateCategory);
router.get('/createTopic', adminController.getCreateTopic);
router.get('/editProduct/:id', adminController.getEditProduct);
router.get('/editCategory/:id', adminController.getEditCategory);
router.get('/editTopic/:id', adminController.getEditTopic);
router.get('/deleteProduct/:id', adminController.getDeleteProduct);
router.get('/deleteCategory/:id', adminController.getDeleteCategory);
router.get('/deleteTopic/:id', adminController.getDeleteTopic);

router.get('/topics', adminController.getTopics);
router.get('/categories', adminController.getCategories);
router.get('/products', adminController.getProducts);

router.post('/createProduct', uploadProductFiles, adminController.postCreateProduct);
router.post('/editProduct', adminController.postEditProduct);

router.post('/createCategory', adminController.postCreateCategory);
router.post('/editCategory', adminController.postEditCategory);

router.post('/createTopic', uploadTopicFiles, adminController.postCreateTopic);
router.post('/editTopic', uploadSingleFile, adminController.postEditTopic);

router.post('/filterTopics', adminController.postFilterTopics);
router.post('/filterProducts', adminController.postFilterProducts);

module.exports = router;
