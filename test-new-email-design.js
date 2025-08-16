import { Resend } from 'resend';

const resend = new Resend('re_jifEnvGQ_ADWmYX46NgX6QdNXGk2pdmti');

async function testNewDesign() {
  try {
    const response = await fetch(
      'https://hkghwdexiobvaoqkpxqj.supabase.co/functions/v1/send-welcome-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZ2h3ZGV4aW9idmFvcWtweHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NzYzMjYsImV4cCI6MjA2ODI1MjMyNn0.6B-3IQtTYVeb9ZQWsa1dBPYWLZlEhJeZlOJbwHLycbU',
          'x-function-secret': 'coquinate-welcome-email-secret-2025-early-bird',
        },
        body: JSON.stringify({
          email: 'administrator@coquinate.com',
          isEarlyBird: true,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Email Early Bird trimis cu noul design!');
      console.log('Response:', data);
    } else {
      console.error('❌ Eroare:', data);
    }
  } catch (error) {
    console.error('❌ Eroare:', error);
  }
}

testNewDesign();
