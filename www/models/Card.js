"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class Card {
    constructor(code, value, suit, image) {
        this.id = uuid_1.v4();
        this.code = code;
        this.name = value;
        this.suit = suit;
        this.image = image;
        this.value = this.getValue(value);
        this.score = this.getScore(value);
    }
    getValue(value) {
        switch (value) {
            case 'ACE':
                return 1;
            case 'JACK':
                return 11;
            case 'QUEEN':
                return 12;
            case 'KING':
                return 13;
            default:
                return parseInt(value, 10);
        }
    }
    getScore(value) {
        switch (value) {
            case 'ACE':
                return 15;
            case 'JACK':
                return 10;
            case 'QUEEN':
                return 10;
            case 'KING':
                return 10;
            default:
                return parseInt(value, 10);
        }
    }
}
exports.default = Card;
//# sourceMappingURL=Card.js.map