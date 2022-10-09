import axios from 'axios';
import { WatcherDBActions } from '../db/actions/watcherDbActions';
import { IParsedPlay, IParsedPlayStat, IPlay } from '../models/watcher-models';

enum EventTypes {
  HIT = 'HIT',
  GOAL = 'GOAL',
  PENALTY = 'PENALTY',
}

enum PlayerTypes {
  HITTER = 'Hitter',
  SCORER = 'Scorer',
  ASSIST = 'Assist',
  PENALTY_ON = 'PenaltyOn'
}

export class GameWatcher {
  public gameId: number;
  private playOffset: number;

  constructor(gameId: number) {
    this.gameId = gameId;
    this.playOffset = 0;
  }

  private async fetchGameData(): Promise<IPlay[]> {
    const eventTypes: string[] = Object.values(EventTypes);
    try {
      const gameData = await axios.get(
        `https://statsapi.web.nhl.com/api/v1/game/${this.gameId}/feed/live`
      );

      if (gameData && gameData.status === 200) {
        const plays: IPlay[] = gameData.data.liveData.plays.allPlays;
        const filteredPlays: IPlay[] = plays
          .slice(this.playOffset)
          .filter((play: IPlay) => eventTypes.includes(play.result.eventTypeId));
        console.log(
          `Total plays fetched ${plays.length}, plays I care about ${filteredPlays.length}`
        );
        this.playOffset = plays.length - 1;
        filteredPlays.length > 0 &&
          console.info(`Received ${filteredPlays.length} new plays.`);
        return filteredPlays;
      }
      throw new Error(`Received ${gameData.status} response from NHL API.`);
    } catch (error) {
      console.error(
        `An error occurred while fetching data for game # ${this.gameId}, ${error}`
      );
    }
  }

  private parsePlaysForDB(plays: IPlay[]) {
    const parsedPlays: IParsedPlay[] = plays.map((play: IPlay) => {
      return {
        gameId: this.gameId,
        playType: play.result.eventTypeId,
        timeStamp: play.about.dateTime
      };
    });
    return parsedPlays;
  }

  private parsePlayStatsForDB(playIds: number[], plays: IPlay[]) {
    const playerTypes: string[] = Object.values(PlayerTypes);
    const parsedPlayStats: IParsedPlayStat[] = [];
    for (const [i, play] of plays.entries()) {
      const preparedPlayStats = play.players
        .filter((player) => playerTypes.includes(player.playerType))
        .map((player) => {
          return {
            playId: playIds[i],
            playerId: player.player.id,
            hitValue: player.playerType === PlayerTypes.HITTER ? 1 : 0,
            goalValue: player.playerType === PlayerTypes.SCORER ? 1 : 0,
            assistValue: player.playerType === PlayerTypes.ASSIST ? 1 : 0,
            penaltyMinutes: player.playerType === PlayerTypes.PENALTY_ON ? play.result.penaltyMinutes : 0,
            pointValue: player.playerType === PlayerTypes.ASSIST || player.playerType === PlayerTypes.SCORER ? 1 : 0
          };
        });
      parsedPlayStats.push(...preparedPlayStats);
    }
    return parsedPlayStats;
  }

  public async recordPlays() {
    const watcherDBActions = new WatcherDBActions();

    const filteredPlays = await this.fetchGameData();
    const parsedPlays = this.parsePlaysForDB(filteredPlays);

    const playDBResult = await watcherDBActions.recordPlays(parsedPlays);
    const newPlayIds = playDBResult.map((play) => play.play_id);
    const parsedPlayStats = this.parsePlayStatsForDB(newPlayIds, filteredPlays);

    await watcherDBActions.recordPlayStats(parsedPlayStats);
  }
}
