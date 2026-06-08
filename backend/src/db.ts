import pg from 'pg'
import dotenv from 'dotenv';

dotenv.config(); // We need to load the variables BEFORE creating the client!
const { Client } = pg

// clients will also use environment variables for connection information
const pgClient = new Client({
  ssl: {
    rejectUnauthorized: false, // To fix `no encryption` error
  }
});

export default pgClient;
