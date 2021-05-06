// import { NextFunction, Request, Response } from 'express'
// import { Match } from '../../models/Match'

// export default class WithMatch {
//   matches: Match[]

//   constructor(matches: Match[]) {
//     this.matches = matches
//   }

//   run(req: Request, res: Response, next: NextFunction): void {
//     const { matchId } = req.params
//     const match = this.matches.find(match => match.id === matchId)

//     if (!match) {
//       res.status(404).json({ message: `match with id ${matchId} not found` })
//       return
//     }

//     req.match = match
//     next()
//   }
// }
