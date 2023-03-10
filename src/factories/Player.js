export class Player {
    constructor(opGameboard) {
        this.opGameboard = opGameboard;
    }

    attackBoard(x, y) {
        return this.opGameboard.receiveAttack(x,y);
    }
}

export class IA extends Player {
    #movesArray = new Array();
    constructor(opGameboard) {
        super(opGameboard);
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                this.#movesArray.push([i,j]);
            }
        }
    }

    attackRandomCoordinates() {
        let coord = this.#movesArray.splice(Math.random() * this.#movesArray.length, 1);
        this.attackBoard(coord[0][0], coord[0][1]);
        return coord[0];
    }
}