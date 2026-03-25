import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Response Brain ────────────────────────────────────────────────────────────

const RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['funnel', 'awareness', 'toma', 'leaking', 'leak'],
    response:
      "📊 **Funnel Analysis**\n\nOur **Company TOMA (Top of Mind Awareness)** is strong at **42%**, placing us #1 in spontaneous recall. However, we're seeing a classic **'Leaky Bucket' effect**: a **15% drop-off** from Consideration (61%) to Purchase Intent (46%).\n\n⚠️ **Competitor A** is currently outperforming us in this final conversion step, with a tighter 9% drop-off gap. Recommend investigating friction at the cart/checkout stage.",
  },
  {
    keywords: ['nps', 'loyalty', 'recommend', 'promoter', 'switching'],
    response:
      "💙 **Loyalty & NPS**\n\nOur **NPS stands at 54**, leading the competitive set. This puts us in the 'Excellent' range (>40).\n\nHowever, the **Switching Behavior** data surfaces a key risk: **22% of lapsed users** cited *'Better Competitor Deals'* as the reason for moving to **Competitor B**. Loyalty programs targeting price-sensitive segments could recover ~8–12pp of Purchase Intent.",
  },
  {
    keywords: ['cart', 'abandonment', 'checkout', 'purchase'],
    response:
      "🛒 **Cart Abandonment**\n\nE-commerce data shows **Cart Abandonment is peaking at 45%**. The primary driver is **'High Shipping Fees'** — cited by 38% of drop-off respondents.\n\nThis is a high-leverage fix: reducing or subsidising shipping for orders above a threshold could lift our **Purchase Intent index by ~10 points**, particularly among Tier 2 city users where price sensitivity is highest.",
  },
  {
    keywords: ['gen z', 'genz', 'generation z', 'demographics', 'young', '18-24', '18 24'],
    response:
      "👥 **Gen Z Demographics**\n\nGen Z (18–24) shows the **highest Ad Recall at 74%** across all segments — our campaigns are landing. However, they record the **lowest Brand Trust score (Index 88)**, below the category baseline of 100.\n\n📱 Discovery is **primarily Influencer-led** rather than direct app entry, meaning trust must be built through creator authenticity, not performance ads alone. Consider an Influencer Brand Ambassador programme.",
  },
  {
    keywords: ['price', 'premium', 'willingness', 'pay', 'wtp'],
    response:
      "💰 **Price & Premium Perception**\n\n**35% of respondents** are willing to pay a **5–10% premium** for our brand — a strong signal of perceived value.\n\nThis aligns directly with our **'Value for Money'** association, where we over-index against **Competitor C (Index 115)**. Competitor D scores lowest on premium willingness (Index 82), suggesting a positioning opportunity to reinforce quality at a slight premium rather than competing on price.",
  },
  {
    keywords: ['payment', 'cod', 'cash', 'prepaid', 'delivery'],
    response:
      "💳 **Payment Behaviour**\n\nOur **COD vs Prepaid split is 40/60**. While prepaid dominates Metro markets, COD remains the preferred mode in Tier 2 & 3 cities.\n\n⚠️ We've noted a **correlation between COD usage and higher return rates** in these markets, impacting Fulfillment Health scores. Incentivising prepaid via a small discount could meaningfully reduce return friction and improve Net Revenue per order.",
  },
  {
    keywords: ['competitor a', 'competitora', 'comp a'],
    response:
      "🔍 **Company vs Competitor A**\n\nHead-to-head, **Company leads on TOMA (42% vs 36%)** and **NPS (54 vs 41)**, reflecting stronger top-funnel awareness and loyalty.\n\nHowever, **Competitor A outperforms us on Purchase Intent conversion** — their funnel drop-off from Consideration → Intent is just 9% vs our 15%. Their key advantage appears to be **faster delivery SLAs** and a more aggressive **first-purchase offer**. Matching on these two levers could close the conversion gap.",
  },
  {
    keywords: ['perception', 'attribute', 'imagery', 'brand image'],
    response:
      "🧠 **Brand Perception & Imagery**\n\nOn **Functional attributes**, Company leads on *'Wide Product Range'* (Index 112) and *'Easy Navigation'* (Index 108).\n\nOn **Emotional attributes**, we under-index on *'Trustworthy Brand'* (Index 94) vs the category norm. Competitor B owns the trust space. Our strongest **Personality** association is *'Innovative'* (Index 119), which we should lean into for Gen Z and premium positioning campaigns.",
  },
];

const DEFAULT_RESPONSE =
  "🤖 I'm your **Brand Health Copilot**, trained on your dashboard's tracking data.\n\nI can help you analyse:\n- **Funnel & Awareness** metrics\n- **NPS & Loyalty** signals\n- **Cart Abandonment** drivers\n- **Gen Z** perception gaps\n- **Price & WTP** benchmarks\n- **Payment & COD** behaviour\n- **Competitor A–D** comparisons\n\nTry asking me *\"Why is our funnel leaking?\"* or tap a chip below.";

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const { keywords, response } of RESPONSES) {
    if (keywords.some((k) => lower.includes(k))) return response;
  }
  return "🔍 I couldn't find a direct match in the dashboard data for that query. Try asking about **Funnel**, **NPS**, **Cart Abandonment**, **Gen Z**, **Pricing**, **COD**, or **Competitor A** — these are the tracked parameters in the study.";
}

// ─── Types ─────────────────────────────────────────────────────────────────────

type Role = 'user' | 'assistant';
interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

const QUICK_CHIPS = [
  'Why is our funnel leaking?',
  'Compare us to Competitor A',
  'Gen Z perception gap',
  'Top abandonment reasons',
];

// ─── Markdown-lite renderer ────────────────────────────────────────────────────

const renderMarkdown = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      // Italic: *text*
      const italicParts = part.split(/(\*[^*]+\*)/g).map((p, k) => {
        if (p.startsWith('*') && p.endsWith('*')) {
          return <em key={k} className="italic">{p.slice(1, -1)}</em>;
        }
        return p;
      });
      return <span key={j}>{italicParts}</span>;
    });

    if (line.startsWith('- ')) {
      return <li key={i} className="ml-3 list-disc">{parts.slice(1)}</li>;
    }
    if (line === '') return <br key={i} />;
    return <p key={i} className="leading-relaxed">{parts}</p>;
  });
};

// ─── Message Bubble ────────────────────────────────────────────────────────────

const MessageBubble = ({ msg }: { msg: Message }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={cn('flex gap-2.5', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-[#1D4ED8]'
            : 'bg-slate-700 border border-slate-600',
        )}
      >
        {isUser
          ? <User className="h-3.5 w-3.5 text-white" />
          : <Sparkles className="h-3.5 w-3.5 text-blue-400" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px]',
          isUser
            ? 'rounded-tr-sm bg-[#1D4ED8] text-white'
            : 'rounded-tl-sm bg-slate-800 text-slate-200 border border-slate-700',
        )}
      >
        {isUser
          ? <p className="leading-relaxed">{msg.content}</p>
          : <div className="space-y-0.5">{renderMarkdown(msg.content)}</div>
        }
        <p className={cn('mt-1.5 text-[10px]', isUser ? 'text-blue-200' : 'text-slate-500')}>
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

// ─── Typing Indicator ──────────────────────────────────────────────────────────

const TypingIndicator = () => (
  <div className="flex gap-2.5">
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 border border-slate-600">
      <Sparkles className="h-3.5 w-3.5 text-blue-400" />
    </div>
    <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-slate-800 border border-slate-700 px-4 py-3">
      <span className="text-[11px] text-slate-400 mr-1">Copilot is analyzing</span>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const Copilot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: DEFAULT_RESPONSE,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: getResponse(trimmed),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setTyping(false);
    }, 850);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Copilot"
        className={cn(
          'fixed bottom-20 right-5 z-50 flex h-13 w-13 items-center justify-center rounded-full shadow-2xl transition-all duration-300 lg:bottom-6',
          open
            ? 'bg-slate-700 border border-slate-600 scale-95'
            : 'bg-[#1D4ED8] hover:bg-blue-600 scale-100 hover:scale-105',
        )}
        style={{ height: 52, width: 52 }}
      >
        {open
          ? <X className="h-5 w-5 text-white" />
          : <Sparkles className="h-5 w-5 text-white" />}
        {/* Pulse ring when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#1D4ED8] opacity-30 animate-ping" />
        )}
      </button>

      {/* Slide-out panel */}
      <div
        className={cn(
          'fixed bottom-0 right-0 z-40 flex flex-col transition-all duration-300 ease-in-out',
          'w-full sm:w-96',
          open
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-4 opacity-0 pointer-events-none',
        )}
        style={{ top: 56 }} // below sticky header
      >
        <div className="flex h-full flex-col rounded-tl-2xl border-l border-t border-slate-700 bg-slate-900 shadow-2xl">

          {/* Panel header */}
          <div className="flex items-center gap-3 border-b border-slate-700/60 px-4 py-3.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D4ED8]/20 border border-[#1D4ED8]/30">
              <Sparkles className="h-4 w-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-none">Brand Health Copilot</p>
              <p className="mt-0.5 text-[11px] text-slate-400">Analyzing Q4 2024 tracking data</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-400 font-medium">Live</span>
            </div>
          </div>

          {/* Data context pills */}
          <div className="flex items-center gap-1.5 border-b border-slate-700/40 bg-slate-800/50 px-4 py-2 overflow-x-auto">
            {['TOMA: 42%', 'NPS: 54', 'Cart Drop: 45%', 'WTP: 35%'].map((pill) => (
              <span
                key={pill}
                className="shrink-0 rounded-full border border-[#1D4ED8]/30 bg-[#1D4ED8]/10 px-2 py-0.5 text-[10px] font-medium text-blue-300"
              >
                {pill}
              </span>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 px-4 py-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {typing && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Quick chips */}
          <div className="border-t border-slate-700/60 bg-slate-800/40 px-3 py-2.5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Quick Analysis</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  disabled={typing}
                  className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-[11px] text-slate-300 transition-colors hover:border-blue-500/50 hover:bg-[#1D4ED8]/15 hover:text-blue-300 disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input bar */}
          <div className="border-t border-slate-700/60 bg-slate-900 px-3 py-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 focus-within:border-[#1D4ED8]/60 transition-colors">
              <Bot className="h-4 w-4 shrink-0 text-slate-500" />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your brand metrics…"
                disabled={typing}
                className="flex-1 bg-transparent text-[13px] text-white placeholder-slate-500 outline-none disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || typing}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1D4ED8] text-white transition-all hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-slate-600">
              Powered by Brand Tracking Study · Q1–Q4 2024
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Copilot;
