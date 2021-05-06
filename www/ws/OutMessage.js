"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsDroppedPayload = exports.GameDroppedPayload = exports.CardDiscardedPayload = exports.CardBoughtPayload = exports.MatchStartedPayload = exports.ConnectedPayload = exports.PlayerUpdatedPayload = exports.MatchUpdatedPayload = exports.JoinedMatchPayload = exports.AvailableMatchesPayload = exports.OutMessageType = void 0;
var OutMessageType;
(function (OutMessageType) {
    OutMessageType["availableMatches"] = "AVAILABLE_MATCHES";
    OutMessageType["joinedMatch"] = "JOINED_MATCH";
    OutMessageType["matchUpdated"] = "MATCH_UPDATED";
    OutMessageType["playerUpdated"] = "PLAYER_UPDATED";
    OutMessageType["playerConnected"] = "PLAYER_CONNECTED";
    OutMessageType["matchStarted"] = "MATCH_STARTED";
    OutMessageType["cardBought"] = "CARD_BOUGHT";
    OutMessageType["cardDiscarded"] = "CARD_DISCARDED";
    OutMessageType["gameDropped"] = "GAME_DROPPED";
    OutMessageType["cardsDropped"] = "CARDS_DROPPED";
})(OutMessageType = exports.OutMessageType || (exports.OutMessageType = {}));
class AvailableMatchesPayload {
    constructor(matches) {
        this.at = new Date();
        this.matches = matches;
    }
}
exports.AvailableMatchesPayload = AvailableMatchesPayload;
class JoinedMatchPayload {
    constructor(player) {
        this.at = new Date();
        this.player = player;
    }
}
exports.JoinedMatchPayload = JoinedMatchPayload;
class MatchUpdatedPayload {
    constructor(match) {
        this.at = new Date();
        this.match = match;
    }
}
exports.MatchUpdatedPayload = MatchUpdatedPayload;
class PlayerUpdatedPayload {
    constructor(player) {
        this.at = new Date();
        this.player = player;
    }
}
exports.PlayerUpdatedPayload = PlayerUpdatedPayload;
class ConnectedPayload {
    constructor(matchId, playerId, match) {
        this.at = new Date();
        this.matchId = matchId;
        this.playerId = playerId;
        this.match = match;
    }
}
exports.ConnectedPayload = ConnectedPayload;
class MatchStartedPayload {
    constructor(matchId, match) {
        this.at = new Date();
        this.matchId = matchId;
        this.match = match;
    }
}
exports.MatchStartedPayload = MatchStartedPayload;
class CardBoughtPayload {
    constructor(card) {
        this.at = new Date();
        this.card = card;
    }
}
exports.CardBoughtPayload = CardBoughtPayload;
class CardDiscardedPayload {
    constructor(remainingCards) {
        this.at = new Date();
        this.remainingCards = remainingCards;
    }
}
exports.CardDiscardedPayload = CardDiscardedPayload;
class GameDroppedPayload {
    constructor(game) {
        this.at = new Date();
        this.game = game;
    }
}
exports.GameDroppedPayload = GameDroppedPayload;
class CardsDroppedPayload {
    constructor(cards) {
        this.at = new Date();
        this.cards = cards;
    }
}
exports.CardsDroppedPayload = CardsDroppedPayload;
//# sourceMappingURL=OutMessage.js.map