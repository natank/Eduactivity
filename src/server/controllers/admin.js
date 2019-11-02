/**
 * Product - Belogs to topic
 * Topic - Belongs to category, has many products
 * Category - has many topics
 */
import path from "path";
import Product from '../models/Product';
import mongoose from 'mongoose';

exports.getCreateProduct = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../dist/createProduct.html'))
}

exports.getCreateCategory = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../dist/createCategory.html'))
}

exports.getCreateTopic = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../dist/createTopic.html'))
}

exports.getEditProduct = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../dist/createProduct.html'))
}

exports.getEditCategory = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../dist/createCategory.html'))
}

exports.getEditTopic = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../dist/createCategory.html'))
}

exports.getTopics = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../dist/topics.html'))
}

exports.getProducts = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../dist/products.html'))
}

exports.getCategories = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../dist/categories.html'))
}

exports.postDeleteProduct = function (req, res, next) {

}

exports.postDeleteCategory = function (req, res, next) {

}

exports.postDeleteTopic = function (req, res, next) {

}

exports.postCreateProduct = async function (req, res, next) {
    try {
        let product = await Product.create({
            title: "Unicorn",
            price: 1.2,
            description: "Lorem ipsum dolor sit amet",
            imageUrl: "http://image",
            fileUrl: "http://file",
            category: mongoose.Types.ObjectId('4edd40c86762e0f123456789'),
            createdBy: mongoose.Types.ObjectId('4edd40c86762e0fb12000003')
        })
        res.redirect('/admin/createProduct')
        console.log(product)
    } catch (err) {
        next(err)
    }

}

exports.postEditProduct = async function (req, res, next) {
    const id = mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
    const result = await Product.update({ _id: id }, {})
    res.redirect('/product')
}

exports.postCreateCategory = function (req, res, next) {
    res.redirect()
}

exports.postEditCategory = function (req, res, next) {
    res.redirect()
}

exports.postCreateTopic = function (req, res, next) {
    res.redirect()
}

exports.postEditTopic = function (req, res, next) {
    res.redirect()
}
