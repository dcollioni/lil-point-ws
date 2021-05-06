"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Card_1 = __importDefault(require("./Card"));
const node_fetch_1 = __importDefault(require("node-fetch"));
class Deck {
    constructor(count = 2) {
        this.count = count;
        this.remaining = 0;
    }
    async shuffle() {
        const response = await node_fetch_1.default(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${this.count}`);
        const { deck_id: id, remaining } = await response.json();
        this.id = id;
        this.remaining = remaining;
        return this;
    }
    async drawCard() {
        const response = await node_fetch_1.default(`https://deckofcardsapi.com/api/deck/${this.id}/draw/?count=1`);
        const { cards, remaining } = await response.json();
        const drawnCard = cards[0];
        const card = new Card_1.default(drawnCard.code, drawnCard.value, drawnCard.suit, drawnCard.image);
        this.remaining = remaining;
        return card;
    }
}
exports.default = Deck;
//# sourceMappingURL=Deck.js.map