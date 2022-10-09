import { IParsedGame } from '../../models/game-model';
import { Utils } from '../../utils';
import { pool } from '../dbConfig';

export class GamesDBActions {
  public async getGamesByIds(gameIds: number[]) {
    const preparedStatements = gameIds.map((_game, i) => `$${i + 1}`).join(',');
    const sql = `
        SELECT * FROM nhl_stat_pipeline.games
        where game_id in (${preparedStatements})
    `;
    const result = await pool.query(sql, gameIds);
    console.log(sql);
    return result.rows;
  }

  public deleteGames(gameIds: number[]) {
    const preparedStatements = gameIds.map((_game, i) => `$${i + 1}`).join(',');
    const sql = `
        DELETE FROM nhl_stat_pipeline.games
        where game_id in (${preparedStatements})
    `;
    pool.query(sql, gameIds);
    console.log(sql);
  }

  public recordGames(gameData: IParsedGame[]) {
    const preparedStatements = Utils.preparedStatementGenerator<IParsedGame>(gameData);
    const sql = `
        INSERT INTO nhl_stat_pipeline.games(game_id, home_team_id, away_team_id, game_date)
        VALUES ${preparedStatements};
    `;
    pool.query(sql, gameData.map((game) => Object.values(game)).flat());
    console.log(sql);
  }
}
