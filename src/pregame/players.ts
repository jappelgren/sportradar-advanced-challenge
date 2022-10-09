import axios from 'axios';
import { PlayerDBActions } from '../db/actions/playersDbActions';
import { IFeedPlayersObject, IParsedPlayer, IPlayerFullDetails } from '../models/player-models';

export class Players {
  private async getPlayersByGameId(gameId: number): Promise<IPlayerFullDetails[]> {
    const playerResult = await axios.get(
      ` https://statsapi.web.nhl.com/api/v1/game/${gameId}/feed/live`
    );
    const playersInGame: IPlayerFullDetails[] = [];
    const playersObject: IFeedPlayersObject = playerResult.data.gameData.players;
    for (const key in playersObject) {
      playersInGame.push(playersObject[key]);
    }
    return playersInGame;
  }

  private parsePlayersForDB(players: IPlayerFullDetails[]) {
    const parsedPlayers: IParsedPlayer[] = players.map((player: IPlayerFullDetails) => {
      return {
        playerId: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        age: player.currentAge,
        number: player.primaryNumber,
        position: player.primaryPosition.name,
        teamId: player.currentTeam?.id || null
      };
    });
    return parsedPlayers;
  }

  public async recordPlayers(gameId: number): Promise<void> {
    const playerDbActions = new PlayerDBActions();
    const players = await this.getPlayersByGameId(gameId);
    const parsedPlayers = this.parsePlayersForDB(players);
    playerDbActions.recordPlayers(parsedPlayers);
  }
}