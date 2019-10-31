const express = require('express'),
  router = express.Router(),
  adminController = require('../controllers/admin');

router.get('/createProduct',       adminController.getCreateProduct);
router.get('/createCategory',      adminController.getCreateCategory);
router.get('/CreateTopic',         adminController.getCreateTopic);
router.get('/editProduct',      adminController.getEditProduct);
router.get('/editCategory',     adminController.getEditCategory);
router.get('/editTopic',        adminController.getEditTopic);
router.post('/deleteProduct',   adminController.postDeleteProduct);
router.post('/deleteCategory',  adminController.postDeleteCategory);
router.post('/deleteTopic',     adminController.postDeleteTopic);

module.exports = router;
