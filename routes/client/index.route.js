const home = require("./home.route");
const productRoutes = require("./product.route");

module.exports = (app) => {
  app.use("/", home);
  
  
  app.use("/products", productRoutes);
}