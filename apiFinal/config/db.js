require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'final',
}).promise(); // Use promise-based interface

module.exports = pool;