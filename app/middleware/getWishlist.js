module.exports = async function (req, res, next) {
  // check if user is logged in
  if ((req.session.isLoggedIn)) {
    let user = req.user;
    if (user) {
      try {
        // query the DB for the wishlist obj
        let wishlist = await user.getWishlistProducts();
        // set res.locals.wishlistProducts to products obj
        res.locals.wishlist = wishlist;
        // call the next middleware
        next();
      } catch (err) {
        next(err)
      }
    } else {
      // if user is not logged in, just call the next middleware 
      next()
    }

  }
}