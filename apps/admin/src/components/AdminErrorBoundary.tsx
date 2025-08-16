import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logComponentError, sendEmailAlert, sendDiscordAlert } from '@coquinate/shared';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@coquinate/ui';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  alertsSent: boolean;
  sendingAlerts: boolean;
  retryDisabled: boolean;
}

/**
 * Error boundary for Admin Dashboard with immediate alert system
 * Sends critical alerts via email and Discord for admin errors
 */
export class AdminErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    alertsSent: false,
    sendingAlerts: false,
    retryDisabled: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, alertsSent: false, sendingAlerts: true, retryDisabled: false };
  }

  public async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error with structured logging
    await logComponentError(
      error,
      {
        componentStack: errorInfo.componentStack || undefined,
      },
      'AdminErrorBoundary'
    );

    this.setState({ errorInfo });

    // Send immediate alerts for admin errors (critical priority)
    await this.sendAdminAlerts(error, errorInfo);
  }

  private async sendAdminAlerts(error: Error, errorInfo: ErrorInfo) {
    if (this.state.alertsSent || this.state.sendingAlerts) {
      return; // Prevent duplicate alerts
    }

    this.setState({ sendingAlerts: true });

    const alertContext = {
      component: 'AdminErrorBoundary',
      componentStack: errorInfo.componentStack,
      errorStack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Send alerts in parallel with timeout to prevent UI blocking
    const alertMessage = `Admin Dashboard Error: ${error.message}`;
    const ALERT_TIMEOUT = 5000; // 5 second timeout

    const timeoutPromise = (promise: Promise<any>, timeout: number) => {
      return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Alert timeout')), timeout)),
      ]);
    };

    try {
      // Send alerts in parallel with timeout protection
      const alertPromises = [
        timeoutPromise(
          sendDiscordAlert(alertMessage, 'critical', alertContext),
          ALERT_TIMEOUT
        ).catch(() => false),
        timeoutPromise(sendEmailAlert(alertMessage, 'critical', alertContext), ALERT_TIMEOUT).catch(
          () => false
        ),
      ];

      const [discordSent, emailSent] = await Promise.all(alertPromises);

      if (discordSent || emailSent) {
        this.setState({ alertsSent: true, sendingAlerts: false });
        console.log('✅ Admin error alerts sent successfully');
      } else {
        this.setState({ sendingAlerts: false });
        console.warn('⚠️ Failed to send admin error alerts - check configuration');
      }
    } catch (alertError) {
      this.setState({ sendingAlerts: false });
      console.error('❌ Error sending admin alerts:', alertError);
      // Don't block UI even if alerts fail
    }
  }

  private handleRetry = () => {
    if (this.state.retryDisabled) {
      return;
    }

    // Debounce retry button for 2 seconds
    this.setState({ retryDisabled: true });
    setTimeout(() => {
      this.setState({ retryDisabled: false });
    }, 2000);

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      alertsSent: false,
      sendingAlerts: false,
    });
  };

  private getSeverityIcon(severity: 'critical' | 'high' | 'medium' | 'low' = 'critical') {
    switch (severity) {
      case 'critical':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'high':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'low':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  }

  private getSeverityColorClasses(severity: 'critical' | 'high' | 'medium' | 'low' = 'critical') {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
    }
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI for admin errors
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const severityColorClasses = this.getSeverityColorClasses('critical');
      const severityIcon = this.getSeverityIcon('critical');

      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-space-md">
          <div className="max-w-2xl w-full">
            <Card variant="elevated" className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-space-md">
                  <div className={`p-space-sm rounded-full ${severityColorClasses}`}>
                    {severityIcon}
                  </div>
                  <div>
                    <CardTitle className="text-heading-lg text-text">
                      Eroare Critică în Panoul de Administrare
                    </CardTitle>
                    <p className="text-text-secondary mt-1">
                      A apărut o eroare neașteptată care împiedică funcționarea normală.
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-space-lg">
                {/* Error Details */}
                <div className="bg-surface-hover border border-border rounded-card p-space-md">
                  <h3 className="text-sm font-semibold text-text mb-space-xs">Detalii Tehnică:</h3>
                  <p className="text-sm text-text-secondary font-mono break-words">
                    {this.state.error?.message || 'Eroare necunoscută'}
                  </p>
                </div>

                {/* Alert Status */}
                <div
                  className={`border rounded-card p-space-md ${
                    this.state.sendingAlerts
                      ? 'bg-yellow-50 border-yellow-200'
                      : this.state.alertsSent
                        ? 'bg-green-50 border-green-200'
                        : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-space-sm">
                    <div className="flex-shrink-0">
                      {this.state.sendingAlerts ? (
                        <svg
                          className="w-5 h-5 animate-spin text-yellow-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      ) : this.state.alertsSent ? (
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          this.state.sendingAlerts
                            ? 'text-yellow-800'
                            : this.state.alertsSent
                              ? 'text-green-800'
                              : 'text-blue-800'
                        }`}
                      >
                        <strong>Status Alertă:</strong>{' '}
                        {this.state.sendingAlerts
                          ? 'Se trimit alertele către administratori...'
                          : this.state.alertsSent
                            ? 'Administratorii au fost notificați automat despre această eroare.'
                            : 'Alertele nu au putut fi trimise - verifică configurația.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-space-sm">
                  <Button
                    onClick={this.handleRetry}
                    disabled={this.state.retryDisabled}
                    loading={this.state.retryDisabled}
                    variant="primary"
                    size="md"
                    className="flex-1"
                  >
                    Încearcă Din Nou
                  </Button>
                  <Button
                    onClick={() => (window.location.href = '/')}
                    variant="secondary"
                    size="md"
                    className="flex-1"
                  >
                    Înapoi la Pagina Principală
                  </Button>
                </div>

                {/* Development Stack Trace */}
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details className="border border-border rounded-card">
                    <summary className="text-sm text-text-secondary cursor-pointer hover:text-text p-space-sm">
                      Stack Trace (Doar în Development)
                    </summary>
                    <div className="border-t border-border p-space-sm">
                      <pre className="text-xs text-text-secondary bg-surface-hover p-space-sm rounded overflow-auto">
                        {this.state.error?.stack}
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </details>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
