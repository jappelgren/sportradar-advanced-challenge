import { IParsedPlayer } from '../../models/player-models';
import { Utils } from '../../utils';
import { pool } from '../dbConfig';

export class PlayerDBActions {
  public async recordPlayers(players: IParsedPlayer[]): Promise<void> {
    const preparedStatements = Utils.preparedStatementGenerator<IParsedPlayer>(players);
    const sql = `
      INSERT INTO nhl_stat_pipeline.players( player_id, first_name, last_name, age, number, position, team_id)
      VALUES ${preparedStatements};
    `;
    const flattenedPlayers = players.map((player) => Object.values(player)).flat();
    pool.query(sql, flattenedPlayers);
    console.log(sql);
  }
}
