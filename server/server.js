const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./router');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

///////////////

const pool = mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'travel_database'
});

////////////////

app.use(cors());
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


//Tests

// //Test server is running and responds to simple requests
// (async () => {
//     try {
//         const response = await axios.get(`http://localhost:${port}/ping`);
//         console.log("Test response:", response.data)
//     } catch (e) {
//         console.error("Error testing endpoint:", e.message);
//     }
// })();
//
// //Search Nearby should return restaurants near Okanagan College Kelowna Campus
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

//Test Login with Debug Dan, debug@debug.com, password DebugPlaintext
// (async () => {
//     try {
//         const response = await axios.post(`http://localhost:${port}/login`, {
//             email: "debug@debug.com",
//             password: "DebugPlaintext"
//         });
//
//         if (response.data.success) {
//             console.log("Login test with debug account was successful!");
//         } else {
//             console.log(`Login test with debug account failed, ${response.data.message}`);
//         }
//
//     } catch (e) {
//         console.error("Error testing endpoint:", e.message);
//     }
// })();

//Test Registration with Temporary Tom, then remove from database
// (async () => {
//     try {
//         let tempExists =
//             false;
//         let email = "temporaryTom@invalid";
//         const membersStart = await getMembers();
//
//         for (let member of membersStart) {
//             if (member.email === email) {
//                 throw Error("Temporary email already exists in database.");
//             }
//         }
//
//         const response = await axios.post(`http://localhost:${port}/register`, {
//             f_name: "Tom",
//             l_name: "Temporary",
//             email: email,
//             password: "letmein"
//         });
//
//         const membersMiddle = await getMembers();
//
//         for (let member of membersMiddle) {
//             if (member.email === email) {
//                 tempExists = true;
//                 break;
//             }
//         }
//
//         if (!tempExists) {
//             throw Error("Temp account creation failed");
//         }
//
//         const query = `DELETE FROM members WHERE email = ?;`;
//         const [rows] = await pool.query(query, [email]);
//
//         if (rows.affectedRows !== 1) {
//             throw Error("Error in removal of temporary account");
//         } else {
//             console.log("Successful account creation/removal test!");
//         }
//
//     } catch (e) {
//         console.log(`Error during registration test:`, e.message);
//     }
// })();

//Test Event creation, then remove it

