import { IParsedGame } from '../../pregame/models/game-model';
import { pool } from '../dbConfig';

export class GamesDBActions {
  public recordGames(gameData: IParsedGame[]) {
    let preparedOffset = 1;
    const preparedStatements = gameData
      .map((game) => {
        let preparedString = `(`;
        const preparedArr = [];
        for (const _key in game) {
          preparedArr.push(`$${preparedOffset}`);
          preparedOffset++;
        }
        preparedString = preparedString.concat(`${preparedArr.join(',')})`);
        return preparedString;
      })
      .join(',');

    const sql = `
        INSERT INTO nhl_stat_pipeline.games(game_id, home_team_id, away_team_id, game_date)
        VALUES ${preparedStatements}
        ON CONFLICT DO NOTHING;
    `;
    pool.query(
      sql,
      gameData.map((game) => Object.values(game)).flat()
    );
    console.log(sql);
  }
}
