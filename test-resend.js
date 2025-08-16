import { Resend } from 'resend';

const resend = new Resend('re_jifEnvGQ_ADWmYX46NgX6QdNXGk2pdmti');

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'administrator@coquinate.com',
      subject: 'Test Coquinate - Email funcționează! 🎉',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #00b4a6;">Salut de la Coquinate!</h1>
          <p>Felicitări! Sistemul de email <strong>funcționează perfect</strong>!</p>
          <p>Acesta este un email de test trimis prin Resend API.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">
            Trimis la: ${new Date().toLocaleString('ro-RO')}<br>
            API Key: re_jif...dmti<br>
            De la: onboarding@resend.dev
          </p>
        </div>
      `,
    });

    console.log('✅ Email trimis cu succes!');
    console.log('ID mesaj:', data.data?.id);
  } catch (error) {
    console.error('❌ Eroare la trimiterea email-ului:', error);
  }
}

testEmail();
