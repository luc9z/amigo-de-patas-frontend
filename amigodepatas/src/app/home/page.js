'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const carouselImages = [
  '/e21cf9a1-aa77-4c53-909d-d867c1d36351.png',
  '/05dc5536-fa54-4aae-95a3-a17601a55c08.png',
  '/b813af48-ac36-44c2-9d20-f5589148e53c.png'
];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { src: carouselImages[0], name: 'Bidu', desc: 'Alegre, carinhoso e vacinado.' },
    { src: carouselImages[1], name: 'Luna', desc: 'Muito dócil e ótima com crianças.' },
    { src: carouselImages[2], name: 'Max', desc: 'Ativo e adora brincar.' }
  ];

  const reasons = [
    'Adotar salva vidas e oferece um lar a quem precisa.',
    'Cachorros adotados são gratos e amorosos.',
    'Você combate o abandono e maus-tratos.'
  ];

  return (
    <main style={{ fontFamily: 'sans-serif', color: '#333', background: '#fefefe' }}>
      <Header />
      <section style={{ padding: '2rem 1rem', backgroundColor: '#f6f6f6', textAlign: 'center' }}>
        <div style={{
          margin: 'auto',
          width: '100%',
          maxWidth: '800px',
          height: '300px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '12px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
        }}>
          <Image
            src={carouselImages[index]}
            alt="Carrossel"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <button style={{
          marginTop: '20px',
          backgroundColor: '#f8bebe',
          border: 'none',
          borderRadius: '6px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          Quero Adotar um Animal
        </button>
      </section>
      <section style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h2 style={{
          fontSize: '22px',
          marginBottom: '2rem',
          fontWeight: '500',
          color: '#444'
        }}>
          Animais Disponíveis para Adoção
        </h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '30px'
        }}>
          {cards.map((animal, i) => (
            <div key={i} style={{
              width: '260px',
              backgroundColor: '#fff',
              border: '1px solid #eee',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              overflow: 'hidden',
              textAlign: 'left'
            }}>
              <Image src={animal.src} alt={animal.name} width={260} height={180} style={{ objectFit: 'cover' }} />
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 8px', fontSize: '18px' }}>{animal.name}</h3>
                <p style={{ fontSize: '14px', color: '#555' }}>{animal.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section style={{ textAlign: 'center', padding: '40px 0', backgroundColor: '#f1f1f1' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '2rem', color: '#444' }}>Por que Adotar um Cachorro?</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          {reasons.map((msg, i) => (
            <div key={i} style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '20px', borderRadius: '10px', width: '280px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              <p style={{ color: '#555', lineHeight: '1.5' }}>{msg}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
