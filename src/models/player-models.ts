export enum PlayerTypes {
  HITTER = 'Hitter',
  SCORER = 'Scorer',
  ASSIST = 'Assist',
  PENALTY_ON = 'PenaltyOn'
}

export interface IAbbreviatedPlayer {
  id: number;
  fullName: string;
  link: string;
}

export interface IAbbreviatedPerson {
  person: IAbbreviatedPlayer;
  jerseyNumber: string;
  position: IPosition;
}

export interface IPosition {
  code: string;
  name: string;
  type: string;
  abbreviation: string;
}

// On the live feed endpoint the player list is an object with the players ID as a key rather than an array.
// This is for that.
export interface IFeedPlayersObject {
  [playerId: string]: IPlayerFullDetails;
}

export interface IPlayerFullDetails {
  id: number;
  fullName: string;
  link: string;
  firstName: string;
  lastName: string;
  primaryNumber: string;
  birthDate: string;
  currentAge: number;
  birthCity: string;
  birthStateProvince: string;
  birthCountry: string;
  nationality: string;
  height: string;
  weight: number;
  active: boolean;
  alternateCaptain: boolean;
  captain: boolean;
  rookie: boolean;
  shootsCatches: string;
  rosterStatus: string;
  currentTeam: {
    id: number;
    name: string;
    link: string;
  };
  primaryPosition: IPosition;
}

export interface IParsedPlayer {
  playerId: number;
  firstName: string;
  lastName: string;
  age: number;
  number: string;
  position: string;
  teamId: number;
}