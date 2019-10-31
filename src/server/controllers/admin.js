/**
 * Product - Belogs to topic
 * Topic - Belongs to category, has many products
 * Category - has many topics
 */
import path from "path";

exports.getCreateProduct = function(req, res, next){
    res.sendFile(path.resolve(__dirname, '../dist/createProduct.html'))
}

exports.getCreateCategory = function(req, res, next){    
    res.sendFile(path.resolve(__dirname, '../dist/createCategory.html'))
}

exports.getCreateTopic = function(req, res, next){
    res.sendFile(path.resolve(__dirname, '../dist/createTopic.html'))
}

exports.getEditProduct = function(req, res, next){
    res.sendFile(path.resolve(__dirname, '../dist/createProduct.html'))
}
exports.getEditCategory = function(req, res, next){

}
exports.getEditTopic = function(req, res, next){

}
exports.postDeleteProduct = function(req, res, next){

}
exports.postDeleteCategory = function(req, res, next){

}
exports.postDeleteTopic = function(req, res, next){

}