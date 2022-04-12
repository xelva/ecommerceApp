const express = require('express');
const usersRepo = require('../../repositories/users.js');
const signupTemplate = require('../../views/admin/auth/signup.js');
const signinTemplate = require('../../views/admin/auth/signin.js')
const { check, validationResult} = require('express-validator');

//create a subrouter to export to the main express app router in app.js
const router = express.Router();

router.get('/signup', (req, res)=>{
    //req = request, incoming 
    //res = response, outgoing
    //if response looks like html, express will send it back for the browser to interprit it as such
    res.send(signupTemplate({ req }));
});


router.post('/signup', 
    [
        check('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            
            .custom(async email => {
                    const existingUser = await usersRepo.getOneBy({ email });
                    if (existingUser) {
                        throw new Error('Email in use');
                    }
                }
            ),
        check('password')
            .trim()
            .isLength({min: 4, max: 20})
            .withMessage('Must be between 4 and 20 characters'), 
        check('passwordConfirmation')
            .trim()
            .isLength({min: 4, max: 20})
            .withMessage('Must be between 4 and 20 characters')
            .custom((passwordConfirmation, { req }) => {
                if (passwordConfirmation !== req.body.password) {
                    throw new Error('Passwords must match');
                }
            })
    ],
    async (req, res) => { //add any middlewear functions before req,res param
        const errors = validationResult(req);
        console.log(errors);

        const { email, password, passwordConfirmation } = req.body;
       
    if (password !== passwordConfirmation) {
        return res.send('Passwords must match');
    }
    //create a user in rep 

    const user = await usersRepo.create({ email, password});

    //store the id and include in the user cookie
    //cookie-session library adds middleware, allows us to access req.session
    req.session.userId = user.id;

    res.send('Account created');
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.send(`You're logged out!`)
})

router.get('/signin', (req, res) => {
    res.send(signinTemplate());
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await (usersRepo.getOneBy( { email }));
    if (!user) {
        return res.send('Email not found');
    }

    const validPassword = await usersRepo.comparePassword(
        user.password,
        password
    );

    if (!validPassword) {
        return res.send('Invalid password');
    }

    req.session.userId = user.id;

    res.send('You are signed in!!');
})

module.exports = router;