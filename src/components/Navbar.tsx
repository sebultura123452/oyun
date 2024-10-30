import React, { useState } from 'react';
import { Gamepad2, Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPath }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigation = (path: string) => {
    onNavigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-indigo-950/50 backdrop-blur-sm border-b border-purple-900/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            <Gamepad2 className="text-purple-400" size={24} aria-hidden="true" />
            <span className="text-xl font-bold text-white">GameVerse</span>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/5"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="text-white" size={24} />
            ) : (
              <Menu className="text-white" size={24} />
            )}
          </button>

          <div className={`
            lg:flex items-center gap-6
            ${isMenuOpen 
              ? 'absolute top-16 left-0 right-0 bg-indigo-950/95 backdrop-blur-sm p-4 border-b border-purple-900/50 space-y-4 lg:space-y-0' 
              : 'hidden'
            }
          `}>
            <NavLink 
              href="/"
              active={currentPath === '/'} 
              onClick={() => handleNavigation('/')}
            >
              Ana Sayfa
            </NavLink>
            <NavLink 
              href="/categories"
              active={currentPath === '/categories'} 
              onClick={() => handleNavigation('/categories')}
            >
              Kategoriler
            </NavLink>
            <NavLink 
              href="/new"
              active={currentPath === '/new'} 
              onClick={() => handleNavigation('/new')}
            >
              Yeni Oyunlar
            </NavLink>
            <NavLink 
              href="/popular"
              active={currentPath === '/popular'} 
              onClick={() => handleNavigation('/popular')}
            >
              Popüler
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, active, onClick }) => {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      className={`text-sm font-medium transition-colors ${
        active 
          ? 'text-white' 
          : 'text-purple-200 hover:text-white'
      }`}
    >
      {children}
    </a>
  );
};

export default Navbar;