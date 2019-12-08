const path = require('path');
const Category = require('../models/Category');
const Topic = require('../models/Topic');
const Product = require('../models/Product');

exports.getHome = async function (req, res, next) {

  try {
    const categories = await Category.find({}, 'title')
    let topicsPerCategoryPromise = categories.map(category => {
      return Topic.find({ category: category.id }, "title").exec()
    })
    let topicsPerCategory = await Promise.all(topicsPerCategoryPromise)
    let data = topicsPerCategory.map((topics, index) => {
      let entry = {
        category: categories[index],
        topics: topics
      }
      return entry
    })
    res.render('./shop/index', { data: data })
  } catch (err) {
    next(err)
  }
}

exports.getTopic = async function (req, res, next) {
  try {
    const topic = await Topic.findById(req.params.id);
    const products = await Product.find({ topic: req.params.id });

    res.render('./shop/topic', { topic: topic, products: products })
  } catch (err) {
    next(err)
  }

}

exports.getProduct = async function (req, res, next) {
  try {

  } catch (err) {
    next(err)
  }
  const prodId = req.params.id;
  const product = await Product.findById(prodId);
  res.render('./shop/product', { product: product })
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
      cart: uiCart
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
      orders: uiOrders
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
  req.invoicePath = path.join('data', 'invoices', req.invoiceName);
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

    pdfDoc.pipe(fs.createWriteStream(req.invoicePath));
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