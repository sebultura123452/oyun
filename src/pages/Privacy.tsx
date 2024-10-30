import React from 'react';
import { SEO } from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useGames } from '../hooks/useGames';
import { Shield } from 'lucide-react';

const Privacy = () => {
  const { categories } = useGames();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <SEO 
        title="Gizlilik Politikası"
        description="GameVerse gizlilik politikası - Verilerinizi nasıl koruduğumuzu öğrenin."
      />
      <Navbar onNavigate={() => {}} currentPath="/privacy" />
      
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <Shield className="w-10 h-10 text-yellow-300" />
              <h1 className="text-3xl font-bold text-white">Gizlilik Politikası</h1>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-purple-100">
                Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                Kişisel Verilerin Korunması
              </h2>
              <p className="text-purple-100 mb-4">
                GameVerse olarak kişisel verilerinizin güvenliği bizim için çok önemlidir. 
                Bu gizlilik politikası, platformumuzda hangi bilgileri topladığımızı ve 
                bu bilgileri nasıl kullandığımızı açıklamaktadır.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                Toplanan Bilgiler
              </h2>
              <ul className="list-disc list-inside text-purple-100 mb-4 space-y-2">
                <li>Oyun tercihleri ve oyun istatistikleri</li>
                <li>Tarayıcı türü ve versiyonu</li>
                <li>Kullanılan cihaz bilgileri</li>
                <li>IP adresi ve konum bilgileri</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                Çerezler ve Takip Teknolojileri
              </h2>
              <p className="text-purple-100 mb-4">
                Platformumuzda çerezler ve benzer takip teknolojileri kullanmaktayız. 
                Bu teknolojiler, size daha iyi bir kullanıcı deneyimi sunmamıza ve 
                platformumuzu geliştirmemize yardımcı olmaktadır.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                Bilgilerin Kullanımı
              </h2>
              <p className="text-purple-100 mb-4">
                Topladığımız bilgileri aşağıdaki amaçlarla kullanmaktayız:
              </p>
              <ul className="list-disc list-inside text-purple-100 mb-4 space-y-2">
                <li>Platform performansını iyileştirmek</li>
                <li>Kullanıcı deneyimini kişiselleştirmek</li>
                <li>Güvenliği sağlamak</li>
                <li>İstatistiksel analizler yapmak</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                Bilgilerin Paylaşımı
              </h2>
              <p className="text-purple-100 mb-4">
                Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla 
                paylaşılmamaktadır. Verileriniz, yalnızca hizmet kalitemizi artırmak 
                amacıyla kullanılmaktadır.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                İletişim
              </h2>
              <p className="text-purple-100">
                Gizlilik politikamız hakkında sorularınız için{' '}
                <a 
                  href="mailto:privacy@gameverse.com" 
                  className="text-yellow-300 hover:text-yellow-400 transition-colors"
                >
                  privacy@gameverse.com
                </a>{' '}
                adresinden bizimle iletişime geçebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer categories={categories} />
    </div>
  );
};

export default Privacy;