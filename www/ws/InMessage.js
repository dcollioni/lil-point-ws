"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextRoundPayload = exports.DropCardsPayload = exports.DropGamePayload = exports.DiscardCardPayload = exports.BuyCardPayload = exports.StartMatchPayload = exports.JoinMatchPayload = exports.CreateMatchPayload = exports.ConnectPayload = exports.InMessageType = void 0;
var InMessageType;
(function (InMessageType) {
    InMessageType["connect"] = "CONNECT";
    InMessageType["createMatch"] = "CREATE_MATCH";
    InMessageType["joinMatch"] = "JOIN_MATCH";
    InMessageType["startMatch"] = "START_MATCH";
    InMessageType["buyCard"] = "BUY_CARD";
    InMessageType["discardCard"] = "DISCARD_CARD";
    InMessageType["dropGame"] = "DROP_GAME";
    InMessageType["dropCards"] = "DROP_CARDS";
    InMessageType["nextRound"] = "NEXT_ROUND";
})(InMessageType = exports.InMessageType || (exports.InMessageType = {}));
class ConnectPayload {
}
exports.ConnectPayload = ConnectPayload;
class CreateMatchPayload {
}
exports.CreateMatchPayload = CreateMatchPayload;
class JoinMatchPayload {
}
exports.JoinMatchPayload = JoinMatchPayload;
class StartMatchPayload {
}
exports.StartMatchPayload = StartMatchPayload;
class BuyCardPayload {
}
exports.BuyCardPayload = BuyCardPayload;
class DiscardCardPayload {
}
exports.DiscardCardPayload = DiscardCardPayload;
class DropGamePayload {
}
exports.DropGamePayload = DropGamePayload;
class DropCardsPayload {
}
exports.DropCardsPayload = DropCardsPayload;
class NextRoundPayload {
}
exports.NextRoundPayload = NextRoundPayload;
//# sourceMappingURL=InMessage.js.map