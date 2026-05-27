'use client';

import { Search, HelpCircle, Plus, X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface SidebarProps {
  onNewChat: () => void;
  onSelectTab: (tab: string) => void;
  onSelectFAQ?: (question: string) => void;
  onClose?: () => void;
  isOpen?: boolean;
  isTyping?: boolean;
}

export default function Sidebar({ 
  onNewChat,
  onSelectTab,
  onSelectFAQ,
  onClose,
  isOpen = true,
  isTyping = false
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [faqList, setFaqList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setIsLoading(true);
        // Using 'faqs' (no leading slash) to append to the baseURL properly
        const response = await api.get('faqs');
        const data = response.data?.data || response.data;
        
        if (Array.isArray(data)) {
          const questions = data.map((item: any) => item.suggested_q).filter(Boolean);
          setFaqList(questions);
        }
      } catch (error) {
        console.error('Failed to fetch FAQs:', error);
        setFaqList([]); // Fallback to empty list
      } finally {
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const filteredFAQs = faqList.filter(faq => 
    faq.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <div 
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[var(--sidebar-bg)] flex flex-col shadow-xl lg:shadow-none border-r border-gray-200 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ width: '300px', maxWidth: '85vw' }}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Sangkay" 
              className="w-9 h-9 rounded-xl object-contain" 
            />
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Sangkay Chatbot
            </span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pt-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isTyping}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* New Chat Button */}
        <div className="px-4 pt-4">
          <button
            onClick={() => {
              if (isTyping) return;
              onNewChat();
              onClose?.();
            }}
            disabled={isTyping}
            className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-left transition-all mb-4 bg-orange-50 hover:bg-orange-100 text-[var(--orange)] font-medium border border-orange-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:border-gray-100"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
          <div className="mb-4 px-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Frequently Asked
            </p>
            <div className="flex flex-col gap-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                </div>
              ) : filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (isTyping) return;
                      onSelectFAQ?.(faq);
                      onClose?.();
                    }}
                    disabled={isTyping}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-all border border-transparent hover:border-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {faq}
                  </button>
                ))
              ) : (
                <p className="text-xs text-gray-400 px-4 py-2 italic">
                  No matching questions found
                </p>
              )}
            </div>
          </div>
        </div>
        {/* <div className="mt-auto p-4 border-t border-gray-200 text-xs text-gray-500">
          Powered by Next.js + Rasa
        </div> */}
      </div>
    </>
  );
}
