const usersRepo = require('./repositories/users.js');
const express = require('express');
const bodyParser = require('body-parser');


const app = express(); //describes everything our web server can do
app.use(bodyParser.urlencoded({ extended: true }));//use 'use' to have all route handlers use this middleware, will not be used in GET request

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


app.post('/', async (req, res) => { //add any middlewear functions before req,res param
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('Email in use');
    }
    if (password !== passwordConfirmation) {
        return res.send('Passwords must match');
    }

    res.send('Account created');
});

app.listen(3000, () => {
    //setup your server to watch for incoming requests on the specified port (3000 in this case)
    console.log('Listening');
})

