export interface IGame {
  gamePk: number;
  link: string;
  gameType: string;
  season: string;
  gameDate: Date;
  status: {
    abstractGameState: string;
    codedGameState: number;
    detailedState: string;
    statusCode: number;
    startTimeTBD: boolean;
  };
  teams: {
    away: {
      leagueRecord: {
        wins: number;
        losses: number;
        ot: number;
        type: string;
      };
      score: number;
      team: {
        id: number;
        name: string;
        link: string;
      };
    };
    home: {
      leagueRecord: {
        wins: number;
        losses: number;
        ot: number;
        type: string;
      };
      score: number;
      team: {
        id: number;
        name: string;
        link: string;
      };
    };
  };
  venue: {
    name: string;
    link: string;
  };
  content: {
    link: string;
  };
}

export interface IParsedGame {
  gameId: number;
  homeTeamId: number;
  awayTeamId: number;
  gameDate: Date;
}