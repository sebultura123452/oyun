import React from 'react';
import * as Icons from 'lucide-react';
import { Category } from '../types/game';
import { useCategories } from '../hooks/useCategories';

interface CategoryListProps {
  selectedCategory?: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ 
  selectedCategory, 
  onSelectCategory 
}) => {
  const { categories, loading, error } = useCategories();

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Gamepad2;
    return <Icon className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-4">
        {[...Array(6)].map((_, i) => (
          <div 
            key={`skeleton-${i}`}
            className="animate-pulse bg-white/20 rounded-full h-10 w-24"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
      <button
        onClick={() => onSelectCategory('')}
        className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
          !selectedCategory 
            ? 'bg-indigo-600 text-white' 
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        Tüm Oyunlar
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.slug)}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors flex items-center gap-2 ${
            selectedCategory === category.slug
              ? 'bg-indigo-600 text-white'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {category.icon && getIcon(category.icon)}
          <span>{category.name}</span>
          <span className="text-xs opacity-75">({category.gameCount})</span>
        </button>
      ))}
    </div>
  );
};