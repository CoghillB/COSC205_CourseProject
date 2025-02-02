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
//OR????
/*async function getMemberByEmail(email) {
    const query = `SELECT * FROM members WHERE email = ?`;
    const [rows] = await pool.query(query, [email]);
    return rows.length > 0 ? rows[0] : null;
}*/
/*async function createMember(f_name, l_name, email, password) {
    const existingMember = await getMemberByEmail(email);

    if (!existingMember) {
        const query = `INSERT INTO members (f_name, l_name, email, password) VALUES (?, ?, ?, SHA1(?))`;
        const [insert] = await pool.query(query, [f_name, l_name, email, password]);
        return insert;
    } else {
        return Promise.reject("User already exists.");
    }
}*/

async function removeMember(email) {
    const query = `DELETE FROM members WHERE email = ?`;
    const [rows] = await pool.query(query, [email]);
    if (rows.affectedRows === 0) {
        return Promise.reject("No changes were made.")
    } else {
        return Promise.resolve("The user has been removed.");
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

async function getMemberItinerary(email) {
    const [rows] = await pool.query(`SELECT * FROM member_itinerary WHERE email = ?`, [email]);
    return rows;
}

async function addEvent(memberEmail, itin_ID, start_time, place_ID, cost) {
    const checkItineraryQuery = `
        SELECT * FROM member_itinerary
        WHERE mem_email = ? AND itin_ID = ?`;

    const [itineraryRows] = await pool.query(checkItineraryQuery, [memberEmail, itin_ID]);

    if (itineraryRows.length === 0) {
        return Promise.reject("Error, itinerary not found.");
    }

    const insertEventQuery = `
        INSERT INTO events (itin_ID, start_time, place_ID, cost)
        VALUES (?, ?, ?, ?)`;

    const [insertResult] = await pool.query(insertEventQuery, [itin_ID, start_time, place_ID, cost]);
    return insertResult;
}

async function removeEvent(event_ID) {
    const checkEventQuery = `SELECT * FROM events WHERE event_ID = ?`;
    const [eventRows] = await pool.query(checkEventQuery, [event_ID]);

    if (eventRows.length === 0) {
        return Promise.reject("Error, event not found");
    }

    const deleteEventQuery = `DELETE FROM events WHERE event_ID = ?`;
    const [deleteResult] = await pool.query(deleteEventQuery, [event_ID]);

    if (deleteResult.affectedRows === 0) {
        return Promise.reject("No changes made");
    } else {
        return Promise.resolve("Event has been removed.");
    }
}

async function createItinerary(memberEmail) {
    const checkMemberQuery = `SELECT * FROM members WHERE email = ?`;
    const [memberRows] = await pool.query(checkMemberQuery, [memberEmail]);

    if (memberRows.length === 0) {
        return Promise.reject("Error, member not found.");
    }

    const insertItineraryQuery = `INSERT INTO itineraries (budget) VALUES (0)`;
    const [insertItinerary] = await pool.query(insertItineraryQuery);

    const itin_ID = insertItinerary.insertId;
    const insertMemberItineraryQuery = `INSERT INTO member_itinerary (mem_email, itin_ID) VALUES (?, ?)`;
    await pool.query(insertMemberItineraryQuery, [memberEmail, itin_ID]);

    return {
        itin_ID, message: "Itinerary created successfully."
    };
}


async function removeItinerary() {
    //remove all events linked to this, then the itinerary
    const checkItineraryQuery = `SELECT * FROM itineraries WHERE itin_ID = ?`;
    const [itineraryRows] = await pool.query(checkItineraryQuery, [itin_ID]);

    if (itineraryRows.length === 0) {
        return Promise.reject("Error, itinerary not found.");
    }

    const deleteEventsQuery = `DELETE FROM events WHERE itin_ID = ?`;
    await pool.query(deleteEventsQuery, [itin_ID]);

    const deleteMemberItineraryQuery = `DELETE FROM member_itinerary WHERE itin_ID = ?`;
    await pool.query(deleteMemberItineraryQuery, [itin_ID]);

    const deleteItineraryQuery = `DELETE FROM itineraries WHERE intin_ID = ?`;
    const [deleteResult] = await pool.query(deleteItineraryQuery, [itin_ID]);

    if (deleteResult.affectedRows === 0) {
        return Promise.reject("No changes were made");
    } else {
        return Promise.resolve("Itinerary has been removed.");
    }

}



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



//Sam attempted tests

//axios - simplifies http requests, handles responses as promises, automatic json conversion,
//supports error handling, works on both front end and back end

//getMembersTest
/*
(async () => {
    try {
        const response = await axios.get(`http://localhost:${port}/getMembers`);

        if (Array.isArray(response.data) && response.data.length > 0) {
            console.log("getMembers test passed!");
        } else {
            console.log("getMembers test failed. No members were found.");
        }
    } catch (e) {
        console.error("Error getMembers", e.message);
    }
})();*/

//getItinerariesTest
/*(async () => {
    try {
        const response = await axios.get(`http://localhost:${port}/getItineraries`);

        if (Array.isArray(response.data)) {
            console.log("getItineraries test passed!");
        } else {
            console.log("getItineraries test failed. No Itineraries found.");
        }
    } catch (e) {
        console.error("Error getItineraries", e.message);
    }
})();*/

//getMemberItineraryTest
/*
(async () => {
    try {
        const response = await axios.post(`http://localhost:${port}/getMemberItinerary`, {
            email: "debug@debug.com"
        });

        if (Array.isArray(reponse.data)) {
            console.log("getMemberItinerary test passed!");
        } else {
            console.log("getMemberItinerary test failed. No itinerary found.");
        }
    } catch (e) {
        console.error("Error getMemberItinerary", e.message);
    }
})();*/

//createEventTest
/*(async () => {
    try {
        const response = await axios.post(`http://localhost:${port}/addEvent`, {
            memberEmail: "debug@debug.com",
            itin_ID: "SOMETHING_SOMETHING",
            start_time: "2025-02-02 14:00:00",
            place_ID: "SOMETHING_SOMETHING",
            cost: 100
        });

        if (response.data.success) {
            console.log("addEvent test passed!");
        } else {
            console.log("addEvent test failed.");
        }
    } catch (e) {
        console.error("Error addEvent", e.message);
    }
})();*/
