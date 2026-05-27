import { motion } from 'framer-motion';

export default function MessageBubble({ message }: { message: any }) {
  const formattedContent = formatMessageContent(message.content, message);

  const isUser = message.type === 'user';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 gap-3`}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <img
            src="/logo.png"
            alt="Sangkay Chatbot"
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[70%] px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl text-sm sm:text-[17px] leading-relaxed shadow-sm font-medium
          ${isUser
            ? 'bg-[#ff9900] text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
      >
        {formattedContent}
      </div>

      {/* User Avatar
      {isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 bg-gray-700 text-white rounded-full flex items-center justify-center text-sm font-medium">
            You
          </div>
        </div>
      )} */}
    </motion.div>
  );
}

// ==================== SMART MESSAGE FORMATTER ====================
function formatMessageContent(text: string, message: any) {
  if (!text) return text;

  // 1. Ticket Button Detection
  const ticketLinkMatch = text.match(/\[Create Ticket\]\s*\((https?:\/\/[^\s)]+)\)/i);
  if (ticketLinkMatch) {
    const url = ticketLinkMatch[1];
    return (
      <div className="space-y-3">
        <p>Your ticket creation link is ready:</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#ff9900] hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Submit a Ticket
        </a>
        <p className="text-xs text-gray-500 mt-2">(Opens in new tab)</p>
      </div>
    );
  }

  // 2. Process Bold (**text**) + Numbered Lists
  const lines = text.split('\n');

  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <br key={index} />;

        // Check for numbered list
        const numberMatch = trimmed.match(/^(\d+)\.\s*(.+)$/);
        if (numberMatch) {
          return (
            <div key={index} className="flex gap-3">
              <span className="font-semibold text-orange-600 mt-0.5 flex-shrink-0">
                {numberMatch[1]}.
              </span>
              <span>{parseBold(numberMatch[2])}</span>
            </div>
          );
        }

        // Regular line with possible bold text
        return (
          <p key={index} className="whitespace-pre-wrap">
            {parseBold(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Helper: Convert **text** → <strong>text</strong>
function parseBold(text: string) {
  if (!text) return text;

  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={i} className="font-semibold text-gray-900">{boldText}</strong>;
    }
    return part;
  });
}