const layout = require('../layout');
const { getError } = require('../helpers.js');

module.exports = ({ errors }) => {
    return layout({
        content: `
        <form method="POST" enctype="multipart/form-data"> 
            <input placeholder="Title" name="title"/>
            <input placeholder="Price" name="price"/>
            <input type="file" name="image"/>
            <button>Submit</button> 
        </form>
        `
    })
}

//change how form data is transimitted using enctype="multipart/form-data"