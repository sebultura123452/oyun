import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

interface Position {
  x: number;
  y: number;
}

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('right');
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(currentSnake => {
      const head = currentSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'up': newHead.y -= 1; break;
        case 'down': newHead.y += 1; break;
        case 'left': newHead.x -= 1; break;
        case 'right': newHead.x += 1; break;
      }

      // Check wall collision
      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return currentSnake;
      }

      // Check self collision
      if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return currentSnake;
      }

      const newSnake = [newHead, ...currentSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsPaused(p => !p);
        return;
      }

      if (gameOver || isPaused) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'down') setDirection('up');
          break;
        case 'ArrowDown':
          if (direction !== 'up') setDirection('down');
          break;
        case 'ArrowLeft':
          if (direction !== 'right') setDirection('left');
          break;
        case 'ArrowRight':
          if (direction !== 'left') setDirection('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver, isPaused]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  const handleDirectionButton = (newDirection: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver || isPaused) return;
    
    const opposites = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    };

    if (opposites[newDirection] !== direction) {
      setDirection(newDirection);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex justify-between w-full max-w-md">
        <div className="text-2xl font-bold">Score: {score}</div>
        <div className="space-x-2">
          <button
            onClick={() => setIsPaused(p => !p)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            New Game
          </button>
        </div>
      </div>

      <div 
        className="bg-gray-200 rounded-lg p-4"
        style={{
          width: GRID_SIZE * CELL_SIZE + 32,
          height: GRID_SIZE * CELL_SIZE + 32
        }}
      >
        <div className="relative" style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}>
          {/* Food */}
          <div
            className="absolute bg-red-500 rounded-full"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE
            }}
          />
          
          {/* Snake */}
          {snake.map((segment, i) => (
            <div
              key={i}
              className="absolute bg-green-500 rounded-sm"
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE
              }}
            />
          ))}
        </div>
      </div>

      {/* Control buttons */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div />
        <button
          onClick={() => handleDirectionButton('up')}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div />
        <button
          onClick={() => handleDirectionButton('left')}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div />
        <button
          onClick={() => handleDirectionButton('right')}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div />
        <button
          onClick={() => handleDirectionButton('down')}
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
              onClick={resetGame}
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

export default SnakeGame;