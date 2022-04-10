const express = require('express');

const app = express(); //describes everything our web server can do

app.get('/', (req, res)=>{
    //req = request, incoming 
    //res = response, outgoing
    //if response looks like html, express will send it back for the browser to interprit it as such
    res.send(`
    <div>
        <form>
            <input placeholder="email"/>
            <input placeholder="password"/>
            <input placeholder="password confirmation"/>
            <button>Sign Up</button>
        </form>
    </div>
    `);
});

app.listen(3000, () => {
    //setup your server to watch for incoming requests on the specified port (3000 in this case)
    console.log('Listening');
})

