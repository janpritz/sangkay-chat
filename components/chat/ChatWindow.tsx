import { useEffect, useRef } from 'react';
import MessageBubble from '@/components/MessageBubble';

interface ChatWindowProps {
  messages: any[];
  isEmpty?: boolean;
  isTyping?: boolean;
}

export default function ChatWindow({ 
  messages, 
  isEmpty = false, 
  isTyping = false 
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or typing starts
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-8 chat-scroll bg-white" 
      id="chat-container"
    >
      {isEmpty ? (
        <div className="h-full flex items-center justify-center">
          {/* Empty state handled by overlay */}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, index) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start typing-indicator">
              <div className="bg-gray-100 text-gray-600 px-6 py-4 rounded-3xl rounded-bl-none flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm">Sangkay is typing...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}