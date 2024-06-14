const express = require('express');
const { path } = require('express/lib/application');
const sqlite3 = require('sqlite3').verbose();

const app = express()
const PORT = 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 1000000
}))

// Connect to SQLite DB
const db = new sqlite3.Database('user_database.db');

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, 
    username TEXT NOT NULL, 
    password TEXT NOT NULL)`);

// Parse JSON
app.use(express.json());

// Serve static files (HTML/CSS)
app.use(express.static('views'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/html/initial.html')
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/html/index.html');
});

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/views/html/home.html')
})

app.get('/createUser', (req, res) => {
    res.sendFile(__dirname + '/views/html/createUser.html')
})


app.post('/login', (req, res) => {
    console.log("TEST", req.body);
    const { first, password } = req.body;
    console.log(first)
    console.log(password)

    db.get('SELECT * FROM users WHERE username = ? and password = ?', [first, password], (err, row) => {
       if (err) {
        console.error('Error querying database', err);
        res.status(500).send('Internal Server Error');
       } 
       else if (row) {
        res.redirect('/home');
       }
       else {
        res.status(401).send('Invalid username or password');
       }
    })
});

app.post('/createUser', (req, res) => {
    const { first, password } = req.body;

    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [first, password], function(err){
        if (err) {
            console.error('Error creating user:', err);
            res.status(500).send('Internal Server Error');
        }
        else {

            res.redirect('/home')
        }
    })
})



// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
