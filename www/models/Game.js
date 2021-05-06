"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const uuid_1 = require("uuid");
class Game {
    constructor(cards) {
        this.id = uuid_1.v4();
        this.cards = cards;
    }
    isValid() {
        const { cards } = this;
        if (cards.length < 3) {
            return false;
        }
        let sortedCards = [...cards].sort(this.sortBySuit).sort(this.sortByValue);
        console.log(sortedCards);
        const uniqueSuits = new Set(sortedCards.map(card => card.suit));
        if (uniqueSuits.size === 1) {
            const validSequence = '01-02-03-04-05-06-07-08-09-10-11-12-13-14';
            const values = sortedCards.map(card => card.value.toString().padStart(2, '0')).join('-');
            console.log(values);
            if (!validSequence.includes(values)) {
                const ace = sortedCards.find(card => card.value === 1);
                if (!ace) {
                    return false;
                }
                if (ace) {
                    ace.value = 14;
                    sortedCards = sortedCards.sort(this.sortByValue);
                    const values = sortedCards.map(card => card.value.toString().padStart(2, '0')).join('-');
                    console.log(values);
                    if (!validSequence.includes(values)) {
                        return false;
                    }
                }
            }
        }
        else if (uniqueSuits.size === 3) {
            const uniqueValues = new Set(sortedCards.map(card => card.value));
            if (uniqueValues.size > 1) {
                return false;
            }
        }
        else {
            return false;
        }
        this.cards = sortedCards;
        return true;
    }
    sortBySuit(a, b) {
        if (a.suit < b.suit) {
            return -1;
        }
        if (a.suit > b.suit) {
            return 1;
        }
        return 0;
    }
    sortByValue(a, b) {
        if (a.value < b.value) {
            return -1;
        }
        if (a.value > b.value) {
            return 1;
        }
        return 0;
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map