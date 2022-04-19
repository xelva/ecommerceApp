const layout = require('../layout.js');
const total = require('../utils.js')

module.exports = () => {
    return layout({
      content: `
        <div id="cart" class="container">
          <div class="columns">
            <div class="column"></div>
            <div class="column is-four-fifths">
              <h3 class="subtitle-up"><b>Shopping Cart</b></h3>
              <div>
                <h1>You don't have any items in your cart</h1> 
              </div>
            </div>
            <div class="column"></div>
          </div>
          <div class="buffer"></div>
        </div>
      `
    })
  };
  