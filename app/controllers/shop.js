const path = require('path');
const Category = require('../models/Category');
const Topic = require('../models/Topic');
const Product = require('../models/Product');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const mkdirp = require('mkdirp')
exports.getHome = async function (req, res, next) {

  try {
    const categories = await Category.find({}, 'title')
    // For every category - get the topics with that category
    let topicsPerCategoryPromise = categories.map(category => {
      return Topic.find({ category: category.id }, "title").exec()
    })
    let topicsPerCategory = await Promise.all(topicsPerCategoryPromise);

    // Create the data stracture for the ui
    let data = topicsPerCategory.map((topics, index) => {
      let entry = {
        category: categories[index],
        topics: topics
      }
      return entry
    })

    // Filter categories that don't have topic yet.
    data = data.filter(entry => {
      const hasTopics = Array.isArray(entry.topics) && entry.topics.length;
      return hasTopics;
    })

    res.render('./shop/index', { data: data, page: 'shop', isLoggedIn: req.user, isAdmin: req.user && req.user.admin })
  } catch (err) {
    next(err)
  }
}

exports.getCategory = async function (req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    const topics = await Topic.find({ category: req.params.id });

    res.render('./shop/category', { category: category, topics: topics, page: 'shop' })
  } catch (err) {
    next(err)
  }

}

exports.getTopic = async function (req, res, next) {
  try {
    const topic = await Topic.findById(req.params.id);
    const products = await Product.find({ topic: req.params.id });
    // Determine which products are in myProducts of the user
    products = products.map(product => {
      let prodId = product.id;
      product.myProduct = req.user.myProducts.find(productId => productId === prodId)
      return product
    })
    res.render('./shop/topic', { topic: topic, products: products, page: 'shop' })
  } catch (err) {
    next(err)
  }

}

exports.getProduct = async function (req, res, next) {
  const prodId = req.params.id;
  try {
    const product = await Product.findById(prodId);
  } catch (err) {
    next(err)
  }

  if (product) {
    // Determine if the product is in myProducts of the user
    product.myProduct = req.user.myProducts.find(productId => productId === prodId)
    res.render('./shop/product', { product: product, page: 'shop' })
  } else {
    let err = "Error: No such product"
    next(err)
  }
}


exports.getCart = async (req, res, next) => {
  try {
    let user = await req.user.populate({
      path: 'cart.product',
    }).execPopulate();

    let uiCart = user.cart.map(item => {
      let cartItem = {
        product: item.product,
        quantity: item.quantity
      }
      return cartItem;
    });
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      cart: uiCart, page: 'shop'
    });
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error)
  }
};

exports.postCart = async (req, res, next) => {

  const prodId = req.body.productId;
  try {

    await Product.estimatedDocumentCount({ _id: prodId }, async (err, num) => {
      if (err) throw (err)
      else if (num > 0) {
        let result = await req.user.addToCart(prodId);
      }
      res.redirect('/cart');
    });
    // console.log(result);
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error)
  }

};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  let user = await req.user.populate({
    path: 'cart.item.product',
  }).execPopulate();

  user.cart = user.cart.filter(item => {
    let leaveInCart = item.product.toString() !== prodId;
    return leaveInCart;
  });
  try {
    await user.save();
    res.redirect('/cart');
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error)
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    await req.user.addOrder();
    res.redirect('/orders');
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error)
  }
};

exports.getOrders = async (req, res, next) => {
  let orders;
  try {
    orders = await req.user.getOrders();
    let uiOrders = orders.map(order => {
      let uiOrder = {}
      uiOrder._id = order._id;
      uiOrder.prods = order.items.map(item => {
        let prod = {
          title: item.product.title,
          quantity: item.quantity
        }
        return prod
      });
      return uiOrder;
    })

    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: uiOrders,
      page: 'shop'
    });
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error)
  }
};


exports.findOrderToDownload = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders()
    const result = orders.find(function (order) {
      return order._id.toString() === req.params.orderId
    })
    if (!result) next(new Error('No order found.'))

    else {
      req.order = result
      next()
    }
  } catch (err) {
    next(err)
  }
}


exports.getInvoiceName = (req, res, next) => {
  req.invoiceName = `invoice_${req.params.orderId}.pdf`
  const dir = path.join('data', 'invoices');
  if (!fs.existsSync(dir)) {
    mkdirp(dir, err => {
      if (err) console.log(err);
      else console.log('dir created');
    })
  }

  req.invoicePath = path.join(dir, req.invoiceName);

  next()
}

exports.getInvoiceFile = async (req, res, next) => {
  try {
    const pdfDoc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="' + req.invoiceName + '"'
    );

    const ws = fs.createWriteStream(req.invoicePath)
    ws.on('error', e => {
      console.log(`failed creating write stream: ${e}`)
    })
    pdfDoc.pipe(ws);

    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text('Invoice', {
      underline: true
    });

    pdfDoc.text('------------------------');
    let totalPrice = 0;
    req.order.items.forEach(item => {
      pdfDoc.fontSize(14).text(`${item.product.title} - ${item.quantity} x $ ${item.product.price}`);
      totalPrice += item.quantity * item.product.price
    })
    pdfDoc.fontSize(20).text('----')
    pdfDoc.text(`Total Price: $${totalPrice}`);

    pdfDoc.end();
    // let data = await new Promise((resolve, reject) => {
    //   fs.readFile(req.invoicePath, (err, data) => {
    //     if (err) reject(err)
    //     else resolve(data)
    //   })
    // })
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'inline; filename="' + req.invoiceName + '"');
    // res.send(data);

    // const file = fs.createReadStream(req.invoicePath);
    // file.pipe(res);
  } catch (err) {
    next(err)
  }
}

exports.getCheckout = async (req, res, next) => {
  try {
    let user = await req.user.populate({
      path: 'cart.product',
    }).execPopulate();

    let uiCart = user.cart.reduce((prev, item, index, cart) => {
      if (item.product) {
        let cartItem = {
          product: item.product,
          quantity: item.quantity
        }
        prev.push(cartItem)
      } else {
        // if product not exist anymore - remove it from cart
        cart.splice(index)
      }
      return prev;
    }, []);
    // await user.save();

    let totalCartValue = uiCart.reduce((prev, curr) => {
      return prev + curr.product.price * curr.quantity
    }, 0)

    const stripe = require('stripe')('sk_test_nnqXbNzNuX3Fy5p9NjjHX9ft00wlTX6B5H');

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        name: 'T-shirt',
        description: 'Comfortable cotton t-shirt',
        images: ['https://example.com/t-shirt.png'],
        amount: 500,
        currency: 'usd',
        quantity: 1,
      }],
      success_url: 'http://127.0.0.1:8080/shop/create-order/?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://example.com/cancel',
    });

    const {
      id
    } = checkoutSession;


    res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Checkout',
      cart: uiCart,
      totalSum: totalCartValue,
      checkoutSessionId: id,
      page: 'shop'
    });
  } catch (err) {
    const error = new Error(err)
    error.httpStatusCode = 500;
    return next(error)
  }
}
