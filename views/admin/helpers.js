module.exports = {
    getError(errors, prop) {
        //prop === 'email' || 'password' || 'passwordConfirmation'
        try {
            return errors.mapped()[prop].msg
        } catch (err) {
            return '';
        }
    }
};
