import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Send, X, Bot, User, Sparkles, Loader2 } from 'lucide-react';

export default function ChatStylist({ currentFlowers }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hi! I'm your AI Floral Stylist. Scan a bouquet or ask me anything about flower arrangements!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        message: input,
        context: currentFlowers
      });
      setMessages(prev => [...prev, { role: 'bot', content: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I'm having trouble connecting to my creative side right now. Please try again!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold">AI Floral Stylist</h3>
                <p className="text-xs text-indigo-100">Always active</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {msg.role === 'bot' ? <Bot size={14} className="text-indigo-500" /> : <User size={14} className="text-indigo-200" />}
                    <span className="text-[10px] uppercase font-bold opacity-70">
                      {msg.role === 'bot' ? 'Stylist' : 'You'}
                    </span>
                  </div>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Quick Suggestions */}
          {!isTyping && messages.length < 3 && (
            <div className="px-4 py-2 bg-white flex gap-2 overflow-x-auto no-scrollbar">
              {['Wedding ideas', 'Flower care', 'Birthday gifts', 'Trending styles'].map(s => (
                <button 
                  key={s} 
                  onClick={() => {
                    setInput(s);
                    // Trigger send if you want it to be immediate
                  }}
                  className="whitespace-nowrap px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100 hover:bg-indigo-100 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              placeholder="Ask for styling tips..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition shadow-lg shadow-indigo-100"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-slate-900 rotate-90' : 'bg-gradient-to-tr from-indigo-600 to-purple-600'
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 border-2 border-white rounded-full animate-pulse"></div>
        )}
      </button>
    </div>
  );
}
