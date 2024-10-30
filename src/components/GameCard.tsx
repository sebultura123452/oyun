import React from 'react';
import { Game } from '../types/game';
import { Gamepad2, Star, Trophy } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onPlay?: () => void;
  featured?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPlay, featured }) => {
  return (
    <div 
      className={`group relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer rounded-xl ${
        featured ? 'shadow-xl ring-4 ring-yellow-400/50' : 'shadow-lg'
      }`}
      onClick={onPlay}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
      
      {featured && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-yellow-400 text-black px-3 py-1 rounded-full">
          <Star className="w-4 h-4" />
          <span className="text-sm font-medium">Popüler</span>
        </div>
      )}

      <img 
        src={game.thumbnail} 
        alt={game.title}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=500&q=80';
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
        <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
        <p className="text-gray-200 text-sm mb-4 line-clamp-2">{game.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="flex items-center text-sm text-gray-300 bg-black/50 px-3 py-1 rounded-full">
            <Trophy className="w-4 h-4 mr-1" />
            {game.plays.toLocaleString()} oynanma
          </span>
          <button
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Oyna
          </button>
        </div>
      </div>
    </div>
  );
};