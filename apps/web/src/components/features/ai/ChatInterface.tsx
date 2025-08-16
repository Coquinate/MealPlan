'use client';

import { useChat } from 'ai/react';
import type { Message } from 'ai';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface ChatInterfaceProps {
  initialMessages?: Message[];
  systemPrompt?: string;
  onError?: (error: Error) => void;
  recipeId?: string;
  className?: string;
}

export default function ChatInterface({
  initialMessages = [],
  systemPrompt,
  onError,
  recipeId,
  className = '',
}: ChatInterfaceProps) {
  const { t } = useTranslation('ai');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState({
    remaining: 60,
    resetIn: 0,
    limit: 60,
  });

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
    setMessages,
  } = useChat({
    api: '/api/ai/chat',
    initialMessages,
    body: {
      systemPrompt,
      recipeId,
    },
    onError: (error) => {
      console.error('Chat error:', error);
      onError?.(error);
    },
    onFinish: () => {
      updateRateLimitInfo();
    },
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateRateLimitInfo = async () => {
    try {
      // Fetch rate limit info from server-side API
      const response = await fetch('/api/ai/rate-limit');
      if (response.ok) {
        const info = await response.json();
        setRateLimitInfo(info);
      }
    } catch (error) {
      console.error('Failed to get rate limit info:', error);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleRetry = () => {
    if (messages.length > 0) {
      reload();
    }
  };

  const handleStopGeneration = () => {
    stop();
  };

  const getRateLimitMessage = () => {
    if (rateLimitInfo.remaining === 0) {
      const seconds = Math.ceil(rateLimitInfo.resetIn / 1000);
      return t('error.rateLimit', { seconds });
    }
    return null;
  };

  const showWelcomeMessage = messages.length === 0 && !isLoading;
  const rateLimitMessage = getRateLimitMessage();

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">{t('chat.title')}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {t('status.ready')} ({rateLimitInfo.remaining}/{rateLimitInfo.limit})
          </span>
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              title={t('tooltip.clear')}
            >
              {t('chat.clear')}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {showWelcomeMessage && (
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg mb-2">{t('message.welcome')}</p>
            <p className="text-sm">{t('message.empty')}</p>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLoading={isLoading && message === messages[messages.length - 1]}
            onRetry={handleRetry}
            onCopy={() => {}}
          />
        ))}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error.message || t('error.generic')}</p>
            <button
              onClick={handleRetry}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              {t('chat.retry')}
            </button>
          </div>
        )}

        {rateLimitMessage && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">{rateLimitMessage}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        input={input}
        isLoading={isLoading}
        disabled={rateLimitInfo.remaining === 0}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onStop={handleStopGeneration}
        placeholder={t('chat.placeholder')}
      />
    </div>
  );
}
