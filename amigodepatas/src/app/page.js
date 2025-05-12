'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Dados mockados para exemplo (posteriormente virão da API)
const featuredPets = [
  {
    id: 1,
    name: 'Rex',
    type: 'Cachorro',
    breed: 'Labrador',
    age: '2 anos',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9nfGVufDB8fDB8fHww'
  },
  {
    id: 2,
    name: 'Luna',
    type: 'Gato',
    breed: 'Siamês',
    age: '1 ano',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fHww'
  },
  {
    id: 3,
    name: 'Thor',
    type: 'Cachorro',
    breed: 'Golden Retriever',
    age: '3 anos',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRvZ3xlbnwwfHwwfHx8MA%3D%3D'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Maria Silva',
    text: 'Adotar o Rex foi a melhor decisão da minha vida. Ele trouxe tanta alegria para nossa família!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww'
  },
  {
    id: 2,
    name: 'João Santos',
    text: 'O processo de adoção foi muito simples e a equipe do Amigo de Patas nos ajudou em cada etapa.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D'
  }
];

const stats = [
  { id: 1, number: '500+', label: 'Animais Adotados' },
  { id: 2, number: '200+', label: 'Famílias Felizes' },
  { id: 3, number: '50+', label: 'Parceiros' }
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section com Carrossel */}
        <section className="relative h-[600px]">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            className="h-full"
          >
            <SwiperSlide>
              <div className="relative h-full">
                <img
                  src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&auto=format&fit=crop&q=80"
                  alt="Cachorro feliz"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <h1 className="text-5xl font-bold mb-4">Dê um Lar para um Amigo</h1>
                    <p className="text-xl mb-8">Mude uma vida, adote um animal de estimação</p>
                    <a
                      href="/animais"
                      className="bg-blue-500 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Ver Animais Disponíveis
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative h-full">
                <img
                  src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&auto=format&fit=crop&q=80"
                  alt="Gato brincando"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <h1 className="text-5xl font-bold mb-4">Amor em Quatro Patas</h1>
                    <p className="text-xl mb-8">Encontre seu companheiro perfeito</p>
                    <a
                      href="/animais"
                      className="bg-blue-500 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Conheça Nossos Animais
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>

        {/* Seção de Estatísticas */}
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat.id} className="p-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção de Animais em Destaque */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Animais em Destaque</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPets.map((pet) => (
                <div key={pet.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{pet.name}</h3>
                    <p className="text-gray-600 mb-2">{pet.breed}</p>
                    <p className="text-gray-600 mb-4">{pet.age}</p>
                    <a
                      href={`/animais/${pet.id}`}
                      className="block text-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Conhecer {pet.name}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção Como Funciona */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Como Funciona a Adoção</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Escolha seu Amigo</h3>
                <p className="text-gray-600">Navegue pelos perfis dos animais e encontre seu companheiro ideal</p>
              </div>
              <div className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Processo de Adoção</h3>
                <p className="text-gray-600">Preencha o formulário e aguarde o contato da nossa equipe</p>
              </div>
              <div className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Bem-vindo ao Lar</h3>
                <p className="text-gray-600">Receba seu novo amigo e comece uma nova jornada juntos</p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Depoimentos */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Histórias de Sucesso</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Pronto para Adotar?</h2>
            <p className="text-xl mb-8">Dê um lar para um animal que precisa de amor e carinho</p>
            <a
              href="/animais"
              className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Começar Agora
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}