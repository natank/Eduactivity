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
import fs from 'fs'

exports.getDashboard = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../../dist/dashboard.html'))
}
exports.getCreateProduct = function (req, res, next) {
    res.render('admin/createProduct', { edit: false });
}

exports.getCreateCategory = function (req, res, next) {
    res.render('admin/createCategory', { edit: false })
}

exports.getCreateTopic = async function (req, res, next) {
    const categories = await Category.find({}, 'title');
    res.render('admin/createTopic', { edit: false, categories: categories })
}

exports.getEditProduct = async function (req, res, next) {
    try {
        let product = await Product.findById(req.params.id);
        res.render('admin/createProduct', { product: product, isEdit: true })
    } catch (err) {
        next(err)
    }

}

exports.getEditCategory = function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../../dist/createCategory.html'))
}

exports.getEditTopic = async function (req, res, next) {
    try {
        const topic = await Topic.findById(req.params.id).populate({
            path: 'category',
            select: 'title'
        })
        const category = await Category.findById(topic.category._id);
        topic.category = category;
        let categories = await Category.find({}, 'title');

        categories = categories.map(category => {
            category.id === topic.category.id ? category.selected = true : category.selected = false;
            return category;
        })
        res.render('admin/createTopic', { topic: topic, isEdit: true, categories: categories })
    } catch (err) {
        next(err)
    }
}

exports.getTopics = async function (req, res, next) {
    try {
        const topics = await Topic.find();

        res.render('admin/topics', { topics: topics })
    } catch (err) {
        next(err)
    }
}

exports.getProducts = async function (req, res, next) {
    try {
        const products = await Product.find();
        res.render('admin/products', { products: products })
    } catch (err) {
        next(err)
    }
}

exports.getCategories = async function (req, res, next) {
    try {
        const categories = await Category.find();

        res.render('admin/categories', { categories: categories })

    } catch (err) {
        next(err)
    }
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
    const { title, description, category, imageName } = req.fields
    await Topic.create({
        title,
        category: category,
        description,
        imageName,
        createdBy: mongoose.Types.ObjectId('4edd40c86762e0fb12000003')
    })
    res.redirect('topics')
}

exports.postEditTopic = async function (req, res, next) {
    const { title, description, category, topicId } = req.fields,
    fileName = req.fileName,
    filePath = req.filePath,
    fileExist = req.fileExist;

    const keys = { title, description, category, imageName: fileName }
    if (fileExist) { // new image was updated
        debugger
        let topic
        try{
            topic = await Topic.findById(topicId, 'imageName')
            if(!topic) throw(err)
        } catch(err){
            next(err)
        }
        // delete the previous image
        const fileToDelete = `./app/images/${topic.imageName}`
        if (fs.existsSync(fileToDelete)) {
            fs.unlinkSync(fileToDelete, err => {
                if (err) next(err)
            })
        }

        // save the new file to images folder
        const imagePath = path.join(
             __dirname,
             '../images',
            fileName
        );

        try {
            await renamePath(filePath, imagePath)
        } catch (err) {
            next(err)
        }
    } else {
        delete keys.imageName
    }

    try {
        // const topic = await Topic.findOneAndUpdate({ _id: _id }, keys);
        const topic = await Topic.updateOne({ _id: _id }, keys);
    } catch (err) {
        next(err)
    }
    res.redirect('topics')
}
exports.postFilterTopics = function (req, res, next) {
    res.redirect()
}
exports.postFilterProducts = function (req, res, next) {
    res.redirect()
}

