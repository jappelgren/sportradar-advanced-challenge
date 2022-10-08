// import { GameWatcher } from './watcher/watcher';

// const watcher = new GameWatcher(2022010092);

// const main = async () => {
//   console.log(await watcher.fetchGameData());
//   setTimeout(() => {
//     main();
//   }, 10000);
// };

// main();

import { Games } from './pregame/games';

const pregame = new Games();

pregame.recordTodaysGames();
