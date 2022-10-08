import pg from 'pg';
require('dotenv').config();

const config = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USER,
};

export const pool = new pg.Pool(config);
