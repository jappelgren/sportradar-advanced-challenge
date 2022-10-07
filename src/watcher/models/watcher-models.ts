export interface AbbreviatedPlayer {
  player: {
    id: number;
    fullName: string;
    link: string;
  };
  playerType: string;
  seasonTotal?: number;
}

export interface Play {
  players: AbbreviatedPlayer[];
  result: {
    event: string;
    eventCode: string;
    eventTypeId: string;
    description: string;
    secondaryType: string;
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
