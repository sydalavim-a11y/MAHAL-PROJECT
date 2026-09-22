import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Send, Bot, User, RefreshCw, HelpCircle, ShieldCheck, CheckCircle2, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AskMahalAssistantProps {
  onClose?: () => void;
}

export const AskMahalAssistant: React.FC<AskMahalAssistantProps> = ({ onClose }) => {
  const { language, t, settings, currentUser, setActiveTab } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text:
        language === 'ml'
          ? `അസ്സലാമു അലൈക്കും. ഞാൻ ${settings.mahalName} ഡിജിറ്റൽ സഹായിയാണ്. നിക്കാഹ് രജിസ്ട്രേഷൻ, മാസവരി, മരണ സർട്ടിഫിക്കറ്റ്, റിലീഫ് ഫണ്ട്, രക്തദാനം, ഭാരവാഹികളുടെ വിവരങ്ങൾ എന്നിവയെക്കുറിച്ച് എന്നോട് ചോദിക്കാം.`
          : `Assalamu Alaikum. I am your 24/7 AI Assistant for ${settings.mahalName}. You can ask me about Nikah registration procedures, monthly contribution dues, Death certificates, welfare relief, blood donation, authority contacts, or prayer schedules.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sampleQuestions = language === 'ml'
    ? [
        'മരണ സർട്ടിഫിക്കറ്റിന് എങ്ങനെ അപേക്ഷിക്കാം?',
        'നിക്കാഹ് രജിസ്റ്റർ ചെയ്യാൻ എന്തൊക്കെ രേഖകൾ വേണം?',
        'മാസവരി വിഹിതം ഓൺലൈനായി അടക്കുന്നത് എങ്ങനെ?',
        'മഹല്ല് ഭാരവാഹികളുടെ ഫോൺ നമ്പറുകൾ ലഭിക്കുമോ?',
        'ചികിത്സാ സഹായത്തിന് എങ്ങനെയാണ് അപേക്ഷിക്കേണ്ടത്?',
        'ഇന്നത്തെ ജമാഅത്ത് നമസ്കാര സമയം എത്രയാണ്?',
      ]
    : [
        'How do I apply for a Death Certificate?',
        'What documents are required for Nikah registration?',
        'How do I pay my monthly Mahal contribution online?',
        'Who are the Mahal working committee authorities?',
        'How does the Medical Welfare Relief Fund work?',
        'What are today’s congregation prayer timings?',
      ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/ask-mahal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          language,
          memberContext: currentUser ? {
            name: currentUser.name,
            memberId: currentUser.memberId,
            role: currentUser.role,
          } : null,
        }),
      });

      if (!response.ok) {
        throw new Error('AI server responded with error');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || data.reply || 'Thank you for your enquiry. Our Mahal desk has registered your question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      // Graceful fallback with reliable community answers
      let fallbackText =
        language === 'ml'
          ? `നൂറുൽ ഹുദാ മഹല്ല് ഓഫീസിലേക്ക് സ്വാഗതം. കൂടുതൽ വിവരങ്ങൾക്കായി ദയവായി മഹല്ല് ഹെൽപ്‌ഡെസ്കിലേക്ക് വിളിക്കുക (${settings.phone}) അല്ലെങ്കിൽ വാട്ട്‌സ്ആപ്പിൽ ബന്ധപ്പെടുക.`
          : `For Nikah registration, bring Aadhaar cards, Bride & Groom Mahal NOCs, and guardian consent. For monthly dues and certificates, you can click on the respective portal above or call the Mahal desk directly at ${settings.phone}.`;

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setActiveTab('home');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Header Banner with Spruce & Lime Palette and prominent Close button */}
      <div className="bg-gradient-to-r from-[#00545f] via-[#004752] to-[#003a42] text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-[#ecffb6]/30 mb-4 sm:mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#d6fb00] text-[#00545f] flex items-center justify-center shadow-lg border border-[#ecffb6]/40 shrink-0">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#00545f]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-bold font-serif text-white tracking-tight truncate">
                {t.aiAssistant.title}
              </h2>
              <span className="text-[10px] bg-[#d6fb00] text-[#00545f] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                AI Active
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#ecffb6] mt-0.5 truncate font-medium">
              {t.aiAssistant.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-2 text-xs text-[#d6fb00] bg-[#003a42]/80 px-3 py-1.5 rounded-xl border border-[#ecffb6]/20">
            <ShieldCheck className="w-4 h-4 text-[#d6fb00]" />
            <span>24/7 Community Intelligence</span>
          </div>

          <button
            id="close-ask-mahal-chat-btn"
            onClick={handleClose}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-rose-600/90 text-white hover:text-white transition-all flex items-center gap-1.5 cursor-pointer border border-white/20 shadow-sm"
            title="Close Ask Mahal Chat"
            aria-label="Close Chat"
          >
            <X className="w-5 h-5 text-white" />
            <span className="text-xs font-bold hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-[#ecffb6] overflow-hidden flex flex-col h-[520px] sm:h-[600px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto space-y-3.5 sm:space-y-4 bg-[#fafdf2]/60">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 sm:gap-3 max-w-[92%] sm:max-w-[85%] ${
                m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-[#00545f] text-white'
                    : 'bg-[#d6fb00] text-[#00545f] font-bold shadow-xs'
                }`}
              >
                {m.sender === 'user' ? <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00545f]" />}
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-2xl shadow-xs text-xs sm:text-[13px] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#00545f] text-white rounded-tr-xs'
                    : 'bg-white text-[#00434c] border border-[#ecffb6] rounded-tl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div
                  className={`text-[10px] mt-1.5 text-right font-mono ${
                    m.sender === 'user' ? 'text-[#ecffb6]/80' : 'text-[#557277]'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#d6fb00] text-[#00545f] flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00545f]" />
              </div>
              <div className="bg-white border border-[#ecffb6] p-3 sm:p-3.5 rounded-2xl rounded-tl-xs flex items-center gap-2 text-xs text-[#3d686e] shadow-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00545f]" />
                <span>Consulting Mahal Register & Knowledge Base...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-[#fafdf2] border-t border-[#ecffb6] px-3 sm:px-4 py-2 sm:py-2.5 overflow-x-auto flex items-center gap-2 text-xs scrollbar-none">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#00545f] shrink-0 uppercase tracking-wide">
            Suggestions:
          </span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="shrink-0 bg-white hover:bg-[#ecffb6] text-[#00545f] border border-[#ecffb6] hover:border-[#d6fb00] px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-2xs whitespace-nowrap cursor-pointer active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-2.5 sm:p-3.5 bg-white border-t border-[#ecffb6] flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'ml'
                ? 'നിങ്ങളുടെ സംശയങ്ങൾ ഇവിടെ മലയാളത്തിലോ ഇംഗ്ലീഷിലോ ചോദിക്കുക...'
                : 'Type your question in English or Malayalam (e.g. death certificate, Nikah, dues)...'
            }
            className="flex-1 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#fafdf2] border border-[#ecffb6] rounded-xl sm:rounded-2xl text-xs sm:text-sm text-[#00434c] focus:outline-none focus:ring-2 focus:ring-[#00545f] placeholder-[#557277]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#00545f] hover:bg-[#003a42] text-[#d6fb00] font-black rounded-xl sm:rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-md cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 text-[#d6fb00]" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
