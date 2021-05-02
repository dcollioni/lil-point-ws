import { IMatch } from '../models/Match'

export enum OutMessageType {
  playerConnected = 'PLAYER_CONNECTED',
  // matchCreated = 'MATCH_CREATED',
}

export interface OutMessagePayload {
  matchId: string
  playerId: string
}

export interface OutMessage {
  type: OutMessageType
  payload: OutMessagePayload
}

export class ConnectedPayload implements OutMessagePayload {
  matchId: string
  playerId: string
  match: IMatch

  constructor(matchId: string, playerId: string, match: IMatch) {
    this.matchId = matchId
    this.playerId = playerId
    this.match = match
  }
}

// export class MatchCreatedPayload implements OutMessagePayload {
//   userId: string
//   match: IMatch

//   constructor(userId: string, match: IMatch) {
//     this.userId = userId
//     this.match = match
//   }
// }
