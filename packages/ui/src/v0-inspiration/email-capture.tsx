import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { IconCircleCheck, IconAlertCircle, IconLoader2 } from '@tabler/icons-react';
import { ShareComponent } from './share-component';
import { ConfettiEffect } from './confetti-effect';
import { playSuccessSound } from './sound-toggle';

export function EmailCapture() {
  const [email, setEmail] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Adresa de email este obligatorie');
      setIsEmailValid(false);
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Te rog să introduci o adresă de email validă');
      setIsEmailValid(false);
      return false;
    }
    setEmailError('');
    setIsEmailValid(true);
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Only validate if user has started typing
    if (newEmail.length > 0) {
      validateEmail(newEmail);
    } else {
      setEmailError('');
      setIsEmailValid(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValidOnSubmit = validateEmail(email);

    if (!isEmailValidOnSubmit || !gdprConsent) {
      if (!gdprConsent) {
        // Could add GDPR error state here if needed
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(`Email înregistrat: ${email}`);

      setShowConfetti(true);
      playSuccessSound();

      setIsSubmitted(true);
    } catch (error) {
      setEmailError('A apărut o eroare. Te rog să încerci din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <ConfettiEffect trigger={showConfetti} />
        <div className="bg-[var(--surface-white)] rounded-xl p-4 sm:p-6 md:p-8 border border-[oklch(0_0_0_/_0.05)] shadow-[var(--shadow-soft)] animate-fade-in-up">
          <div className="bg-[#F0FAF5] text-[#2F855A] p-4 rounded-lg text-center text-sm border border-[#C6F6D5]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <IconCircleCheck size={20} className="text-[#2F855A] animate-bounce" />
              <strong>Mulțumim pentru înscriere!</strong>
            </div>
            <p>Vei primi un e-mail de confirmare în curând.</p>
          </div>

          <div className="mt-6">
            <ShareComponent />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="bg-[var(--surface-white)] rounded-xl p-4 sm:p-6 md:p-8 border border-[oklch(0_0_0_/_0.05)] shadow-[var(--shadow-soft)]">
      <h3 className="font-semibold mb-4 text-base sm:text-lg leading-snug">
        Primii 500 înscriși primesc o lună de acces gratuit!
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div className="flex-1 relative">
            <Input
              type="email"
              placeholder="adresa@email.com"
              value={email}
              onChange={handleEmailChange}
              required
              disabled={isSubmitting}
              className={`w-full py-3 sm:py-3.5 px-4 sm:px-5 border rounded-lg text-sm sm:text-base bg-[var(--surface-eggshell)] transition-all duration-200 min-h-[44px] ${
                emailError
                  ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]'
                  : isEmailValid
                    ? 'border-green-400 focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.2)]'
                    : 'border-[var(--border-light)] focus:border-[var(--primary-warm)] focus:shadow-[0_0_0_3px_oklch(58%_0.08_200_/_0.2)]'
              }`}
            />
            {email.length > 0 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isEmailValid ? (
                  <IconCircleCheck size={16} className="text-green-500" />
                ) : emailError ? (
                  <IconAlertCircle size={16} className="text-red-500" />
                ) : null}
              </div>
            )}
          </div>
          <Button
            type="submit"
            disabled={!email || !gdprConsent || isSubmitting || !isEmailValid}
            className="py-3 sm:py-3.5 px-6 sm:px-8 bg-[var(--primary-warm)] text-[var(--surface-white)] border-none rounded-lg font-semibold text-sm sm:text-base cursor-pointer transition-all duration-200 hover:bg-[var(--primary-warm-dark)] hover:transform hover:-translate-y-0.5 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none min-h-[44px] whitespace-nowrap flex items-center gap-2"
          >
            {isSubmitting && <IconLoader2 size={16} className="animate-spin" />}
            {isSubmitting ? 'Se trimite...' : 'Prinde oferta!'}
          </Button>
        </div>

        {emailError && (
          <div className="mb-3 text-red-600 text-xs sm:text-sm flex items-center gap-2">
            <IconAlertCircle size={14} />
            {emailError}
          </div>
        )}

        <div className="flex items-start gap-3 mb-4">
          <Checkbox
            id="gdpr"
            checked={gdprConsent}
            onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
            disabled={isSubmitting}
            className="mt-0.5 flex-shrink-0"
          />
          <label
            htmlFor="gdpr"
            className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed"
          >
            Sunt de acord cu{' '}
            <a
              href="/politica-de-confidentialitate.html"
              target="_blank"
              className="text-[var(--text-muted)] underline hover:text-[var(--primary-warm)] transition-colors duration-200"
              rel="noreferrer"
            >
              Politica de Confidențialitate
            </a>{' '}
            și doresc să primesc comunicări prin e-mail.
          </label>
        </div>
      </form>

      <div className="flex flex-col gap-2 text-sm text-[var(--text-muted)] mt-4">
        <div className="flex items-center gap-2">
          <span className="text-[var(--accent-coral)] font-bold">✓</span>
          <span className="text-xs sm:text-sm">
            <b>Toți înscrișii</b> primesc un trial extins la 7 zile!
          </span>
        </div>
      </div>
    </div>
  );
}
