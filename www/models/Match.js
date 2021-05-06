"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = void 0;
const uuid_1 = require("uuid");
const MatchRound_1 = require("./MatchRound");
var MatchStatus;
(function (MatchStatus) {
    MatchStatus["created"] = "CREATED";
    MatchStatus["started"] = "STARTED";
    MatchStatus["finished"] = "FINISHED";
})(MatchStatus || (MatchStatus = {}));
class Match {
    constructor(numberOfPlayers) {
        this.cardsPerPlayer = 3;
        this.id = uuid_1.v4();
        this.status = MatchStatus.created;
        this.numberOfPlayers = numberOfPlayers;
        this.players = [];
        this.rounds = [];
    }
    addPlayer(player) {
        this.players.push(player);
        return player;
    }
    async start() {
        const round = await new MatchRound_1.MatchRound(this.players, this.cardsPerPlayer).start();
        this.rounds.push(round);
        this.currentRound = round;
        this.status = MatchStatus.started;
        return this;
    }
    async nextRound() {
        const round = await new MatchRound_1.MatchRound(this.players, this.cardsPerPlayer).start();
        this.rounds.push(round);
        this.currentRound = round;
        return round;
    }
}
exports.Match = Match;
//# sourceMappingURL=Match.js.map