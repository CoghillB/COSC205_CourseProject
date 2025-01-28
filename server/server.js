const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const { Client } = require('@googlemaps/google-maps-services-js');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const mapsKey = process.env.MAPS_API;


//MYSQL connection and requests

const pool = mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'TravelGuide' //? 'Members' ?
});

async function getMembers() {
    const [rows] = await pool.query(`SELECT f_name, l_name, email FROM members`);
    return rows;
}

async function createMember(f_name, l_name, email, password) {
    const check = `SELECT * FROM members WHERE email = ?`;
    const [checkRows] = await pool.query(check, [email]);
    if (checkRows.length === 0) {
        const query = `INSERT INTO members (f_name, l_name, email, password) VALUES (?, ?, ?, SHA1(?))`;
        const [insert] = await pool.query(query, [f_name, l_name, email, password]);
        return insert;
    } else {
        return Promise.reject("Another user already exists with that name.");
    }
}

//Maps requests
const mapClient = new Client({});

//Incoming requests

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'userpage.html'));
});

// app.post('/login')
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = `SELECT * FROM members WHERE email = ? AND password = SHA1(?)`;
        const [rows] = await pool.query(query, [email, password]);
        console.log(rows);

        if (rows.length > 0) {
            res.send({ success: true, message: 'Login successful!' });
        } else {
            res.send({ success: false, message: 'Invalid username or password.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Server error. Please try again later.' });
    }
});

// app.post('/register')
app.post('/register', async (req, res) => {
    const { f_name, l_name, email, password } = req.body;
    console.log(req.body);
    try {
        const response = await createUser(f_name, l_name, email, password);

        if (response.ok) {
            res.status(201).send("Account created");
        } else {
            res.status(400).send("error");
        }

    } catch (e) {
        res.status(400).send("error");
    }
});

async function startServer() {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

startServer();