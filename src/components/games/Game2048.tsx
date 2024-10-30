import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const Game2048: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(Array(4).fill(null).map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initGame();
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const initGame = () => {
    const newGrid = Array(4).fill(null).map(() => Array(4).fill(0));
    addNewTile(newGrid);
    addNewTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  };

  const addNewTile = (currentGrid: number[][]) => {
    const emptyTiles = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === 0) {
          emptyTiles.push({ x: i, y: j });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      currentGrid[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const move = (direction: 'up' | 'down' | 'left' | 'right') => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    let moved = false;
    let newScore = score;

    const moveAndMerge = (arr: number[]) => {
      // Remove zeros
      const filtered = arr.filter(num => num !== 0);
      // Merge
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          newScore += filtered[i];
          filtered.splice(i + 1, 1);
        }
      }
      // Add zeros back
      while (filtered.length < 4) filtered.push(0);
      return filtered;
    };

    if (direction === 'left' || direction === 'right') {
      for (let i = 0; i < 4; i++) {
        const row = newGrid[i];
        const oldRow = [...row];
        if (direction === 'right') row.reverse();
        const newRow = moveAndMerge(row);
        if (direction === 'right') newRow.reverse();
        newGrid[i] = newRow;
        if (JSON.stringify(oldRow) !== JSON.stringify(newRow)) moved = true;
      }
    } else {
      for (let j = 0; j < 4; j++) {
        const column = newGrid.map(row => row[j]);
        const oldColumn = [...column];
        if (direction === 'down') column.reverse();
        const newColumn = moveAndMerge(column);
        if (direction === 'down') newColumn.reverse();
        for (let i = 0; i < 4; i++) {
          newGrid[i][j] = newColumn[i];
        }
        if (JSON.stringify(oldColumn) !== JSON.stringify(newColumn)) moved = true;
      }
    }

    if (moved) {
      addNewTile(newGrid);
      setGrid(newGrid);
      setScore(newScore);
      checkGameOver(newGrid);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (gameOver) return;
    switch (e.key) {
      case 'ArrowUp': move('up'); break;
      case 'ArrowDown': move('down'); break;
      case 'ArrowLeft': move('left'); break;
      case 'ArrowRight': move('right'); break;
    }
  };

  const checkGameOver = (currentGrid: number[][]) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === 0) return;
        if (i < 3 && currentGrid[i][j] === currentGrid[i + 1][j]) return;
        if (j < 3 && currentGrid[i][j] === currentGrid[i][j + 1]) return;
      }
    }
    setGameOver(true);
  };

  const getTileColor = (value: number): string => {
    const colors: { [key: number]: string } = {
      2: 'bg-blue-200',
      4: 'bg-blue-300',
      8: 'bg-blue-400',
      16: 'bg-blue-500',
      32: 'bg-blue-600',
      64: 'bg-blue-700',
      128: 'bg-purple-500',
      256: 'bg-purple-600',
      512: 'bg-purple-700',
      1024: 'bg-yellow-500',
      2048: 'bg-yellow-600'
    };
    return colors[value] || 'bg-gray-700';
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex justify-between w-full max-w-md">
        <div className="text-2xl font-bold">Score: {score}</div>
        <button
          onClick={initGame}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          New Game
        </button>
      </div>

      <div className="bg-gray-200 p-4 rounded-lg">
        {grid.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`w-16 h-16 m-1 flex items-center justify-center rounded-lg text-white font-bold text-xl transition-all ${
                  cell ? getTileColor(cell) : 'bg-gray-300'
                }`}
              >
                {cell || ''}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div />
        <button
          onClick={() => move('up')}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div />
        <button
          onClick={() => move('left')}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div />
        <button
          onClick={() => move('right')}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div />
        <button
          onClick={() => move('down')}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
        <div />
      </div>

      {gameOver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <p className="mb-4">Final Score: {score}</p>
            <button
              onClick={initGame}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game2048;