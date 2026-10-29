"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Volume2,
  VolumeX,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Bot,
  HelpCircle,
  Copy,
  Check,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  Compass,
  Users,
  CreditCard,
  Building2,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  actions?: string[];
}

const defaultSuggestions = [
  "Koo zote 18 za Luhya ni zipi?",
  "Jinsi ya kulipa ada ya Welfare (KES 200)?",
  "Mwongozo wa nyumba na matatu Mombasa",
  "Sherehe ya Isukuti itafanyika lini?",
];

/**
 * Rich message formatter to render markdown (bold, bullets, chips, links) cleanly
 */
function FormattedMessageContent({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-2 text-[13px] leading-relaxed text-gray-800">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        // Bullet point lines
        const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("* ");
        const cleanLine = isBullet ? trimmed.replace(/^[•\-*]\s*/, "") : trimmed;

        // Numbered list lines (e.g. "1. ")
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        const isNumbered = !!numberedMatch;

        // Parse bold **text** and code `code`
        const parseSpans = (raw: string) => {
          // Match **bold**, *italic*, and `code`
          const parts = raw.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
          return parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pIdx} className="font-bold text-[#082f1a]">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith("`") && part.endsWith("`")) {
              const codeVal = part.slice(1, -1);
              return (
                <span
                  key={pIdx}
                  className="inline-block px-1.5 py-0.5 mx-0.5 rounded-md bg-amber-100/90 text-amber-950 font-mono font-bold text-[11px] border border-amber-300/60 shadow-2xs"
                >
                  {codeVal}
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

        if (isNumbered && numberedMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1">
              <span className="w-5 h-5 rounded-full bg-[#0D6E38]/10 text-[#0D6E38] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                {numberedMatch[1]}
              </span>
              <div className="flex-1">{parseSpans(numberedMatch[2])}</div>
            </div>
          );
        }

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DDA71D] shrink-0 mt-2" />
              <div className="flex-1">{parseSpans(cleanLine)}</div>
            </div>
          );
        }

        return <p key={lineIdx}>{parseSpans(trimmed)}</p>;
      })}
    </div>
  );
}

export default function MsingiAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text:
        "**Mulembe muno!** Mimi ni **Msingi AI (Sauti ya Mulembe)**, msaidizi wako wa kitamaduni na kidijitali nchini Kenya.\n\n" +
        "Ninaweza kukusaidia kuhusu:\n" +
        "• **Koo 18 za Luhya:** Asili, mila, koo ndogo na maeneo ya nyumbani.\n" +
        "• **Mfuko wa Ustawi:** Michango ya M-Pesa (`522522`), ada ya KES 200, na fomu za rambirambi.\n" +
        "• **Mwongozo wa Wageni:** Kupata nyumba na usafiri wa matatu Mombasa.\n" +
        "• **Matawi ya Kenya:** Tawi la Mombasa, Nairobi, Kisumu, Nakuru na Eldoret.",
      timestamp: "Sasa hivi",
      actions: defaultSuggestions,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen for custom trigger events from Header or buttons
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-msingi-ai", handleOpen);
    return () => window.removeEventListener("open-msingi-ai", handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Voice playback using Web Speech API (Swahili / English)
  const speakText = (text: string) => {
    if (!soundEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`•\-]/g, "").slice(0, 260);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "sw-KE";
      utterance.rate = 0.96;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis unavailable:", e);
      setIsPlayingAudio(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  // Voice Recognition (Speech-to-Text)
  const toggleListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Kifaa chako hakitumii utambuzi wa sauti moja kwa moja. Tafadhali andika ujumbe wako.");
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
    } catch (err) {
      console.warn("Speech recognition error:", err);
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
          "Samahani, mtandao umekumbana na ucheleweshaji mdogo. Unaweza kupiga simu kwa **0712 345 678** au kutumia menyu kuu ya Mulembe18 kupata msaada wa haraka wa wazee wa jumuia.",
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
    <>
      {/* Floating Trigger Pill in Bottom Right (Agnos Style) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#111827] hover:bg-black text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 border border-[#EAE7DF]"
          aria-label="Open Msingi AI Assistant"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#FF5500] text-white flex items-center justify-center font-black shadow-xs">
              <Sparkles size={16} />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#111827]" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-wide">
                Msingi AI
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FAF9F6] text-[#111827] border border-[#EAE7DF] font-bold uppercase tracking-wider">
                KE
              </span>
            </div>
            <span className="text-[10px] text-gray-400 block -mt-0.5 font-medium">
              Sauti ya Mulembe
            </span>
          </div>
        </button>
      )}

      {/* Slide-Up Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col bg-[#FAF9F6] rounded-3xl shadow-2xl border border-[#EAE7DF] overflow-hidden transition-all duration-300 ${
            isExpanded
              ? "inset-4 sm:inset-8 w-auto h-auto max-h-none"
              : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[440px] max-h-[85vh] h-[660px]"
          }`}
        >
          {/* Top Bar / Header */}
          <div className="bg-[#111827] text-white px-5 py-4 flex items-center justify-between border-b border-[#EAE7DF]/20 relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-[#FF5500] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Sparkles size={20} />
                </div>
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#111827]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white tracking-tight">
                    Msingi AI
                  </h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20 font-bold uppercase tracking-wider">
                    Kenya
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span>Sauti Model</span>
                  <span>•</span>
                  <span>Cultural AI Assistant</span>
                  {isPlayingAudio && (
                    <span className="flex items-center gap-0.5 text-[#FF5500] animate-pulse">
                      <Volume2 size={11} />
                      <span className="text-[10px]">Inasoma...</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Voice toggle */}
              <button
                onClick={() => {
                  if (isPlayingAudio) stopSpeaking();
                  setSoundEnabled(!soundEnabled);
                }}
                title={soundEnabled ? "Sauti Iwashwe (Voice On)" : "Sauti Izimwe (Voice Off)"}
                className={`p-2 rounded-xl transition-colors ${
                  soundEnabled
                    ? "text-[#FF5500] bg-white/10 hover:bg-white/20"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
                aria-label="Toggle Voice"
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Expand / Minimize Window */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Punguza Dirisha" : "Kuza Dirisha"}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors hidden sm:block"
                aria-label="Toggle window size"
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              {/* Close */}
              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Funga Msingi AI"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Context Bar */}
          <div className="bg-white px-4 py-2 border-b border-[#EAE7DF] flex items-center justify-between text-[11px] text-gray-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#FF5500]" />
              <span className="font-semibold text-gray-700">Mulembe18 Intelligent Desk</span>
            </div>
            <Link
              href="/ai"
              onClick={() => setIsOpen(false)}
              className="text-[#111827] hover:text-[#FF5500] font-bold inline-flex items-center gap-1 transition-colors"
            >
              <span>Ukurasa Kamili</span>
              <ArrowRight size={11} />
            </Link>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                {/* Avatar + Label Header */}
                <div
                  className={`flex items-center gap-1.5 mb-1 text-[11px] text-gray-400 font-medium ${
                    m.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.sender === "assistant" && (
                    <div className="w-4 h-4 rounded-full bg-[#DDA71D] text-[#082f1a] flex items-center justify-center font-black text-[9px]">
                      M
                    </div>
                  )}
                  <span>{m.sender === "user" ? "Wewe" : "Msingi AI"}</span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
                </div>

                {/* Bubble Container */}
                <div
                  className={`max-w-[88%] rounded-2xl p-4 shadow-xs relative transition-all ${
                    m.sender === "user"
                      ? "bg-[#111827] text-white rounded-br-xs shadow-xs"
                      : "bg-white text-gray-900 border border-[#EAE7DF] rounded-bl-xs shadow-xs"
                  }`}
                >
                  {/* Message formatted content */}
                  {m.sender === "user" ? (
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  ) : (
                    <FormattedMessageContent text={m.text} />
                  )}

                  {/* Actions Bar for Assistant */}
                  {m.sender === "assistant" && (
                    <div className="mt-3 pt-2.5 border-t border-[#EAE7DF] flex items-center justify-between text-[11px] text-gray-500">
                      <span className="text-[10px] text-gray-400">Msingi Sauti Engine</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => speakText(m.text)}
                          title="Sikiliza kwa Sauti"
                          className="hover:text-[#FF5500] text-gray-500 transition-colors flex items-center gap-1 font-medium"
                        >
                          <Volume2 size={13} className="text-[#FF5500]" />
                          <span>Sikiliza</span>
                        </button>
                        <button
                          onClick={() => copyToClipboard(m.text, m.id)}
                          title="Nakili jibu"
                          className="hover:text-[#FF5500] text-gray-500 transition-colors flex items-center gap-1 font-medium"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check size={13} className="text-emerald-600" />
                              <span className="text-emerald-600 font-bold">Imenakiliwa</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>Nakili</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggested Action Chips */}
                {m.actions && m.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {m.actions.map((act) => (
                      <button
                        key={act}
                        onClick={() => handleSendMessage(act)}
                        className="px-3 py-1.5 rounded-full bg-white hover:bg-orange-50 hover:border-[#FF5500] text-[#111827] hover:text-[#FF5500] border border-[#EAE7DF] font-medium text-[11px] transition-all shadow-2xs flex items-center gap-1 text-left transform active:scale-95"
                      >
                        <span>{act}</span>
                        <ArrowRight size={11} className="text-gray-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2.5 text-xs text-gray-600 bg-white px-4 py-3 rounded-2xl border border-[#EAE7DF] w-fit shadow-xs animate-pulse">
                <div className="w-4 h-4 border-2 border-[#FF5500] border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">Msingi AI anajibu kwa Kiswahili na Kiingereza...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 bg-white border-t border-[#EAE7DF]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Mic Speech-to-Text Button */}
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? "Inasikiliza... Bofya kusitisha" : "Ongea kwa sauti"}
                className={`p-2.5 rounded-2xl transition-all shrink-0 border border-[#EAE7DF] ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-[#FAF9F6] hover:bg-orange-50 text-gray-600 hover:text-[#FF5500]"
                }`}
                aria-label="Voice Input"
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? "Ongea sasa... inasikiliza..." : "Uliza chochote kuhusu Mulembe, koo, ustawi..."}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE7DF] text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5500] transition-all"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-10 h-10 rounded-2xl bg-[#FF5500] hover:bg-[#e04b00] text-white flex items-center justify-center shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Tuma Ujumbe"
              >
                <Send size={15} />
              </button>
            </form>

            {/* Sub-footer credits & links */}
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-gray-500 px-1">
              <span className="flex items-center gap-1">
                <span>Inaendeshwa na</span>
                <strong className="text-gray-700">Msingi AI</strong>
                <span>(Nairobi, Kenya)</span>
              </span>
              <a
                href="https://msingiai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0D6E38] font-semibold inline-flex items-center gap-1 transition-colors"
              >
                <span>msingiai.com</span>
                <ExternalLink size={9} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
