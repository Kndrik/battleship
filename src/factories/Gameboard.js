class Gameboard {
    #ships = new Array();
    constructor() {
        this.#createGrid();
    }
    
    #createGrid() {
        this.grid = new Array(10);
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = new Array(10);
            for (let j = 0; j < this.grid[i].length; j++) {
                this.grid[i][j] = new Cell();
            }
        }
    }

    placeShip(ship, x, y, rotated = false) {
        if (!rotated) {
            if (x + ship.length-1 > 9) throw new Error('Ship is overflowing');
            this.#ships.push(ship);
            return this.fillHorizontalShip(ship, x, y);
        } else {
            if (y - ship.length-1 < 0) throw new Error('Ship is overflowing');
            this.#ships.push(ship);
            return this.fillVerticalShip(ship, x, y);
        }
    }

    fillHorizontalShip(ship, x, y) {
        let cells = new Array();
        const initX = x;
        const length = ship.length;
        while(x < initX + length) {
            const cell = this.getCell(x, y);
            if (cell.state === 'ship') {
                throw new Error('Ships are overlapping');
            }
            cells.push(cell);
            x++;
        }

        cells.forEach(cell => {
            cell.ship = ship;
            cell.changeState('ship');
        });
    }

    fillVerticalShip(ship, x, y) {
        let cells = new Array();
        const initY = y;
        const length = ship.length;
        while(y > initY - length) {
            const cell = this.getCell(x, y);
            if (cell.state === 'ship') {
                throw new Error('Ships are overlapping');
            }
            cells.push(cell);
            y--;
        }

        cells.forEach(cell => {
            cell.ship = ship;
            cell.changeState('ship');
        });
    }

    receiveAttack(x, y) {
        const cell = this.getCell(x,y);
        switch(cell.getState()) {
            case 'default':
                cell.changeState('miss');
            break;

            case 'ship':
                cell.changeState('hit');
                cell.getShip().hit();
            break;

            case 'hit':
                cell.changeState('hit');
            break;

            case 'miss':
                cell.changeState('miss');
            break;
        }
    }

    areAllShipsSunk() {
        for(let i = 0; i < this.#ships.length; i++) {
            if (!this.#ships[i].isSunk()) {
                return false;
            }
        }
        return true;
    }

    getCell(x, y) {
        return this.grid[x][y];
    }
}

export class Cell {
    constructor(ship) {
        this.state = 'default';
        this.ship = ship;
    }

    changeState(name) {
        this.state = name;
    }

    getState() {
        return this.state;
    }

    getShip() {
        return this.ship;
    }
}

export default Gameboard;