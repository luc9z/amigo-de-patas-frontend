import Header from "../components/Header";
import Footer from "../components/Footer";
import { PawPrint, HeartHandshake, Home, HandCoins } from "lucide-react";

export default function QuemSomos() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-800">
      <Header />
      <main className="flex-grow bg-gray-50 animate-fade-in px-2 md:px-0 py-6 md:py-10">
        <section className="container mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black drop-shadow-sm">Sobre o Amigo de Patas</h1>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl animate-fade-in-up">
              O Amigo de Patas nasceu do amor incondicional pelos animais e do desejo de transformar vidas. Somos uma equipe multidisciplinar dedicada a promover a adoção responsável, o resgate e o bem-estar de cães e gatos em situação de vulnerabilidade.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 animate-fade-in-up">
              <li><b>Missão:</b> Conectar animais resgatados a lares amorosos e responsáveis.</li>
              <li><b>Visão:</b> Um mundo onde todo pet tenha um lar seguro e feliz.</li>
              <li><b>Valores:</b> Respeito, empatia, responsabilidade e transparência.</li>
            </ul>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in-up">
            <PawPrint size={120} className="text-pink-200 mb-4 drop-shadow-lg animate-fade-in-up" />
            <span className="text-pink-600 font-bold text-xl">Amor, Respeito e Dedicação</span>
          </div>
        </section>

        <section className="container mx-auto px-6 py-8 md:py-12 animate-fade-in-up">
          <h2 className="text-2xl font-semibold text-black mb-6 text-center">Nossas Atividades</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-all duration-300 animate-fade-in-up">
              <HeartHandshake size={56} className="mx-auto mb-4 text-pink-500" />
              <h3 className="text-lg font-bold mb-2 text-black">Adoção Responsável</h3>
              <p className="text-black">Apoiamos e orientamos famílias na adoção consciente, garantindo o bem-estar dos pets e dos adotantes.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-all duration-300 animate-fade-in-up">
              <PawPrint size={56} className="mx-auto mb-4 text-pink-500" />
              <h3 className="text-lg font-bold mb-2 text-black">Resgate e Reabilitação</h3>
              <p className="text-black">Resgatamos animais em situação de risco, oferecendo cuidados veterinários, abrigo temporário e muito carinho.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-all duration-300 animate-fade-in-up">
              <Home size={56} className="mx-auto mb-4 text-pink-500" />
              <h3 className="text-lg font-bold mb-2 text-black">Conscientização</h3>
              <p className="text-black">Promovemos campanhas educativas sobre guarda responsável, castração e combate ao abandono.</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-8 md:py-12 animate-fade-in-up" style={{marginTop: '3.5rem'}}>
          <h2 className="text-2xl font-semibold text-black mb-6 text-center">Como você pode ajudar?</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <div className="flex-1 bg-pink-50 border border-pink-200 rounded-xl shadow-md p-6 text-center hover:scale-105 transition-transform animate-fade-in-up">
              <Home size={40} className="mx-auto mb-2 text-pink-500" />
              <h3 className="text-lg font-bold mb-2 text-black">Adote um Amigo</h3>
              <p className="text-black mb-2">Ofereça um lar cheio de amor para um pet resgatado. Veja os animais disponíveis na nossa página de adoção.</p>
              <a href="/animais" className="inline-block mt-2 px-6 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition">Quero Adotar</a>
            </div>
            <div className="flex-1 bg-pink-50 border border-pink-200 rounded-xl shadow-md p-6 text-center hover:scale-105 transition-transform animate-fade-in-up">
              <PawPrint size={40} className="mx-auto mb-2 text-pink-500" />
              <h3 className="text-lg font-bold mb-2 text-black">Seja um Lar Temporário</h3>
              <p className="text-black mb-2">Ajude um animal em recuperação oferecendo abrigo temporário até que ele encontre uma família definitiva.</p>
              <a href="/animais?lar_temporario=true" className="inline-block mt-2 px-6 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition">Quero Ajudar</a>
            </div>
            <div className="flex-1 bg-pink-50 border border-pink-200 rounded-xl shadow-md p-6 text-center hover:scale-105 transition-transform animate-fade-in-up">
              <HandCoins size={40} className="mx-auto mb-2 text-pink-500" />
              <h3 className="text-lg font-bold mb-2 text-black">Doe ou Apoie</h3>
              <p className="text-black mb-2">Sua doação faz a diferença! Entre em contato para saber como contribuir financeiramente ou com itens para os animais.</p>
              <span className="inline-block mt-2 px-6 py-2 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed">Quero Doar</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
