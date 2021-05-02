export enum InMessageType {
  connect = 'CONNECT',
  // createMatch = 'CREATE_MATCH',
}

export interface InMessagePayload {
  matchId: string
  playerId: string
}

export interface InMessage {
  type: InMessageType
  payload: InMessagePayload
}

export class ConnectPayload implements InMessagePayload {
  matchId: string
  playerId: string
}

// export class CreateMatchPayload implements InMessagePayload {
//   userId: string
//   numberOfPlayers: number
// }
