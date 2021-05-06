"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class Player {
    constructor(id = uuid_1.v4(), name) {
        this.id = id;
        this.name = name;
        this.cards = [];
        this.selectedCards = [];
        this.score = 0;
    }
    get numberOfCards() {
        return this.cards.length;
    }
}
exports.default = Player;
//# sourceMappingURL=Player.js.map