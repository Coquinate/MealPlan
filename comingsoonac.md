User Story: Landing Page "Coming Soon" pentru Coquinate
Ca vizitator interesat de serviciul Coquinate,
Vreau să accesez o pagină de pre-lansare clară, atractivă și de încredere,
Pentru a înțelege rapid beneficiile, a mă înscrie pe lista de așteptare și a primi o ofertă valoroasă.

Criterii de Acceptare (Acceptance Criteria)

1. Tehnic & SEO
   AC 1.1: Viteză de Încărcare

Dat fiind un utilizator cu o conexiune 4G,

Când accesează URL-ul paginii,

Atunci pagina trebuie să se încarce complet (Largest Contentful Paint) în mai puțin de 2 secunde.

AC 1.2: Optimizare SEO On-Page

Dat fiind un motor de căutare care indexează pagina,

Când analizează codul sursă,

Atunci trebuie să găsească:

Un singur tag <h1>.

Un tag <title> setat la: Coquinate - Planificarea inteligentă a meselor pentru familiile din România.

Un tag <meta name="description"> cu conținut relevant.

Tag-uri link pentru favicon în format .ico, .svg și apple-touch-icon.

2. Legal & Încredere (GDPR)
   AC 2.1: Consimțământ GDPR

Dat fiind un utilizator care dorește să se înscrie,

Când completează adresa de e-mail,

Atunci butonul de trimitere ("Prinde oferta!") trebuie să fie inactiv (disabled) până când căsuța de consimțământ GDPR este bifată.

AC 2.2: Acces la Politica de Confidențialitate

Dat fiind un utilizator pe pagină,

Când face click pe link-ul "Politică de Confidențialitate" din footer sau de lângă căsuța de consimțământ,

Atunci se va deschide într-un tab nou pagina dedicată politicii de confidențialitate.

3. Experiența Utilizatorului (UX) - Formular
   AC 3.1: Validare E-mail în Timp Real

Dat fiind un utilizator care completează formularul,

Când introduce un text care nu respectă formatul standard de e-mail (ex: "test@test"),

Atunci câmpul de e-mail trebuie să afișeze o eroare vizuală (ex: o bordură roșie) și un mesaj de ajutor, fără a fi necesară reîncărcarea paginii.

AC 3.2: Feedback la Înscriere cu Succes

Dat fiind un utilizator care a completat corect e-mailul și a bifat consimțământul,

Când apasă pe butonul "Prinde oferta!",

Atunci întregul bloc al formularului (#capture-container) trebuie să fie înlocuit cu:

Un mesaj de succes clar: "Mulțumim pentru înscriere! Vei primi un e-mail de confirmare în curând."

O secțiune de partajare pe rețelele sociale (Facebook, WhatsApp).

4. Strategia Post-Înscriere (Backend & Email)
   AC 4.1: Salvarea E-mailului în Baza de Date

Dat fiind o înscriere cu succes prin formular,

Când datele sunt trimise către backend (Supabase),

Atunci adresa de e-mail trebuie să fie salvată într-un tabel dedicat, împreună cu un timestamp și un flag care indică dacă face parte din primii 500 de înscriși.

AC 4.2: Trimiterea E-mailului de Confirmare Automat

Dat fiind o nouă înregistrare în baza de date,

Când înregistrarea este confirmată,

Atunci un trigger (Supabase Function) trebuie să apeleze serviciul SendGrid pentru a trimite automat e-mailul de confirmare HTML corespunzător (varianta "early bird" sau varianta standard), către adresa de e-mail furnizată.
