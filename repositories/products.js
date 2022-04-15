const Repository = require("./repository.js");

class ProductsRepository extends Repository {

};

module.exports = new ProductsRepository('products.json');
