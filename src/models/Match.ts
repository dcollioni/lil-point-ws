import { v4 as uuidv4 } from 'uuid'
import { MatchRound } from './MatchRound'
import Player from './Player'

enum MatchStatus {
  created = 'CREATED',
  started = 'STARTED',
  finished = 'FINISHED',
}

export interface IMatch {
  id: string
  status: MatchStatus
  numberOfPlayers: number
  players: Player[]
  rounds: MatchRound[]
  currentRound?: MatchRound
}

export class Match implements IMatch {
  private cardsPerPlayer = 11
  id: string
  status: MatchStatus
  numberOfPlayers: number
  players: Player[]
  rounds: MatchRound[]
  currentRound?: MatchRound

  constructor(numberOfPlayers: number) {
    this.id = uuidv4()
    this.status = MatchStatus.created
    this.numberOfPlayers = numberOfPlayers
    this.players = []
    this.rounds = []
  }

  addPlayer(player: Player): Player {
    this.players.push(player)
    return player
  }

  async start(): Promise<Match> {
    const round = await new MatchRound(this.players, this.cardsPerPlayer).start()
    this.rounds.push(round)
    this.currentRound = round
    this.status = MatchStatus.started
    return this
  }

  async nextRound(): Promise<MatchRound> {
    const round = await new MatchRound(this.players, this.cardsPerPlayer).start()
    this.rounds.push(round)
    this.currentRound = round
    return round
  }
}
