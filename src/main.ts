import cron from 'node-cron';
import { Games } from './pregame/games';
// import { GameWatcher } from './watcher/watcher';

// const watcher = new GameWatcher(2022010099);

// const main = async () => {
//   watcher.recordPlays();
// };

// main();

// import { Games } from './pregame/games';

// const pregame = new Games();

// pregame.recordTodaysGames();

// import { Players } from './pregame/players';

// const players = new Players();
// const main = async () => {
//   const roster = await players.recordPlayers(2022010099);
//   console.log(roster);
// };
// main();

class Main {
  static startUp() {
    cron.schedule('* 4-17 * * *', () => {

    });
  }
}

Main.startUp();