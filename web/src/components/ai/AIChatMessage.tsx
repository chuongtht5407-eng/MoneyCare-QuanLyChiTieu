import React from 'react';
import { Sparkles, User } from 'lucide-react';
import { ChatMessage } from '../../types/ai';

interface AIChatMessageProps {
  message: ChatMessage;
}

export const AIChatMessage: React.FC<AIChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Format basic bold formatting (**text**) safely into formatted JSX
  const formatContent = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*|\n)/g);
    return parts.map((part, index) => {
      if (part === '\n') {
        return <br key={index} />;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-extrabold text-inherit">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className={`flex gap-3 my-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white shadow-2xs ${
          isUser ? 'bg-[#171923]' : 'bg-[#2F5BEA]'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 fill-white" />}
      </div>

      {/* Bubble Content */}
      <div className={`max-w-[80%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
            isUser
              ? 'bg-[#2F5BEA] text-white rounded-tr-xs'
              : message.isError
              ? 'bg-red-50 text-[#EF4444] border border-red-200 rounded-tl-xs'
              : 'bg-white text-[#171923] border border-[#E8EAF0] rounded-tl-xs'
          }`}
        >
          {formatContent(message.content)}
        </div>

        <p className={`text-[10px] text-[#858A9B] px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};
