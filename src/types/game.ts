export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  plays: number;
  tags: string[];
  component: string;
  ageRange: string;
  isNew: boolean;
  isPopular: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  gameCount: number;
  icon: string;
}