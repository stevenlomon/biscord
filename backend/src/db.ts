import pg from 'pg'
const { Pool, Client } = pg

// pools will use environment variables for connection information
const pool = new Pool();

const pgClient = new Client();

export default pgClient;
