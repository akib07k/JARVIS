
export const MessageBubble = ({ sender, text }: { sender: 'ai' | 'user', text: string }) => {
  const isUser = sender === 'user';
  
  return (
    <div className={`w-full py-6 ${isUser ? '' : 'bg-[#31313e]'}`}>
      <div className="max-w-3xl mx-auto flex gap-6 px-4">
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${isUser ? 'bg-indigo-600 text-white' : 'bg-blue-600 text-white'}`}>
          <span className="text-sm font-semibold">{isUser ? 'U' : 'AI'}</span>
        </div>
        
        {/* Message Content */}
        <div className="flex-1 space-y-2 overflow-hidden">
          <div className="font-semibold text-sm text-gray-200">
            {isUser ? 'You' : 'Assistant'}
          </div>
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};
