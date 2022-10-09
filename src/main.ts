import { GameWatcher } from './watcher/watcher';

const watcher = new GameWatcher(2022010092);

const main = async () => {
  const gameData = await watcher.fetchGameData();
  const playIds = watcher.parsePlaysForDB(gameData);
  const preppedStats = watcher.parsePlayStatsForDB(playIds.map((plays) => plays.gameId), gameData);
  console.log(preppedStats);
};

main();

// import { Games } from './pregame/games';

// const pregame = new Games();

// pregame.recordTodaysGames();

// import { Players } from './pregame/players';

// const players = new Players();
// const main = async () => {
//   const roster = await players.recordPlayers(2022010100);
//   console.log(roster);
// };
// main();
