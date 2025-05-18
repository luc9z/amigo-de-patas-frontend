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

const feedbacks = [
  {
    name: "Maria Silva",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Adotar o Rex foi a melhor decisão da minha vida. Ele trouxe tanta alegria para nossa família!",
  },
  {
    name: "João Santos",
    image: "https://randomuser.me/api/portraits/men/35.jpg",
    text: "O processo de adoção foi muito simples e a equipe do Amigo de Patas nos ajudou em cada etapa.",
  },
  {
    name: "Ana Paula",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "A adoção foi rápida e segura. Recomendo a todos!",
  },
];

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

  const dogCards = animais.filter((a) => a.especie === "cachorro").slice(0, 10);
  const catCards = animais.filter((a) => a.especie === "gato").slice(0, 10);

  const renderCardsSlider = (cards, tipo) => {
    const scrollRef = useRef(null);

    const scroll = (dir) => {
      if (scrollRef.current) {
        const amount = 280;
        scrollRef.current.scrollBy({
          left: dir === "left" ? -amount : amount,
          behavior: "smooth",
        });
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
                    className="min-w-[260px] h-auto bg-white border border-gray-200 rounded-xl shadow-md flex flex-col overflow-hidden"
                >
                  <div className="w-full h-auto">
                    <Image
                        src={animal.imagemUrl || "/placeholder.jpg"}
                        alt={animal.nome}
                        width={260}
                        height={260}
                        className="rounded-t-xl object-cover w-full h-[240px]"
                    />
                  </div>

                  <div className="p-4 flex-grow text-center flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{animal.nome}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {animal.descricao}
                      </p>
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
                        className="mt-auto inline-block bg-pink-200 text-sm font-medium text-center text-gray-800 py-2 px-4 rounded-md hover:bg-pink-300 transition"
                    >
                      Conhecer
                    </Link>
                  </div>
                </div>
            ))}

            <Link
                href={`/animais/${tipo}`}
                className="min-w-[260px] h-auto bg-gray-100 border border-gray-200 rounded-xl shadow-md flex flex-col justify-center items-center text-center hover:bg-gray-200 transition"
            >
              <div className="p-6">
                <h3 className="text-base font-semibold text-gray-700 mb-1">
                  Ver todos
                </h3>
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
  };

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
                onClick={() =>
                    setIndex(
                        (index - 1 + carouselImages.length) % carouselImages.length
                    )
                }
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
          <h2 className="text-xl font-semibold text-gray-700 mb-8">
            Cachorros Disponíveis para Adoção
          </h2>
          <div className="max-w-screen-xl mx-auto relative">
            {renderCardsSlider(dogCards, "cachorro")}
          </div>
        </section>

        <section className="py-12 px-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-8">
            Gatos Disponíveis para Adoção
          </h2>
          <div className="max-w-screen-xl mx-auto relative">
            {renderCardsSlider(catCards, "gato")}
          </div>
        </section>

        <section className="py-12 px-4 text-center bg-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-8">
            Por que Adotar um Animal?
          </h2>
          <div className="flex justify-center flex-wrap gap-6">
            {reasons.map((msg, i) => (
                <div
                    key={i}
                    className="bg-white border border-gray-300 rounded-lg shadow-sm p-6 w-[280px]"
                >
                  <p className="text-gray-600 leading-relaxed">{msg}</p>
                </div>
            ))}
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-50 text-center">
          <h2 className="text-2xl font-semibold mb-10">Histórias de Sucesso</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {feedbacks.map((f, i) => (
                <div
                    key={i}
                    className="w-[300px] bg-white rounded-xl shadow-md p-6 text-center"
                >
                  <Image
                      src={f.image}
                      alt={f.name}
                      width={60}
                      height={60}
                      className="rounded-full mx-auto object-cover"
                  />
                  <h4 className="mt-4 text-base font-semibold text-gray-700">
                    {f.name}
                  </h4>
                  <p className="text-sm text-gray-500 italic mt-2">"{f.text}"</p>
                </div>
            ))}
          </div>
        </section>

        <Footer />
      </main>
  );
}
