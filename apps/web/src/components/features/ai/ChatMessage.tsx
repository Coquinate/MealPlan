'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import type { Message } from 'ai';

interface TextPart {
  type: 'text';
  text: string;
}

interface ImagePart {
  type: 'image';
  image: string;
  alt?: string;
}

type MessagePart = TextPart | ImagePart | string;

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
  onRetry?: () => void;
  onCopy?: (content: string) => void;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
}

export default function ChatMessage({
  message,
  isLoading = false,
  onRetry,
  onCopy,
  onEdit,
  onDelete,
}: ChatMessageProps) {
  const { t } = useTranslation('ai');
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(
    typeof message.content === 'string' ? message.content : ''
  );

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';

  const handleCopy = async () => {
    if (typeof message.content === 'string') {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      onCopy?.(message.content);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleEdit = () => {
    if (isEditing && editContent !== message.content) {
      onEdit?.(message.id, editContent);
    }
    setIsEditing(!isEditing);
  };

  const renderContent = () => {
    // Handle message parts (AI SDK 4.2 feature)
    if (Array.isArray(message.content)) {
      return (message.content as MessagePart[]).map((part, index) => {
        if (typeof part === 'string') {
          return <span key={index}>{part}</span>;
        }

        const typedPart = part as TextPart | ImagePart;

        if (typedPart.type === 'text') {
          return <span key={index}>{(typedPart as TextPart).text}</span>;
        }

        if (typedPart.type === 'image') {
          const imagePart = typedPart as ImagePart;
          return (
            <img
              key={index}
              src={imagePart.image}
              alt={imagePart.alt || t('media.image')}
              className="max-w-full h-auto rounded-lg mt-2"
            />
          );
        }

        return null;
      });
    }

    // Handle string content
    if (isEditing) {
      return (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      );
    }

    return <div className="prose prose-sm max-w-none">{message.content}</div>;
  };

  const getRoleLabel = () => {
    if (isUser) return t('message.user');
    if (isAssistant) return t('message.assistant');
    if (isSystem) return t('message.system');
    return '';
  };

  const getMessageClasses = () => {
    const base = 'flex gap-3 p-4 rounded-lg';
    if (isUser) return `${base} bg-blue-50 ml-8`;
    if (isAssistant) return `${base} bg-gray-50 mr-8`;
    if (isSystem) return `${base} bg-yellow-50 mx-4 text-sm`;
    return base;
  };

  const getAvatarClasses = () => {
    const base = 'w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold';
    if (isUser) return `${base} bg-blue-500`;
    if (isAssistant) return `${base} bg-gray-700`;
    if (isSystem) return `${base} bg-yellow-500`;
    return base;
  };

  const getInitial = () => {
    if (isUser) return 'U';
    if (isAssistant) return 'A';
    if (isSystem) return 'S';
    return '?';
  };

  return (
    <div className={getMessageClasses()}>
      <div className="flex-shrink-0">
        <div className={getAvatarClasses()}>{getInitial()}</div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-500">{getRoleLabel()}</span>

          {!isSystem && (
            <div className="flex items-center gap-1">
              {isAssistant && !isLoading && (
                <>
                  <button
                    onClick={handleCopy}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title={t('tooltip.copy')}
                  >
                    {isCopied ? (
                      <span className="text-xs text-green-600">{t('chat.copied')}</span>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </button>

                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title={t('tooltip.regenerate')}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  )}
                </>
              )}

              {isUser && onEdit && (
                <button
                  onClick={handleEdit}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {isEditing ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  )}
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(message.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="text-sm text-gray-800">
          {isLoading && isAssistant ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
              <span className="text-gray-500">{t('chat.thinking')}</span>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
}
