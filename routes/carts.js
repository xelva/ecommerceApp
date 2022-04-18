const express = require('express');
const cartsRepo = require('../repositories/carts.js');
const productsRepo = require('../repositories/products.js')
const cartShowTemplate = require('../Views/carts/show.js')

const router = express.Router();

// receive post request to add item to cart
router.post('/cart/products', async (req, res) => {
    //figure out the cart
    let cart;
    if (!req.session.cartId) {
        //we don't have a cart and store cart id on cartId propertyof req.session
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
    } else {
        cart = await cartsRepo.getOne(req.session.cartId);
    }
    //either increment existing product
    //or add new item to item array
    const existingItem = cart.items.find(item => item.id === req.body.productId)
    if (existingItem) {
        existingItem.quantity++
    } else {
        cart.items.push({ id: req.body.productId, quantity: 1});
    }

    await cartsRepo.update(cart.id, {
        items: cart.items
    });

    res.redirect('/cart')
})

// receive a get request to show items in cart
router.get('/cart', async (req, res) => {
    if (!req.session.cartId) {
        return res.redirect('/');
    }

    const cart = await cartsRepo.getOne(req.session.cartId);
   
    for (let item of cart.items) {
        const product = await productsRepo.getOne(item.id);

        item.product = product;
    }
   
   res.send(cartShowTemplate( {items: cart.items}));
});

// reveive a post request to delete item form cart 
 router.post('/cart/:id/delete', async (req, res) => {
    const cart = await cartsRepo.getOne(req.session.cartId);
    const itemId = req.params.id;
    
    for (let item of cart.items) {
        if (itemId === item.id) {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                console.log('delete me')
            }
        }
    }
    await cartsRepo.update(cart.id, {
        items: cart.items
    })
    res.redirect('/cart')
 })

module.exports = router;