"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchRound = void 0;
const uuid_1 = require("uuid");
const Deck_1 = __importDefault(require("./Deck"));
const Game_1 = require("./Game");
const Table_1 = __importDefault(require("./Table"));
const Turn_1 = __importDefault(require("./Turn"));
class MatchRound {
    constructor(players, cardsPerPlayer) {
        this.turnPlayerIndex = 0;
        this.playerDropCards = (cards, gameId) => {
            const { turn, table } = this;
            const game = table.games.find(g => g.id === gameId);
            if (game && cards.length > 0) {
                const newGame = new Game_1.Game([...game.cards, ...cards]);
                if (newGame.isValid()) {
                    game.cards = newGame.cards;
                    const cardsIds = cards.map(card => card.id);
                    turn.player.cards = turn.player.cards.filter(c => !cardsIds.includes(c.id));
                    // player.selectedCards = []
                    this.checkTurnResult();
                    return cards;
                }
            }
        };
        this.id = uuid_1.v4();
        this.players = players;
        this.cardsPerPlayer = cardsPerPlayer;
        this.deck = new Deck_1.default();
        this.table = new Table_1.default();
        this.turn = new Turn_1.default(this.players[this.turnPlayerIndex]);
        this.hasEnded = false;
    }
    async start() {
        this.deck = await this.deck.shuffle();
        const playersCards = await this.drawPlayersCards();
        playersCards.map((cards, index) => {
            this.players[index].cards = cards;
        });
        return this;
    }
    nextTurn() {
        this.turnPlayerIndex++;
        if (this.turnPlayerIndex === this.players.length) {
            this.turnPlayerIndex = 0;
        }
        this.turn = new Turn_1.default(this.players[this.turnPlayerIndex]);
        return this.turn;
    }
    async playerBuyCard() {
        if (!this.turn.canBuy) {
            return;
        }
        try {
            const card = await this.deck.drawCard();
            this.turn.player.cards.push(card);
            this.turn.canBuy = false;
            this.turn.canDrop = true;
            this.turn.canDiscard = true;
            return card;
        }
        catch (err) {
            console.error(err);
        }
    }
    playerDiscardCard(cardId) {
        const { turn, table } = this;
        if (!turn.canDiscard) {
            return false;
        }
        const { player } = turn;
        const card = player.cards.find(c => c.id === cardId);
        if (card) {
            table.discarded.push(card);
            table.selectedCards = [];
            player.cards = player.cards.filter(c => c.id !== cardId);
            player.selectedCards = [];
            this.checkTurnResult();
            if (!this.hasEnded) {
                this.nextTurn();
                return true;
            }
        }
        return false;
    }
    playerDropGame(cards) {
        // const {
        //   turn: { player },
        //   table,
        // } = this
        // if (!this.turn.canDrop) {
        //   return
        // }
        // const { selectedCards: tableSelectedCards } = table
        // const { selectedCards } = player
        const game = new Game_1.Game(cards);
        if (!game.isValid()) {
            return;
        }
        const cardsIds = cards.map(card => card.id);
        const { turn, table } = this;
        turn.canBuy = false;
        turn.canDrop = true;
        turn.canDiscard = true;
        table.games.push(game);
        table.discarded = table.discarded.filter(card => !cardsIds.includes(card.id));
        // this.table.selectedCards = []
        turn.player.cards = turn.player.cards.filter(card => !cardsIds.includes(card.id));
        // this.turn.player.selectedCards = []
        this.checkTurnResult();
        return game;
    }
    selectDiscardedCard(card) {
        const { turn, table } = this;
        const { selectedCards } = table;
        if (selectedCards.length === 0) {
            if (!(turn === null || turn === void 0 ? void 0 : turn.canBuy)) {
                return;
            }
            table.selectedCards.push(card);
            turn.canBuy = false;
            turn.canDrop = true;
        }
        else if (selectedCards.includes(card)) {
            table.selectedCards = selectedCards.filter(c => c !== card);
            turn.canBuy = true;
            turn.canDrop = false;
        }
    }
    checkTurnResult() {
        const { turn: { player }, } = this;
        if (player.numberOfCards === 0) {
            this.hasEnded = true;
            this.sumPlayersScore();
        }
    }
    sumPlayersScore() {
        const { players } = this;
        for (const player of players) {
            player.score += player.cards.reduce((sum, currentCard) => {
                return (sum += currentCard.score);
            }, 0);
        }
        console.log(players);
    }
    async drawPlayersCards() {
        const cards = this.players.map(() => []);
        let complete = false;
        do {
            for (const playerCards of cards) {
                if (playerCards.length < this.cardsPerPlayer) {
                    try {
                        const card = await this.deck.drawCard();
                        playerCards.push(card);
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            }
            complete = cards.flat().length === this.players.length * this.cardsPerPlayer;
        } while (!complete);
        return cards;
    }
}
exports.MatchRound = MatchRound;
//# sourceMappingURL=MatchRound.js.map