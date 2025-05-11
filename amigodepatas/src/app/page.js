import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Bem-vindo ao Amigo de Patas
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Conectando pessoas e animais para criar laços de amizade e cuidado.
            </p>
            <div className="space-x-4">
              <a
                href="/register"
                className="bg-blue-500 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Começar Agora
              </a>
              <a
                href="/sobre"
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Saiba Mais
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}