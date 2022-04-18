module.exports = {
    /* sum(renderedItems) {
        let total = 0;
        for (item of renderedItems) {
            total += item.product.price * item.quantity;
            
        }
        return total;
    } */
    sum(renderedItems) {
        const totalPrice = renderedItems.reduce((prev, item) => {
            return prev + item.quantity * item.product.price;
        }, 0);
        return totalPrice;
    }
};