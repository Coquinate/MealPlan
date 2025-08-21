'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation('common');
  return (
    <div className="min-h-screen bg-surface">
      {/* Navigation */}
      <nav className="border-b border-border-default bg-surface-raised sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">{t('error.general.backToPrivacy')}</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 lg:py-12">
        <article className="prose prose-lg mx-auto max-w-4xl">
          <h1 className="text-4xl font-display font-bold text-text-primary mb-2">
            Politica de Confidențialitate - Coquinate
          </h1>

          <p className="text-text-secondary">
            <strong>Ultima actualizare:</strong> 16 August 2025
            <br />
            <strong>Intrare în vigoare:</strong> La lansare
          </p>

          <section className="mt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              1. Informații despre Operatorul de Date
            </h2>
            <p className="text-text-primary">
              <strong>Denumire:</strong> Coquinate SRL (în curs de înființare)
              <br />
              <strong>Adresa:</strong> [Va fi completată la înregistrare]
              <br />
              <strong>Email:</strong> contact@coquinate.ro
              <br />
              <strong>Telefon:</strong> [Va fi completat]
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              2. Ce Date Personale Colectăm
            </h2>

            <h3 className="text-xl font-display font-medium text-text-primary mt-6">
              2.1 Pentru Lista de Așteptare (Pre-lansare)
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-text-primary">
              <li>
                <strong>Adresa de email:</strong> Pentru a vă notifica despre lansarea serviciului
              </li>
              <li>
                <strong>Data și ora înscrierii:</strong> Pentru sistemul early bird (primii 500
                utilizatori)
              </li>
              <li>
                <strong>Adresa IP:</strong> Pentru prevenirea abuzurilor și rate limiting
              </li>
              <li>
                <strong>Consimțământul GDPR:</strong> Data și ora acordării consimțământului
              </li>
            </ul>

            <h3 className="text-xl font-display font-medium text-text-primary mt-6">
              2.2 Pentru Serviciul Complet (După lansare)
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-text-primary">
              <li>
                <strong>Informații de cont:</strong> Nume, email, parolă (criptată)
              </li>
              <li>
                <strong>Informații gospodărie:</strong> Numărul de persoane, preferințe alimentare
              </li>
              <li>
                <strong>Istoric utilizare:</strong> Rețete salvate, planuri de mese generate
              </li>
              <li>
                <strong>Informații de plată:</strong> Procesate securizat prin Stripe (nu stocăm
                detalii card)
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              3. Baza Legală pentru Procesare
            </h2>
            <p className="text-text-primary">Procesăm datele dumneavoastră pe baza:</p>
            <ul className="list-disc pl-6 space-y-2 text-text-primary">
              <li>
                <strong>Consimțământ</strong> (Art. 6(1)(a) GDPR): Pentru comunicări de marketing și
                lista de așteptare
              </li>
              <li>
                <strong>Contract</strong> (Art. 6(1)(b) GDPR): Pentru furnizarea serviciului după
                înregistrare
              </li>
              <li>
                <strong>Interes legitim</strong> (Art. 6(1)(f) GDPR): Pentru îmbunătățirea
                serviciului și securitate
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              4. Cum Folosim Datele Dumneavoastră
            </h2>
            <p className="text-text-primary">Folosim datele colectate pentru:</p>
            <ul className="list-disc pl-6 space-y-2 text-text-primary">
              <li>Trimiterea notificării de lansare și oferte early bird</li>
              <li>Crearea și gestionarea contului dumneavoastră</li>
              <li>Personalizarea planurilor de mese conform preferințelor</li>
              <li>Comunicări despre serviciu (actualizări, funcții noi)</li>
              <li>Îmbunătățirea serviciului prin analiză agregată</li>
              <li>Respectarea obligațiilor legale</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              5. Partajarea Datelor cu Terți
            </h2>
            <p className="text-text-primary">Datele dumneavoastră pot fi partajate cu:</p>
            <ul className="list-disc pl-6 space-y-2 text-text-primary">
              <li>
                <strong>Supabase</strong> (USA/EU): Infrastructură bază de date (sub-procesor)
              </li>
              <li>
                <strong>Resend/SendGrid</strong> (EU): Serviciu trimitere emailuri (sub-procesor)
              </li>
              <li>
                <strong>Stripe</strong> (EU): Procesare plăți (procesor independent)
              </li>
              <li>
                <strong>Vercel</strong> (USA/EU): Hosting website (sub-procesor)
              </li>
            </ul>
            <p className="text-text-primary mt-4">
              Toți partenerii sunt conformi GDPR și au acorduri de procesare date.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              6. Transferuri Internaționale
            </h2>
            <p className="text-text-primary">
              Unele servicii folosite pot transfera date în afara SEE. Asigurăm protecție adecvată
              prin:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-primary">
              <li>Clauze contractuale standard UE</li>
              <li>EU-US Data Privacy Framework (pentru transferuri către SUA)</li>
              <li>Măsuri tehnice și organizatorice adecvate</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              7. Perioada de Păstrare a Datelor
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-text-primary">
              <li>
                <strong>Email listă așteptare:</strong> Până la lansare + 6 luni (sau până la
                dezabonare)
              </li>
              <li>
                <strong>Date cont activ:</strong> Pe durata contractului + 30 zile
              </li>
              <li>
                <strong>Date cont inactiv:</strong> Maxim 2 ani de la ultima activitate
              </li>
              <li>
                <strong>Date financiare:</strong> 10 ani (obligație legală)
              </li>
              <li>
                <strong>Loguri securitate:</strong> 90 zile
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              8. Drepturile Dumneavoastră
            </h2>
            <p className="text-text-primary">Conform GDPR, aveți dreptul să:</p>
            <ul className="list-disc pl-6 space-y-2 text-text-primary">
              <li>
                <strong>Accesați</strong> datele personale pe care le deținem (Art. 15)
              </li>
              <li>
                <strong>Rectificați</strong> date incorecte (Art. 16)
              </li>
              <li>
                <strong>Ștergeți</strong> datele ("dreptul de a fi uitat") (Art. 17)
              </li>
              <li>
                <strong>Restricționați</strong> procesarea (Art. 18)
              </li>
              <li>
                <strong>Portabilitatea</strong> datelor către alt serviciu (Art. 20)
              </li>
              <li>
                <strong>Vă opuneți</strong> procesării (Art. 21)
              </li>
              <li>
                <strong>Retrageți consimțământul</strong> oricând (Art. 7)
              </li>
            </ul>
            <p className="text-text-primary mt-4">
              Pentru exercitarea drepturilor:{' '}
              <a
                href="mailto:gdpr@coquinate.ro"
                className="text-primary hover:text-primary-hover underline"
              >
                gdpr@coquinate.ro
              </a>
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              9. Securitatea Datelor
            </h2>
            <p className="text-text-primary">Implementăm măsuri de securitate precum:</p>
            <ul className="list-disc pl-6 space-y-2 text-text-primary">
              <li>Criptare SSL/TLS pentru toate transmisiile</li>
              <li>Criptare bcrypt pentru parole</li>
              <li>Row Level Security (RLS) în baza de date</li>
              <li>Rate limiting pentru prevenirea abuzurilor</li>
              <li>Backup-uri regulate criptate</li>
              <li>Acces restricționat pe bază de rol</li>
              <li>Monitorizare și logging securitate</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              10. Cookie-uri
            </h2>
            <p className="text-text-primary">Folosim cookie-uri esențiale pentru:</p>
            <ul className="list-disc pl-6 space-y-2 text-text-primary">
              <li>Menținerea sesiunii de autentificare</li>
              <li>Preferințe limbă (română/engleză)</li>
              <li>Securitate (CSRF protection)</li>
            </ul>
            <p className="text-text-primary mt-4">Cookie-uri analitice (opționale):</p>
            <ul className="list-disc pl-6 space-y-2 text-text-primary">
              <li>Vercel Analytics pentru performanță site</li>
              <li>Necesită consimțământ separat</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              11. Marketing și Comunicări
            </h2>

            <h3 className="text-xl font-display font-medium text-text-primary mt-6">
              Email-uri Pre-lansare
            </h3>
            <p className="text-text-primary">Cu consimțământul dvs., vă vom trimite:</p>
            <ul className="list-disc pl-6 space-y-2 text-text-primary">
              <li>Notificare unică de lansare</li>
              <li>Oferta early bird (primii 500)</li>
              <li>Maximum 2 email-uri pregătitoare</li>
            </ul>

            <h3 className="text-xl font-display font-medium text-text-primary mt-6">
              Email-uri Post-lansare
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-text-primary">
              <li>Confirmare înregistrare</li>
              <li>Planuri săptămânale (funcționalitate serviciu)</li>
              <li>Actualizări importante serviciu</li>
              <li>Newsletter lunar (opțional)</li>
            </ul>
            <p className="text-text-primary mt-4">Puteți dezabona oricând via link din email.</p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">12. Minori</h2>
            <p className="text-text-primary">
              Serviciul nu se adresează persoanelor sub 16 ani. Nu colectăm intenționat date de la
              minori. Dacă aflăm că am colectat date de la un minor, le vom șterge imediat.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              13. Modificări ale Politicii
            </h2>
            <p className="text-text-primary">
              Vom notifica prin email despre modificări semnificative cu 30 zile înainte de intrarea
              în vigoare. Versiunile anterioare vor fi arhivate public.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              14. Autoritatea de Supraveghere
            </h2>
            <p className="text-text-primary">Aveți dreptul să depuneți plângere la:</p>
            <div className="bg-surface-raised border border-border-default rounded-lg p-6 mt-4">
              <p className="text-text-primary">
                <strong>
                  Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal
                  (ANSPDCP)
                </strong>
                <br />
                B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, București
                <br />
                <a
                  href="mailto:anspdcp@dataprotection.ro"
                  className="text-primary hover:text-primary-hover underline"
                >
                  anspdcp@dataprotection.ro
                </a>
                <br />
                +40.318.059.211
              </p>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              15. Contact pentru Protecția Datelor
            </h2>
            <p className="text-text-primary">Pentru întrebări despre confidențialitate:</p>
            <ul className="list-disc pl-6 space-y-2 text-text-primary">
              <li>
                Email:{' '}
                <a
                  href="mailto:gdpr@coquinate.ro"
                  className="text-primary hover:text-primary-hover underline"
                >
                  gdpr@coquinate.ro
                </a>
              </li>
              <li>
                Email general:{' '}
                <a
                  href="mailto:contact@coquinate.ro"
                  className="text-primary hover:text-primary-hover underline"
                >
                  contact@coquinate.ro
                </a>
              </li>
              <li>Adresă: [Va fi completată]</li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">16. Definiții</h2>
            <ul className="list-disc pl-6 space-y-2 text-text-primary">
              <li>
                <strong>Date personale:</strong> Orice informație despre o persoană fizică
                identificată sau identificabilă
              </li>
              <li>
                <strong>Procesare:</strong> Orice operațiune asupra datelor personale
              </li>
              <li>
                <strong>Consimțământ:</strong> Acord liber, specific, informat și neambiguu
              </li>
              <li>
                <strong>Early bird:</strong> Primii 500 utilizatori înregistrați
              </li>
            </ul>
          </section>

          <section className="mt-8 border-t border-border-default pt-8">
            <h2 className="text-2xl font-display font-semibold text-text-primary">Consimțământ</h2>
            <p className="text-text-primary">
              Prin bifarea căsuței "Sunt de acord cu Politica de Confidențialitate", confirmați că:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-text-primary">
              <li>Ați citit și înțeles această politică</li>
              <li>Sunteți de acord cu procesarea datelor descrisă</li>
              <li>Înțelegeți că puteți retrage consimțământul oricând</li>
            </ul>
          </section>

          <div className="mt-12 pt-8 border-t border-border-default">
            <p className="text-sm text-text-muted italic">
              Acest document respectă cerințele Regulamentului General privind Protecția Datelor
              (GDPR) - Regulamentul (UE) 2016/679 și legislația română aplicabilă.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
