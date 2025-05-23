import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Contato() {
  return (
      <div className="min-h-screen flex flex-col bg-white font-sans text-gray-800">
        <Header />
        <main className="flex-grow px-4 py-10 md:py-16">
          <section className="container mx-auto max-w-3xl  rounded-xl p-8 md:p-12 animate-fade-in-up">
            <h1 className="text-4xl font-bold mb-6 text-center text-black">Fale Conosco</h1>
            <p className="text-lg text-gray-700 mb-8 text-center">
              Tem alguma dúvida, sugestão ou deseja fazer parte da nossa causa? Preencha o formulário abaixo e entraremos em contato com você!
            </p>
            <form className="space-y-6">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                    type="text"
                    id="nome"
                    name="nome"
                    required
                    placeholder="Seu nome"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="seuemail@exemplo.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
              <div>
                <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                    id="mensagem"
                    name="mensagem"
                    rows={5}
                    required
                    placeholder="Escreva sua mensagem aqui..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
              <div className="text-center">
                <button
                    type="submit"
                    className="bg-pink-600 text-white font-semibold rounded-lg px-6 py-2 hover:bg-pink-700 transition"
                >
                  Enviar mensagem
                </button>
              </div>
            </form>
          </section>
        </main>
        <Footer />
      </div>
  );
}
