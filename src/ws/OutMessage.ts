import Card from '../models/Card'
import { Game } from '../models/Game'
import { IMatch } from '../models/Match'
import Player from '../models/Player'

export enum OutMessageType {
  availableMatches = 'AVAILABLE_MATCHES',
  joinedMatch = 'JOINED_MATCH',
  matchUpdated = 'MATCH_UPDATED',
  playerUpdated = 'PLAYER_UPDATED',
  playerConnected = 'PLAYER_CONNECTED',
  matchStarted = 'MATCH_STARTED',
  cardBought = 'CARD_BOUGHT',
  cardDiscarded = 'CARD_DISCARDED',
  gameDropped = 'GAME_DROPPED',
  cardsDropped = 'CARDS_DROPPED',
}

export interface OutMessagePayload {
  at: Date
}

export interface OutMessage {
  type: OutMessageType
  payload: OutMessagePayload
}

export class AvailableMatchesPayload implements OutMessagePayload {
  at: Date
  matches: IMatch[]

  constructor(matches: IMatch[]) {
    this.at = new Date()
    this.matches = matches
  }
}

export class JoinedMatchPayload implements OutMessagePayload {
  at: Date
  player: Player

  constructor(player: Player) {
    this.at = new Date()
    this.player = player
  }
}

export class MatchUpdatedPayload implements OutMessagePayload {
  at: Date
  match: IMatch

  constructor(match: IMatch) {
    this.at = new Date()
    this.match = match
  }
}

export class PlayerUpdatedPayload implements OutMessagePayload {
  at: Date
  player: Player

  constructor(player: Player) {
    this.at = new Date()
    this.player = player
  }
}

export class ConnectedPayload implements OutMessagePayload {
  at: Date
  matchId: string
  playerId: string
  match: IMatch

  constructor(matchId: string, playerId: string, match: IMatch) {
    this.at = new Date()
    this.matchId = matchId
    this.playerId = playerId
    this.match = match
  }
}

export class MatchStartedPayload implements OutMessagePayload {
  at: Date
  matchId: string
  match: IMatch

  constructor(matchId: string, match: IMatch) {
    this.at = new Date()
    this.matchId = matchId
    this.match = match
  }
}

export class CardBoughtPayload implements OutMessagePayload {
  at: Date
  card: Card

  constructor(card: Card) {
    this.at = new Date()
    this.card = card
  }
}

export class CardDiscardedPayload implements OutMessagePayload {
  at: Date
  remainingCards: Card[]

  constructor(remainingCards: Card[]) {
    this.at = new Date()
    this.remainingCards = remainingCards
  }
}

export class GameDroppedPayload implements OutMessagePayload {
  at: Date
  game: Game

  constructor(game: Game) {
    this.at = new Date()
    this.game = game
  }
}

export class CardsDroppedPayload implements OutMessagePayload {
  at: Date
  cards: Card[]

  constructor(cards: Card[]) {
    this.at = new Date()
    this.cards = cards
  }
}
