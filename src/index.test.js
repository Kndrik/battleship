import { sum } from "./index";
import Ship from "./factories/Ship";

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