import React from 'react';
import { SEO } from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useGames } from '../hooks/useGames';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  const { categories } = useGames();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <SEO 
        title="İletişim"
        description="GameVerse ile iletişime geçin - Sorularınız ve önerileriniz için bize ulaşın."
      />
      <Navbar onNavigate={() => {}} currentPath="/contact" />
      
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <Mail className="w-10 h-10 text-yellow-300" />
              <h1 className="text-3xl font-bold text-white">İletişim</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Bize Ulaşın
                </h2>
                
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-yellow-300 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold">Email</h3>
                    <a 
                      href="mailto:info@gameverse.com"
                      className="text-purple-200 hover:text-white transition-colors"
                    >
                      info@gameverse.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-yellow-300 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold">Telefon</h3>
                    <a 
                      href="tel:+902121234567"
                      className="text-purple-200 hover:text-white transition-colors"
                    >
                      +90 (212) 123 45 67
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-yellow-300 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold">Adres</h3>
                    <p className="text-purple-200">
                      Levent Mah. Büyükdere Cad.<br />
                      No:123 K:4<br />
                      34394 Şişli/İstanbul
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white font-medium mb-2">
                    Adınız
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 bg-white/10 border border-purple-300/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 text-white placeholder-purple-200"
                    placeholder="Adınızı girin"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 bg-white/10 border border-purple-300/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 text-white placeholder-purple-200"
                    placeholder="Email adresinizi girin"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-white font-medium mb-2">
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-2 bg-white/10 border border-purple-300/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 text-white placeholder-purple-200"
                    placeholder="Mesajınızı yazın"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Gönder
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer categories={categories} />
    </div>
  );
};

export default Contact;