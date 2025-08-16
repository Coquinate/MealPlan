/**
 * Email notification utility for admin error alerts
 * Uses Resend as email service provider
 */

export interface EmailAlert {
  to: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, unknown>;
}

export interface EmailConfig {
  apiKey?: string;
  fromEmail: string;
  toEmail: string;
  enableEmails: boolean;
}

/**
 * Creates email configuration from environment variables
 */
export function createEmailConfig(): EmailConfig {
  return {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: process.env.FROM_EMAIL || 'admin@coquinate.ro',
    toEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@coquinate.ro',
    enableEmails: process.env.ENABLE_EMAIL_ALERTS === 'true',
  };
}

/**
 * Formats error context for email display
 */
function formatErrorForEmail(error: string, context?: Record<string, unknown>): string {
  let message = `🚨 ALERTĂ EROARE ADMINISTRATOR 🚨\n\n`;
  message += `Eroare: ${error}\n\n`;
  message += `Timp: ${new Date().toLocaleString('ro-RO')}\n\n`;

  if (context) {
    message += `Context:\n`;
    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'object') {
        message += `${key}: ${JSON.stringify(value, null, 2)}\n`;
      } else {
        message += `${key}: ${value}\n`;
      }
    }
  }

  message += `\n---\nCoquinate - Dashboard Administrare`;

  return message;
}

/**
 * Sends email notification (browser environment - calls API)
 */
export async function sendEmailAlert(
  error: string,
  priority: EmailAlert['priority'] = 'medium',
  context?: Record<string, unknown>
): Promise<boolean> {
  const config = createEmailConfig();

  if (!config.enableEmails) {
    console.log('📧 Alerte email dezactivate, se loghează:', { error, priority, context });
    return false;
  }

  try {
    const subject = `[${priority.toUpperCase()}] Eroare Administrator - ${error.substring(0, 50)}...`;
    const message = formatErrorForEmail(error, context);

    // In browser environment, call API endpoint
    if (typeof window !== 'undefined') {
      const response = await fetch('/api/send-error-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          message,
          priority,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error(`Eroare API email: ${response.status}`);
      }

      console.log('✅ Email-ul de alertă administrator trimis cu succes');
      return true;
    }

    console.log('📧 Alertă email preparată:', { subject, priority });
    return false;
  } catch (emailError) {
    console.error('❌ Eșec la trimiterea email-ului de alertă administrator:', emailError);
    return false;
  }
}

/**
 * Sends email notification (server environment - direct Resend call)
 */
export async function sendServerEmailAlert(
  error: string,
  priority: EmailAlert['priority'] = 'medium',
  context?: Record<string, unknown>
): Promise<boolean> {
  const config = createEmailConfig();

  if (!config.enableEmails || !config.apiKey) {
    console.log('📧 Alerte email server dezactivate sau lipsește cheia API');
    return false;
  }

  try {
    const subject = `[${priority.toUpperCase()}] Eroare Administrator - ${error.substring(0, 50)}...`;
    const message = formatErrorForEmail(error, context);

    // Direct Resend API call for server environments
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: config.fromEmail,
        to: config.toEmail,
        subject,
        text: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Eroare API Resend: ${response.status}`);
    }

    console.log('✅ Email de alertă administrator server trimis cu succes');
    return true;
  } catch (emailError) {
    console.error('❌ Eșec la trimiterea email-ului de alertă administrator server:', emailError);
    return false;
  }
}

/**
 * Discord webhook alternative for admin alerts
 */
export async function sendDiscordAlert(
  error: string,
  priority: EmailAlert['priority'] = 'medium',
  context?: Record<string, unknown>
): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  const enableDiscord = process.env.DISCORD_ADMIN_ERRORS === 'true';

  if (!enableDiscord || !webhookUrl) {
    console.log('🔔 Alerte Discord dezactivate sau lipsește URL-ul webhook');
    return false;
  }

  try {
    const priorityEmojis = {
      low: '🟡',
      medium: '🟠',
      high: '🔴',
      critical: '🚨',
    };

    const priorityLabels = {
      low: 'Scăzut',
      medium: 'Mediu',
      high: 'Ridicat',
      critical: 'Critic',
    };

    const embed = {
      title: `${priorityEmojis[priority]} Alertă Eroare Administrator - ${priorityLabels[priority]}`,
      description: error,
      color: priority === 'critical' ? 16711680 : priority === 'high' ? 16753920 : 16776960,
      fields: context
        ? Object.entries(context).map(([key, value]) => ({
            name: key,
            value: typeof value === 'object' ? JSON.stringify(value) : String(value),
            inline: true,
          }))
        : [],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Coquinate - Dashboard Administrare',
      },
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      throw new Error(`Eroare webhook Discord: ${response.status}`);
    }

    console.log('✅ Alertă administrator Discord trimisă cu succes');
    return true;
  } catch (discordError) {
    console.error('❌ Eșec la trimiterea alertei administrator Discord:', discordError);
    return false;
  }
}
