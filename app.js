const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth.js');
const productsRouter = require('./routes/admin/products.js');

const app = express(); //describes everything our web server can do

//add in middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));//use 'use' to have all route handlers use this middleware, will not be used in GET request
app.use(cookieSession({
    keys: ['asdflkjdsifjlsdf443jl']
}));
app.use(authRouter);
app.use(productsRouter);

app.listen(3000, () => {
    //setup your server to watch for incoming requests on the specified port (3000 in this case)
    console.log('Listening');
})

