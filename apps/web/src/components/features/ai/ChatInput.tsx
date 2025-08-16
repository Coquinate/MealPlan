'use client';

import { useTranslation } from 'react-i18next';
import { useRef, useEffect, KeyboardEvent } from 'react';

interface ChatInputProps {
  input: string;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onStop?: () => void;
  className?: string;
}

export default function ChatInput({
  input,
  isLoading = false,
  disabled = false,
  placeholder,
  maxLength = 1000,
  onInputChange,
  onSubmit,
  onStop,
  className = '',
}: ChatInputProps) {
  const { t } = useTranslation('ai');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading && !disabled) {
        const form = e.currentTarget.form;
        if (form) {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          form.dispatchEvent(submitEvent);
        }
      }
    }
  };

  const getPlaceholderText = () => {
    if (disabled) return t('error.generic');
    if (isLoading) return t('status.streaming');
    return placeholder || t('chat.placeholder');
  };

  const getCharacterCount = () => {
    const remaining = maxLength - input.length;
    if (remaining < 100) {
      return (
        <span className={`text-xs ${remaining < 20 ? 'text-red-500' : 'text-yellow-500'}`}>
          {remaining}
        </span>
      );
    }
    return null;
  };

  return (
    <form onSubmit={onSubmit} className={`border-t bg-white p-4 ${className}`}>
      <div className="relative flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholderText()}
            disabled={disabled || isLoading}
            maxLength={maxLength}
            rows={1}
            className={`
              w-full px-4 py-3 pr-12 resize-none rounded-lg border
              focus:outline-none focus:ring-2 transition-all
              ${
                disabled
                  ? 'bg-gray-100 cursor-not-allowed text-gray-500 border-gray-200'
                  : 'bg-white hover:border-gray-300 focus:ring-blue-500 focus:border-transparent'
              }
              ${isLoading ? 'opacity-75' : ''}
            `}
            style={{
              minHeight: '48px',
              maxHeight: '200px',
            }}
          />

          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            {getCharacterCount()}

            {input.length > 0 && !isLoading && !disabled && (
              <button
                type="button"
                onClick={() => {
                  const event = new Event('input', { bubbles: true });
                  if (textareaRef.current) {
                    textareaRef.current.value = '';
                    textareaRef.current.dispatchEvent(event);
                  }
                }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title={t('chat.clear')}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 min-w-[100px] justify-center"
            title={t('tooltip.stop')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            </svg>
            {t('action.stop')}
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className={`
              px-4 py-3 rounded-lg transition-all flex items-center gap-2 min-w-[100px] justify-center
              ${
                !input.trim() || disabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md'
              }
            `}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            {t('chat.send')}
          </button>
        )}
      </div>

      {isLoading && (
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <div
              className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '200ms' }}
            />
            <div
              className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: '400ms' }}
            />
          </div>
          {t('status.streaming')}
        </div>
      )}
    </form>
  );
}
