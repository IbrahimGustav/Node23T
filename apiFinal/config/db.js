require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'final',
}).promise();

module.exports = pool;