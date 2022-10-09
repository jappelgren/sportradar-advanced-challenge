import { IParsedPlayer } from '../../models/player-models';
import { pool } from '../dbConfig';

export class PlayerDBActions {
    public async recordPlayers(players: IParsedPlayer[]): Promise<void> {
        let preparedOffset = 1;
        const preparedStatements = players
            .map((player) => {
                let preparedString = `(`;
                const preparedArr = [];
                for (const _key in player) {
                    preparedArr.push(`$${preparedOffset}`);
                    preparedOffset++;
                }
                preparedString = preparedString.concat(`${preparedArr.join(',')})`);
                return preparedString;
            })
            .join(',');
        const sql = `
        INSERT INTO nhl_stat_pipeline.players( player_id, first_name, last_name, age, number, position, team_id)
        VALUES ${preparedStatements};
    `;
        const playerFlatArr = players.map((player) => Object.values(player)).flat();
        pool.query(sql, playerFlatArr);
        console.log(sql);
    }
}
