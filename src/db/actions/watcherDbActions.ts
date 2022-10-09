import { IParsedPlay, IParsedPlayStat } from '../../models/watcher-models';
import { Utils } from '../../utils';
import { pool } from '../dbConfig';

export class WatcherDBActions {
  public async recordPlays(plays: IParsedPlay[]) {
    const preparedStatements = Utils.preparedStatementGenerator<IParsedPlay>(plays);
    const sql = `
      INSERT INTO nhl_stat_pipeline.plays(game_id, play_type, time_stamp, team_id)
      VALUES ${preparedStatements}
      RETURNING play_id;
    `;
    const flattenedPlays = plays.map((play) => Object.values(play)).flat();
    try {
      const result = await pool.query(sql, flattenedPlays);
      if (result && result.rowCount > 0) {
        return result.rows;
      }
      throw new Error(`Inserting new plays into db returned no play_ids. Check play_stats table to see if any stats were recorded without stat foreign key.`);
    } catch (error) {
      console.error(`An error occurred while recording new plays in the db. ${error}`);
    }
  }

  public async recordPlayStats(playStats: IParsedPlayStat[]) {
    const preparedStatements = Utils.preparedStatementGenerator<IParsedPlayStat>(playStats);
    const sql = `
      INSERT INTO nhl_stat_pipeline.play_stats(play_id, player_id, hit_value, goal_value, assist_value, penalty_minutes, point_value)
      VALUES ${preparedStatements};
    `;
    const flattenedPlays = playStats.map((playStat) => Object.values(playStat)).flat();
    try {
      await pool.query(sql, flattenedPlays);
    } catch (error) {
      console.error(`An error occurred while recording new play stats in the db. ${error}`);
    }
  }
}
