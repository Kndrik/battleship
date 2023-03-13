import './style.css';
import { domHandler } from './DomHandler';
import Gameboard from './factories/Gameboard';
import { Player, IA } from './factories/Player';
import Ship from './factories/Ship';
import { Cell } from './factories/Gameboard';


export const gameSystem = (() => {
    const playerBoard = new Gameboard();
    const oponentBoard = new Gameboard();
    const player = new Player(oponentBoard);
    const ia = new IA(playerBoard);

    const initialize = () => {
        playerBoard.autoPlaceShips();
        oponentBoard.autoPlaceShips();
        domHandler.buildPlayerGrid(playerBoard);
        domHandler.buildOponentGrid();
    }

    const playerAttack = (x, y) => {
        const attacked = player.attackBoard(x, y);
        if (!attacked) return;
        domHandler.updateCell(x, y, oponentBoard.getCell(x, y).getState(), false);
        const coord = ia.attackRandomCoordinates();
        domHandler.updateCell(coord[0], coord[1], playerBoard.getCell(coord[0], coord[1]).getState(), true);
    }
    
    return { initialize, playerAttack }
})();


gameSystem.initialize();