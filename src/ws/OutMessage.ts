import { IMatch } from '../models/Match'

export enum OutMessageType {
  playerConnected = 'PLAYER_CONNECTED',
  matchStarted = 'MATCH_STARTED',
  cardBought = 'CARD_BOUGHT',
  cardDiscarded = 'CARD_DISCARDED',
}

export interface OutMessagePayload {
  matchId: string
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

export class MatchStartedPayload implements OutMessagePayload {
  matchId: string
  match: IMatch

  constructor(matchId: string, match: IMatch) {
    this.matchId = matchId
    this.match = match
  }
}

export class CardBoughtPayload implements OutMessagePayload {
  matchId: string
  match: IMatch

  constructor(matchId: string, match: IMatch) {
    this.matchId = matchId
    this.match = match
  }
}

export class CardDiscardedPayload implements OutMessagePayload {
  matchId: string
  match: IMatch

  constructor(matchId: string, match: IMatch) {
    this.matchId = matchId
    this.match = match
  }
}
