'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { authService } from '@/services/api';
import '@/styles/swiper.css';

export default function Home() {
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimais();
  }, []);

  const fetchAnimais = async () => {
    try {
      const response = await authService.getAnimais();
      setAnimais(response);
    } catch (error) {
      console.error('Erro ao carregar animais:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[600px] bg-gradient-to-r from-blue-500 to-blue-700">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl font-bold mb-4">Dê um Lar para um Amigo</h1>
              <p className="text-xl mb-8">Mude uma vida, adote um animal de estimação</p>
              <a
                href="/animais"
                className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Ver Animais Disponíveis
              </a>
            </div>
          </div>
        </section>

        {/* Seção de Estatísticas */}
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Animais Adotados</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
                <div className="text-gray-600">Famílias Felizes</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-600">Parceiros</div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Animais em Destaque */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Animais em Destaque</h2>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="pb-12"
            >
              {animais.map((animal) => (
                <SwiperSlide key={animal.id}>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img
                      src={animal.imagemUrl}
                      alt={animal.nome}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{animal.nome}</h3>
                      <p className="text-gray-600 mb-2">{animal.especie}</p>
                      <p className="text-gray-600 mb-4">{animal.porte}</p>
                      <div className="flex space-x-2 mb-4">
                        {animal.vacinado && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Vacinado
                          </span>
                        )}
                        {animal.castrado && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Castrado
                          </span>
                        )}
                      </div>
                      <a
                        href={`/animais/${animal.id}`}
                        className="block text-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Conhecer {animal.nome}
                      </a>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
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
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={3}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                0: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-12"
            >
              <SwiperSlide>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww"
                      alt="Maria Silva"
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <h3 className="text-xl font-semibold">Maria Silva</h3>
                  </div>
                  <p className="text-gray-600 italic">
                    "Adotar o Rex foi a melhor decisão da minha vida. Ele trouxe tanta alegria para nossa família!"
                  </p>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D"
                      alt="João Santos"
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <h3 className="text-xl font-semibold">João Santos</h3>
                  </div>
                  <p className="text-gray-600 italic">
                    "O processo de adoção foi muito simples e a equipe do Amigo de Patas nos ajudou em cada etapa."
                  </p>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500&auto=format&fit=crop&q=60"
                      alt="Ana Paula"
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <h3 className="text-xl font-semibold">Ana Paula</h3>
                  </div>
                  <p className="text-gray-600 italic">
                    "A adoção foi rápida e segura. Recomendo a todos!"
                  </p>
                </div>
              </SwiperSlide>
            </Swiper>
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