const express = require('express'),
  router = express.Router(),
  adminController = require('../controllers/admin');
const uploadProductFiles = require('../middleware/uploadProductFiles');
const uploadTopicFile = require('../middleware/uploadTopicFile');


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

router.post(
  '/createProduct',
  // Extract file names and include them in the body for validation
  (req, res, next) => {
    let { files } = { ...req };
    if (files.printable && files.imageurl) {
      req.body.printableName = files.printable.name || undefined;
      req.body.imageName = files.imageurl.name || undefined;
    }
    next();
  },
  //first check for existance of numerical inputs
  [
    check('printableName')
      .custom(value => {
        let hasSpaces = !/\s/.test(value);
        return hasSpaces;
      })
      .withMessage('No spaces are allowed in the printable name'),
    check('imageName')
      .custom(value => !/\s/.test(value))
      .withMessage('No spaces are allowed in the image name'),
    check('title')
      .isLength({
        min: 2
      })
      .withMessage('Title must contain 2 or more chars'),
    check('description')
      .isLength({
        min: 15,
        max: 100
      })
      .withMessage('Description must contain 15-100 characters'),
    check('price')
      .isNumeric()
      .withMessage('Price must contain only digits'),
    check('topic')
      .isAscii()
      .withMessage('One topic must be selected')
  ],
  // Continue for files input
  uploadProductFiles,
  // Validate existance of files
  [
    check('imageUrl')
      .isAscii()
      .withMessage('Please provide proudct image'),
    check('printableUrl')
      .isAscii()
      .withMessage('Please provide printable file')
  ],
  adminController.postCreateProduct
);

// TODO: Add validation checks for other forms
router.post(
  '/editProduct',
  uploadProductFiles,
  adminController.postEditProduct
);

router.post('/createCategory', adminController.postCreateCategory);
router.post('/editCategory', adminController.postEditCategory);

router.post('/createTopic', uploadTopicFile, adminController.postCreateTopic);
router.post('/editTopic', uploadTopicFile, adminController.postEditTopic);

router.post('/filterTopics', adminController.postFilterTopics);
router.post('/filterProducts', adminController.postFilterProducts);

module.exports = router;
