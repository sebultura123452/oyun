import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { GameCard } from './components/GameCard';
import { CategoryList } from './components/CategoryList';
import { SearchBar } from './components/SearchBar';
import { SEO } from './components/SEO';
import GamePlayer from './components/GamePlayer';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import { useGames } from './hooks/useGames';
import { Game } from './types/game';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdBanner from './components/AdBanner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Sparkles, Star, Trophy, Zap } from 'lucide-react';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const { games, categories, loading, error } = useGames(selectedCategory);

  // URL'den oyun ID'sini veya kategoriyi al
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('game');
    const category = params.get('category');
    
    if (gameId) {
      const game = games.find(g => g.id === gameId);
      if (game) {
        setSelectedGame(game);
      }
    } else if (category) {
      setSelectedCategory(category);
      setCurrentPath('/category');
    }
  }, [games]);

  // Özel sayfaları render et
  if (currentPath === '/privacy') {
    return <Privacy />;
  }
  if (currentPath === '/terms') {
    return <Terms />;
  }
  if (currentPath === '/contact') {
    return <Contact />;
  }

  const handleNavigation = (path: string) => {
    setCurrentPath(path);
    setSelectedGame(null);
    setSearchQuery('');
    setSelectedCategory('');
    window.history.pushState({}, '', path === '/' ? '/' : `/${path}`);
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (currentPath) {
      case '/new':
        return game.isNew && matchesSearch;
      case '/popular':
        return game.isPopular && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  // Get random games for suggestions
  const getRandomGames = (count: number, excludeId?: string) => {
    const availableGames = games.filter(game => game.id !== excludeId);
    const shuffled = [...availableGames].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const getPageTitle = () => {
    switch (currentPath) {
      case '/new':
        return 'Yeni Oyunlar';
      case '/popular':
        return 'Popüler Oyunlar';
      case '/categories':
        return 'Kategoriler';
      default:
        return 'Çocuk Oyunları';
    }
  };

  const getPageIcon = () => {
    switch (currentPath) {
      case '/new':
        return <Zap className="w-10 h-10 text-yellow-300" />;
      case '/popular':
        return <Star className="w-10 h-10 text-yellow-300" />;
      case '/categories':
        return <Trophy className="w-10 h-10 text-yellow-300" />;
      default:
        return <Sparkles className="w-10 h-10 text-yellow-300" />;
    }
  };

  if (selectedGame) {
    return (
      <GamePlayer 
        game={selectedGame} 
        onBack={() => {
          setSelectedGame(null);
          window.history.pushState({}, '', currentPath);
        }}
        suggestedGames={getRandomGames(3, selectedGame.id)}
      />
    );
  }

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
          <SEO />
          <Navbar onNavigate={handleNavigation} currentPath={currentPath} />
          
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                {getPageIcon()}
                <h1 className="text-4xl font-bold text-white">{getPageTitle()}</h1>
              </div>

              <SearchBar onSearch={setSearchQuery} />
              
              {currentPath === '/' && (
                <CategoryList
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              )}

              <AdBanner className="my-8" />

              {/* Featured Games */}
              {currentPath === '/' && !searchQuery && !selectedCategory && (
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <Star className="w-6 h-6 text-yellow-300" />
                    <h2 className="text-2xl font-bold text-white">Popüler Oyunlar</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.filter(game => game.isPopular).slice(0, 3).map(game => (
                      <GameCard 
                        key={game.id} 
                        game={game} 
                        onPlay={() => {
                          setSelectedGame(game);
                          window.history.pushState({}, '', `?game=${game.id}`);
                        }}
                        featured
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Games */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-6 h-6 text-yellow-300" />
                  <h2 className="text-2xl font-bold text-white">
                    {selectedCategory ? `${selectedCategory} Oyunları` : 'Tüm Oyunlar'}
                  </h2>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={`skeleton-${i}`} className="animate-pulse">
                        <div className="bg-white/20 h-48 rounded-t-xl" />
                        <div className="bg-white/10 p-4 rounded-b-xl">
                          <div className="h-4 bg-white/20 rounded w-3/4 mb-2" />
                          <div className="h-4 bg-white/20 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center bg-red-500/10 backdrop-blur rounded-xl p-8">
                    <p className="text-white">{error}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGames.map(game => (
                      <GameCard 
                        key={game.id} 
                        game={game} 
                        onPlay={() => {
                          setSelectedGame(game);
                          window.history.pushState({}, '', `?game=${game.id}`);
                        }}
                        featured={currentPath === '/popular' && game.isPopular}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <Footer categories={categories} />
        </div>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;