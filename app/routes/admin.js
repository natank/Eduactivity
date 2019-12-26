const express = require('express'),
  router = express.Router(),
  adminController = require('../controllers/admin');
const uploadProductFiles = require('../middleware/uploadProductFiles')
const uploadTopicFiles = require('../middleware/uploadTopicFiles');
const uploadSingleFile = require('../middleware/uploadSingleFile');
const { check } = require('express-validator');


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

router.post('/createProduct', uploadProductFiles, [
  check('title')
    .isLength({
      min: 2
    }).withMessage('Title must contain 2 or more chars'),
  check('description')
    .isLength({
      min: 15,
      max: 100
    }).withMessage('Description must contain 15-100 characters'),
  check('price')
    .isNumeric()
    .withMessage('Price must contain only digits'),
  check('topic')
    .isAscii()
    .withMessage('One topic must be selected'),
  check('imageName')
    .isAscii()
    .withMessage('Please provide proudct image'),
  check('printableName')
    .isAscii()
    .withMessage('Please provide printable file')
], adminController.postCreateProduct);
router.post('/editProduct', uploadProductFiles, adminController.postEditProduct);

router.post('/createCategory', adminController.postCreateCategory);
router.post('/editCategory', adminController.postEditCategory);

router.post('/createTopic', uploadTopicFiles, adminController.postCreateTopic);
router.post('/editTopic', uploadSingleFile, adminController.postEditTopic);

router.post('/filterTopics', adminController.postFilterTopics);
router.post('/filterProducts', adminController.postFilterProducts);

module.exports = router;
