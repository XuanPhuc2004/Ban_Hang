const systemConfig = require("../../config/system");
const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
  });
}


// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products-category/create", {
    pageTitle: "Taọ danh mục sản phẩm",
  });
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  
  console.log(req.body);
  res.send("oke");
};
