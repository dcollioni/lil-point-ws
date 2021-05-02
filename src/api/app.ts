import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { Match } from '../models/Match'
import { routes } from './router'

const app = express()
app.use(cors())
app.use(bodyParser.json())

export const start = (matches: Match[]): void => {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`api running: http://localhost:${port}/`)
  })

  app.use('/', routes(matches))
}
