const express = require('express'),
  router = express.Router(),
  adminController = require('../controllers/admin');
  const uploadProductFiles = require('../middleware/uploadProductFiles')
  const uploadTopicFiles = require('../middleware/uploadTopicFiles')
  
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

router.post('/createProduct', uploadProductFiles, adminController.postCreateProduct);
router.post('/editProduct', adminController.postEditProduct);
router.post('/deleteProduct', adminController.postDeleteProduct);

router.post('/createCategory', adminController.postCreateCategory);
router.post('/editCategory', adminController.postEditCategory);
router.post('/deleteCategory', adminController.postDeleteCategory);

router.post('/createTopic', uploadTopicFiles, adminController.postCreateTopic);
router.post('/editTopic', adminController.postEditTopic);
router.post('/deleteTopic', adminController.postDeleteTopic);

router.post('/filterTopics', adminController.postFilterTopics);
router.post('/filterProducts', adminController.postFilterProducts);

module.exports = router;
