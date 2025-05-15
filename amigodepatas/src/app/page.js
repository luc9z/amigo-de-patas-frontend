'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const carouselImages = [
  'https://images.unsplash.com/photo-1601758123927-1965c1f9f5e0',
  'https://images.unsplash.com/photo-1558788353-f76d92427f16',
  'https://images.unsplash.com/photo-1507146426996-ef05306b995a'
];

const dogCards = [
  { src: 'https://images.unsplash.com/photo-1583511655789-8bfb3e7d6d9d', name: 'Bidu', desc: 'Alegre, carinhoso e vacinado.' },
  { src: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d', name: 'Luna', desc: 'Muito dócil e ótima com crianças.' },
  { src: 'https://images.unsplash.com/photo-1557976606-d3e48ef66a8f', name: 'Max', desc: 'Ativo e adora brincar.' }
];

const catCards = [
  { src: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6', name: 'Mimi', desc: 'Curiosa e muito carinhosa.' },
  { src: 'https://images.unsplash.com/photo-1605433249632-e3c9a4910314', name: 'Tom', desc: 'Sociável e gosta de colo.' },
  { src: 'https://images.unsplash.com/photo-1574158622682-e40e69881006', name: 'Nina', desc: 'Independente e tranquila.' }
];

const feedbacks = [
  {
    name: 'Maria Silva',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'Adotar o Rex foi a melhor decisão da minha vida. Ele trouxe tanta alegria para nossa família!'
  },
  {
    name: 'João Santos',
    image: 'https://randomuser.me/api/portraits/men/35.jpg',
    text: 'O processo de adoção foi muito simples e a equipe do Amigo de Patas nos ajudou em cada etapa.'
  },
  {
    name: 'Ana Paula',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    text: 'A adoção foi rápida e segura. Recomendo a todos!'
  }
];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => setIndex((index - 1 + carouselImages.length) % carouselImages.length);
  const handleNext = () => setIndex((index + 1) % carouselImages.length);

  const renderCards = (cards) => (
      <div className="flex flex-wrap justify-center gap-6">
        {cards.map((animal, i) => (
            <div key={i} className="w-[260px] h-[360px] bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
              <div className="relative w-full h-[200px]">
                <Image src={animal.src} alt={animal.name} fill className="object-cover" />
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-medium mb-1">{animal.name}</h3>
                <p className="text-sm text-gray-600">{animal.desc}</p>
              </div>
            </div>
        ))}
      </div>
  );

  const reasons = [
    'Adotar salva vidas e oferece um lar a quem precisa.',
    'Animais adotados são gratos e amorosos.',
    'Você combate o abandono e maus-tratos.'
  ];

  return (
      <main className="font-sans text-gray-800 bg-white">
        <Header />

        <section className="py-10 px-4 bg-gray-100 text-center">
          <div className="mx-auto w-full max-w-5xl h-[500px] relative overflow-hidden rounded-2xl shadow-lg">
            <div className="flex h-full transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${index * 100}%)` }}>
              {carouselImages.map((src, i) => (
                  <div key={i} className="min-w-full h-full relative">
                    <Image
                        src={src}
                        alt={`Slide ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 1000px"
                    />
                  </div>
              ))}
            </div>
            <button
                onClick={handlePrev}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
            >
              &#10094;
            </button>
            <button
                onClick={handleNext}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
            >
              &#10095;
            </button>
          </div>
          <button className="mt-6 bg-pink-200 text-sm font-medium py-2 px-4 rounded-md hover:bg-pink-300 transition">
            Quero Adotar um Animal
          </button>
        </section>

        <section className="py-12 px-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-8">Cachorros Disponíveis para Adoção</h2>
          {renderCards(dogCards)}
        </section>

        <section className="py-12 px-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-8">Gatos Disponíveis para Adoção</h2>
          {renderCards(catCards)}
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

        <section className="py-16 px-4 bg-gray-50 text-center">
          <h2 className="text-2xl font-semibold mb-10">Histórias de Sucesso</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {feedbacks.map((f, i) => (
                <div key={i} className="w-[300px] bg-white rounded-xl shadow-md p-6 text-center">
                  <Image src={f.image} alt={f.name} width={60} height={60} className="rounded-full mx-auto object-cover" />
                  <h4 className="mt-4 text-base font-semibold text-gray-700">{f.name}</h4>
                  <p className="text-sm text-gray-500 italic mt-2">"{f.text}"</p>
                </div>
            ))}
          </div>
        </section>

        <Footer />
      </main>
  );
}