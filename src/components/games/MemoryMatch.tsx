import React, { useState, useEffect } from 'react';
import { Gamepad2 } from 'lucide-react';

const ICONS = [
  '🎮', '🎲', '🎯', '🎨', '🎭', '🎪',
  '🎢', '🎡', '🎪', '🎭', '🎨', '🎯',
  '🎲', '🎮', '🎡', '🎢'
];

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryMatch: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const shuffledIcons = [...ICONS].sort(() => Math.random() - 0.5);
    const newCards = shuffledIcons.map((icon, index) => ({
      id: index,
      icon,
      isFlipped: false,
      isMatched: false
    }));
    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setGameOver(false);
  };

  const handleCardClick = (cardId: number) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(cardId) ||
      cards[cardId].isMatched
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(m => m + 1);
      const [firstId, secondId] = newFlippedCards;
      
      if (cards[firstId].icon === cards[secondId].icon) {
        setCards(currentCards => 
          currentCards.map(card => 
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          )
        );
        setFlippedCards([]);

        // Check if game is over
        const allMatched = cards.every(card => 
          (card.id === firstId || card.id === secondId) ? true : card.isMatched
        );
        
        if (allMatched) {
          setGameOver(true);
          if (!bestScore || moves + 1 < bestScore) {
            setBestScore(moves + 1);
          }
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex justify-between w-full max-w-md">
        <div className="text-2xl font-bold">Moves: {moves}</div>
        {bestScore && <div className="text-2xl">Best: {bestScore}</div>}
        <button
          onClick={initGame}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          New Game
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-md">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`w-20 h-20 flex items-center justify-center text-3xl rounded-lg transition-all transform ${
              card.isMatched || flippedCards.includes(card.id)
                ? 'bg-green-500 text-white rotate-0'
                : 'bg-indigo-600 text-white rotate-180'
            } ${
              card.isMatched ? 'opacity-50' : 'hover:bg-indigo-700'
            }`}
            disabled={card.isMatched}
          >
            {card.isMatched || flippedCards.includes(card.id) ? (
              card.icon
            ) : (
              <Gamepad2 className="w-8 h-8" />
            )}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p className="mb-2">You completed the game in {moves} moves</p>
            {bestScore === moves && (
              <p className="text-green-600 mb-4">New Best Score! 🎉</p>
            )}
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

export default MemoryMatch;