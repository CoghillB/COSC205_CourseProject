const path = require('path');
const express = require('express');
const { getMembers, createMember, checkMember } = require('./database');
const { Client } = require('@googlemaps/google-maps-services-js');
const dotenv = require('dotenv');
dotenv.config();
const mapsKey = process.env.MAPS_API;

const router = express.Router();
const mapClient = new Client({});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'userpage.html'));
});

router.get('/getApiKey', (req, res) => {
    console.log("issuing API key");
    res.json({
        apiKey: process.env.MAPS_API
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const check = await checkMember(email, password);

        if (check) {
            res.send({ success: true, message: 'Login successful!' });
        } else {
            res.send({ success: false, message: 'Invalid username or password.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Server error. Please try again later.' });
    }
});

router.post('/register', async (req, res) => {
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

router.post('/searchNearby', async (req, res) => {
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

router.post('/getPlaceById', async (req, res) => {
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

router.post('/textSearch', async (req, res) => {
    const { str } = req.body;
    console.log(str);
    if (!str) return res.status(400).send("Please provide str");

    try {
        const response = await mapClient.textSearch({
            params:{
                query: str,
                key: mapsKey
            }
        });

        res.status(200).send(response.data);
    } catch (e) {
        console.log(`Error in /textSearch, ${e}`);
    }
});

router.get('/ping', async(req, res) => {
    res.json({ message: "Server is up!" });
});

module.exports = router;