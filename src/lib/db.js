// src/lib/db.js
import mariadb from 'mariadb';
import { configDotenv } from 'dotenv';

const pool = mariadb.createPool({
  host: process.env.DB_HOST, // Change this if your MariaDB is on a different server
  user: process.env.DB_USER, // Your database username
  password: process.env.DB_PASSWORD, // Your database password
  database: process.env.DB_NAME, // Your database name
  connectionLimit: 5, // Connection pool limit
});

export default pool;
