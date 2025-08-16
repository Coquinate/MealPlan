import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@coquinate/ui';

export function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-surface">
      <div className="bg-admin-surface-raised p-8 rounded-card shadow-card max-w-md w-full text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-admin-text mb-2">Acces Neautorizat</h1>
        <p className="text-admin-text-secondary mb-6">
          Nu aveți permisiunea necesară pentru a accesa această pagină. Contactați administratorul
          sistemului dacă credeți că aceasta este o eroare.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="primary" onClick={() => navigate('/admin/login')}>
            Înapoi la Autentificare
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Pagina Principală
          </Button>
        </div>
      </div>
    </div>
  );
}
