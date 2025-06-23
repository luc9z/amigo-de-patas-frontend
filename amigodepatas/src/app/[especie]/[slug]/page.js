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

// tipos para backend: 'ADOCAO' e 'LAR_TEMPORARIO'
const getTipoEnum = (tipo) => {
  if (tipo === "adocao") return "ADOCAO";
  if (tipo === "lar_temporario") return "LAR_TEMPORARIO";
  return tipo.toUpperCase();
};

export default function AnimalPage() {
  const { slug, especie } = useParams();
  const [animal, setAnimal] = useState(null);
  const [outros, setOutros] = useState([]);
  const [minhasCandidaturas, setMinhasCandidaturas] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [loadingCandidatura, setLoadingCandidatura] = useState(false);
  const scrollRef = useRef(null);
  const { user } = useAuth();

  // Buscar animal pelo slug/espécie
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

  // Buscar candidaturas do usuário logado
  useEffect(() => {
    async function buscarCandidaturas() {
      if (!user || !animal) return setMinhasCandidaturas([]);
      try {
        const todas = await authService.getMinhasCandidaturas();
        // Só do animal atual
        setMinhasCandidaturas(
            todas.filter((c) =>
                (c.animalId === animal.id || (c.animal && c.animal.id === animal.id))
            )
        );
      } catch {
        setMinhasCandidaturas([]);
      }
    }
    if (animal && user) buscarCandidaturas();
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

  // Só permite uma candidatura por tipo
  const jaCandidatado = (tipo) => {
    if (!user || !animal) return false;
    const tipoEnum = getTipoEnum(tipo);
    // Checa se existe candidatura para o tipo desejado (e.g. ADOCAO)
    return minhasCandidaturas.some(
        (c) =>
            String((c.type || c.tipo)).toUpperCase() === tipoEnum
    );
  };

  const handleCandidatar = async (tipo) => {
    if (!user || !animal) return;
    if (jaCandidatado(tipo)) {
      setMensagem("Você já enviou uma solicitação para esse tipo.");
      return;
    }
    setLoadingCandidatura(true);
    setMensagem("");
    try {
      await authService.criarCandidatura({
        animalId: animal.id,
        type: getTipoEnum(tipo),
        message: "",
      });

      // Após sucesso, refaz fetch das candidaturas
      const todas = await authService.getMinhasCandidaturas();
      setMinhasCandidaturas(
          todas.filter((c) =>
              (c.animalId === animal.id || (c.animal && c.animal.id === animal.id))
          )
      );
      setMensagem(
          tipo === "adocao"
              ? "Candidatura para adoção enviada com sucesso!"
              : "Candidatura para lar temporário enviada com sucesso!"
      );
    } catch (err) {
      setMensagem(
          "Erro ao enviar candidatura. " + (err.body || err.message || "")
      );
    } finally {
      setLoadingCandidatura(false);
    }
  };

  if (!animal)
    return <p className="text-center py-20">Animal não encontrado.</p>;

  return (
      <main className="bg-gradient-to-br from-pink-50 via-white to-blue-50 min-h-screen text-gray-800 font-sans">
        <Header />

        <section className="max-w-3xl mx-auto px-6 pt-8 pb-2">
          <div className="mb-4">
            <Link href="/" className="text-pink-600 hover:underline font-semibold">
              Página Inicial
            </Link>
            <span className="mx-1 text-gray-400">/</span>
            <Link href="/animais" className="text-pink-600 hover:underline font-semibold">
              Animais
            </Link>
            <span className="mx-1 text-gray-400">/</span>
            <span className="text-gray-700 font-semibold capitalize">{animal.nome}</span>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-12">
          <div className={`bg-white shadow-lg rounded-2xl p-8 border-2 text-center relative transition-all duration-300 ${animal.adotado ? 'border-green-400' : 'border-pink-200'}`}>
            <Image
                src={animal.imagemUrl || "/placeholder.jpg"}
                alt={animal.nome}
                width={300}
                height={300}
                className="rounded-xl mx-auto object-cover h-[300px] w-[300px] bg-gray-100"
            />
            {animal.adotado && (
                <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
                  Já foi adotado!
                </div>
            )}
            <h1 className="text-3xl font-bold mt-6 mb-2 text-pink-600">{animal.nome}</h1>
            <p className="text-gray-700 mb-6">{animal.descricao}</p>

            <div className="flex justify-center gap-3 flex-wrap mb-8">
            <span className="bg-green-100 text-green-700 text-base px-4 py-1 rounded-full font-semibold">
              {animal.vacinado ? "Vacinado" : "Não vacinado"}
            </span>
              <span className="bg-green-100 text-green-700 text-base px-4 py-1 rounded-full font-semibold">
              {animal.castrado ? "Castrado" : "Não castrado"}
            </span>
              <span className="bg-gray-200 text-gray-700 text-base px-4 py-1 rounded-full font-semibold capitalize">
              {animal.porte}
            </span>
              {animal.lar_temporario && (
                  <span className="bg-yellow-100 text-yellow-800 text-base px-4 py-1 rounded-full font-semibold">
                Lar Temporário
              </span>
              )}
            </div>

            {animal.adotado ? (
                <button
                    className="font-semibold px-8 py-2 rounded-xl text-lg bg-gray-300 text-gray-500 cursor-not-allowed shadow transition"
                    disabled
                >
                  Este animal já foi adotado
                </button>
            ) : (
                <div className="flex flex-col gap-3 items-center">
                  {!user ? (
                      <p className="text-gray-700 text-base text-center">
                        <Link href="/login" className="text-pink-600 font-semibold hover:underline">
                          Entre na sua conta
                        </Link>{" "}
                        ou{" "}
                        <Link href="/register" className="text-pink-600 font-semibold hover:underline">
                          crie uma
                        </Link>{" "}
                        para adotar este animal.
                      </p>
                  ) : (
                      <button
                          className={`font-semibold px-8 py-2 rounded-xl text-lg shadow transition-all duration-300 ${
                              jaCandidatado("adocao") || loadingCandidatura
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  : "bg-pink-600 text-white hover:bg-pink-700"
                          }`}
                          disabled={jaCandidatado("adocao") || loadingCandidatura}
                          onClick={() => handleCandidatar("adocao")}
                      >
                        {jaCandidatado("adocao")
                            ? "Já se candidatou para adoção"
                            : loadingCandidatura
                                ? "Enviando..."
                                : "Quero Adotar este Animal"}
                      </button>
                  )}

                  {animal.lar_temporario && user && (
                      <button
                          className={`font-semibold px-8 py-2 rounded-xl text-lg shadow transition-all duration-300 ${
                              jaCandidatado("lar_temporario") || loadingCandidatura
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  : "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                          }`}
                          disabled={jaCandidatado("lar_temporario") || loadingCandidatura}
                          onClick={() => handleCandidatar("lar_temporario")}
                      >
                        {jaCandidatado("lar_temporario")
                            ? "Já se candidatou para lar temporário"
                            : loadingCandidatura
                                ? "Enviando..."
                                : "Quero ser Lar Temporário"}
                      </button>
                  )}

                  {mensagem && (
                      <div className="mt-4 text-green-700 bg-green-100 px-6 py-3 rounded-xl text-base font-medium shadow-sm">
                        {mensagem}
                      </div>
                  )}
                </div>
            )}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-16">
          <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">
            Outros animais disponíveis
          </h2>

          <div className="relative">
            <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-pink-50 z-10 border border-pink-200"
                aria-label="Ver anterior"
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
                      className="min-w-[260px] bg-white border-2 border-pink-100 rounded-xl shadow-md flex flex-col overflow-hidden hover:shadow-xl transition"
                  >
                    <Image
                        src={a.imagemUrl || "/placeholder.jpg"}
                        alt={a.nome}
                        width={260}
                        height={180}
                        className="object-cover h-[200px] w-full"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-1 text-pink-600">{a.nome}</h3>
                      <p className="text-sm text-gray-600 mb-2">{a.descricao}</p>
                      <div className="flex gap-2 flex-wrap">
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                      {a.vacinado ? "Vacinado" : "Não vacinado"}
                    </span>
                        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                      {a.castrado ? "Castrado" : "Não castrado"}
                    </span>
                        <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full font-medium capitalize">
                      {a.porte}
                    </span>
                      </div>
                    </div>
                  </Link>
              ))}
            </div>

            <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-pink-50 z-10 border border-pink-200"
                aria-label="Ver próximo"
            >
              <ChevronRight />
            </button>
          </div>
        </section>

        <Footer />
      </main>
  );
}
