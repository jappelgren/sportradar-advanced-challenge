import axios from 'axios';
import { Play } from './models/watcher-models';

enum EventTypes {
  HIT = 'HIT',
  GOAL = 'GOAL',
  PENALTY = 'PENALTY',
}

export class GameWatcher {
  public gameId: number;
  private playOffset: number;

  constructor(gameId: number) {
    this.gameId = gameId;
    this.playOffset = 0;
  }

  public async fetchGameFeed(): Promise<Play[]> {
    const eventTypes: string[] = Object.values(EventTypes);
    try {
      const gameData = await axios.get(
        `https://statsapi.web.nhl.com/api/v1/game/${this.gameId}/feed/live`
      );

      if (gameData && gameData.status === 200) {
        const plays: Play[] = gameData.data.liveData.plays.allPlays;
        const filteredPlays: Play[] = plays
          .slice(this.playOffset)
          .filter((play: Play) => eventTypes.includes(play.result.eventTypeId));

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
}
