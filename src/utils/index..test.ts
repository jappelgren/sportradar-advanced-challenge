import { Utils } from '.';
import { IParsedPlayer } from '../models/player-models';

describe('Utils.preparedStatementGenerator', () => {
  it('should return a valid list of prepared statements when given a valid argArr', () => {
    const players = [
      {
        playerId: 1,
        firstName: 'Gabe',
        lastName: 'Appelgren',
        age: 2,
        number: '44',
        position: 'Center',
        teamId: 30
      },
      {
        playerId: 2,
        firstName: 'Nori',
        lastName: 'Appelgren',
        age: 1,
        number: '43',
        position: 'Goalie',
        teamId: 30
      }
    ];

    const preparedStatements = Utils.preparedStatementGenerator<IParsedPlayer>(players);
    expect(preparedStatements).toEqual('($1,$2,$3,$4,$5,$6,$7),($8,$9,$10,$11,$12,$13,$14)');
  });
});