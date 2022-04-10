const express = require('express');

const app = express(); //describes everything our web server can do

app.get('/', (req, res)=>{
    //req = request, incoming 
    //res = response, outgoing
    //if response looks like html, express will send it back for the browser to interprit it as such
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email"/>
            <input name="password" placeholder="password"/>
            <input name="passwordConfirmation" placeholder="passwordConfirmation"/>
            <button>Sign Up</button>
        </form>
    </div>
    `);
});

app.post('/', (req, res) => {
    //get access to the incoming info
    req.on('data', data => {
        const parsed = data.toString('utf8').split('&');//convert buffer to string and parse
        const formData = {};
        for (let pair of parsed) {
            const [key, value] = pair.split('='); //destructure to assign first value of array to key, second to value
            formData[key] = value;
        }
        console.log(formData);
    })
    res.send('Account created');
});

app.listen(3000, () => {
    //setup your server to watch for incoming requests on the specified port (3000 in this case)
    console.log('Listening');
})

