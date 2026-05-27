'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import ChatInput from '@/components/chat/ChatInput';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [greeting, setGreeting] = useState('How can I help you today?');
  const [recentQuestions, setRecentQuestions] = useState<string[]>([
    "What are the enrollment requirements?",
    "How to reset my portal password?",
    "Where is the registrar's office?",
    "Schedule for midterm exams",
    "List of available scholarships"
  ]);

  // Placeholder for Recently Asked and Frequently Asked Questions data. 
  // In the future, this will be fetched from the backend.
  const PREDEFINED_ANSWERS: Record<string, string> = {
    // Recently Asked
    "What are the enrollment requirements?": "The enrollment requirements include: 1. Original Report Card (Form 138), 2. PSA Birth Certificate, 3. Certificate of Good Moral Character, 4. 2x2 ID Pictures, and 5. Enrollment Form.",
    "How to reset my portal password?": "To reset your portal password, go to the login page, click 'Forgot Password', enter your student ID/email, and follow the instructions sent to your registered email.",
    "Where is the registrar's office?": "The Registrar's Office is located on the ground floor of the Administration Building, right next to the Finance Office.",
    "Schedule for midterm exams": "Midterm exams are scheduled for October 15-20, 2026. Please check your department bulletin board for the specific room assignments and times.",
    "List of available scholarships": "Available scholarships include: 1. Academic Scholarship, 2. Financial Assistance, 3. Athletic Scholarship, 4. Cultural Arts Grant, and 5. Government-funded scholarships (CHED/TES).",
    
    // Frequently Asked
    "What is Sangkay Chatbot?": "Sangkay Chatbot is your AI-powered student assistant designed to help you with enrollment, campus information, and other university-related inquiries.",
    "How do I contact support?": "You can contact support by visiting the IT Services office in the Tech Building or emailing support@university.edu.ph.",
    "What are the library hours?": "The University Library is open Monday to Friday, 8:00 AM to 7:00 PM, and Saturdays from 9:00 AM to 1:00 PM.",
    "How to apply for graduation?": "To apply for graduation, submit your clearance and completed application form to the Registrar's Office during the first month of your final semester.",
    "Campus emergency numbers": "Campus Security: (02) 123-4567, Health Clinic: (02) 123-4568, Fire Safety: (02) 123-4569.",
    "How to request a transcript?": "You can request an official transcript of records through the Student Portal or by visiting the Registrar's Window 2. Processing typically takes 5-7 working days.",
    "Where is the health clinic?": "The University Health Clinic is located on the second floor of the Student Center Building, open from 8:00 AM to 5:00 PM.",
    "WIFI access on campus": "To access the campus WIFI, use your student ID as the username and your portal password. Look for the 'Sangkay-Student-WIFI' network.",
    "Student organization registration": "Registration for student organizations happens during the first two weeks of the first semester at the Office of Student Affairs.",
    "Lost and found location": "The Central Lost and Found is managed by the Campus Security Office located near the Main Gate."
  };

  const greetings = [
    "How can I help you today?",
    "What's on your mind?",
    "How can I assist you right now?",
    "Need help with something?",
    "I'm here to help. What do you need?",
    "What can I do for you today?"
  ];

  // Update empty state and randomize greeting
  useEffect(() => {
    const empty = messages.length === 0;
    setIsEmpty(empty);
    if (empty) {
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      setGreeting(randomGreeting);
    }
  }, [messages]);

  const handleSend = (message: string) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message
    };

    setMessages(prev => [...prev, userMessage]);

    // Update recent questions
    setRecentQuestions(prev => {
      const filtered = prev.filter(q => q !== message);
      return [message, ...filtered.slice(0, 9)];
    });

    // Check if it's a predefined answer (placeholder for Recently Asked Questions)
    if (PREDEFINED_ANSWERS[message]) {
      setIsTyping(true);
      // Simulate a small delay for natural feel
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: PREDEFINED_ANSWERS[message]
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 600);
    } else {
      sendToRasa(message, setMessages, setIsTyping);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    const baseUrl = process.env.NEXT_PUBLIC_RASA_SERVER_URL || 'http://localhost:5005';
    const senderId = typeof window !== 'undefined'
      ? localStorage.getItem('sangkay_sender_id') || `user_${Date.now()}`
      : 'default';

    fetch(`${baseUrl}/webhooks/rest/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: senderId,
        message: "/restart",
      }),
    }).catch(err => console.error("Rasa Restart Error:", err));
  };

  return (
    <div className="flex h-screen bg-white text-gray-900 overflow-hidden relative">
      <Sidebar 
        onNewChat={handleNewChat}
        onSelectTab={(tab) => console.log('Tab selected:', tab)}
        onSelectFAQ={handleSend}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center p-4 border-b border-gray-100 bg-white z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-600"
          >
            <Menu className="w-6 h-6" />
          </button>
          {/* <div className="flex-1 flex justify-center mr-10">
            <img src="/logo.png" alt="Sangkay" className="w-7 h-7 object-contain" />
          </div> */}
          <p className="text-gray-500">Chat with Sangkay</p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          <ChatWindow
            messages={messages}
            isEmpty={isEmpty}
            isTyping={isTyping}
          />

          {/* Centered Welcome + Input (First Load) */}
          <AnimatePresence>
            {isEmpty && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.8, delay: 0.2 } }}
                className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 transition-all duration-700 z-20 bg-white/80 backdrop-blur-sm"
              >
                <div className="w-full max-w-2xl animate-fade-in flex flex-col items-center">
                  <div className="text-center mb-8 sm:mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-full mb-4 sm:mb-6">
                      <span className="text-4xl sm:text-5xl">👋</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-semibold text-gray-900 mb-2 sm:mb-3">
                      {greeting}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-lg">
                      Ask me anything — I'm here to assist
                    </p>
                  </div>

                  <div className="w-full">
                    <ChatInput onSend={handleSend} isCentered={true} />
                  </div>
                  
                  {/* Recent Questions Carousel (Welcome View) */}
                  <div className="mt-8 sm:mt-12 w-full overflow-hidden">
                    <p className="text-[10px] sm:text-sm font-medium text-gray-500 mb-3 sm:mb-4 px-2 uppercase tracking-wider">
                      Recently Asked
                    </p>
                    <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2 scroll-smooth">
                      {recentQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(q)}
                          className="flex-none w-[240px] sm:w-[280px] bg-white border border-gray-200 p-3 sm:p-4 rounded-2xl text-left hover:border-orange-400 hover:shadow-md transition-all group"
                        >
                          <p className="text-gray-700 group-hover:text-gray-900 line-clamp-2 text-xs sm:text-sm leading-relaxed">
                            {q}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Input + Recent Questions (Active Chat) */}
        {!isEmpty && (
          <div className="flex flex-col bg-white border-t border-gray-100">
            <div className="px-4 sm:px-6 py-2 sm:py-3 overflow-x-auto flex gap-2 sm:gap-3 no-scrollbar scroll-smooth">
              {recentQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="flex-none bg-gray-50 border border-gray-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs text-gray-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-all whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
            <ChatInput onSend={handleSend} isCentered={false} />
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== RASA INTEGRATION ====================

async function sendToRasa(
  message: string,
  setMessages: React.Dispatch<React.SetStateAction<any[]>>,
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
) {
  const baseUrl = process.env.NEXT_PUBLIC_RASA_SERVER_URL || 'http://localhost:5005';

  const senderId = typeof window !== 'undefined'
    ? localStorage.getItem('sangkay_sender_id') || `user_${Date.now()}`
    : 'default';

  if (typeof window !== 'undefined') {
    localStorage.setItem('sangkay_sender_id', senderId);
  }

  try {
    setIsTyping(true);

    const response = await fetch(`${baseUrl}/webhooks/rest/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: senderId,
        message: message.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    for (const item of data) {
      if (item.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            type: 'bot',
            content: item.text,
          },
        ]);
      }
      else if (item.custom?.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            type: 'bot',
            content: item.custom.text,
          },
        ]);
      }
      else if (item.buttons) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            type: 'bot',
            content: item.text || "Please choose an option:",
            buttons: item.buttons,
          },
        ]);
      }
    }
  } catch (error) {
    console.error('Rasa Error:', error);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'bot',
        content: "Sorry, I'm having trouble connecting right now. Please try again.",
      },
    ]);
  } finally {
    setIsTyping(false);
  }
}
