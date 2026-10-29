"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Mic,
  MicOff,
  ArrowRight,
  ShieldCheck,
  Compass,
  Building2,
  Users,
  Coins,
  FileText,
  Calendar,
  ExternalLink,
  MessageSquare,
  Flame,
  CheckCircle2,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  actions?: string[];
}

const suggestedCategories = [
  {
    icon: Users,
    title: "Koo 18 za Luhya",
    desc: "Asili, mila na koo ndogo",
    prompt: "Nieleze kuhusu koo zote 18 za jamii ya Waluhya na asili yao",
  },
  {
    icon: Coins,
    title: "Mfuko wa Ustawi (Welfare)",
    desc: "Ada ya KES 200 na M-Pesa",
    prompt: "Je, mfuko wa ustawi unafanya kazi vipi na ninalipa vipi kwa M-Pesa?",
  },
  {
    icon: Compass,
    title: "Mwongozo wa Mombasa",
    desc: "Nyumba za Bamburi na matatu",
    prompt: "Nimehamia Mombasa, nawezaje kupata nyumba ya bei nafuu na usafiri wa matatu?",
  },
  {
    icon: Building2,
    title: "Matawi ya Kenya",
    desc: "Mombasa, Nairobi, Kisumu",
    prompt: "Matawi ya Mulembe18 yako kaunti gani na ninawezaje kujiunga?",
  },
];

function RichFormattedText({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-2.5 text-sm sm:text-base leading-relaxed text-gray-800">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lineIdx} className="h-1.5" />;

        const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("* ");
        const cleanLine = isBullet ? trimmed.replace(/^[•\-*]\s*/, "") : trimmed;
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);

        const parseSpans = (raw: string) => {
          const parts = raw.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
          return parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pIdx} className="font-extrabold text-[#082f1a]">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith("`") && part.endsWith("`")) {
              return (
                <span
                  key={pIdx}
                  className="inline-block px-2 py-0.5 mx-0.5 rounded-md bg-amber-100/90 text-amber-950 font-mono font-bold text-xs border border-amber-300 shadow-2xs"
                >
                  {part.slice(1, -1)}
                </span>
              );
            }
            if (part.startsWith("*") && part.endsWith("*")) {
              return (
                <em key={pIdx} className="italic text-gray-700">
                  {part.slice(1, -1)}
                </em>
              );
            }
            return <React.Fragment key={pIdx}>{part}</React.Fragment>;
          });
        };

        if (numberedMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-2.5 pl-1">
              <span className="w-6 h-6 rounded-full bg-[#0D6E38]/10 text-[#0D6E38] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {numberedMatch[1]}
              </span>
              <div className="flex-1">{parseSpans(numberedMatch[2])}</div>
            </div>
          );
        }

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2.5 pl-1">
              <span className="w-2 h-2 rounded-full bg-[#DDA71D] shrink-0 mt-2.5 shadow-2xs" />
              <div className="flex-1">{parseSpans(cleanLine)}</div>
            </div>
          );
        }

        return <p key={lineIdx}>{parseSpans(trimmed)}</p>;
      })}
    </div>
  );
}

export default function MsingiAIPage() {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "assistant",
      text:
        "**Mulembe muno!** Karibu kwenye **Msingi AI Cultural Studio**.\n\n" +
        "Mimi ni msaidizi wa akili mnemba aliyejengwa nchini Kenya na Msingi AI, nikiboreshwa kwa lugha za Kiswahili, Kiingereza, na utamaduni wa jamii ya Mulembe.\n\n" +
        "Unaweza kuniuliza kuhusu:\n" +
        "• **Koo zote 18:** Bukusu, Maragoli, Wanga, Samia, Tiriki, Idakho, n.k.\n" +
        "• **Ustawi & M-Pesa:** Paybill `522522`, ada ya KES 200, na uwazi wa malipo ya umma.\n" +
        "• **Matawi & Nyumba:** Mwongozo wa kuishi Mombasa, njia za matatu, na viongozi wa matawi.\n\n" +
        "Chagua mada hapa chini au andika/ongea swali lako moja kwa moja!",
      timestamp: "Sasa hivi",
      actions: [
        "Koo 18 za Luhya",
        "Lipa Welfare (KES 200)",
        "Nyumba za Bamburi & Matatu",
        "Matawi ya Kenya",
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakText = (text: string) => {
    if (!soundEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`•\-]/g, "").slice(0, 320);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "sw-KE";
      utterance.rate = 0.96;

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  const toggleListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Utambuzi wa sauti haupatikani kwenye kivinjari hiki.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "sw-KE";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputMessage).trim();
    if (!messageContent || isLoading) return;

    stopSpeaking();

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/msingi-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
          history: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          sender: "assistant",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          actions: data.suggestedActions || [],
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (soundEnabled) {
          speakText(data.audioText || data.reply);
        }
      } else {
        throw new Error(data.error || "Response failed");
      }
    } catch {
      const fallbackMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text:
          "Samahani, mtandao umezidiwa kidogo. Unaweza kuwasiliana na ofisi ya Mulembe18 kupitia **0712 345 678** au USSD **\*384\*18#**.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col text-[#111827] font-sans">
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-6">
        
        {/* Hero Header (Agnos Style) */}
        <div className="bg-[#111827] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-[#EAE7DF]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-[#FF5500] text-white flex items-center justify-center shadow-sm shrink-0">
                <Sparkles size={30} />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-white/20 text-gray-300 text-[10px] font-mono uppercase tracking-widest mb-2">
                  &gt; CULTURAL AI STUDIO &lt;
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Msingi AI Studio
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF5500] text-white font-bold text-xs uppercase tracking-wider">
                    Sauti ya Mulembe
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl leading-relaxed">
                  Msaidizi wa akili mnemba aliyetengenezwa nchini Kenya na Msingi AI.
                  Anaelewa Kiswahili fasaha, Kiingereza, na utamaduni wa koo zote 18 za Luhya.
                </p>
              </div>
            </div>

            {/* Audio Toggle & Info */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (isPlayingAudio) stopSpeaking();
                  setSoundEnabled(!soundEnabled);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all border ${
                  soundEnabled
                    ? "bg-[#FF5500] text-white border-[#FF5500] shadow-sm"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                }`}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span>{soundEnabled ? "Sauti Imewashwa" : "Sauti Imezimwa"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Suggestion Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {suggestedCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(cat.prompt)}
                className="bg-white hover:bg-[#FAF9F6] p-4 rounded-3xl border border-[#EAE7DF] hover:border-[#FF5500]/50 text-left transition-all shadow-[0_4px_25px_rgba(0,0,0,0.02)] group hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5500] group-hover:bg-[#FF5500] group-hover:text-white flex items-center justify-center mb-2.5 transition-colors border border-orange-200">
                  <Icon size={16} />
                </div>
                <h4 className="font-bold text-xs text-[#111827] group-hover:text-[#FF5500] transition-colors">
                  {cat.title}
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">{cat.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Chat Stream Window */}
        <div className="bg-white rounded-3xl border border-[#EAE7DF] shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col h-[580px] overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#FAF9F6] px-6 py-3 border-b border-[#EAE7DF] flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-[#111827]">Mazungumzo ya Moja kwa Moja</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">Mulembe18 Knowledge Base</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span>Paybill: <strong className="text-gray-800 font-mono">522522</strong></span>
              <span>•</span>
              <span>USSD: <strong className="text-gray-800 font-mono">*384*18#</strong></span>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
                  {m.sender === "assistant" && (
                    <div className="w-5 h-5 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-[10px]">
                      M
                    </div>
                  )}
                  <span className="font-bold text-gray-600">
                    {m.sender === "user" ? "Wewe" : "Msingi AI"}
                  </span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-3xl p-5 transition-all ${
                    m.sender === "user"
                      ? "bg-[#111827] text-white rounded-br-xs shadow-sm"
                      : "bg-[#FAF9F6] text-gray-900 border border-[#EAE7DF] rounded-bl-xs"
                  }`}
                >
                  {m.sender === "user" ? (
                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  ) : (
                    <RichFormattedText text={m.text} />
                  )}

                  {m.sender === "assistant" && (
                    <div className="mt-4 pt-3 border-t border-[#EAE7DF] flex items-center justify-between text-xs text-gray-500">
                      <span className="text-[11px] text-gray-400">Msingi AI Sauti Model</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => speakText(m.text)}
                          className="hover:text-[#FF5500] text-gray-600 transition-colors flex items-center gap-1.5 font-bold"
                        >
                          <Volume2 size={15} className="text-[#FF5500]" />
                          <span>Sikiliza kwa Sauti</span>
                        </button>
                        <button
                          onClick={() => copyToClipboard(m.text, m.id)}
                          className="hover:text-[#FF5500] text-gray-600 transition-colors flex items-center gap-1.5 font-bold"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check size={15} className="text-emerald-600" />
                              <span className="text-emerald-600">Imenakiliwa</span>
                            </>
                          ) : (
                            <>
                              <Copy size={15} />
                              <span>Nakili</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggestions */}
                {m.actions && m.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2.5 max-w-[90%]">
                    {m.actions.map((act) => (
                      <button
                        key={act}
                        onClick={() => handleSendMessage(act)}
                        className="px-3.5 py-1.5 rounded-full bg-white hover:bg-orange-50 hover:border-[#FF5500] text-[#111827] hover:text-[#FF5500] border border-[#EAE7DF] font-medium text-xs transition-all shadow-2xs flex items-center gap-1.5"
                      >
                        <span>{act}</span>
                        <ArrowRight size={12} className="text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-[#FAF9F6] px-5 py-3.5 rounded-2xl border border-[#EAE7DF] w-fit shadow-xs">
                <div className="w-5 h-5 border-2 border-[#FF5500] border-t-transparent rounded-full animate-spin" />
                <span>Msingi AI anajibu kwa Kiswahili na Kiingereza...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-[#EAE7DF]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3"
            >
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? "Sitisha" : "Ongea kwa sauti"}
                className={`p-3 rounded-full transition-all shrink-0 border border-[#EAE7DF] ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-[#FAF9F6] hover:bg-orange-50 text-gray-600 hover:text-[#FF5500]"
                }`}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? "Ongea sasa, mfumo unanakili..." : "Uliza kuhusu koo za Luhya, michango ya ustawi, nyumba Mombasa..."}
                className="flex-1 px-5 py-3 rounded-full bg-[#FAF9F6] border border-[#EAE7DF] text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5500] transition-all"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-3 rounded-full bg-[#FF5500] hover:bg-[#e04b00] text-white flex items-center gap-2 font-bold text-sm shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <span>Tuma</span>
                <Send size={15} />
              </button>
            </form>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 px-1">
              <span>
                Teknolojia ya <strong>Msingi AI Sauti Model</strong> (Nairobi, Kenya)
              </span>
              <a
                href="https://msingiai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FF5500] font-bold inline-flex items-center gap-1 transition-colors"
              >
                <span>msingiai.com</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

