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
import fs from 'fs';
import renamePath from '../util/renamePath';
const { check, validationResult } = require('express-validator');

exports.getDashboard = function (req, res, next) {
    res.render('./admin/dashboard', { page: 'admin', isAdmin: req.user.admin })
}
exports.getCreateProduct = async function (req, res, next) {
    try {
        let topics = await Topic.find({}, 'title')
        res.render('admin/createProduct', { renderAs: 'new', topics: topics, page: 'admin' });
    } catch (err) {
        next(err)
    }
}

exports.getCreateCategory = function (req, res, next) {
    res.render('admin/createCategory', { edit: false, page: 'admin' })
}

exports.getCreateTopic = async function (req, res, next) {
    const categories = await Category.find({}, 'title');
    res.render('admin/createTopic', { edit: false, categories: categories, page: 'admin' })
}

exports.getEditProduct = async function (req, res, next) {
    try {
        let product = await Product.findById(req.params.id).populate({ path: 'topic', select: 'title' });
        let topics = await Topic.find({}, 'title')
        res.render('admin/createProduct', {
            product: product, renderAs: 'edit',
            topics: topics, page: 'admin'
        })
    } catch (err) {
        next(err)
    }

}

exports.getEditCategory = async function (req, res, next) {
    const category = await Category.findById(req.params.id);
    res.render('admin/createCategory', { category: category, isEdit: true, page: 'admin' })
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
        res.render('admin/createTopic', { topic: topic, isEdit: true, categories: categories, page: 'admin' })
    } catch (err) {
        next(err)
    }
}

exports.getTopics = async function (req, res, next) {
    const filter = req.query.filter;
    let query;
    if (filter && filter != 'all') {
        query = Topic.find({ category: filter })
    } else {
        query = Topic.find()
    }
    try {
        const topics = await query.populate({
            path: 'category',
            select: 'title'
        });
        const categories = await Category.find({}, 'title')
        res.render('admin/topics', { topics: topics, categories: categories, filter: filter, page: 'admin' })
    } catch (err) {
        next(err)
    }
}

exports.getProducts = async function (req, res, next) {
    const filter = req.query.topic;
    let query;

    if (filter && filter != 'all') {
        query = Product.find({ topic: filter })
    } else {
        query = Product.find();
    }
    try {
        let products = await query.populate({
            path: 'topic',
            select: 'title'
        });
        const topics = await Topic.find({}, 'title')
        res.render('admin/products', { products: products, topics: topics, filter: filter, page: 'admin' })
    } catch (err) {
        next(err)
    }
}

exports.getCategories = async function (req, res, next) {
    try {
        const categories = await Category.find();

        res.render('admin/categories', { categories: categories, page: 'admin' })

    } catch (err) {
        next(err)
    }
}

exports.getDeleteProduct = async function (req, res, next) {
    try {
        const product = await Product.findById(req.params.id);
        let { imageName, printableName } = product;
        let imagePath = path.resolve(__dirname, `../images/${imageName}`)
        let printablePath = path.resolve(__dirname, `../images/${printableName}`)

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
        }
        if (fs.existsSync(printablePath)) {
            fs.unlinkSync(printablePath)
        }
        await Product.deleteOne({ _id: req.params.id })
    } catch (err) {
        next(err)
    }
    res.redirect('/admin/products')
}

exports.getDeleteCategory = async function (req, res, next) {
    const categoryId = req.params.id;
    try {
        const topicsCount = await Topic.countDocuments({ category: categoryId })
        if (topicsCount === 0) {
            await Category.deleteOne({ _id: categoryId })
        } else {
            console.log("There are topics related to this category. Please delete them first")
        }
        res.redirect('/admin/categories')
    } catch (err) {
        next(err)
    }
}

exports.getDeleteTopic = async function (req, res, next) {
    const topicId = req.params.id;

    try {
        const topic = await Topic.findById(topicId).select('imageName');
        fs.unlinkSync(path.resolve(__dirname, `../images/${topic.imageName}`));
        await Topic.deleteOne({ _id: topicId })
    } catch (err) {
        next(err)
    }
    res.redirect('/admin/topics')
}

exports.postCreateProduct = async function (req, res, next) {
    const errors = validationResult(req);
    const { title, price, description, imageName, printableName, topic } = req.body;
    if (errors.isEmpty()) {
        await createTheProduct()
    } else {
        showErrors()
    }
    async function createTheProduct() {
        try {
            let product = await Product.create({
                title: title,
                price: price,
                description: description,
                imageName: imageName,
                printableName: printableName,
                topic: topic,
                createdBy: mongoose.Types.ObjectId('4edd40c86762e0fb12000003')
            })
            res.redirect('/admin/products')
        } catch (err) {
            next(err)
        }
    }

    async function showErrors() {
        let topics = await Topic.find({}, 'title')
        const validationErrors = errors.array().reduce((errorObj, error) => {
            let { param } = error
            // if field contains more than one validation error - show only the first
            if (!errorObj[param]) errorObj[param] = error.msg
            return errorObj
        }, {})
        res.status(422).render('admin/createProduct', {
            renderAs: 'errors',
            topics: topics,
            product: { title, price, description, topic },
            validationErrors,
            page: 'admin'
        })
    }

}

exports.postEditProduct = async function (req, res, next) {
    const { title, price, description, imageName, printableName, topic, prodId } = req.body;

    // check if new files where uploaded and update the db
    let newValues = { title, price, description, topic }
    if (imageName) {
        newValues.imageName = imageName
    }
    if (printableName) {
        newValues.printableName = printableName
    }
    try {
        await Product.updateOne({ _id: prodId }, newValues)
    } catch (err) {
        next(err)
    }
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

exports.postEditCategory = async function (req, res, next) {
    try {
        await Category.updateOne({ _id: req.body.id }, { title: req.body.title })
    } catch (err) {
        next(err)
    }

    res.redirect('/admin/categories')
}

exports.postCreateTopic = async function (req, res, next) {
    const { title, description, category, imageName } = req.body
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
    const { title, description, category, topicId } = req.body,
        fileName = req.fileName,
        filePath = req.filePath,
        fileExist = req.fileExist;

    const keys = { title, description, category, imageName: fileName }
    if (fileExist) { // new image was updated
        let topic
        try {
            topic = await Topic.findById(topicId, 'imageName')
            if (!topic) throw (err)
        } catch (err) {
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
        const topic = await Topic.updateOne({ _id: topicId }, keys);
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

