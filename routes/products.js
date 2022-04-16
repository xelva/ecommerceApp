const express = require('express');
const productsRepo = require('../repositories/products.js')
const productsIndexTemplate = require('../Views/products/index.js')

const router = express.Router(); 

router.get('/', async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({products}))

})

module.exports = router;