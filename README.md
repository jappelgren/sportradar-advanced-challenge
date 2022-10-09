# Sportradar Advanced Challenge

This app is a pipeline to ingest data from live NHL hockey games as they happen.

The app watches for certain plays and records the data in a postgres database.

The following plays and any assists will be recorded:

- Hits
- Goals
- Penalties 

## How the App Works
When the app is started a cron job checks the NHL schedule API hourly from 4 AM to 5 PM recording any games and players scheduled to play in those games in the DB.  

90 minutes before a game is scheduled to start the app will spawn a process to watch for the above mentioned play types.  When one happens the play, play type, players involved in the play and any statistics involved in the play are recorded in the db.  This process makes a call to the NHL API every 5 seconds (this can be edited by changing the delayInMs variable in watcherMain.ts).  I have read that there is no rate limit on this end point so that number can probably be reduced if you need up to the second results.

When a game ends the process will record any last plays and shut itself down.

## Running App Locally
The following are required to run this app:

- [Node](https://nodejs.org/en/download/)
- [Postgres v.14 or higher](https://www.postgresql.org/download/windows/) 
  - If you don't want to install Postgres locally I recommend using the [Postgres Docker image](https://hub.docker.com/_/postgres).
  - Make sure to record your new DB's host, port, user name, db name and password.  You will need them for an .env file later.

Continue with the following steps when Node and Postgres are ready to go.

1. Clone this repo.
2. To setup the schema and tables in your local db run the sql contained in the database.sql file. 
    - An insert of all active teams from the 2022-2023 season is included in the database.sql file.  Make sure these are added to the db before continuing.  There is now team fetching functionality in the app and the app will not work without that data.
3. In a terminal cd into the directory containing the repo you just cloned.
4. The app will need an .env file.  Create this in an IDE or running `touch .env` in your terminal.
    - The following variables should be added to your newly created .env file. These are needed for the app to connect to your local DB.
         - DB_HOST
         - DB_PORT
         - DB_USER
         - DB_NAME
         - DB_PASSWORD
5. Run `npm install`
6. Run `npm run build` to compile the TypeScript into JavaScript.
7. Run `npm run start` to start the app.  By default the app will check for games hourly from 4 AM to 5 PM.  To change this, edit the cron string in main.ts.