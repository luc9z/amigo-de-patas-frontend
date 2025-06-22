"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import authService from "@/services/api";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// CORES: rosa #FEC7D7, azul #3B82F6, branco #FFF
const colors = {
    primary: "#FEC7D7",
    secondary: "#3B82F6",
    light: "#FFF",
};

const carouselImages = [
    "/banners/banner1.jpeg",
    "/banners/banner2.jpeg",
    "/banners/banner3.jpeg",
];

// CARD SLIDER
function CardsSlider({ cards, tipo }) {
    const scrollRef = useRef(null);

    const scroll = (dir) => {
        if (scrollRef.current) {
            const amount = 320;
            scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg border border-pink-100 hover:bg-pink-100 z-10"
                aria-label="Scroll Left"
            >
                <ChevronLeft className="w-6 h-6 text-pink-400" />
            </button>
            <div
                ref={scrollRef}
                className="flex gap-8 overflow-x-auto scroll-smooth px-8 py-2 scrollbar-hide"
            >
                {cards.map((animal, i) => (
                    <div
                        key={animal.id || i}
                        className="w-80 h-[420px] bg-white border border-gray-100 rounded-2xl shadow-lg flex flex-col overflow-hidden relative transition-all duration-300 hover:scale-105 hover:shadow-xl flex-shrink-0 group"
                    >
                        <div className="w-full h-[200px] relative">
                            <Image
                                src={animal.imagemUrl || "/placeholder.jpg"}
                                alt={animal.nome}
                                width={320}
                                height={200}
                                className="object-cover w-full h-full"
                            />
                            {animal.lar_temporario && (
                                <span className="absolute top-3 right-3 bg-yellow-400/90 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full shadow-md z-20 flex items-center gap-1">
                  🏠 Lar Temporário
                </span>
                            )}
                        </div>
                        <div className="p-5 flex-grow text-center flex flex-col justify-between h-full">
                            <div>
                                <h3 className="text-lg font-bold mb-1 text-blue-600 capitalize">{animal.nome}</h3>
                                <p className="descricao-limitada mb-3 text-gray-600">{animal.descricao}</p>
                                <div className="flex justify-center gap-2 mb-3 flex-wrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-pink-50 text-pink-700 border border-pink-100">
                    {animal.vacinado ? "Vacinado" : "Não vacinado"}
                  </span>
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {animal.castrado ? "Castrado" : "Não castrado"}
                  </span>
                                </div>
                            </div>
                            <Link
                                href={`/${animal.especie}/${animal.slug}`}
                                className="mt-auto inline-block text-sm font-bold py-2 px-6 rounded-md bg-pink-200/80 text-gray-900 border border-pink-100 hover:bg-pink-300 transition-colors duration-300 shadow-sm"
                            >
                                Conhecer
                            </Link>
                        </div>
                    </div>
                ))}
                <Link
                    href={`/animais?especie=${tipo}`}
                    className="min-w-[320px] max-w-[320px] h-[420px] bg-gradient-to-br from-pink-100 via-blue-50 to-white border border-pink-200 rounded-2xl shadow-md flex flex-col justify-center items-center text-center hover:bg-pink-50 transition flex-shrink-0"
                >
                    <div className="p-6 flex flex-col items-center">
                        <h3 className="text-lg font-bold text-pink-600 mb-2">Ver todos</h3>
                        <p className="text-base text-blue-500">do tipo <span className="capitalize">{tipo}</span></p>
                        <span className="text-3xl mt-4">➔</span>
                    </div>
                </Link>
            </div>
            <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg border border-pink-100 hover:bg-pink-100 z-10"
                aria-label="Scroll Right"
            >
                <ChevronRight className="w-6 h-6 text-pink-400" />
            </button>
        </div>
    );
}

// HOME PAGE
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

            {/* BANNER CAROUSEL */}
            <section className="w-full h-[440px] md:h-[500px] lg:h-[560px] bg-gradient-to-r from-pink-100 via-white to-blue-100 relative overflow-hidden">
                <div className="w-full h-full mx-auto rounded-none relative shadow-none">
                    <div
                        className="flex h-full transition-transform duration-1000 ease-in-out"
                        style={{ transform: `translateX(-${index * 100}%)` }}
                    >
                        {carouselImages.map((src, i) => (
                            <div
                                key={i}
                                className="min-w-full h-full relative cursor-pointer"
                                onClick={() => window.location.href = '/animais'}
                            >
                                <Image
                                    src={src}
                                    alt={`Slide ${i + 1}`}
                                    fill
                                    className="object-cover w-full h-full"
                                    sizes="100vw"
                                    priority={i === 0}
                                />
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                                    {carouselImages.map((_, j) => (
                                        <span
                                            key={j}
                                            className={`block w-3 h-3 rounded-full transition-all ${i === index && j === i ? 'bg-pink-400' : 'bg-pink-200/60'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => setIndex((index - 1 + carouselImages.length) % carouselImages.length)}
                        className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow border border-pink-100 hover:bg-pink-100"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="text-pink-400" />
                    </button>
                    <button
                        onClick={() => setIndex((index + 1) % carouselImages.length)}
                        className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-white/90 p-2 rounded-full shadow border border-pink-100 hover:bg-pink-100"
                        aria-label="Próximo"
                    >
                        <ChevronRight className="text-pink-400" />
                    </button>
                </div>
            </section>

            <section className="py-12 px-4 text-center bg-white">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-8 tracking-tight"> Cachorros Disponíveis para Adoção</h2>
                <div className="max-w-screen-xl mx-auto relative">
                    <CardsSlider cards={dogCards} tipo="cachorro" />
                </div>
            </section>

            <section className="py-12 px-4 text-center bg-white">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-8 tracking-tight"> Gatos Disponíveis para Adoção</h2>
                <div className="max-w-screen-xl mx-auto relative">
                    <CardsSlider cards={catCards} tipo="gato" />
                </div>
            </section>

            <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-white to-pink-50 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-10"> Animais que já foram adotados</h2>
                <div className="max-w-screen-xl mx-auto">
                    {adoptedAnimals.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-8">
                            {adoptedAnimals.map((animal, i) => {
                                const celebratoryMessages = [
                                    "Parabéns! Este pet encontrou um lar cheio de amor!",
                                    "Agora tenho uma família para chamar de minha!",
                                    "Fui adotado e estou muito feliz no meu novo lar!",
                                    "Ganhei um novo começo ao lado de pessoas incríveis!",
                                ];
                                return (
                                    <div
                                        key={animal.id || i}
                                        className="w-80 h-[400px] bg-gradient-to-br from-green-50 via-white to-green-100 border border-green-300 rounded-2xl shadow-md flex flex-col overflow-hidden relative transition-transform duration-300 hover:scale-105 hover:shadow-xl animate-fade-in"
                                    >
                                        <div className="w-full h-[200px] relative">
                                            <Image
                                                src={animal.imagemUrl || "/placeholder.jpg"}
                                                alt={animal.nome}
                                                width={320}
                                                height={200}
                                                className="object-cover w-full h-full"
                                            />
                                            <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
                        🏠 Já tem um lar!
                      </span>
                                        </div>
                                        <div className="p-4 flex-grow text-center flex flex-col justify-between h-full">
                                            <div>
                                                <h3 className="text-lg font-bold mb-1 text-green-700 capitalize">{animal.nome}</h3>
                                                <p className="descricao-limitada mb-3 text-gray-600">{animal.descricao}</p>
                                            </div>
                                            <div className="mt-2 text-green-800 text-sm font-semibold bg-green-100 rounded-xl px-3 py-2 animate-fade-in">
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

            {/* MOTIVOS */}
            <section className="py-12 px-4 text-center bg-gradient-to-r from-pink-50 via-white to-blue-50">
                <h2 className="text-2xl font-semibold text-pink-700 mb-8">Por que Adotar um Animal?</h2>
                <div className="flex justify-center flex-wrap gap-7">
                    {reasons.map((msg, i) => (
                        <div key={i} className="bg-white border border-pink-100 rounded-2xl shadow-md p-7 w-[320px]">
                            <p className="text-blue-700 text-lg leading-relaxed font-medium">{msg}</p>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </main>
    );
}
