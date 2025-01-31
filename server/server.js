const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
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
    database: 'travel_database'
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

async function getEvents() {
    const [rows] = await pool.query(`SELECT * FROM events`);
    return rows;
}

async function getItineraries() {
    const [rows] = await pool.query(`SELECT * FROM itineraries`);
    return rows;
}

async function getMemberItinerary(memberEmail) {
    const [rows] = await pool.query(`SELECT * FROM member_itinerary WHERE email = ?`, [memberEmail]);
    return rows;
}

//some sort of createEvent function
//async function createEvent(memberEmail, itin_ID, start_time, place_ID, cost) {
// try {
//const checkItineraryQuery = `
//SELECT * FROM member_itinerary
//WHERE email = ? AND itin_ID = ?`
//
//const insertEventQuery = `
//INSERT INTO events (itin_ID, start_time, place_ID, cost)
//VALUES (?, ?, ?, ?)`;
//??????????

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

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = `SELECT * FROM members WHERE email = ? AND password = SHA1(?)`;
        const [rows] = await pool.query(query, [email, password]);

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

app.post('/register', async (req, res) => {
    const { f_name, l_name, email, password } = req.body;
    console.log(req.body);
    try {
        const response = await createMember(f_name, l_name, email, password);

        if (response.affectedRows === 1) {
            res.status(201).send("Account created");
        } else {
            res.status(400).send("error");
        }

    } catch (e) {
        res.status(400).send("error");
    }
});

app.post('/searchNearby', async (req, res) => {
    const { lat, long, radius, type } = req.body;
    if (!lat || !long || !radius) return res.status(400).send("Please provide radius and type.");

    try {
        const response = await mapClient.placesNearby({
            params:{
                location: `${lat},${long}`,
                radius: radius,
                type: type,
                key: mapsKey
            }
        });

        console.log(response.data);
        res.status(200).send(response.data);

    } catch (e) {
        console.log(`Error in /searchNearby, ${e}`);
        res.status(500).send("Error retrieving places");
    }
});

app.post('/getPlaceById', async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).send("ID must not be null");

    try {
        const response = await mapClient.placeDetails({
            params:{
                place_id: id,
                fields: ["name", "formatted_address", "rating", "photos"],
                key: mapsKey
            }
        });

        console.log(response.data);
        res.status(200).send(response.data);

    } catch (e) {
        console.log(`Error in /getPlaceById, ${e}`);
    }
});

app.get('/ping', async(req, res) => {
    res.json({ message: "Server is up!" });
});

async function startServer() {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

startServer();

//Tests

//Test server is running and responds to simple requests
// (async () => {
//     try {
//         const response = await axios.get(`http://localhost:${port}/ping`);
//         console.log("Test response:", response.data)
//     } catch (e) {
//         console.error("Error testing endpoint:", e.message);
//     }
// })();
//Search Nearby should return restaurants near Okanagan College Kelowna Campus
// (async () => {
//     try {
//         const response = await axios.post(`http://localhost:${port}/searchNearby`, {
//             lat: 49.9556,
//             long: -119.3889,
//             radius: 500,
//             type: "restaurant"
//         }, {
//             headers: { "Content-Type": "application/json" }
//         });
//
//         console.log("Test Response:", response.data);
//     } catch (e) {
//         console.error("Error testing endpoint:", e.message);
//     }
// })();
//
// //Get Place By ID should return Okanagan College Kelowna Campus
// (async () => {
//     try {
//         const response = await axios.post(`http://localhost:${port}/getPlaceById`, {
//             id: "ChIJicy6skSLfVMRXJhpeAYlmPg"
//         }, {
//             headers: { "Content-Type": "application/json" }
//         });
//
//         console.log("Test Response:", response.data);
//     } catch (e) {
//         console.error("Error testing endpoint:", e.message);
//     }
// })();