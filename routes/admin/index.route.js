const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");
const productdRoutes = require("./product.route");
const productCategorydRoutes = require("./products-category.route");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
  app.use(PATH_ADMIN + "/products", productdRoutes);
  app.use(PATH_ADMIN + "/products-category", productCategorydRoutes);
 
}