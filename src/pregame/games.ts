import axios from 'axios';
import { format } from 'date-fns';
import { GamesDBActions } from '../db/actions/gamesDbActions';
import { IGame, IParsedGame } from './models/game-model';

export class Games {
  public todaysGames: IGame[];

  private async getTodaysGames(): Promise<IGame[]> {
    const today: string = format(new Date(), 'yyyy-MM-dd');
    try {
      const scheduleResult = await axios.get(
        `https://statsapi.web.nhl.com/api/v1/schedule?date=${today}`
      );
      if (scheduleResult && scheduleResult.status === 200) {
        const todaysGames: IGame[] = scheduleResult.data.dates[0].games;
        this.todaysGames = todaysGames;
        return todaysGames;
      }
      throw new Error(
        `Received a ${scheduleResult.status} response from the NHL API while fetching scheduled games.`
      );
    } catch (error) {
      console.error(
        `An error occurred while fetching today\'s games. ${error}`
      );
    }
  }

  private parseGamesForDB(games: IGame[]): IParsedGame[] {
    const parsedGames: IParsedGame[] = games.map((game: IGame) => {
      return {
        gameId: game.gamePk,
        homeTeamId: game.teams.home.team.id,
        awayTeamId: game.teams.away.team.id,
        gameDate: game.gameDate,
      };
    });
    return parsedGames;
  }

  public async recordTodaysGames() {
    const dbActions = new GamesDBActions();
    const games = (await this.getTodaysGames()) as unknown as IGame[];
    const parsedGames = this.parseGamesForDB(games);
    const gamesInDb = await dbActions.getGamesByIds(
      parsedGames.map((game) => game.gameId)
    );
    if (gamesInDb.length > 0) {
      dbActions.deleteGames(gamesInDb.map((game) => game.game_id));
    }
    dbActions.recordGames(parsedGames);
  }
}
