import Ship from "./Ship";

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

    autoPlaceShips() {
        const shipSizes = [5, 4, 3, 3, 2];
        for (const size of shipSizes) {
            let placed = false;
            while (!placed) {
                const x = Math.floor(Math.random() * 10);
                const y = Math.floor(Math.random() * 10);
                const rotate = Math.random() < 0.5;
                try {
                    this.placeShip(new Ship(size), x, y, rotate);
                    placed = true;
                } catch (err) {
                    // Do nothing - just try again with a new random position
                    console.log(err);
                }
            }
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
            if ((x > 0 && this.getCell(x-1, y).state === 'ship') ||
                (x < 9 && this.getCell(x+1, y).state === 'ship') ||
                (y < 9 && this.getCell(x, y+1).state === 'ship') ||
                (y > 0 && this.getCell(x, y-1).state === 'ship')) {
                throw new Error('Ships are too close');
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
            if ((x > 0 && this.getCell(x-1, y).state === 'ship') ||
                (x < 9 && this.getCell(x+1, y).state === 'ship') ||
                (y < 9 && this.getCell(x, y+1).state === 'ship') ||
                (y > 0 && this.getCell(x, y-1).state === 'ship')) {
                throw new Error('Ships are too close');
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
                return false;

            case 'miss':
                return false;
        }
        return true;
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
