import { IParsedGame } from '../../models/game-model';
import { Utils } from '../../utils';
import { pool } from '../dbConfig';

export class GamesDBActions {
  // Changing the inset to upset makes this and the delete method unnecessary.
  // Leaving them in for future use.
  public async getGamesByIds(gameIds: number[]) {
    const preparedStatements = gameIds.map((_game, i) => `$${i + 1}`).join(',');
    const sql = `
        SELECT * FROM nhl_stat_pipeline.games
        where game_id in (${preparedStatements})
    `;
    try {
      const result = await pool.query(sql, gameIds);
      if (result && result.rowCount > 0) {
        return result.rows;
      }
      console.info(`Fetching games with ids ${gameIds} returned 0 results.`);
      return [];
    } catch (error) {
      console.error(`Error fetching games with ids ${gameIds} from DB. ${error}`);
    }
  }

  public deleteGames(gameIds: number[]) {
    const preparedStatements = gameIds.map((_game, i) => `$${i + 1}`).join(',');
    const sql = `
        DELETE FROM nhl_stat_pipeline.games
        where game_id in (${preparedStatements})
    `;
    try {
      pool.query(sql, gameIds);
    } catch (error) {
      console.error(`Error occurred when attempting to delete games with ids ${gameIds} from DB. ${error}`);
    }
  }

  public recordGames(gameData: IParsedGame[]) {
    const preparedStatements = Utils.preparedStatementGenerator<IParsedGame>(gameData);
    const sql = `
        INSERT INTO nhl_stat_pipeline.games(game_id, home_team_id, away_team_id, game_date)
        VALUES ${preparedStatements}
        ON CONFLICT (game_id)
        DO
          UPDATE 
          SET
          home_team_id = excluded.home_team_id, 
          away_team_id = excluded.away_team_id, 
          game_date = excluded.game_date
    `;
    const flattenedGames = gameData.map((game) => Object.values(game)).flat();
    try {
      console.log(`Recording game(s) with id(s) ${gameData.map((game) => game.gameId)} in DB.`);
      pool.query(sql, flattenedGames);
    } catch (error) {
      console.error(`An error occurred while inserting/updating games into DB.  ${error}`);
    }
  }
}
