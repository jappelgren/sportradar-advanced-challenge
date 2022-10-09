import { differenceInMinutes } from 'date-fns';
import cron from 'node-cron';
import { Games } from './pregame/games';
import { Players } from './pregame/players';
import { Utils } from './utils';
import { exec } from 'node:child_process';


class Main {
  static async startUp() {
    // Instantiate new Games and Players objects.
    const games = new Games();
    const players = new Players();

    // Cron job will check schedule and players every hour from 4 am until 5 pm.
    cron.schedule('0-59 * * * *', async () => {
      // Record any games being played today and records them in DB.
      await games.recordTodaysGames();

      if (games.todaysGames.length > 0) {
        const gameIds = games.todaysGames.map((game) => game.gamePk);
        // If games are being played, check the roster for the game and record those players in DB.  Updating any out of date data since they last played.
        await players.recordPlayersWithDelay(gameIds, 2000);
        
        // Timeout to make sure all players have been updated before we start spawning game watcher processes
        setTimeout(() => {
          for (const game of games.todaysGames) {
            const nowUtc = Utils.nowInUtc();
            const nowAndStartTimeDiff = differenceInMinutes(new Date(game.gameDate), nowUtc);

            if (nowAndStartTimeDiff <= 90 && !games.startedGames.includes(game.gamePk)) {
              console.log(`Starting gameWatcher process for game id ${game.gamePk}`);
              // 90 minutes before a game starts we spawn a game watcher process.
              exec(`node ./dist/watcher/watcherMain.js ${game.gamePk} ${game.gameDate}`, (error, stdout, stderr) => {
                if (error) {
                  console.error(`exec error: ${error}`);
                  return;
                }
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
              });
              // Add id to started games array so we don't spawn multiple processes per game.
              games.startedGames.push(game.gamePk);
            }
          }
        }, 2000 * 2 * gameIds.length);
      }
    });
  }
}

Main.startUp();