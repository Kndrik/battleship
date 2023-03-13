import { gameSystem } from ".";

export const domHandler = (() => {
    const buildOponentGrid = () => {
        const gridsParent = document.querySelector('.grids-container');
        const newGrid = document.createElement('div');
        newGrid.classList.add('grid-container', 'oponent');
        for (let i = 0; i < 10; i++) {
            const newRow = document.createElement('div');
            newRow.classList.add('row');
            for (let j = 0; j < 10; j++) {
                const newCell = document.createElement('div');
                newCell.classList.add('cell');
                newCell.classList.add('oponent');
                newCell.setAttribute('xPos', j);
                newCell.setAttribute('yPos', i);
                newCell.addEventListener('click', (event) => cellClicked(j, i, event));
                newRow.appendChild(newCell);
            }
            newGrid.prepend(newRow);
        }
        gridsParent.appendChild(newGrid);
    }
    
    const buildPlayerGrid = (board) => {
        const gridsParent = document.querySelector('.grids-container');
        const newGrid = document.createElement('div');
        newGrid.className = 'grid-container player';
        for (let i = 0; i < 10; i++) {
            const newRow = document.createElement('div');
            newRow.className = 'row';
            for (let j = 0; j < 10; j++) {
                const newCell = document.createElement('div');
                newCell.classList.add('cell');
                newCell.classList.add('player');
                newCell.setAttribute('xpos', j);
                newCell.setAttribute('ypos', i);
                newCell.classList.add(board.getCell(j, i).getState());
                newRow.appendChild(newCell);
            }
            newGrid.prepend(newRow);
        }
        gridsParent.appendChild(newGrid);
    }

    const cellClicked = (x, y) => {
        gameSystem.playerAttack(x, y);
    }

    const updateCell = (x, y, state, player) => {
        const cell = player ?
            document.querySelector(`.cell.player[xpos="${x}"][ypos="${y}"]`) :
            document.querySelector(`.cell.oponent[xpos="${x}"][ypos="${y}"]`);
        cell.className = `cell ${state}`;
    }

    return { buildOponentGrid, buildPlayerGrid, updateCell };
})();