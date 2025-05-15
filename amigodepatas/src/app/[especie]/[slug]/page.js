"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import authService from "@/services/api";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AnimalPage() {
  const { slug, especie } = useParams();
  const [animal, setAnimal] = useState(null);
  const [outros, setOutros] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function carregarAnimal() {
      const animais = await authService.getAnimais();
      const animaisComSlug = gerarSlugsUnicos(animais);
      const encontrado = animaisComSlug.find(
        (a) => a.slug === slug && a.especie.toLowerCase() === especie
      );
      setAnimal(encontrado);

      const outrosAnimais = animaisComSlug
        .filter((a) => a.slug !== slug)
        .slice(0, 10);
      setOutros(outrosAnimais);
    }
    carregarAnimal();
  }, [slug, especie]);

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

  if (!animal)
    return <p className="text-center py-20">Animal não encontrado.</p>;

  return (
    <main className="bg-white text-gray-800 font-sans">
      <Header />

      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white shadow-md rounded-2xl p-8 border border-gray-200 text-center">
          <Image
            src={animal.imagemUrl || "/placeholder.jpg"}
            alt={animal.nome}
            width={300}
            height={300}
            className="rounded-lg mx-auto object-cover h-[300px] w-[300px]"
          />
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
          </div>

          <button className="bg-pink-200 text-gray-800 font-medium px-6 py-2 rounded-md hover:bg-pink-300 transition">
            Quero Adotar este Animal
          </button>
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
