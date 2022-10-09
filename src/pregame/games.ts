import axios from 'axios';
// import { format } from 'date-fns';
import { GamesDBActions } from '../db/actions/gamesDbActions';
import { IGame, IParsedGame } from '../models/game-model';

export class Games {
  public todaysGames: IGame[];
  public earliestGame: IGame;
  public startedGames: IGame[];

  private async getTodaysGames(): Promise<IGame[]> {
    // const today: string = format(new Date(), 'yyyy-MM-dd');
    const today = '2022-10-08';
    try {
      const scheduleResult = await axios.get(
        `https://statsapi.web.nhl.com/api/v1/schedule?date=${today}`
      );
      if (scheduleResult && scheduleResult.status === 200) {
        if (scheduleResult.data.dates.length > 0) {
          const todaysGames: IGame[] = scheduleResult.data.dates[0].games;
          this.todaysGames = todaysGames;
          this.earliestGame = todaysGames.sort((a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime())[0];
          return todaysGames;
        }
        console.info(`No games scheduled for ${today}.`);
        return [];
      }
      throw new Error(
        `Received a ${scheduleResult.status} response from the NHL API while fetching scheduled games.`
      );
    } catch (error) {
      console.error(
        `An error occurred while fetching today's games. ${error}`
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

  public async recordTodaysGames(): Promise<void> {
    const dbActions = new GamesDBActions();
    const games = await this.getTodaysGames();
    if (games.length < 1) {
      console.info(`No games received from API, assuming not games scheduled today.`);
      return;
    }
    const parsedGames = this.parseGamesForDB(games);
    await dbActions.recordGames(parsedGames);
  }
}
