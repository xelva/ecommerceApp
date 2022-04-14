
const productsRepo = require('../../repositories/products.js')
const express = require('express');
const productsNewTemplate = require('../../Views/admin/products/new.js');
const { checkTitle, checkPrice } = require('./validators.js');
const { validationResult } = require('express-validator');

const router = express.Router();

router.get('/admin/products', (req, res) => {

});

router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}));

});

router.post('/admin/products/new', [
    checkTitle, checkPrice
], (req, res) => {
    const errors = validationResult(req);
    
    req.on('data', data => {
        console.log(data.toString());
    })
    res.send('submitted');
});

module.exports = router;