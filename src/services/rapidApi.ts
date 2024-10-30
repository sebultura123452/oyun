import config from '../data/config.json';
import { Game, Category } from '../types/game';
import { v4 as uuidv4 } from 'uuid';

const RAPID_API_KEY = config.api.rapidApiKey;
const BASE_URL = 'https://free-to-play-games-database.p.rapidapi.com/api';

const headers = {
  'X-RapidAPI-Key': RAPID_API_KEY,
  'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
};

export async function fetchGamesFromAPI(category?: string): Promise<Game[]> {
  try {
    const endpoint = category 
      ? `${BASE_URL}/games?category=${category.toLowerCase()}`
      : `${BASE_URL}/games`;

    const response = await fetch(endpoint, { headers });
    
    if (!response.ok) {
      throw new Error('API yanıt vermedi');
    }

    const data = await response.json();

    return data.map((game: any) => ({
      id: game.id.toString(),
      title: game.title,
      description: game.short_description,
      thumbnail: game.thumbnail,
      category: game.genre,
      plays: Math.floor(Math.random() * 50000) + 1000, // API oynanma sayısı vermediği için
      tags: [game.genre, game.platform, ...game.tags || []],
      gameData: {
        width: '100%',
        height: '600px',
        source: game.game_url
      }
    }));
  } catch (error) {
    console.error('API hatası:', error);
    throw error;
  }
}

export async function fetchCategoriesFromAPI(): Promise<Category[]> {
  try {
    const response = await fetch(`${BASE_URL}/games`, { headers });
    
    if (!response.ok) {
      throw new Error('API yanıt vermedi');
    }

    const games = await response.json();
    
    // Benzersiz kategorileri çıkar
    const uniqueCategories = new Set(games.map((game: any) => game.genre));
    
    return Array.from(uniqueCategories).map(category => ({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category as string,
      slug: category.toLowerCase().replace(/\s+/g, '-'),
      description: `${category} kategorisindeki en iyi oyunlar`,
      gameCount: games.filter((game: any) => game.genre === category).length,
      icon: getCategoryIcon(category as string)
    }));
  } catch (error) {
    console.error('Kategori API hatası:', error);
    throw error;
  }
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'MMORPG': 'users',
    'Shooter': 'target',
    'Strategy': 'chess',
    'Action': 'zap',
    'Racing': 'car',
    'Sports': 'trophy',
    'MOBA': 'swords',
    'Battle Royale': 'shield',
    'Card Game': 'cards',
    'Fighting': 'swords-cross',
    'MMO': 'globe',
    'Social': 'users',
    'Fantasy': 'wand',
    'Space': 'rocket',
    'Survival': 'tent',
    'Horror': 'skull',
    'Zombie': 'skull',
    'Military': 'shield',
    'Martial Arts': 'swords',
    'Flight': 'plane',
    'Tower Defense': 'castle',
    'Racing': 'car'
  };

  return icons[category] || 'gamepad-2';
}