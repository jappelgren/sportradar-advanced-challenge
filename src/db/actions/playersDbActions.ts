import { IParsedPlayer } from '../../models/player-models';
import { Utils } from '../../utils';
import { pool } from '../dbConfig';

export class PlayerDBActions {
  public async recordPlayers(players: IParsedPlayer[]): Promise<void> {
    const preparedStatements = Utils.preparedStatementGenerator<IParsedPlayer>(players);
    const sql = `
      INSERT INTO nhl_stat_pipeline.players( player_id, first_name, last_name, age, number, position, team_id)
      VALUES ${preparedStatements}
      ON CONFLICT (player_id)
      DO
        UPDATE
        SET 
          first_name = excluded.first_name, 
          last_name = excluded.last_name, 
          age = excluded.age, 
          number = excluded.number, 
          position = excluded.position, 
          team_id = excluded.team_id
      ;
    `;
    const flattenedPlayers = players.map((player) => Object.values(player)).flat();
    try {
      console.log(`Recording/updating players with team id ${players[0].teamId} in DB.`);
      pool.query(sql, flattenedPlayers);
    } catch (error) {
      console.error(`An error occurred while trying to insert/update players in DB.  ${error}`);
    }
  }
}
