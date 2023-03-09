class Gameboard {
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
        // TODO: PREVENT OVERFLOW
        if (!rotated) {
            this.fillHorizontalShip(ship, x, y)
        } else {
            this.fillVerticalShip(ship, x, y);
        }
    }

    fillHorizontalShip(ship, x, y) {
        const initX = x;
        const length = ship.length;
        while(x < initX + length) {
            const cell = this.getCell(x, y);
            cell.ship = ship;
            cell.changeState('ship');
            x++;
        }
    }

    fillVerticalShip(ship, x, y) {
        const initY = y;
        const length = ship.length;
        while(y > initY - length) {
            const cell = this.getCell(x, y);
            cell.changeState('ship');
            cell.ship = ship;
            y--;
        }
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