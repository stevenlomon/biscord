import pg from 'pg'
import dotenv from 'dotenv';

dotenv.config(); // We need to load the variables BEFORE creating the client!
const { Pool } = pg

// clients will also use environment variables for connection information
const pool = new Pool({
  ssl: {
    rejectUnauthorized: false, // To fix `no encryption` error
  }
});

export default pool;
