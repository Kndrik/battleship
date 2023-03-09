import { sum } from "./index";
import Ship from "./factories/Ship";
import Gameboard from "./factories/Gameboard";
import { Cell } from "./factories/Gameboard";


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