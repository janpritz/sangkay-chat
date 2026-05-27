'use client';

import { Send } from 'lucide-react';
import { useState, useRef } from 'react';

export default function ChatInput({ 
  onSend, 
  isCentered = false,
  isDisabled = false
}: { 
  onSend: (msg: string) => void; 
  isCentered?: boolean;
  isDisabled?: boolean;
}) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim() || isDisabled) return;

    const messageText = input.trim();
    
    // Clear input and send actual message immediately
    setInput('');
    onSend(messageText);
  };

  return (
    <div className={`${isCentered ? 'px-2 sm:px-6' : 'p-3 sm:p-6 border-t border-gray-200 bg-white'} relative overflow-visible`}>
      <div className={`flex gap-2 sm:gap-3 relative ${isCentered ? 'max-w-3xl mx-auto' : 'max-w-4xl mx-auto'}`}>
        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isDisabled ? "Sangkay is typing..." : "Type your message..."}
            disabled={isDisabled}
            className={`flex-1 bg-gray-100 border border-gray-300 rounded-3xl px-4 sm:px-6 py-3 sm:py-4 
                       focus:outline-none focus:border-[#ff9900] text-base sm:text-lg placeholder-gray-500
                       shadow-lg transition-all duration-300 focus:shadow-xl
                       ${isCentered ? 'sm:py-5 sm:text-xl' : ''} ${isDisabled ? 'cursor-not-allowed opacity-70' : ''}`}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!input.trim() || isDisabled}
          className={`bg-[#ff9900] hover:bg-orange-600 disabled:bg-gray-300 
                     w-12 h-12 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl flex items-center justify-center 
                     transition-all text-white shadow-md hover:shadow-lg
                     ${isCentered ? 'sm:w-16 sm:h-16' : ''} ${!isDisabled && input.trim() ? 'active:scale-90' : ''}`}
        >
          <Send className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}
