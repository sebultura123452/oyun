import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';
import config from '../data/config.json';
import { Category } from '../types/game';

interface FooterProps {
  categories: Category[];
}

const Footer: React.FC<FooterProps> = ({ categories }) => {
  const currentYear = new Date().getFullYear();

  const handleNavigation = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', path);
    window.location.reload();
  };

  return (
    <footer className="bg-indigo-950/50 backdrop-blur-sm border-t border-purple-900/50 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hakkımızda</h3>
            <p className="text-purple-200 text-sm">
              GameVerse, çocuklar için güvenli ve eğlenceli oyunlar sunan bir platformdur. 
              Eğitici ve geliştirici oyunlarla öğrenmeyi eğlenceye dönüştürüyoruz.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hızlı Bağlantılar</h3>
            <ul className="space-y-2 text-purple-200 text-sm">
              <li>
                <a 
                  href="/category"
                  onClick={(e) => handleNavigation('/category', e)}
                  className="hover:text-white transition-colors"
                >
                  Kategoriler
                </a>
              </li>
              <li>
                <a 
                  href="/new"
                  onClick={(e) => handleNavigation('/new', e)}
                  className="hover:text-white transition-colors"
                >
                  Yeni Oyunlar
                </a>
              </li>
              <li>
                <a 
                  href="/popular"
                  onClick={(e) => handleNavigation('/popular', e)}
                  className="hover:text-white transition-colors"
                >
                  Popüler Oyunlar
                </a>
              </li>
              <li>
                <a 
                  href="/contact"
                  onClick={(e) => handleNavigation('/contact', e)}
                  className="hover:text-white transition-colors"
                >
                  İletişim
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Kategoriler</h3>
            <ul className="space-y-2 text-purple-200 text-sm">
              {categories.map(category => (
                <li key={category.id}>
                  <a 
                    href={`/category?category=${category.slug}`}
                    onClick={(e) => handleNavigation(`/category?category=${category.slug}`, e)}
                    className="hover:text-white transition-colors"
                  >
                    {category.name} ({category.gameCount})
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bizi Takip Edin</h3>
            <div className="flex space-x-4">
              <a 
                href={`https://facebook.com/${config.site.socialHandles?.facebook}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-200 hover:text-white transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a 
                href={`https://twitter.com/${config.site.socialHandles?.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-200 hover:text-white transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a 
                href={`https://instagram.com/${config.site.socialHandles?.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-200 hover:text-white transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href={`https://youtube.com/${config.site.socialHandles?.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-200 hover:text-white transition-colors"
              >
                <Youtube className="w-6 h-6" />
              </a>
            </div>
            <p className="text-purple-200 text-sm">
              Email: {config.site.contactEmail}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-purple-900/50">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-purple-200 text-sm">
              © {currentYear} GameVerse. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-2 text-purple-200 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>in Turkey</span>
            </div>
            <div className="flex space-x-4 text-sm">
              <a 
                href="/privacy" 
                onClick={(e) => handleNavigation('/privacy', e)}
                className="text-purple-200 hover:text-white transition-colors"
              >
                Gizlilik Politikası
              </a>
              <a 
                href="/terms"
                onClick={(e) => handleNavigation('/terms', e)}
                className="text-purple-200 hover:text-white transition-colors"
              >
                Kullanım Şartları
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;