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
    database: 'TravelGuide'
});


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
//
// app.post('/register')


async function startServer() {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

startServer();