const express = require('express');
const productsRepo = require('../repositories/products.js')

const router = express.Router();

router.get('/getProducts', async (req, res) => {
    const getProduct = await productsRepo.getOne('52def6e6')
    console.log(getProduct.title);
    res.send('hey')
});

module.exports = router;