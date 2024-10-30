import React from 'react';
import { SEO } from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useGames } from '../hooks/useGames';
import { Scale } from 'lucide-react';

const Terms = () => {
  const { categories } = useGames();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <SEO 
        title="Kullanım Şartları"
        description="GameVerse kullanım şartları - Platform kullanım koşullarını öğrenin."
      />
      <Navbar onNavigate={() => {}} currentPath="/terms" />
      
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <Scale className="w-10 h-10 text-yellow-300" />
              <h1 className="text-3xl font-bold text-white">Kullanım Şartları</h1>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-purple-100">
                Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                Genel Kurallar
              </h2>
              <p className="text-purple-100 mb-4">
                GameVerse'i kullanarak aşağıdaki şartları kabul etmiş olursunuz. 
                Bu platformu kullanırken tüm yerel ve uluslararası yasalara uymayı 
                kabul ediyorsunuz.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                Kullanım Lisansı
              </h2>
              <p className="text-purple-100 mb-4">
                GameVerse, platformdaki oyunları oynamanız için size kişisel, 
                devredilemez bir lisans vermektedir. Bu lisans:
              </p>
              <ul className="list-disc list-inside text-purple-100 mb-4 space-y-2">
                <li>Ticari amaçla kullanılamaz</li>
                <li>Başkalarına devredilemez</li>
                <li>Platform içeriği kopyalanamaz</li>
                <li>Oyunlar üzerinde değişiklik yapılamaz</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                Yaş Sınırlaması
              </h2>
              <p className="text-purple-100 mb-4">
                Platform, 4-16 yaş arası çocuklar için tasarlanmıştır. 
                Her oyunun kendi yaş sınırlaması bulunmaktadır ve ebeveyn 
                gözetiminde kullanılması önerilmektedir.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                İçerik Politikası
              </h2>
              <p className="text-purple-100 mb-4">
                Tüm oyunlarımız çocuklar için uygun içeriğe sahiptir. 
                Şiddet, uygunsuz dil veya yetişkin içeriği bulunmamaktadır.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                Sorumluluk Reddi
              </h2>
              <p className="text-purple-100 mb-4">
                Platform "olduğu gibi" sunulmaktadır. Oyunların kesintisiz 
                çalışacağı veya hatasız olacağı garanti edilmemektedir.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                İletişim
              </h2>
              <p className="text-purple-100">
                Kullanım şartları hakkında sorularınız için{' '}
                <a 
                  href="mailto:terms@gameverse.com" 
                  className="text-yellow-300 hover:text-yellow-400 transition-colors"
                >
                  terms@gameverse.com
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

export default Terms;