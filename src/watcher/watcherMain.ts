import { differenceInMinutes } from 'date-fns';
import { Utils } from '../utils';
import { GameWatcher } from './watcher';

class WatcherMain {
  static initializedGame: GameWatcher;
  static delayInMs = 1000 * 60 * 5;

  static async watchGame(gameId: number, startTime: Date) {
    const nowUtc = Utils.nowInUtc();
    const nowAndStartTimeDiff = differenceInMinutes(startTime, nowUtc);

    console.info(`${nowAndStartTimeDiff > 10 ? `Waiting for game id: ${gameId} to start. There are ${nowAndStartTimeDiff} minutes until game scheduled start time.` : ''}`);

    if (!this.initializedGame && nowAndStartTimeDiff <= 10) {
      console.info(`Initializing watcher for game id ${gameId}`);
      this.initializedGame = new GameWatcher(gameId);
    }

    if (this.initializedGame) {
      this.delayInMs = 5000;
      this.initializedGame.recordPlays();
    }

    if (this.initializedGame?.gameOver) {
      console.info(`Game has ended, watcher for gameId ${gameId} now exiting.`);
      process.exit();
    }

    setTimeout(() => {
      this.watchGame(gameId, startTime);
    }, this.delayInMs);
  }
}
const args = process.argv;

if (args.length < 2) {
  console.error(`Must provide a valid gameId and game start time when starting this process.`);
  process.exit(1);
}

WatcherMain.watchGame(parseInt(args[2]), new Date(args[3]));