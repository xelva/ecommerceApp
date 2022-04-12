const usersRepo = require('./repositories/users.js');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');


const app = express(); //describes everything our web server can do
app.use(bodyParser.urlencoded({ extended: true }));//use 'use' to have all route handlers use this middleware, will not be used in GET request
app.use(cookieSession({
    keys: ['asdflkjdsifjlsdf443jl']
}));

app.get('/signup', (req, res)=>{
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


app.post('/signup', async (req, res) => { //add any middlewear functions before req,res param
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('Email in use');
    }
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

app.get('/signout', (req, res) => {
    req.session = null;
    res.send(`You're logged out!`)
})

app.get('/signin', (req, res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email"/>
            <input name="password" placeholder="password"/>
            <button>Sign In</button>
        </form>
    </div>
    `)
})

app.post('/signin', async (req, res) => {
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

app.listen(3000, () => {
    //setup your server to watch for incoming requests on the specified port (3000 in this case)
    console.log('Listening');
})

