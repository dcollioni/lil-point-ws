import express, { Router } from 'express'
import { Match } from '../models/Match'
import WithMatch from './middlewares/WithMatch'

export const routes = (matches: Match[]): Router => {
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

  return router
}
