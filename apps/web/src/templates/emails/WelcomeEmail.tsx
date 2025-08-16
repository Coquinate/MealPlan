import React from 'react';

interface WelcomeEmailProps {
  email: string;
  isEarlyBird: boolean;
}

/**
 * Welcome Email Template Component
 * Can be used with React Email library for better email rendering
 * Currently, the HTML is embedded in the Edge Function for simplicity
 */
export function WelcomeEmail({ email, isEarlyBird }: WelcomeEmailProps) {
  const baseStyles = {
    fontFamily: "'Inter', system-ui, sans-serif",
    lineHeight: 1.6,
    color: '#1a1a1a',
  };

  const containerStyles = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  };

  const headerStyles = {
    background: 'linear-gradient(135deg, #00b4a6 0%, #00d9ca 100%)',
    color: 'white',
    padding: '30px',
    borderRadius: '10px 10px 0 0',
    textAlign: 'center' as const,
  };

  const contentStyles = {
    background: 'white',
    padding: '30px',
    border: '1px solid #e5e5e5',
    borderRadius: '0 0 10px 10px',
  };

  const badgeStyles = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: 'bold',
    margin: '10px 0',
  };

  const buttonStyles = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #00b4a6 0%, #00d9ca 100%)',
    color: 'white',
    padding: '12px 30px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    margin: '20px 0',
  };

  const benefitStyles = {
    padding: '15px',
    margin: '10px 0',
    background: '#f8f9fa',
    borderLeft: '4px solid #00b4a6',
  };

  const footerStyles = {
    textAlign: 'center' as const,
    padding: '20px',
    color: '#666',
    fontSize: '14px',
  };

  if (isEarlyBird) {
    return (
      <div style={baseStyles}>
        <div style={containerStyles}>
          <div style={headerStyles}>
            <h1 style={{ margin: 0, fontSize: '28px' }}>🌟 Felicitări! Ești Early Bird!</h1>
            <div style={badgeStyles}>Primii 500 Utilizatori</div>
          </div>

          <div style={contentStyles}>
            <p>Salut și bine ai venit în familia Coquinate!</p>

            <p>
              Ești printre <strong>primii 500 de utilizatori</strong> care au crezut în viziunea
              noastră de a transforma modul în care familiile din România planifică și gătesc
              mâncarea.
            </p>

            <div style={benefitStyles}>
              <strong>🎁 Beneficiile tale Early Bird:</strong>
              <ul>
                <li>Acces gratuit pentru primele 3 luni după lansare</li>
                <li>Reducere permanentă de 30% la abonament</li>
                <li>Acces prioritar la funcții noi</li>
                <li>Influență directă asupra dezvoltării platformei</li>
              </ul>
            </div>

            <p>
              În curând vei primi un email cu detalii despre lansarea oficială și cum să îți
              activezi beneficiile exclusive.
            </p>

            <p>
              Între timp, ne-ar ajuta enorm dacă ai împărtăși Coquinate cu prietenii și familia ta.
              Cu cât suntem mai mulți, cu atât putem crea o experiență mai bună pentru toți!
            </p>

            <div style={{ textAlign: 'center' }}>
              <a href="https://coquinate.ro" style={buttonStyles}>
                Vizitează Site-ul
              </a>
            </div>

            <p>Mulțumim că faci parte din această călătorie!</p>

            <p>
              Cu drag,
              <br />
              <strong>Echipa Coquinate</strong>
            </p>
          </div>

          <div style={footerStyles}>
            <p>Ai primit acest email pentru că te-ai înscris pe coquinate.ro</p>
            <p>© 2025 Coquinate. Toate drepturile rezervate.</p>
          </div>
        </div>
      </div>
    );
  }

  // Regular user email
  return (
    <div style={baseStyles}>
      <div style={containerStyles}>
        <div style={headerStyles}>
          <h1 style={{ margin: 0, fontSize: '28px' }}>Bine ai venit la Coquinate!</h1>
        </div>

        <div style={contentStyles}>
          <p>Salut și mulțumim că te-ai alăturat comunității Coquinate!</p>

          <p>
            Suntem încântați să te avem alături în misiunea noastră de a face planificarea meselor
            mai simplă și mai plăcută pentru familiile din România.
          </p>

          <div style={benefitStyles}>
            <strong>Ce urmează:</strong>
            <ul>
              <li>Te vom anunța imediat ce lansăm platforma</li>
              <li>Vei primi sfaturi exclusive despre planificarea meselor</li>
              <li>Acces la rețete și idei de meniuri săptămânale</li>
              <li>Oferte speciale pentru abonații din lista de așteptare</li>
            </ul>
          </div>

          <p>
            Lansarea oficială este foarte aproape! Pregătește-te să spui adio întrebării zilnice "Ce
            gătim azi?" și să economisești ore prețioase în fiecare săptămână.
          </p>

          <div style={{ textAlign: 'center' }}>
            <a href="https://coquinate.ro" style={buttonStyles}>
              Vizitează Site-ul
            </a>
          </div>

          <p>
            Dacă ai întrebări sau sugestii, nu ezita să ne scrii. Feedback-ul tău ne ajută să creăm
            cea mai bună experiență posibilă!
          </p>

          <p>
            Cu drag,
            <br />
            <strong>Echipa Coquinate</strong>
          </p>
        </div>

        <div style={footerStyles}>
          <p>Ai primit acest email pentru că te-ai înscris pe coquinate.ro</p>
          <p>© 2025 Coquinate. Toate drepturile rezervate.</p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeEmail;
