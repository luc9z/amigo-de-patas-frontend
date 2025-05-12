'use client';

export default function Header() {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#fff',
      borderBottom: '1px solid #eee',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '22px', color: '#333' }}>
        Amigo de Patas
      </div>
      <nav style={{ display: 'flex', gap: '1.5rem' }}>
        <a href="#" style={{ color: '#555', textDecoration: 'none' }}>Quem Somos</a>
        <a href="#" style={{ color: '#555', textDecoration: 'none' }}>Quero Adotar</a>
        <a href="#" style={{ color: '#555', textDecoration: 'none' }}>Contato</a>
      </nav>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button style={{
          background: 'transparent',
          border: '1px solid #888',
          borderRadius: '5px',
          padding: '0.4rem 0.8rem',
          cursor: 'pointer',
          color: '#555'
        }}>Entrar</button>
        <button style={{
          backgroundColor: '#f8bebe',
          border: 'none',
          borderRadius: '5px',
          padding: '0.4rem 0.8rem',
          cursor: 'pointer',
          color: '#333',
          fontWeight: '500'
        }}>Cadastrar-se</button>
      </div>
    </header>
  );
}
