import gamesData from '../data/games.json';
import { Game, Category } from '../types/game';

export async function getGames(category?: string): Promise<Game[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const games = gamesData.games;
  
  if (category) {
    return games.filter(game => 
      game.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  return games;
}

export async function getCategories(): Promise<Category[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Kategorileri döndürmeden önce her kategori için oyun sayısını hesapla
  const categories = gamesData.categories.map(category => {
    const gameCount = gamesData.games.filter(
      game => game.category.toLowerCase() === category.name.toLowerCase()
    ).length;
    
    return {
      ...category,
      gameCount
    };
  });
  
  return categories;
}