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
    const checkItineraryQuery = ``;


    // try {
    //const checkItineraryQuery = `
    //SELECT * FROM member_itinerary
    //WHERE email = ? AND itin_ID = ?`
    //
    //const insertEventQuery = `
    //INSERT INTO events (itin_ID, start_time, place_ID, cost)
    //VALUES (?, ?, ?, ?)`;
}

async function removeEvent() {

}

async function createItinerary(memberEmail) {

}

async function removeItinerary() {
    //remove all events linked to this, then the itinerary
}


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