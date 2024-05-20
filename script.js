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
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/login', (req, res) => {
    console.log("TEST", req.body);
});




// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
