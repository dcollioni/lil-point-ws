import { start as startApi } from './api/app'
import { Match } from './models/Match'
import { start as startWebSocket } from './ws/webSocket'

const matches: Match[] = []

startApi(matches)
startWebSocket(matches)
