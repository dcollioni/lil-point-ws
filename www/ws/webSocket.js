"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const ws_1 = __importDefault(require("ws"));
const InMessage_1 = require("./InMessage");
const Match_1 = require("./../models/Match");
const OutMessage_1 = require("./OutMessage");
const Player_1 = __importDefault(require("../models/Player"));
const start = (matches) => {
    const port = parseInt(process.env.PORT || '8080');
    const wss = new ws_1.default.Server({ port }, () => {
        console.log(`web socket running: http://localhost:${port}/`);
    });
    wss.on('connection', (ws) => {
        if (!ws.protocol) {
            const availableMatches = {
                type: OutMessage_1.OutMessageType.availableMatches,
                payload: new OutMessage_1.AvailableMatchesPayload(matches),
            };
            ws.send(JSON.stringify(availableMatches));
        }
        ws.on('message', async (data) => {
            let inMessage;
            try {
                inMessage = JSON.parse(data);
            }
            catch (e) {
                sendError(ws, 'Wrong format');
                return;
            }
            console.log(ws.protocol);
            console.log(inMessage);
            // let match: IMatch
            // if (ws.protocol) {
            //   match = getMatch(ws.protocol)
            //   if (!match) {
            //     sendError(ws, 'Match not found')
            //     return
            //   }
            // }
            let outMessage;
            switch (inMessage.type) {
                case InMessage_1.InMessageType.createMatch:
                    outMessage = createMatch(inMessage.payload);
                    sendToAll(outMessage);
                    break;
                case InMessage_1.InMessageType.joinMatch:
                    outMessage = joinMatch(inMessage.payload);
                    ws.send(JSON.stringify(outMessage));
                    outMessage = matchUpdated(inMessage.payload.matchId);
                    sendToAll(outMessage, inMessage.payload.matchId);
                    break;
                case InMessage_1.InMessageType.startMatch:
                    await startMatch(inMessage.payload);
                    break;
                case InMessage_1.InMessageType.buyCard:
                    await buyCard(inMessage.payload);
                    break;
                case InMessage_1.InMessageType.discardCard:
                    discardCard(inMessage.payload);
                    break;
                case InMessage_1.InMessageType.dropGame:
                    dropGame(inMessage.payload);
                    break;
                case InMessage_1.InMessageType.dropCards:
                    dropCards(inMessage.payload);
                    break;
                case InMessage_1.InMessageType.nextRound:
                    nextRound(inMessage.payload);
                    break;
            }
        });
    });
    const getMatch = (matchId) => {
        return matches.find(match => match.id === matchId);
    };
    const createMatch = (payload) => {
        const match = new Match_1.Match(payload.numberOfPlayers);
        matches.push(match);
        return {
            type: OutMessage_1.OutMessageType.availableMatches,
            payload: new OutMessage_1.AvailableMatchesPayload(matches),
        };
    };
    const joinMatch = (payload) => {
        const match = getMatch(payload.matchId);
        const player = new Player_1.default(payload.playerId, payload.playerName);
        match.addPlayer(player);
        return {
            type: OutMessage_1.OutMessageType.joinedMatch,
            payload: new OutMessage_1.JoinedMatchPayload(player),
        };
    };
    const startMatch = async (payload) => {
        let match = getMatch(payload.matchId);
        match = await match.start();
        const matchUpdatedMessage = {
            type: OutMessage_1.OutMessageType.matchUpdated,
            payload: new OutMessage_1.MatchUpdatedPayload(match),
        };
        sendToAll(matchUpdatedMessage, match.id);
        match.players.forEach(player => {
            const playerUpdatedMessage = {
                type: OutMessage_1.OutMessageType.playerUpdated,
                payload: new OutMessage_1.PlayerUpdatedPayload(player),
            };
            sendToAll(playerUpdatedMessage, player.id);
        });
    };
    const buyCard = async (payload) => {
        const match = getMatch(payload.matchId);
        const turn = match.currentRound.turn;
        const turnPlayer = match.currentRound.turn.player;
        if (!turn.canBuy || turnPlayer.id !== payload.playerId) {
            console.log('Player cannot buy card', payload.playerId);
            return;
        }
        const card = await match.currentRound.playerBuyCard();
        if (!card) {
            return;
        }
        const matchUpdatedMessage = {
            type: OutMessage_1.OutMessageType.matchUpdated,
            payload: new OutMessage_1.MatchUpdatedPayload(match),
        };
        sendToAll(matchUpdatedMessage, match.id);
        const cardBoughtMessage = {
            type: OutMessage_1.OutMessageType.cardBought,
            payload: new OutMessage_1.CardBoughtPayload(card),
        };
        sendToAll(cardBoughtMessage, turnPlayer.id);
    };
    const discardCard = (payload) => {
        const match = getMatch(payload.matchId);
        const turn = match.currentRound.turn;
        const turnPlayer = match.currentRound.turn.player;
        if (!turn.canDiscard || turnPlayer.id !== payload.playerId) {
            console.log('Player cannot discard card', payload.playerId);
            return;
        }
        match.currentRound.playerDiscardCard(payload.cardId);
        const matchUpdatedMessage = {
            type: OutMessage_1.OutMessageType.matchUpdated,
            payload: new OutMessage_1.MatchUpdatedPayload(match),
        };
        sendToAll(matchUpdatedMessage, match.id);
        const cardDiscardedMessage = {
            type: OutMessage_1.OutMessageType.cardDiscarded,
            payload: new OutMessage_1.CardDiscardedPayload(turnPlayer.cards),
        };
        sendToAll(cardDiscardedMessage, turnPlayer.id);
    };
    const dropGame = (payload) => {
        const match = getMatch(payload.matchId);
        const turn = match.currentRound.turn;
        const turnPlayer = match.currentRound.turn.player;
        if (turnPlayer.id !== payload.playerId) {
            console.log('Player cannot drop game 1', payload.playerId);
            return;
        }
        if (!turn.canDrop) {
            const lastDiscarded = match.currentRound.table.discarded[match.currentRound.table.discarded.length - 1];
            console.log(lastDiscarded);
            if (!lastDiscarded) {
                console.log('Player cannot drop game 2', payload.playerId);
                return;
            }
            const cardsIds = payload.cards.map(card => card.id);
            if (!cardsIds.includes(lastDiscarded.id) || !turn.canBuy) {
                console.log('Player cannot drop game 3', payload.playerId);
                return;
            }
        }
        const game = match.currentRound.playerDropGame(payload.cards);
        if (!game) {
            return;
        }
        const matchUpdatedMessage = {
            type: OutMessage_1.OutMessageType.matchUpdated,
            payload: new OutMessage_1.MatchUpdatedPayload(match),
        };
        sendToAll(matchUpdatedMessage, match.id);
        const gameDroppedMessage = {
            type: OutMessage_1.OutMessageType.gameDropped,
            payload: new OutMessage_1.GameDroppedPayload(game),
        };
        sendToAll(gameDroppedMessage, turnPlayer.id);
    };
    const dropCards = (payload) => {
        const match = getMatch(payload.matchId);
        const turn = match.currentRound.turn;
        const turnPlayer = match.currentRound.turn.player;
        if (!turn.canDrop || turnPlayer.id !== payload.playerId) {
            console.log('Player cannot drop cards', payload.playerId);
            return;
        }
        const cards = match.currentRound.playerDropCards(payload.cards, payload.gameId);
        if (!cards) {
            return;
        }
        const matchUpdatedMessage = {
            type: OutMessage_1.OutMessageType.matchUpdated,
            payload: new OutMessage_1.MatchUpdatedPayload(match),
        };
        sendToAll(matchUpdatedMessage, match.id);
        const cardsDroppedMessage = {
            type: OutMessage_1.OutMessageType.cardsDropped,
            payload: new OutMessage_1.CardsDroppedPayload(cards),
        };
        sendToAll(cardsDroppedMessage, turnPlayer.id);
    };
    const nextRound = async (payload) => {
        const match = getMatch(payload.matchId);
        if (!match.currentRound.hasEnded) {
            console.log('Cannot start next round');
            return;
        }
        const round = await match.nextRound();
        const matchUpdatedMessage = {
            type: OutMessage_1.OutMessageType.matchUpdated,
            payload: new OutMessage_1.MatchUpdatedPayload(match),
        };
        sendToAll(matchUpdatedMessage, match.id);
        round.players.forEach(player => {
            const playerUpdatedMessage = {
                type: OutMessage_1.OutMessageType.playerUpdated,
                payload: new OutMessage_1.PlayerUpdatedPayload(player),
            };
            sendToAll(playerUpdatedMessage, player.id);
        });
    };
    const matchUpdated = (matchId) => {
        const match = getMatch(matchId);
        return {
            type: OutMessage_1.OutMessageType.matchUpdated,
            payload: new OutMessage_1.MatchUpdatedPayload(match),
        };
    };
    // const connected = (payload: ConnectPayload, match: IMatch): ConnectedPayload => {
    //   return new ConnectedPayload(payload.matchId, payload.playerId, match)
    // }
    const sendToAll = (outMessage, protocol) => {
        wss.clients.forEach(client => {
            if (client.readyState === ws_1.default.OPEN) {
                if (!protocol) {
                    client.send(JSON.stringify(outMessage));
                }
                else if (client.protocol.includes(protocol)) {
                    client.send(JSON.stringify(outMessage));
                }
            }
        });
    };
    const sendError = (ws, message) => {
        const messageObject = {
            type: 'ERROR',
            payload: message,
        };
        ws.send(JSON.stringify(messageObject));
    };
    return wss;
};
exports.start = start;
//# sourceMappingURL=webSocket.js.map