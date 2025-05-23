"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import authService from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AnimalPage() {
  const { slug, especie } = useParams();
  const [animal, setAnimal] = useState(null);
  const [outros, setOutros] = useState([]);
  const [candidaturas, setCandidaturas] = useState([]); // Simulação local
  const [mensagem, setMensagem] = useState("");
  const [loadingCandidatura, setLoadingCandidatura] = useState(false);
  const scrollRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    async function carregarAnimal() {
      const animais = await authService.getAnimais();
      const animaisComSlug = gerarSlugsUnicos(animais);
      const encontrado = animaisComSlug.find(
        (a) => a.slug === slug && a.especie.toLowerCase() === especie
      );
      setAnimal(encontrado);

      const outrosAnimais = animaisComSlug
        .filter((a) => a.slug !== slug && !a.adotado)
        .slice(0, 10);
      setOutros(outrosAnimais);
    }
    carregarAnimal();
  }, [slug, especie]);

  // Simula buscar candidaturas do usuário para este animal
  useEffect(() => {
    if (animal && user) {
      // Simule candidaturas já feitas (poderia vir do backend)
      // Exemplo: [{animal_id, user_id, tipo, data}]
      setCandidaturas([
        // { animal_id: animal.id, user_id: user.id, tipo: "adocao", data: "2024-05-23" }
      ]);
    }
  }, [animal, user]);

  function gerarSlugsUnicos(animais) {
    const contador = {};
    return animais.map((animal) => {
      const nomeBase = animal.nome.toLowerCase().replace(/\s+/g, "");
      contador[nomeBase] = (contador[nomeBase] || 0) + 1;
      const slug = `${nomeBase}${contador[nomeBase]}`;
      return { ...animal, slug, especie: animal.especie.toLowerCase() };
    });
  }

  const scroll = (dir) => {
    if (scrollRef.current) {
      const amount = 280;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  const jaCandidatado = (tipo) => {
    if (!user || !animal) return false;
    return candidaturas.some(
      (c) => c.animal_id === animal.id && c.user_id === user.id && c.tipo === tipo
    );
  };

  const handleCandidatar = async (tipo) => {
    if (!user || !animal) return;
    setLoadingCandidatura(true);
    setMensagem("");
    try {
      // Simula requisição POST
      await new Promise((res) => setTimeout(res, 800));
      // Aqui seria: await authService.candidatar({ animal_id: animal.id, user_id: user.id, tipo });
      setCandidaturas((prev) => [
        ...prev,
        { animal_id: animal.id, user_id: user.id, tipo, data: new Date().toISOString() },
      ]);
      setMensagem(
        tipo === "adocao"
          ? "Candidatura para adoção enviada com sucesso!"
          : "Candidatura para lar temporário enviada com sucesso!"
      );
    } catch {
      setMensagem("Erro ao enviar candidatura. Tente novamente.");
    } finally {
      setLoadingCandidatura(false);
    }
  };

  if (!animal)
    return <p className="text-center py-20">Animal não encontrado.</p>;

  return (
    <main className="bg-white text-gray-800 font-sans">
      <Header />

      <section className="max-w-3xl mx-auto px-6 pt-8 pb-2">
        <div className="mb-4">
          <Link href="/" className="text-blue-500 hover:underline">
            Página Inicial
          </Link>
          <span> / </span>
          <Link href="/animais" className="text-blue-500 hover:underline">
            Animais
          </Link>
          <span> / </span>
          <span className="text-gray-700 font-semibold capitalize">{animal.nome}</span>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className={`bg-white shadow-md rounded-2xl p-8 border text-center relative ${animal.adotado ? 'border-green-400' : 'border-gray-200'}`}>
          <Image
            src={animal.imagemUrl || "/placeholder.jpg"}
            alt={animal.nome}
            width={300}
            height={300}
            className="rounded-lg mx-auto object-cover h-[300px] w-[300px]"
          />
          {animal.adotado && (
            <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
              Já foi adotado!
            </div>
          )}
          <h1 className="text-2xl font-bold mt-4 mb-1 capitalize">
            {animal.nome}
          </h1>
          <p className="text-gray-600 mb-4">{animal.descricao}</p>

          <div className="flex justify-center gap-3 flex-wrap mb-6">
            <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
              {animal.vacinado ? "Vacinado" : "Não vacinado"}
            </span>
            <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
              {animal.castrado ? "Castrado" : "Não castrado"}
            </span>
            <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full capitalize">
              {animal.porte}
            </span>
            {animal.lar_temporario && (
              <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                Lar Temporário
              </span>
            )}
          </div>

          {animal.adotado ? (
            <button 
              className="font-medium px-6 py-2 rounded-md bg-gray-300 text-gray-500 cursor-not-allowed transition"
              disabled
            >
              Este animal já foi adotado
            </button>
          ) : (
            <div className="flex flex-col gap-3 items-center">
              <button
                className={`font-medium px-6 py-2 rounded-md transition-all duration-300 ${jaCandidatado("adocao") ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-pink-200 text-gray-800 hover:bg-pink-300"}`}
                disabled={jaCandidatado("adocao") || loadingCandidatura}
                onClick={() => handleCandidatar("adocao")}
              >
                {jaCandidatado("adocao") ? "Já se candidatou para adoção" : loadingCandidatura ? "Enviando..." : "Quero Adotar este Animal"}
              </button>
              {animal.lar_temporario && (
                <button
                  className={`font-medium px-6 py-2 rounded-md transition-all duration-300 ${jaCandidatado("lar_temporario") ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-yellow-300 text-gray-800 hover:bg-yellow-400"}`}
                  disabled={jaCandidatado("lar_temporario") || loadingCandidatura}
                  onClick={() => handleCandidatar("lar_temporario")}
                >
                  {jaCandidatado("lar_temporario") ? "Já se candidatou para lar temporário" : loadingCandidatura ? "Enviando..." : "Quero ser Lar Temporário"}
                </button>
              )}
              {mensagem && (
                <div className="mt-3 text-green-700 bg-green-100 px-4 py-2 rounded-xl text-sm font-medium">
                  {mensagem}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
          Outros animais disponíveis
        </h2>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 z-10"
          >
            <ChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth px-2 py-2 scrollbar-hide"
          >
            {outros.map((a) => (
              <Link
                key={a.id}
                href={`/${a.especie}/${a.slug}`}
                className="min-w-[260px] bg-white border border-gray-200 rounded-xl shadow-md flex flex-col overflow-hidden hover:shadow-lg transition"
              >
                <Image
                  src={a.imagemUrl || "/placeholder.jpg"}
                  alt={a.nome}
                  width={260}
                  height={180}
                  className="object-cover h-[200px] w-full"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{a.nome}</h3>
                  <p className="text-sm text-gray-600 mb-2">{a.descricao}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                      {a.vacinado ? "Vacinado" : "Não vacinado"}
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                      {a.castrado ? "Castrado" : "Não castrado"}
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full capitalize">
                      {a.porte}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 z-10"
          >
            <ChevronRight />
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
