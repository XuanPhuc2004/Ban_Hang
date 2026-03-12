const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  if(!req.cookies.cartId) {
    // tạo giỏ hàng
    const cart = new Cart();
    await cart.save();

    const expiresCooke = 365 * 24 * 60 * 60 * 1000;

    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresCooke)
    });

  } else {
    // lấy ra thôi
  }

  next();
}