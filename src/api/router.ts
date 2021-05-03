import express, { Router } from 'express'
import { Match } from '../models/Match'
import WithMatch from './middlewares/WithMatch'
import WebSocket from 'ws'
import {
  OutMessage,
  OutMessageType,
  MatchStartedPayload,
  CardBoughtPayload,
  CardDiscardedPayload,
} from '../ws/OutMessage'

export const routes = (matches: Match[], wss: WebSocket.Server): Router => {
  const router = express.Router()
  const withMatch = new WithMatch(matches)
  const withMatchRun = withMatch.run.bind(withMatch)

  router.post('/match', (req, res) => {
    const { numberOfPlayers } = req.body

    const match = new Match(numberOfPlayers)
    matches.push(match)

    return res.status(201).json(match)
  })

  router.post('/match/:matchId/join', withMatchRun, (req, res) => {
    const { name } = req.body
    const match = req.match as Match

    const player = match.addPlayer(name)
    return res.status(201).json(player)
  })

  router.post('/match/:matchId/start', withMatchRun, async (req, res) => {
    let match = req.match as Match
    match = await match.start()

    const outMessage: OutMessage = {
      type: OutMessageType.matchStarted,
      payload: { matchId: match.id, match } as MatchStartedPayload,
    }
    sendToAll(outMessage, match.id)

    return res.json(match)
  })

  router.post('/match/:matchId/buy', withMatchRun, async (req, res) => {
    const match = req.match as Match
    const card = await match.currentRound.playerBuyCard()

    const outMessage: OutMessage = {
      type: OutMessageType.cardBought,
      payload: { matchId: match.id, match } as CardBoughtPayload,
    }
    sendToAll(outMessage, match.id)

    return res.json(card)
  })

  router.post('/match/:matchId/discard/:cardId', withMatchRun, async (req, res) => {
    const match = req.match as Match

    const { cardId } = req.params
    match.currentRound.playerDiscardCard(cardId)

    const outMessage: OutMessage = {
      type: OutMessageType.cardDiscarded,
      payload: { matchId: match.id, match } as CardDiscardedPayload,
    }
    sendToAll(outMessage, match.id)

    return res.sendStatus(200)
  })

  const sendToAll = (outMessage: OutMessage, protocol?: string) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        if (protocol && client.protocol === protocol) {
          client.send(JSON.stringify(outMessage))
        }
      }
    })
  }

  return router
}
