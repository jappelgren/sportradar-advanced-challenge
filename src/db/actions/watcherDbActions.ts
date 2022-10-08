import { pool } from '../dbConfig';

export const getPlayers = async () => {
  const result = await pool.query(`
    SELECT * 
    FROM nhl_stat_pipeline.players
    `, []);
  return result.rows;
};
