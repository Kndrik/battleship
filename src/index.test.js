import Ship from "./factories/Ship";
import Gameboard from "./factories/Gameboard";
import { Cell } from "./factories/Gameboard";
import { Player, IA } from "./factories/Player";
import { domHandler } from "./DomHandler";


// Ship tests
test('Ship not hit', () => {
    const ship = new Ship(3);
    expect(ship.hitCount).toBe(0);
});

test('Ship hit', () => {
    const ship = new Ship(4);
    ship.hit();
    ship.hit();
    expect(ship.hitCount).toBe(2);
});

test('Ship: isSunk() -> no hit', () => {
    const ship = new Ship(3);
    expect(ship.isSunk()).toBeFalsy();
});

test('Ship: isSunk() -> some hits', () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeFalsy();
});

test('Ship: isSunk() -> fully hit', () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBeTruthy();
});

// Cell tests
test('Cell', () => {
    const cell = new Cell();
    expect(cell.state).toBe('default');
});

test('Cell, changeState', () => {
    const cell = new Cell();
    cell.changeState('ship');
    expect(cell.state).toBe('ship');
});


// Gameboard tests
test('Gameboard: getCell() -> default', () => {
    const board = new Gameboard();
    expect(board.getCell(1,1)).toBeInstanceOf(Cell);
});

test('Gameboard: placeShip() -> simple', () => {
    const board = new Gameboard();
    board.placeShip(new Ship(1), 3, 4);
    expect(board.getCell(3,4).state).toBe('ship');
    expect(board.getCell(4,4).state).toBe('default');
});

test('Gameboard: placeShip() -> long horizontal', () => {
    const board = new Gameboard();
    board.placeShip(new Ship(3), 3, 4);
    expect(board.getCell(3,4).state).toBe('ship');
    expect(board.getCell(4,4).state).toBe('ship');
    expect(board.getCell(5,4).state).toBe('ship');
    expect(board.getCell(6,4).state).toBe('default');
});

test('Gameboard: placeShip() -> long vertical', () => {
    const board = new Gameboard();
    board.placeShip(new Ship(3), 3, 4, true);
    expect(board.getCell(3,4).state).toBe('ship');
    expect(board.getCell(3,3).state).toBe('ship');
    expect(board.getCell(3,2).state).toBe('ship');
    expect(board.getCell(3,1).state).toBe('default');
});

test('Gameboard: placeShip() -> overflow hor', () => {
    const board = new Gameboard();
    expect(() => { board.placeShip(new Ship(5), 8, 4) }).toThrow('Ship is overflowing');
});

test('Gameboard: placeShip() -> overflow vert', () => {
    const board = new Gameboard();
    expect(() => { board.placeShip(new Ship(3), 6, 2, true) }).toThrow('Ship is overflowing');
});

test('Gameboard: placeShip() -> limit before overflow', () => {
    const board = new Gameboard();
    board.placeShip(new Ship(3), 7, 4);
    expect(board.getCell(9,4).state).toBe('ship');
});

test('Gameboard: placeShip() -> overlapping hor', () => {
    const board = new Gameboard();
    board.placeShip(new Ship(3), 4, 4);
    expect(() => {
        board.placeShip(new Ship(3), 3, 4);
    }).toThrow('Ships are overlapping');
});

test('Gameboard: placeShip() -> overlapping vert', () => {
    const board = new Gameboard();
    board.placeShip(new Ship(3), 4, 4);
    expect(() => {
        board.placeShip(new Ship(3), 5, 5, true);
    }).toThrow('Ships are overlapping');
});

test('Gameboard: receiveAttack() -> empty cell', () => {
    const board = new Gameboard();
    board.receiveAttack(3,4);
    expect(board.getCell(3,4).state).toBe('miss');
    expect(board.getCell(3,5).state).toBe('default');
});

test('Gameboard: receiveAttack() -> ship cell', () => {
    const board = new Gameboard();
    board.placeShip(new Ship(3), 3, 4, false);
    board.receiveAttack(4,4);
    expect(board.getCell(4,4).state).toBe('hit');
    expect(board.getCell(5,4).state).toBe('ship');
    expect(board.getCell(7,4).state).toBe('default');
})

test('Gameboard: receiveAttack() -> miss cell', () => {
    const board = new Gameboard();
    board.receiveAttack(3,4);
    board.receiveAttack(3,4);
    expect(board.getCell(3,4).state).toBe('miss');
    expect(board.getCell(3,5).state).toBe('default');
})

test('Gameboard: receiveAttack() -> hit cell', () => {
    const board = new Gameboard();
    board.placeShip(new Ship(3), 3, 4, false);
    board.receiveAttack(3,4);
    board.receiveAttack(3,4);
    expect(board.getCell(3,4).state).toBe('hit');
    expect(board.getCell(3,5).state).toBe('default');
})

test('Gameboard: receiveAttack() -> hit ship', () => {
    const board = new Gameboard();
    const ship = new Ship(3);
    board.placeShip(ship, 3, 4, false);
    board.receiveAttack(4, 4);
    expect(ship.hitCount).toBe(1);
})

test('Gameboard: areAllShipsSunk() -> no hit', () => {
    const board = new Gameboard();
    board.placeShip(new Ship(3), 3, 4);
    board.receiveAttack(1,1);
    expect(board.areAllShipsSunk()).toBeFalsy();
});

test('Gameboard: areAllShipsSunk() -> some hit', () => {
    const board = new Gameboard();
    board.placeShip(new Ship(3), 3, 4);
    board.receiveAttack(3, 4);
    expect(board.areAllShipsSunk()).toBeFalsy();
});

test('Gameboard: areAllShipsSunk() -> all hit', () => {
    const board = new Gameboard();
    board.placeShip(new Ship(3), 3, 4);
    board.receiveAttack(3,4);
    board.receiveAttack(4,4);
    board.receiveAttack(5,4);
    expect(board.areAllShipsSunk()).toBeTruthy();
});

test('Gameboard: areAllShipsSunk() -> multiple boats one sunk', () => {
    const board = new Gameboard();
    board.placeShip(new Ship(3), 3, 4);
    board.placeShip(new Ship(2), 6, 6);
    board.receiveAttack(3,4);
    board.receiveAttack(4,4);
    board.receiveAttack(5,4);
    expect(board.areAllShipsSunk()).toBeFalsy();
});

// Player tests
test('Player: attackBoard() -> miss', () => {
    const board = new Gameboard();
    const player = new Player(board);
    player.attackBoard(3,3);
    expect(board.getCell(3,3).state).toBe('miss');
    expect(board.getCell(3,4).state).toBe('default');
});

test('Player: attackBoard() -> hit', () => {
    const board = new Gameboard();
    const player = new Player(board);
    board.placeShip(new Ship(3), 3, 3);
    player.attackBoard(3, 3);
    expect(board.getCell(3,3).state).toBe('hit');
    expect(board.getCell(4,3).state).toBe('ship');
});
