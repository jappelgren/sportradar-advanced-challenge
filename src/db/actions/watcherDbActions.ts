import { IParsedPlay, IParsedPlayStat } from '../../models/watcher-models';
import { Utils } from '../../utils';
import { pool } from '../dbConfig';

export class WatcherDBActions {
  public async recordPlays(plays: IParsedPlay[]) {
    const preparedStatements = Utils.preparedStatementGenerator<IParsedPlay>(plays);
    const sql = `
      INSERT INTO nhl_stat_pipeline.plays(game_id, play_type, time_stamp)
      VALUES ${preparedStatements}
      RETURNING play_id;
    `;
    const flattenedPlays = plays.map((play) => Object.values(play)).flat();
    const result = await pool.query(sql, flattenedPlays);
    console.log(result.rows);
    return result.rows;
  }

  public async recordPlayStats(playStats: IParsedPlayStat[]) {
    const preparedStatements = Utils.preparedStatementGenerator<IParsedPlayStat>(playStats);
    const sql = `
      INSERT INTO nhl_stat_pipeline.play_stats(play_id, player_id, hit_value, goal_value, assist_value, penalty_minutes, point_value)
      VALUES ${preparedStatements};
    `;
    const flattenedPlays = playStats.map((playStat) => Object.values(playStat)).flat();
    await pool.query(sql, flattenedPlays);
  }
}
