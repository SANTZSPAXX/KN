import React, { useState, useRef, useEffect } from "react";
import { Message } from "../types";
import { Send, Bot, User, HelpCircle, PhoneCall, Compass, Check, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SUGGESTIONS = [
  "Quais são as soluções sob medida?",
  "Como falar com o WhatsApp oficial?",
  "Qual o horário de atendimento?",
  "Vocês têm Cupons de Desconto ativos?",
  "Quanto custa criar um ERP próprio?"
];

export default function ChatKore() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: "Olá! Sou o **ChatKore**, especialista em tecnologias inteligentes da KoreNexus. Como posso ajudar com sua ideia de Sistema sob medida ou tirar dúvidas sobre nossos aplicativos hoje?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Direct POST to full-stack Express API route to secure the Gemini API Key on server-side
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const result = await response.json();
      if (response.ok && result.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            role: "assistant",
            content: result.reply,
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error(result.error || "Resposta inválida do assistente");
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: `⚠️ Houve uma instabilidade de comunicação temporária com a IA ChatKore. Mas fique tranquilo! Nosso fone corporativo é **(11) 98938-7263** e e-mail é **contato@korenexus.com.br**. Clique no botão "Falar com Humano" acima para ir direto ao WhatsApp.`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render markdown-like text to formatted HTML simple utility
  const formatMessageText = (text: string) => {
    // Simple bold markdown conversion
    let formatted = text;
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Replace hyperlinks with clickable elements (and open in new tab)
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    formatted = formatted.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-brand-blue font-semibold hover:underline bg-white/5 px-2 py-0.5 rounded border border-white/5 ml-1 inline-block">$1</a>');

    // Replace linebreaks
    return <span dangerouslySetInnerHTML={{ __html: formatted.replace(/\n/g, '<br />') }} />;
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-220px)] min-h-[600px] md:h-[calc(100vh-180px)] border border-gray-800 bg-[#0F131F] rounded-2xl overflow-hidden shadow-2xl">
      {/* Bot Header */}
      <div className="p-4 bg-[#111622] border-b border-gray-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white relative">
            <Bot className="h-5 w-5" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-[#111622]"></span>
          </div>
          <div>
            <h3 className="text-white text-sm font-display font-bold leading-none">
              ChatKore
            </h3>
            <span className="text-[9px] text-gray-400 font-mono tracking-wider">ASSISTENTE CORPORATIVO DE ENGENHARIA</span>
          </div>
        </div>

        {/* WhatsApp direct connection link button */}
        <a
          href="https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Estava%20conversando%20com%20o%20ChatKore%20e%20gostaria%20de%20falar%20com%20um%20especialista%20comercial."
          target="_blank"
          referrerPolicy="no-referrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition"
        >
          <PhoneCall className="h-3 w-3" />
          <span>Falar no WhatsApp</span>
        </a>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#0A0D14]/80">
        {messages.map((msg) => {
          const isAi = msg.role === "assistant";
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 max-w-[85%] ${isAi ? "" : "ml-auto flex-row-reverse"}`}
            >
              {/* Balloon */}
              <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                isAi
                  ? "bg-[#111622] border border-gray-800 text-slate-200 rounded-tl-none font-sans"
                  : "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/10 font-sans font-medium"
              }`}>
                {formatMessageText(msg.content)}
              </div>
            </motion.div>
          );
        })}

        {/* Typing Placeholder */}
        {isLoading && (
          <div className="flex items-start gap-2.5 max-w-[85%]">
            <div className="p-3.5 rounded-2xl bg-[#111622] border border-gray-800 text-slate-400 text-xs rounded-tl-none flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-400" />
              <span>Processando resposta...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-4 bg-[#111622] border-t border-gray-800 flex gap-2.5"
      >
        <input
          type="text"
          value={input}
          disabled={isLoading}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "Aguarde a IA..." : "Fale sobre sistemas, horário, WhatsApp comercial, etc..."}
          className="flex-1 bg-[#0A0D14] border border-gray-800 disabled:opacity-50 text-white rounded-full px-5 py-3 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg cursor-pointer shrink-0"
          id="btn-send-message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
