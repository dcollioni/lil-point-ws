import WebSocket from 'ws'
import { ConnectPayload, InMessage, InMessageType } from './InMessage'
import { Match } from './../models/Match'
import { ConnectedPayload, OutMessage, OutMessageType } from './OutMessage'
import Player from '../models/Player'

export const start = (matches: Match[]): void => {
  const port = 8080
  const wss = new WebSocket.Server({ port }, () => {
    console.log(`web socket running: http://localhost:${port}/`)
  })

  wss.on('connection', (ws: WebSocket) => {
    console.log('new connection!')
    ws.send('Welcome to the chat, enjoy :)')

    ws.on('message', (data: string) => {
      let inMessage

      try {
        inMessage = JSON.parse(data) as InMessage
      } catch (e) {
        sendError(ws, 'Wrong format')
        return
      }

      const match = getMatch(inMessage.payload.matchId)
      const player = getPlayer(match, inMessage.payload.playerId)

      if (!match) {
        sendError(ws, 'Match not found')
        return
      }

      if (!player) {
        sendError(ws, 'Player not found')
        return
      }

      let outMessage: OutMessage

      switch (inMessage.type) {
        case InMessageType.connect:
          outMessage = {
            type: OutMessageType.playerConnected,
            payload: connected(inMessage.payload as ConnectPayload, match),
          }
          break
      }

      switch (outMessage.type) {
        case OutMessageType.playerConnected:
          sendToAll(outMessage, ws.protocol)
          break
      }
    })
  })

  const getMatch = (matchId: string): Match => {
    return matches.find(match => match.id === matchId)
  }

  const getPlayer = (match: Match, playerId: string): Player => {
    return match.players.find(player => player.id === playerId)
  }

  const connected = (payload: ConnectPayload, match: Match): ConnectedPayload => {
    return new ConnectedPayload(payload.matchId, payload.playerId, match)
  }

  const sendToAll = (outMessage: OutMessage, protocol?: string) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        if (protocol && client.protocol === protocol) {
          client.send(JSON.stringify(outMessage))
        }
      }
    })
  }

  const sendError = (ws: WebSocket, message: string) => {
    const messageObject = {
      type: 'ERROR',
      payload: message,
    }

    ws.send(JSON.stringify(messageObject))
  }
}
