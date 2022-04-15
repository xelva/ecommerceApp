const express = require('express');
const usersRepo = require('../../repositories/users.js');
const signupTemplate = require('../../views/admin/auth/signup.js');
const signinTemplate = require('../../views/admin/auth/signin.js')
const { handleErrors } = require('./middlewares.js')
const { requireEmail, requirePassword, requirePasswordConfirmation, checkEmail, checkPassword } = require('./validators.js');

//create a subrouter to export to the main express app router in app.js
const router = express.Router();

router.get('/signup', (req, res)=>{
    //req = request, incoming 
    //res = response, outgoing
    //if response looks like html, express will send it back for the browser to interprit it as such
    res.send(signupTemplate({ req }));
});


router.post('/signup', 
    [requireEmail, requirePassword, requirePasswordConfirmation],
    handleErrors(signupTemplate),
    async (req, res) => { //midleware is automatically added before req, res
        const { email, password } = req.body;
        const user = await usersRepo.create({ email, password});
        //store the id and include in the user cookie
        //cookie-session library adds middleware, allows us to access req.session
        req.session.userId = user.id;

        res.redirect('/admin/products');
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.send(`You're logged out!`)
})

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}));
})

router.post('/signin', [checkEmail, checkPassword],
    handleErrors(signinTemplate),
    async (req, res) => {
        const { email } = req.body;
        const user = await (usersRepo.getOneBy( { email }));
        if (!user) {
            return res.send('Email not found');
        }

        req.session.userId = user.id;

        res.redirect('/admin/products');
})

module.exports = router;