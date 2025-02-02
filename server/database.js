const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();


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

async function checkMember(email, password) {
    const query = `SELECT * FROM members WHERE email = ? AND password = SHA1(?)`;
    const [rows] = await pool.query(query, [email, password])
    return rows.length === 1;

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


module.exports = {
    getMembers,
    createMember,
    checkMember,
    removeMember,
    getEvents,
    getItineraries,
    getMemberItinerary,
    addEvent,
    removeEvent,
    createItinerary
};