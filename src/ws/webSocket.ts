import WebSocket from 'ws'
import {
  BuyCardPayload,
  // ConnectPayload,
  CreateMatchPayload,
  DiscardCardPayload,
  DropCardsPayload,
  DropGamePayload,
  InMessage,
  // InMessagePayload,
  InMessageType,
  JoinMatchPayload,
  NextRoundPayload,
  StartMatchPayload,
} from './InMessage'
import { Match } from './../models/Match'
import {
  AvailableMatchesPayload,
  CardBoughtPayload,
  CardDiscardedPayload,
  CardsDroppedPayload,
  GameDroppedPayload,
  // ConnectedPayload,
  JoinedMatchPayload,
  MatchUpdatedPayload,
  OutMessage,
  OutMessageType,
  PlayerUpdatedPayload,
} from './OutMessage'
import Player from '../models/Player'

export const start = (matches: Match[]): WebSocket.Server => {
  const port = parseInt(process.env.PORT || '8080')
  const wss = new WebSocket.Server({ port }, () => {
    console.log(`web socket running: http://localhost:${port}/`)
  })

  wss.on('connection', (ws: WebSocket) => {
    if (!ws.protocol) {
      const availableMatches: OutMessage = {
        type: OutMessageType.availableMatches,
        payload: new AvailableMatchesPayload(matches),
      }
      ws.send(JSON.stringify(availableMatches))
    }

    ws.on('message', async (data: string) => {
      let inMessage

      try {
        inMessage = JSON.parse(data) as InMessage
      } catch (e) {
        sendError(ws, 'Wrong format')
        return
      }

      console.log(ws.protocol)
      console.log(inMessage)

      // let match: IMatch

      // if (ws.protocol) {
      //   match = getMatch(ws.protocol)
      //   if (!match) {
      //     sendError(ws, 'Match not found')
      //     return
      //   }
      // }

      let outMessage: OutMessage

      switch (inMessage.type) {
        case InMessageType.createMatch:
          outMessage = createMatch(inMessage.payload as CreateMatchPayload)
          sendToAll(outMessage)
          break
        case InMessageType.joinMatch:
          outMessage = joinMatch(inMessage.payload as JoinMatchPayload)
          ws.send(JSON.stringify(outMessage))

          outMessage = matchUpdated((inMessage.payload as JoinMatchPayload).matchId)
          sendToAll(outMessage, (inMessage.payload as JoinMatchPayload).matchId)
          break
        case InMessageType.startMatch:
          await startMatch(inMessage.payload as StartMatchPayload)
          break
        case InMessageType.buyCard:
          await buyCard(inMessage.payload as BuyCardPayload)
          break
        case InMessageType.discardCard:
          discardCard(inMessage.payload as DiscardCardPayload)
          break
        case InMessageType.dropGame:
          dropGame(inMessage.payload as DropGamePayload)
          break
        case InMessageType.dropCards:
          dropCards(inMessage.payload as DropCardsPayload)
          break
        case InMessageType.nextRound:
          nextRound(inMessage.payload as NextRoundPayload)
          break
      }
    })
  })

  const getMatch = (matchId: string): Match => {
    return matches.find(match => match.id === matchId)
  }

  const createMatch = (payload: CreateMatchPayload): OutMessage => {
    const match = new Match(payload.numberOfPlayers)
    matches.push(match)

    return {
      type: OutMessageType.availableMatches,
      payload: new AvailableMatchesPayload(matches),
    }
  }

  const joinMatch = (payload: JoinMatchPayload): OutMessage => {
    const match = getMatch(payload.matchId)
    const player = new Player(payload.playerId, payload.playerName)
    match.addPlayer(player)

    return {
      type: OutMessageType.joinedMatch,
      payload: new JoinedMatchPayload(player),
    }
  }

  const startMatch = async (payload: StartMatchPayload): Promise<void> => {
    let match = getMatch(payload.matchId)
    match = await match.start()

    const matchUpdatedMessage = {
      type: OutMessageType.matchUpdated,
      payload: new MatchUpdatedPayload(match),
    }
    sendToAll(matchUpdatedMessage, match.id)

    match.players.forEach(player => {
      const playerUpdatedMessage = {
        type: OutMessageType.playerUpdated,
        payload: new PlayerUpdatedPayload(player),
      }
      sendToAll(playerUpdatedMessage, player.id)
    })
  }

  const buyCard = async (payload: BuyCardPayload): Promise<void> => {
    const match = getMatch(payload.matchId)
    const turn = match.currentRound.turn
    const turnPlayer = match.currentRound.turn.player

    if (!turn.canBuy || turnPlayer.id !== payload.playerId) {
      console.log('Player cannot buy card', payload.playerId)
      return
    }

    const card = await match.currentRound.playerBuyCard()
    if (!card) {
      return
    }

    const matchUpdatedMessage = {
      type: OutMessageType.matchUpdated,
      payload: new MatchUpdatedPayload(match),
    }
    sendToAll(matchUpdatedMessage, match.id)

    const cardBoughtMessage = {
      type: OutMessageType.cardBought,
      payload: new CardBoughtPayload(card),
    }
    sendToAll(cardBoughtMessage, turnPlayer.id)
  }

  const discardCard = (payload: DiscardCardPayload): Promise<void> => {
    const match = getMatch(payload.matchId)
    const turn = match.currentRound.turn
    const turnPlayer = match.currentRound.turn.player

    if (!turn.canDiscard || turnPlayer.id !== payload.playerId) {
      console.log('Player cannot discard card', payload.playerId)
      return
    }

    match.currentRound.playerDiscardCard(payload.cardId)

    const matchUpdatedMessage = {
      type: OutMessageType.matchUpdated,
      payload: new MatchUpdatedPayload(match),
    }
    sendToAll(matchUpdatedMessage, match.id)

    const cardDiscardedMessage = {
      type: OutMessageType.cardDiscarded,
      payload: new CardDiscardedPayload(turnPlayer.cards),
    }
    sendToAll(cardDiscardedMessage, turnPlayer.id)
  }

  const dropGame = (payload: DropGamePayload) => {
    const match = getMatch(payload.matchId)
    const turn = match.currentRound.turn
    const turnPlayer = match.currentRound.turn.player

    if (turnPlayer.id !== payload.playerId) {
      console.log('Player cannot drop game 1', payload.playerId)
      return
    }

    if (!turn.canDrop) {
      const lastDiscarded = match.currentRound.table.discarded[match.currentRound.table.discarded.length - 1]
      console.log(lastDiscarded)
      if (!lastDiscarded) {
        console.log('Player cannot drop game 2', payload.playerId)
        return
      }

      const cardsIds = payload.cards.map(card => card.id)
      if (!cardsIds.includes(lastDiscarded.id) || !turn.canBuy) {
        console.log('Player cannot drop game 3', payload.playerId)
        return
      }
    }

    const game = match.currentRound.playerDropGame(payload.cards)
    if (!game) {
      return
    }

    const matchUpdatedMessage = {
      type: OutMessageType.matchUpdated,
      payload: new MatchUpdatedPayload(match),
    }
    sendToAll(matchUpdatedMessage, match.id)

    const gameDroppedMessage = {
      type: OutMessageType.gameDropped,
      payload: new GameDroppedPayload(game),
    }
    sendToAll(gameDroppedMessage, turnPlayer.id)
  }

  const dropCards = (payload: DropCardsPayload) => {
    const match = getMatch(payload.matchId)
    const turn = match.currentRound.turn
    const turnPlayer = match.currentRound.turn.player

    if (!turn.canDrop || turnPlayer.id !== payload.playerId) {
      console.log('Player cannot drop cards', payload.playerId)
      return
    }

    const cards = match.currentRound.playerDropCards(payload.cards, payload.gameId)
    if (!cards) {
      return
    }

    const matchUpdatedMessage = {
      type: OutMessageType.matchUpdated,
      payload: new MatchUpdatedPayload(match),
    }
    sendToAll(matchUpdatedMessage, match.id)

    const cardsDroppedMessage = {
      type: OutMessageType.cardsDropped,
      payload: new CardsDroppedPayload(cards),
    }
    sendToAll(cardsDroppedMessage, turnPlayer.id)
  }

  const nextRound = async (payload: NextRoundPayload): Promise<void> => {
    const match = getMatch(payload.matchId)

    if (!match.currentRound.hasEnded) {
      console.log('Cannot start next round')
      return
    }

    const round = await match.nextRound()

    const matchUpdatedMessage = {
      type: OutMessageType.matchUpdated,
      payload: new MatchUpdatedPayload(match),
    }
    sendToAll(matchUpdatedMessage, match.id)

    round.players.forEach(player => {
      const playerUpdatedMessage = {
        type: OutMessageType.playerUpdated,
        payload: new PlayerUpdatedPayload(player),
      }
      sendToAll(playerUpdatedMessage, player.id)
    })
  }

  const matchUpdated = (matchId: string): OutMessage => {
    const match = getMatch(matchId)

    return {
      type: OutMessageType.matchUpdated,
      payload: new MatchUpdatedPayload(match),
    }
  }

  // const connected = (payload: ConnectPayload, match: IMatch): ConnectedPayload => {
  //   return new ConnectedPayload(payload.matchId, payload.playerId, match)
  // }

  const sendToAll = (outMessage: OutMessage, protocol?: string) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        if (!protocol) {
          client.send(JSON.stringify(outMessage))
        } else if (client.protocol.includes(protocol)) {
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

  return wss
}
