require('dotenv').config();
const mysql = require('mysql');

// Create a MySQL connection pool to manage database connections
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'deppfuckus_db'
});

console.log('Database connection pool created');

module.exports = db;