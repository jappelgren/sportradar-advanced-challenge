import axios from 'axios';
import { PlayerDBActions } from '../db/actions/playersDbActions';
import { IFeedPlayersObject, IParsedPlayer, IPlayerFullDetails } from '../models/player-models';

export class Players {
  private async getPlayersByGameId(gameId: number): Promise<IPlayerFullDetails[]> {
    try {
      const playerResult = await axios.get(
        ` https://statsapi.web.nhl.com/api/v1/game/${gameId}/feed/live`
      );
      if (playerResult && playerResult.status === 200) {
        if (Object.keys(playerResult.data.gameData.players).length > 0) {
          const playersInGame: IPlayerFullDetails[] = [];
          const playersObject: IFeedPlayersObject = playerResult.data.gameData.players;
          for (const key in playersObject) {
            playersInGame.push(playersObject[key]);
          }
          return playersInGame;
        }
        console.warn(`No players found for game id ${gameId}. Players may not have been assigned yet. Make sure ${gameId} is a valid game id.`);
        return [];
      }
      throw new Error(`Received a ${playerResult.status} response from NHL API.`);
    } catch (error) {
      console.error(`An error occurred while fetching players for game id ${gameId}. ${error}`);
    }
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
    if (players.length < 1) {
      return;
    }
    const parsedPlayers = this.parsePlayersForDB(players);
    await playerDbActions.recordPlayers(parsedPlayers);
  }

  public async recordPlayersWithDelay(gameIds: number[], delayMs = 1000) {
    await this.recordPlayers(gameIds[0]);

    if (gameIds.length > 1) {
      setTimeout(() => {
        gameIds.shift();
        this.recordPlayersWithDelay(gameIds, delayMs);
      }, delayMs);
    }
  }
}