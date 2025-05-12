export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Amigo de Patas</h3>
            <p className="text-gray-300">
              Conectando pessoas e animais para criar laços de amizade e cuidado.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <a href="/sobre" className="text-gray-300 hover:text-white">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="/contato" className="text-gray-300 hover:text-white">
                  Contato
                </a>
              </li>
              <li>
                <a href="/termos" className="text-gray-300 hover:text-white">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: contato@amigodepatas.com</li>
              <li>Telefone: (XX) XXXX-XXXX</li>
              <li>Endereço: Rua Exemplo, 123</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Amigo de Patas. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
} 