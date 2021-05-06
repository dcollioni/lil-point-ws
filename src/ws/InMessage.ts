import Card from '../models/Card'

export enum InMessageType {
  connect = 'CONNECT',
  createMatch = 'CREATE_MATCH',
  joinMatch = 'JOIN_MATCH',
  startMatch = 'START_MATCH',
  buyCard = 'BUY_CARD',
  discardCard = 'DISCARD_CARD',
  dropGame = 'DROP_GAME',
  dropCards = 'DROP_CARDS',
  nextRound = 'NEXT_ROUND',
}

export interface InMessagePayload {
  at: Date
}

export interface InMessage {
  type: InMessageType
  payload: InMessagePayload
}

export class ConnectPayload implements InMessagePayload {
  at: Date
  matchId: string
  playerId: string
}

export class CreateMatchPayload implements InMessagePayload {
  at: Date
  numberOfPlayers: number
}

export class JoinMatchPayload implements InMessagePayload {
  at: Date
  matchId: string
  playerId: string
  playerName: string
}

export class StartMatchPayload implements InMessagePayload {
  at: Date
  matchId: string
}

export class BuyCardPayload implements InMessagePayload {
  at: Date
  matchId: string
  playerId: string
}

export class DiscardCardPayload implements InMessagePayload {
  at: Date
  matchId: string
  playerId: string
  cardId: string
}

export class DropGamePayload implements InMessagePayload {
  at: Date
  matchId: string
  playerId: string
  cards: Card[]
}

export class DropCardsPayload implements InMessagePayload {
  at: Date
  matchId: string
  playerId: string
  gameId: string
  cards: Card[]
}

export class NextRoundPayload implements InMessagePayload {
  at: Date
  matchId: string
}
