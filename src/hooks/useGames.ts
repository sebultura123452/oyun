import { useState, useEffect } from 'react';
import { Game, Category } from '../types/game';
import { getGames, getCategories } from '../services/api';

export const useGames = (category?: string) => {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [gamesData, categoriesData] = await Promise.all([
          getGames(category),
          getCategories()
        ]);
        setGames(gamesData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Veriler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  return { games, categories, loading, error };
};