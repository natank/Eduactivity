/**
 * Product - Belogs to topic
 * Topic - Belongs to category, has many products
 * Category - has many topics
 */
import path from "path";
import Product from '../models/Product';
import Topic from '../models/Topic';
import Category from '../models/Category';
import mongoose from 'mongoose';


exports.getDashboard = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../../dist/dashboard.html'))
}
exports.getCreateProduct = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../../dist/createProduct.html'))
}

exports.getCreateCategory = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../../dist/createCategory.html'))
}

exports.getCreateTopic = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../../dist/createTopic.html'))
}

exports.getEditProduct = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../../dist/createProduct.html'))
}

exports.getEditCategory = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../../dist/createCategory.html'))
}

exports.getEditTopic = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../../dist/createCategory.html'))
}

exports.getTopics = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../../dist/topics.html'))
}

exports.getProducts = function (req, res, next) {
    // get products from db

    res.sendFile(path.resolve(__dirname, '../../dist/products.html'))
}

exports.getCategories = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../../dist/categories.html'))
}

exports.postDeleteProduct = function (req, res, next) {

}

exports.postDeleteCategory = function (req, res, next) {

}

exports.postDeleteTopic = function (req, res, next) {

}

exports.postCreateProduct = async function (req, res, next) {
    try {
        const { title, price, description, imageName, printableName, category } = req.fields;
        let product = await Product.create({
            title: title,
            price: price,
            description: description,
            imageName: imageName,
            printableName: printableName,
            category: category,
            createdBy: mongoose.Types.ObjectId('4edd40c86762e0fb12000003')
        })
        res.redirect('/admin/products')
        console.log(product)
    } catch (err) {
        next(err)
    }

}

exports.postEditProduct = async function (req, res, next) {
    const id = mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
    const result = await Product.update({ _id: id }, {})
    res.redirect('/admin/products')
}

exports.postCreateCategory = async function (req, res, next) {
    const { title } = { ...req.body }
    const category = await Category.create({
        title,
        createdBy: mongoose.Types.ObjectId('4edd40c86762e0fb12000003')
    })
    res.redirect('/admin/categories')
}

exports.postEditCategory = function (req, res, next) {
    res.redirect()
}

exports.postCreateTopic = async function (req, res, next) {
    const {title, description, category, imageName} = req.fields
    await Topic.create({
        title,
        category: mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
        description,
        imageName,
        createdBy: mongoose.Types.ObjectId('4edd40c86762e0fb12000003')
    })
    res.redirect('topics')
}

exports.postEditTopic = function (req, res, next) {
    res.redirect()
}
exports.postFilterTopics = function (req, res, next) {
    res.redirect()
}
exports.postFilterProducts = function (req, res, next) {
    res.redirect()
}

