import { GameWatcher } from './watcher/watcher';

const watcher = new GameWatcher(2022010076);
const main = async () => {
  await watcher.fetchGameFeed();
};

let i = 0;
while (i <= 1) {
  main();
  i++;
}
