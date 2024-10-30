import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gamepad2, Maximize2, Minimize2 } from 'lucide-react';
import { Game } from '../types/game';
import AdBanner from './AdBanner';
import Game2048 from './games/Game2048';
import SnakeGame from './games/SnakeGame';
import MemoryMatch from './games/MemoryMatch';
import Tetris from './games/Tetris';
import SportsGame from './games/SportsGame';

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
  suggestedGames: Game[];
}

const GamePlayer: React.FC<GamePlayerProps> = ({ game, onBack, suggestedGames }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Prevent space key scrolling
  useEffect(() => {
    const preventSpaceScroll = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', preventSpaceScroll);
    return () => window.removeEventListener('keydown', preventSpaceScroll);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const gameContainer = document.getElementById('game-container');
      if (gameContainer?.requestFullscreen) {
        gameContainer.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const getGameComponent = (componentName: string) => {
    switch (componentName) {
      case 'Game2048':
        return <Game2048 />;
      case 'SnakeGame':
        return <SnakeGame />;
      case 'MemoryMatch':
        return <MemoryMatch />;
      case 'Tetris':
        return <Tetris />;
      case 'FootballGame':
        return <SportsGame gameType="football" />;
      case 'BasketballGame':
        return <SportsGame gameType="basketball" />;
      case 'VolleyballGame':
        return <SportsGame gameType="volleyball" />;
      default:
        return null;
    }
  };

  const gameComponent = getGameComponent(game.component);

  if (!gameComponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white mb-4 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Geri Dön</span>
          </button>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Oyun Bulunamadı</h2>
            <p className="text-purple-200">Bu oyun şu anda kullanılamıyor.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Geri Dön</span>
          </button>
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            <span>{isFullscreen ? 'Küçült' : 'Tam Ekran'}</span>
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-4">
          <h1 className="text-2xl font-bold text-white mb-2">{game.title}</h1>
          <p className="text-purple-200 mb-4">{game.description}</p>
          <div className="flex gap-4 text-sm text-purple-300">
            <span>Kategori: {game.category}</span>
            <span>Oynanma: {game.plays.toLocaleString()}</span>
          </div>
        </div>

        <AdBanner className="mb-4" slot="gameTop" />

        <div 
          id="game-container"
          className={`bg-white rounded-xl shadow-xl overflow-hidden ${
            isFullscreen ? 'fixed inset-0 z-50' : ''
          }`}
        >
          {gameComponent}
        </div>

        {!isFullscreen && (
          <>
            <AdBanner className="my-8" slot="gameMiddle" />

            {/* Suggested Games */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Gamepad2 className="w-6 h-6" />
                Benzer Oyunlar
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedGames.map(suggestedGame => (
                  <div 
                    key={suggestedGame.id}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-colors"
                    onClick={() => {
                      window.history.pushState({}, '', `?game=${suggestedGame.id}`);
                      window.location.reload();
                    }}
                  >
                    <img 
                      src={suggestedGame.thumbnail}
                      alt={suggestedGame.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=500&q=80';
                      }}
                    />
                    <h3 className="text-lg font-bold text-white mb-2">{suggestedGame.title}</h3>
                    <p className="text-purple-200 text-sm line-clamp-2">{suggestedGame.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <AdBanner className="mt-8" slot="gameBottom" />
          </>
        )}
      </div>
    </div>
  );
};

export default GamePlayer;