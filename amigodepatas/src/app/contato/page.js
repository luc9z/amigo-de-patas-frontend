export default function Contato() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Contato</h1>
        <p className="text-lg text-gray-700 max-w-2xl mb-4">
          Entre em contato conosco para dúvidas, sugestões ou parcerias!
        </p>
        <form className="max-w-lg space-y-4">
          <input type="text" placeholder="Seu nome" className="w-full border rounded px-3 py-2" />
          <input type="email" placeholder="Seu e-mail" className="w-full border rounded px-3 py-2" />
          <textarea placeholder="Sua mensagem" className="w-full border rounded px-3 py-2" rows={5}></textarea>
          <button type="submit" className="bg-pink-200 text-gray-800 font-medium rounded px-4 py-2 hover:bg-pink-300 transition">Enviar</button>
        </form>
      </div>
    </main>
  );
}
