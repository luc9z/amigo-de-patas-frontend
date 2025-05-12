'use client';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#fafafa',
      padding: '2rem 1rem',
      borderTop: '1px solid #eee',
      marginTop: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        color: '#666'
      }}>
        <div>
          <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Amigo de Patas</h4>
          <p style={{ maxWidth: '300px' }}>
            Nossa missão é conectar animais resgatados com pessoas dispostas a oferecer um lar cheio de amor.
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Contato</h4>
          <p>Email: contato@amigodepatas.com.br</p>
          <p>Telefone: (55) 99999-9999</p>
        </div>
        <div>
          <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>Redes Sociais</h4>
          <p>Instagram: @amigodepatas</p>
          <p>Facebook: fb.com/amigodepatas</p>
        </div>
      </div>
    </footer>
  );
}
