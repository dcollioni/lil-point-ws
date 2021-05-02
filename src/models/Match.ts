import { v4 as uuidv4 } from 'uuid'
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
}

export class Match implements IMatch {
  id: string
  status: MatchStatus
  numberOfPlayers: number
  players: Player[]

  constructor(numberOfPlayers: number) {
    this.id = uuidv4()
    this.status = MatchStatus.created
    this.numberOfPlayers = numberOfPlayers
    this.players = []
  }

  addPlayer(name: string): Player {
    const player = new Player(name)
    this.players.push(player)
    return player
  }
}
