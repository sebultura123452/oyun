import React, { useState, useEffect, useCallback } from 'react';
import { Pause, Play, RotateCw, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 1000;

type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

interface Tetromino {
  type: TetrominoType;
  position: { x: number; y: number };
  shape: number[][];
  color: string;
}

const TETROMINOES: Record<TetrominoType, { shape: number[][], color: string }> = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: 'bg-cyan-500'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 'bg-yellow-500'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: 'bg-purple-500'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: 'bg-green-500'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: 'bg-red-500'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: 'bg-blue-500'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: 'bg-orange-500'
  }
};

const Tetris: React.FC = () => {
  const [board, setBoard] = useState<string[][]>(
    Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill(''))
  );
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const createNewPiece = useCallback(() => {
    const types = Object.keys(TETROMINOES) as TetrominoType[];
    const type = types[Math.floor(Math.random() * types.length)];
    const { shape, color } = TETROMINOES[type];
    
    return {
      type,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      shape,
      color
    };
  }, []);

  const checkCollision = useCallback((piece: Tetromino, board: string[][], offsetX = 0, offsetY = 0) => {
    return piece.shape.some((row, y) =>
      row.some((value, x) => {
        const newX = piece.position.x + x + offsetX;
        const newY = piece.position.y + y + offsetY;
        return (
          value !== 0 && (
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board[newY][newX] !== '')
          )
        );
      })
    );
  }, []);

  const mergePieceToBoard = useCallback((piece: Tetromino, board: string[][]) => {
    const newBoard = board.map(row => [...row]);
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const boardY = piece.position.y + y;
          const boardX = piece.position.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT) {
            newBoard[boardY][boardX] = piece.color;
          }
        }
      });
    });
    return newBoard;
  }, []);

  const rotatePiece = useCallback((piece: Tetromino) => {
    const rotated = {
      ...piece,
      shape: piece.shape[0].map((_, i) =>
        piece.shape.map(row => row[i]).reverse()
      )
    };

    if (!checkCollision(rotated, board)) {
      setCurrentPiece(rotated);
    }
  }, [board, checkCollision]);

  const movePiece = useCallback((offsetX: number) => {
    if (!currentPiece || gameOver || isPaused) return;

    const newPiece = {
      ...currentPiece,
      position: {
        ...currentPiece.position,
        x: currentPiece.position.x + offsetX
      }
    };

    if (!checkCollision(newPiece, board)) {
      setCurrentPiece(newPiece);
    }
  }, [currentPiece, gameOver, isPaused, board, checkCollision]);

  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    const newPiece = {
      ...currentPiece,
      position: {
        ...currentPiece.position,
        y: currentPiece.position.y + 1
      }
    };

    if (!checkCollision(newPiece, board)) {
      setCurrentPiece(newPiece);
    } else {
      // Merge piece and check for completed lines
      const newBoard = mergePieceToBoard(currentPiece, board);
      let linesCleared = 0;
      
      const finalBoard = newBoard.reduce((acc, row) => {
        if (row.every(cell => cell !== '')) {
          linesCleared++;
          acc.unshift(Array(BOARD_WIDTH).fill(''));
        } else {
          acc.push(row);
        }
        return acc;
      }, [] as string[][]);

      if (linesCleared > 0) {
        const points = [40, 100, 300, 1200][linesCleared - 1] * level;
        setScore(prev => prev + points);
        
        // Level up every 10 lines
        const newTotalLines = Math.floor(score / 1000) + linesCleared;
        const newLevel = Math.floor(newTotalLines / 10) + 1;
        if (newLevel > level) {
          setLevel(newLevel);
          setSpeed(prev => prev * 0.8);
        }
      }

      setBoard(finalBoard);

      // Check game over
      if (currentPiece.position.y <= 0) {
        setGameOver(true);
      } else {
        setCurrentPiece(createNewPiece());
      }
    }
  }, [currentPiece, gameOver, isPaused, board, level, score, checkCollision, mergePieceToBoard, createNewPiece]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1);
          break;
        case 'ArrowRight':
          movePiece(1);
          break;
        case 'ArrowDown':
          dropPiece();
          break;
        case 'ArrowUp':
          if (currentPiece) rotatePiece(currentPiece);
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPiece, movePiece, dropPiece, rotatePiece, gameOver]);

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      setCurrentPiece(createNewPiece());
    }

    const gameLoop = setInterval(() => {
      if (!isPaused && !gameOver) {
        dropPiece();
      }
    }, speed);

    return () => clearInterval(gameLoop);
  }, [currentPiece, createNewPiece, dropPiece, gameOver, isPaused, speed]);

  const resetGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill('')));
    setCurrentPiece(null);
    setScore(0);
    setLevel(1);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setIsPaused(false);
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const boardY = currentPiece.position.y + y;
            const boardX = currentPiece.position.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((color, x) => (
          <div
            key={`${y}-${x}`}
            className={`w-6 h-6 border border-gray-700 ${color || 'bg-gray-900'}`}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex justify-between w-full max-w-md">
        <div>
          <div className="text-xl font-bold">Score: {score}</div>
          <div className="text-lg">Level: {level}</div>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setIsPaused(p => !p)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            New Game
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        {renderBoard()}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <button
          onClick={() => movePiece(-1)}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => currentPiece && rotatePiece(currentPiece)}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <RotateCw className="w-6 h-6" />
        </button>
        <button
          onClick={() => movePiece(1)}
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
      <button
        onClick={dropPiece}
        className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 w-full max-w-[200px]"
      >
        <ArrowDown className="w-6 h-6 mx-auto" />
      </button>

      {gameOver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <p className="mb-2">Final Score: {score}</p>
            <p className="mb-4">Level Reached: {level}</p>
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

export default Tetris;