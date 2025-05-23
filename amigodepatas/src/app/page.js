"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import authService from "@/services/api";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselImages = [
  "/banners/banner1.jpg",
  "/banners/banner2.jpg",
  "/banners/banner3.jpg",
];

function CardsSlider({ cards, tipo }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      const amount = 280;
      scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 z-10"
      >
        <ChevronLeft />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth px-6 py-2 scrollbar-hide"
      >
        {cards.map((animal, i) => (
          <div
            key={animal.id || i}
            className="w-72 h-[420px] border rounded-xl shadow-md flex flex-col overflow-hidden relative bg-white border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in flex-shrink-0"
          >
            <div className="w-full h-[200px] relative">
              <Image
                src={animal.imagemUrl || "/placeholder.jpg"}
                alt={animal.nome}
                width={288}
                height={200}
                className="rounded-t-xl object-cover w-full h-full"
              />
              {animal.lar_temporario && (
                <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
                  🏠 Lar Temporário
                </span>
              )}
            </div>
            <div className="p-4 flex-grow text-center flex flex-col justify-between h-full">
              <div>
                <h3 className="text-lg font-semibold mb-1">{animal.nome}</h3>
                <p className="descricao-limitada mb-2">{animal.descricao}</p>
                <div className="flex justify-center gap-2 mb-3 flex-wrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                    {animal.vacinado ? "Vacinado" : "Não vacinado"}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                    {animal.castrado ? "Castrado" : "Não castrado"}
                  </span>
                </div>
              </div>
              <Link
                href={`/${animal.especie}/${animal.slug}`}
                className="mt-auto inline-block text-sm font-medium text-center py-2 px-4 rounded-md transition-colors duration-300 bg-pink-200 text-gray-800 hover:bg-pink-300"
              >
                Conhecer
              </Link>
            </div>
          </div>
        ))}
        <Link
          href={`/animais?especie=${tipo}`}
          className="min-w-[280px] max-w-[280px] h-[420px] bg-gray-100 border border-gray-200 rounded-xl shadow-md flex flex-col justify-center items-center text-center hover:bg-gray-200 transition flex-shrink-0"
        >
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-700 mb-1">Ver todos</h3>
            <p className="text-sm text-gray-500">do tipo {tipo}</p>
          </div>
        </Link>
      </div>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200 z-10"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

export default function Home() {
  const [index, setIndex] = useState(0);
  const [animais, setAnimais] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function carregarAnimais() {
      try {
        const dados = await authService.getAnimais();
        setAnimais(gerarSlugsUnicos(dados));
      } catch (err) {
        console.error("Erro ao carregar animais:", err);
      }
    }
    carregarAnimais();
  }, []);

  function gerarSlugsUnicos(animais) {
    const contador = {};
    return animais.map((animal) => {
      const nomeBase = animal.nome.toLowerCase().replace(/\s+/g, "");
      contador[nomeBase] = (contador[nomeBase] || 0) + 1;
      const slug = `${nomeBase}${contador[nomeBase]}`;
      return { ...animal, slug, especie: animal.especie.toLowerCase() };
    });
  }

  const dogCards = animais.filter((a) => a.especie === "cachorro" && a.adotado === false).slice(0, 8);
  const catCards = animais.filter((a) => a.especie === "gato" && a.adotado === false).slice(0, 8);
  const adoptedAnimals = animais
    .filter((a) => a.adotado)
    .sort((a, b) => {
      if (a.dataAdocao && b.dataAdocao) {
        return new Date(b.dataAdocao) - new Date(a.dataAdocao);
      }
      return (b.id || 0) - (a.id || 0);
    })
    .slice(0, 4);

  const reasons = [
    "Adotar salva vidas e oferece um lar a quem precisa.",
    "Animais adotados são gratos e amorosos.",
    "Você combate o abandono e maus-tratos.",
  ];

  return (
    <main className="font-sans text-gray-800 bg-white">
      <Header />

      <section className="w-full h-[500px] px-0 py-0 bg-gray-100 text-center">
        <div className="mx-auto w-full h-full relative overflow-hidden rounded-none shadow-none">
          <div
            className="flex h-full transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {carouselImages.map((src, i) => (
              <div key={i} className="min-w-full h-full relative cursor-pointer" onClick={() => window.location.href = '/animais'}>
                <Image
                  src={src}
                  alt={`Slide ${i + 1}`}
                  fill
                  className="object-cover w-full h-full"
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => setIndex((index - 1 + carouselImages.length) % carouselImages.length)}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
          >
            &#10094;
          </button>
          <button
            onClick={() => setIndex((index + 1) % carouselImages.length)}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
          >
            &#10095;
          </button>
        </div>
      </section>

      <section className="py-12 px-4 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-8">Cachorros Disponíveis para Adoção</h2>
        <div className="max-w-screen-xl mx-auto relative">
          <CardsSlider cards={dogCards} tipo="cachorro" />
        </div>
      </section>

      <section className="py-12 px-4 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-8">Gatos Disponíveis para Adoção</h2>
        <div className="max-w-screen-xl mx-auto relative">
          <CardsSlider cards={catCards} tipo="gato" />
        </div>
      </section>
      <section className="py-16 px-4 bg-gray-50 text-center">
        <h2 className="text-2xl font-semibold mb-10">Animais que já foram adotados</h2>
        <div className="max-w-screen-xl mx-auto">
          {adoptedAnimals.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8">
              {adoptedAnimals.map((animal, i) => {
                const celebratoryMessages = [
                  "Parabéns! Este pet encontrou um lar cheio de amor!",
                  "Agora tenho uma família para chamar de minha!",
                  "Fui adotado e estou muito feliz no meu novo lar!",
                  "Ganhei um novo começo ao lado de pessoas incríveis!"
                ];
                return (
                  <div
                    key={animal.id || i}
                    className="w-72 h-[420px] border rounded-xl shadow-md flex flex-col overflow-hidden relative bg-green-50 border-green-300 transition-transform transition-shadow duration-300 hover:scale-105 hover:shadow-xl animate-fade-in"
                  >
                    <div className="w-full h-[200px] relative">
                      <Image
                        src={animal.imagemUrl || "/placeholder.jpg"}
                        alt={animal.nome}
                        width={288}
                        height={200}
                        className="rounded-t-xl object-cover w-full h-full"
                      />
                      <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
                        🏠 Já tem um lar!
                      </span>
                    </div>
                    <div className="p-4 flex-grow text-center flex flex-col justify-between h-full">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{animal.nome}</h3>
                        <p className="descricao-limitada mb-2">{animal.descricao}</p>
                      </div>
                      <div className="mt-2 text-green-700 text-sm font-semibold bg-green-100 rounded-lg px-3 py-2 animate-fade-in">
                        {celebratoryMessages[i % celebratoryMessages.length]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum animal adotado encontrado.</p>
          )}
        </div>
      </section>
      <section className="py-12 px-4 text-center bg-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-8">Por que Adotar um Animal?</h2>
        <div className="flex justify-center flex-wrap gap-6">
          {reasons.map((msg, i) => (
              <div key={i} className="bg-white border border-gray-300 rounded-lg shadow-sm p-6 w-[280px]">
                <p className="text-gray-600 leading-relaxed">{msg}</p>
              </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
