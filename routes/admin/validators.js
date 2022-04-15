const { check } = require('express-validator');
const usersRepo = require('../../repositories/users.js');

module.exports = {
    requireEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email')
        .custom(async email => {
                const existingUser = await usersRepo.getOneBy({ email });
                if (existingUser) {
                    throw new Error('Email in use');
                }
        }),
    requirePassword: check('password')
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage('Must be between 4 and 20 characters'),
    requirePasswordConfirmation:  check('passwordConfirmation')
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage('Must be between 4 and 20 characters')
        .custom(async (passwordConfirmation, { req }) => {
            const password = req.body.password;
            if (passwordConfirmation !== password) {
                throw new Error('Passwords must match');
        } 
    }),
   checkEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async (email) => {
        const user = await usersRepo.getOneBy({ email})
        if (!user) {
            throw new Error('Email not found!');
        }
    }),
    checkPassword: check('password')
        .trim(),
    checkTitle: check('title')
        .trim()
        .isLength({ min: 5, max: 40 })
        .withMessage('Must be between 5 and 40 characters'),
    checkPrice: check('price')
        .trim()
        .toFloat()
        .isFloat({ min: 1})
        .withMessage('Price must be a number'),
};

