import { IAbbreviatedPlayer } from './player-models';

export interface IPlay {
  players: {
    player: IAbbreviatedPlayer;
    playerType: string;
    seasonTotal?: number;
  }[];
  result: {
    event: string;
    eventCode: string;
    eventTypeId: string;
    description: string;
    secondaryType: string;
    penaltySeverity?: string;
    penaltyMinutes?: number;
  };
  about: {
    eventIdx: number;
    eventId: number;
    period: number;
    periodType: string;
    ordinalNum: string;
    periodTime: string;
    periodTimeRemaining: string;
    dateTime: Date;
    goals: {
      away: number;
      home: number;
    };
  };
  coordinates: {
    x: number;
    y: number;
  };
  team: {
    id: number;
    name: string;
    link: string;
    triCode: string;
  };
}

export interface IParsedPlay {
  gameId: number;
  playType: string;
  timeStamp: Date;
}

export interface IParsedPlayStat {
  playId: number;
  playerId: number;
  hitValue: number;
  goalValue: number;
  assistValue: number;
  penaltyMinutes: number;
  pointValue: number;
}