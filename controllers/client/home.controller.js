const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");
const productsHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => {
  // lay san pham noi bat
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  });

  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);

  // lay san pham moi nhat
  const productsNew = await Product.find({
    deleted: false,
    status: "active"
  }).sort({position: "desc"}).limit(6);

  const newProductsNew = productsHelper.priceNewProducts(productsNew);


  res.render("client/pages/home/index", {
    pageTitle: "Trang chu",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
  });
};
