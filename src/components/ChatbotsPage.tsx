import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Bot, 
  Send, 
  MessageSquare, 
  Smartphone, 
  Play, 
  Code, 
  CheckCircle, 
  RefreshCw, 
  BarChart2, 
  Zap, 
  Settings, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Download, 
  FileJson, 
  AlertCircle, 
  Share2, 
  Copy, 
  Globe, 
  Cpu, 
  Users, 
  Eye, 
  Check, 
  FileText, 
  Sliders, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ShoppingBag,
  HelpCircle,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Bot template structures
interface BotTemplate {
  id: string;
  name: string;
  platform: "whatsapp" | "web" | "telegram" | "app";
  description: string;
  avatarColor: string;
  greeting: string;
  prompt: string;
  keywords: { trigger: string; reply: string }[];
}

const BOT_TEMPLATES: BotTemplate[] = [
  {
    id: "tpl-1",
    name: "Suporte Técnico Internet",
    platform: "whatsapp",
    description: "Template otimizado para provedores de internet (ISPs), diagnóstico de conexão, reboot de modems e suporte N1.",
    avatarColor: "bg-indigo-500",
    greeting: "Olá! Seja bem-vindo ao suporte automatizado da KoreLink. 🌐\nPor favor, digite seu CPF ou escolha uma das opções abaixo:\n\n1. Lentidão ou Sem Conexão 📶\n2. Segunda Via de Boleto 🧾\n3. Alterar Plano de Internet 🚀\n4. Falar com Suporte Humano 👤",
    prompt: "Você é o assistente virtual de um provedor de internet de alta velocidade super experiente. Ajude o cliente a reiniciar o modem (tirar da tomada por 30s), verificar cabos coaxiais ou ópticos, ou responder cordial para falar com humanos se nenhuma opção resolver.",
    keywords: [
      { trigger: "1", reply: "Entendo o problema. Na maioria das vezes, desligar o modem da energia elétrica por 30 segundos e ligá-lo novamente resolve problemas de lentidão. Pode fazer este teste agora mesmo? Se persistir, farei um reset remoto." },
      { trigger: "lentidao", reply: "Para problemas de lentidão, certifique-se de que não está baixando arquivos pesados e faça um teste preferencialmente conectado via cabo de rede diretamente ao roteador." },
      { trigger: "2", reply: "Perfeito! Para emitirmos sua segunda via, por favor digite o CPF do titular da conta para localizarmos suas faturas em aberto em nosso sistema." },
      { trigger: "3", reply: "Excelente escolha! Atualmente temos planos promocionais incríveis para sua região, incluindo 500 Mega por apenas R$ 99,90/mês. Gostaria de agendar a migração de pacote?" },
      { trigger: "4", reply: "Estou transferindo você para um analista humano do time de infraestrutura. Aguarde um instante por favor... ⏳" },
      { trigger: "boleto", reply: "Para boletos rápidos, digite 'BOLETO' acompanhado do seu CPF para emitirmos a linha digitável do PIX ou código de barras instantaneamente." }
    ]
  },
  {
    id: "tpl-2",
    name: "Atendimento Clínico & Agendamentos",
    platform: "whatsapp",
    description: "Ideal para clínicas, consultórios médicos e de estética. Agendamentos de consultas automáticas, confirmação de horários.",
    avatarColor: "bg-teal-500",
    greeting: "Olá, bem-vindo à Clínica Saúde Integrada! 🏥✨\nComo posso cuidar de você hoje?\n\n1. Agendar uma Nova Consulta / Retorno 📅\n2. Horários Disponíveis e Convênios 🧬\n3. Endereço e Localização da Clínica 📍\n4. Cancelar ou Reagendar Atendimento ❌",
    prompt: "Você é um atendente de clínica médica extremamente simpático e paciente. Oriente os pacientes sobre médicos disponíveis (Dr. Marcos - Cardiologia, Dra. Ana - Pediatria), convênios aceitos (Unimed, Amil, SulAmérica) e ajude-os com informações de agendamentos.",
    keywords: [
      { trigger: "1", reply: "Para agendar, me diga: qual é a especialidade ou o nome do médico que você está procurando? Temos Clínica Geral, Cardiologia, Pediatria e Dermatologia ativo esta semana." },
      { trigger: "2", reply: "Aceitamos os principais convênios do país: Unimed, Amil, SulAmérica, Bradesco Saúde e Cassi. Para consultas particulares, emitimos recibo completo para reembolso." },
      { trigger: "3", reply: "Nossa matriz fica localizada na Av. Paulista, 1200 - Edifício Corporate Center. Temos estacionamento conveniado com manobrista no local! 🚗 Office 1402." },
      { trigger: "4", reply: "Sem problemas. Digite seu nome completo e a data da consulta que deseja alterar ou cancelar. Nosso time administrativo atualizará sua agenda." }
    ]
  },
  {
    id: "tpl-3",
    name: "Vendas & Carrinho E-commerce",
    platform: "web",
    description: "Assistente virtual para reter abandonos de carrinhos de compras em websites, aplicar cupons, sugerir produtos e tirar dúvidas fiscais.",
    avatarColor: "bg-fuchsia-500",
    greeting: "Ei! Notei que você curtiu alguns produtos incríveis. 🛍️⚡\nSe tiver qualquer dúvida sobre frete, tamanhos ou precisar de um cupom especial, estou aqui!\n\nDigite:\n👉 'CUPOM' para ganhar 10% OFF agora mesmo\n👉 'FRETE' para consultar custo de envio\n👉 'RASTREAMENTO' para saber onde está seu pedido",
    prompt: "Você é o assessor de compras de um e-commerce moderno e jovem. Incentive a venda oferecendo o cupom PRIMEIRA10, explique o prazo de postagem de até 24 horas úteis, e ofereça ajuda com especificações de produtos.",
    keywords: [
      { trigger: "cupom", reply: "Aproveite! Use o cupom **KORE10** na tela de pagamento para garantir 10% de desconto adicional e Frete Grátis na sua primeira compra! 🎁" },
      { trigger: "frete", reply: "Nossas entregas são via Sedex Express ou Transportadora Privada Logística. Digite seu CEP para calcular o prazo preciso e valor do envio automático." },
      { trigger: "rastreamento", reply: "Para rastrear seu pacotinho de amor, informe o código de rastreio iniciado por 'KRX...' ou digite seu e-mail de cadastro." },
      { trigger: "tamanho", reply: "Nossa tabela de medidas é padrão brasileiro. Nas páginas de cada produto ou roupas, há uma imagem intuitiva mostrando as larguras em centímetros com tolerância de 1cm de costura!" }
    ]
  },
  {
    id: "tpl-4",
    name: "Cardápio & Delivery Pizzaria",
    platform: "whatsapp",
    description: "Atendimento completo para pizzarias, hambúrgueres e bares. Anote pedidos, envie opções de sabores e integre taxas de entrega.",
    avatarColor: "bg-amber-600",
    greeting: "Fala, amante de pizza! 🍕🔥\nBem-vindo à Bella Napoli Delivery!\nPreparamos tudo no forno a lenha direto para sua mesa.\n\nEscolha o que deseja fazer hoje:\n1. Ver Cardápio de Pizzas e Bebidas 🍕🥤\n2. Fazer Pedido Rápido 🛒\n3. Consultar Taxa de Entrega para seu CEP 🛵\n4. Status do Meu Pedido no Forno 🕰️",
    prompt: "Você é o pizzaiolo virtual simpático e divertido. Sugira a pizza de Calabresa Especial e a Margherita Premium. Sempre peça o endereço completo e forma de pagamento no final do pedido.",
    keywords: [
      { trigger: "1", reply: "Aqui estão as nossas queridinhas:\n🍕 Calabresa Especial: Molho artesanal, mozzarella, calabresa defumada e cebola roxa - R$ 45,00\n🍕 Margherita Premium: Tomate fresco, manjericão gigante, mozzarella de búfala e azeite - R$ 48,00\n🍕 Portuguesa Clássica: Presunto, ovos, cebola, ervilha e azeitonas pretas - R$ 49,90\n\nQual tamanho deseja? Média (6 fatias) ou Grande (8 fatias)?" },
      { trigger: "2", reply: "Maravilha! Digite quais itens você quer (ex: 1 Pizza Grande Calabresa + 1 Guaraná 2L) e me passe o seu endereço completo de entrega para eu calcular o pedido." },
      { trigger: "3", reply: "Para entregas nos bairros centrais, a taxa é fixa de R$ 6,00. Para demais áreas, digite seu CEP para consultarmos no mapa dinâmico de motoboys." },
      { trigger: "4", reply: "As pizzas saem super rápido! Me diga o número de telefone do pedido ou o código de acompanhamento enviado para darmos o status em tempo real." }
    ]
  }
];

export default function ChatbotsPage() {
  const [bots, setBots] = useState<BotTemplate[]>(BOT_TEMPLATES);
  const [selectedBotId, setSelectedBotId] = useState<string>("tpl-1");
  const [tabWorkspace, setTabWorkspace] = useState<"visual" | "fluxo" | "codigo" | "metricas">("visual");
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "error" }>({ show: false, msg: "", type: "success" });

  // Current selected bot form states
  const currentBot = useMemo(() => bots.find(b => b.id === selectedBotId) || bots[0], [bots, selectedBotId]);

  const [botName, setBotName] = useState(currentBot.name);
  const [botPlatform, setBotPlatform] = useState(currentBot.platform);
  const [botAvatarColor, setBotAvatarColor] = useState(currentBot.avatarColor);
  const [botGreeting, setBotGreeting] = useState(currentBot.greeting);
  const [botPrompt, setBotPrompt] = useState(currentBot.prompt);
  const [botKeywords, setBotKeywords] = useState<{ trigger: string; reply: string }[]>(currentBot.keywords);

  // New keyword trigger form
  const [newTrigger, setNewTrigger] = useState("");
  const [newReply, setNewReply] = useState("");

  // Update form states when selected bot changes
  useEffect(() => {
    setBotName(currentBot.name);
    setBotPlatform(currentBot.platform);
    setBotAvatarColor(currentBot.avatarColor);
    setBotGreeting(currentBot.greeting);
    setBotPrompt(currentBot.prompt);
    setBotKeywords(currentBot.keywords);
  }, [selectedBotId, currentBot]);

  // Integrated Simulator chat states
  const [chatHistory, setChatHistory] = useState<{ role: "assistant" | "user"; content: string; time: string }[]>([
    { role: "assistant", content: currentBot.greeting, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Reset chat history when bot selection or greeting changes
  const resetChat = () => {
    setChatHistory([
      { role: "assistant", content: botGreeting, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
  };

  useEffect(() => {
    resetChat();
  }, [selectedBotId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Save changes of the editing bot to the array
  const handleSaveBot = () => {
    const updated = bots.map(b => {
      if (b.id === selectedBotId) {
        return {
          ...b,
          name: botName,
          platform: botPlatform,
          avatarColor: botAvatarColor,
          greeting: botGreeting,
          prompt: botPrompt,
          keywords: botKeywords
        };
      }
      return b;
    });
    setBots(updated);
    triggerToast("Configurações do Chatbot salvas com sucesso! 🚀", "success");
  };

  // Add a new chatbot
  const handleCreateNewBot = () => {
    const newId = `bot-${Date.now()}`;
    const newCustomBot: BotTemplate = {
      id: newId,
      name: "Novo Chatbot Inteligente",
      platform: "whatsapp",
      description: "Chatbot personalizado criado do zero para responder chamados e leads.",
      avatarColor: "bg-blue-600",
      greeting: "Olá! Como posso ajudar você hoje? Digite sua dúvida ou selecione uma opção.",
      prompt: "Você é um assistente virtual prestativo e cordial. Descubra os problemas e sugira soluções rápidas.",
      keywords: [
        { trigger: "ajuda", reply: "Claro! Posso ajudar com suporte de TI, dúvidas de planos, ou direcionar para um humano responsável." },
        { trigger: "humano", reply: "Estou alertando nosso suporte. Por favor aguarde um momento." }
      ]
    };

    setBots([...bots, newCustomBot]);
    setSelectedBotId(newId);
    triggerToast("Novo chatbot provisionado em nosso estúdio! 🌟");
  };

  // Delete current bot
  const handleDeleteBot = () => {
    if (bots.length <= 1) {
      triggerToast("Erro: Você precisa de no mínimo 1 chatbot ativo.", "error");
      return;
    }
    const filtered = bots.filter(b => b.id !== selectedBotId);
    setBots(filtered);
    setSelectedBotId(filtered[0].id);
    triggerToast("Chatbot excluído com sucesso do painel.");
  };

  // Simulator bot engine (smart static match + AI fallback simulation)
  const handleSendSimulatorMessage = () => {
    if (!chatInput.trim()) return;

    const userMsgText = chatInput;
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Append user message
    setChatHistory(prev => [...prev, { role: "user", content: userMsgText, time: userTime }]);
    setChatInput("");
    setIsTyping(true);

    // Simulate delay for thinking
    setTimeout(() => {
      const lowerInput = userMsgText.toLowerCase().trim();
      let matchedReply = "";

      // Try keyword triggers configured for this bot
      for (const item of botKeywords) {
        if (lowerInput.includes(item.trigger.toLowerCase())) {
          matchedReply = item.reply;
          break;
        }
      }

      // Fallback response with generative vibe based on instructions
      if (!matchedReply) {
        matchedReply = `Compreendo sua mensagem ("${userMsgText}"). Como assistente virtual inteligente configurado para este canal, meu comportamento é guiado pelas diretrizes:\n\n*${botPrompt.substring(0, 180)}...*\n\nSe preferir falar com um atendente, por favor digite "4" ou fale com o suporte principal.`;
      }

      setIsTyping(false);
      setChatHistory(prev => [...prev, {
        role: "assistant",
        content: matchedReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1250);
  };

  // Keyword rules manipulations
  const handleAddKeyword = () => {
    if (!newTrigger.trim() || !newReply.trim()) {
      triggerToast("Digite um Gatilho de Palavra-chave e uma resposta correspondente", "error");
      return;
    }

    // Verify existing
    if (botKeywords.some(k => k.trigger.toLowerCase() === newTrigger.toLowerCase().trim())) {
      triggerToast("Gatilho já registrado! Delete para adicionar novamente.", "error");
      return;
    }

    const updatedKeywords = [...botKeywords, { trigger: newTrigger.trim(), reply: newReply.trim() }];
    setBotKeywords(updatedKeywords);
    setNewTrigger("");
    setNewReply("");
    triggerToast("Nova regra de gatilho adicionada!", "success");
  };

  const handleDeleteKeyword = (triggerToDelete: string) => {
    const updatedKeywords = botKeywords.filter(k => k.trigger !== triggerToDelete);
    setBotKeywords(updatedKeywords);
    triggerToast("Gatilho removido com sucesso.");
  };

  // Dynamic code generations for Website embed
  const webEmbedCode = useMemo(() => {
    return `<!-- KoreNexus Chatbot Widget Embed -->
<script>
  window.KoreNexusBotConfig = {
    botId: "${currentBot.id}",
    botName: "${botName}",
    platform: "website-widget",
    themeColor: "${botAvatarColor.includes('blue') ? '#2563eb' : botAvatarColor.includes('indigo') ? '#6366f1' : botAvatarColor.includes('teal') ? '#14b8a6' : '#d97706'}",
    greetingText: "${botGreeting.replace(/\n/g, '\\n').replace(/"/g, '\\"')}"
  };
</script>
<script src="https://cdn.korenexus.com.br/scripts/v3/widget-chatbot.min.js" async defer></script>
<!-- End of KoreNexus Code -->`;
  }, [currentBot.id, botName, botAvatarColor, botGreeting]);

  // WhatsApp Meta Integration JSON Payload
  const whatsappPayloadCode = useMemo(() => {
    return JSON.stringify({
      object: "whatsapp_business_account",
      entry: [
        {
          id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
          changes: [
            {
              value: {
                messaging_product: "whatsapp",
                metadata: {
                  display_phone_number: "5511989387263",
                  phone_number_id: "PHONE_NUMBER_ID"
                },
                contacts: [
                  {
                    profile: { name: "Cliente Teste" },
                    wa_id: "5511999999999"
                  }
                ],
                messages: [
                  {
                    from: "5511999999999",
                    id: "wamid.HBgLNTUxMTk4OTM4NzI2M1VJZDNBQUFCODRFQQ==",
                    timestamp: "178129034",
                    text: { body: "Olá, gostaria de saber preços" },
                    type: "text"
                  }
                ]
              },
              field: "messages"
            }
          ]
        }
      ],
      ai_routing: {
        agent_identity: botName,
        instructions: botPrompt,
        active_triggers: botKeywords.map(k => k.trigger)
      }
    }, null, 2);
  }, [botName, botPrompt, botKeywords]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`Código ${type} copiado para a área de transferência! 📋`, "success");
  };

  // Metrics simulated for the current bot
  const botStats = useMemo(() => {
    // Generate a pseudo random stats based on botId string hash
    let hash = 0;
    for (let i = 0; i < selectedBotId.length; i++) {
      hash = selectedBotId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const seed = Math.abs(hash);
    const conversas = (seed % 450) + 120;
    const taxaRetencao = 82 + (seed % 15);
    const taxaTransf = 8 + (seed % 9);
    const msgsEnviadas = conversas * 4 + (seed % 200);

    return {
      chats: conversas,
      retention: taxaRetencao,
      transfers: taxaTransf,
      messages: msgsEnviadas,
      satisfaction: 4.4 + (seed % 6) / 10
    };
  }, [selectedBotId]);

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Dynamic Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-6 left-1/2 z-50 px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border ${
              toast.type === "success" 
                ? "bg-emerald-950/95 border-emerald-500/30 text-emerald-400" 
                : "bg-rose-950/95 border-rose-500/30 text-rose-400"
            } max-w-md w-[90%] filter backdrop-blur-md`}
          >
            {toast.type === "success" ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
            <span className="text-xs font-semibold leading-relaxed">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner - Sleek and Sci-Fi Style of KoreNexus */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-800/80 bg-gradient-to-br from-[#0a0f1d] via-[#02050c] to-[#010204] p-6 sm:p-8">
        <div className="absolute right-0 top-0 h-64 w-64 bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute left-1/4 bottom-0 h-48 w-48 bg-purple-500/5 blur-[100px] rounded-full"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <Sparkles className="h-3 w-3 text-blue-400 animate-pulse" />
              KoreNexus Multi-Channel Bot Engines
            </div>
            <h1 className="text-3xl font-display font-black text-white tracking-tight">
              Estúdio de Chatbots para Empresas
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
              Desenvolva, hospede e treine chatbots de inteligência artificial autônomos integrados ao <strong className="text-white">WhatsApp Business</strong>, portais corporativos e aplicativos mobile (KoreNexus App).
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleCreateNewBot}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-indigo-500/10 shrink-0 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Criar Novo Bot
            </button>
            <button
              onClick={resetChat}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#0E1524] border border-gray-800 hover:border-gray-750 text-gray-400 hover:text-white text-xs font-semibold rounded-xl transition"
            >
              <RefreshCw className="h-4 w-4" />
              Limpar Simulador
            </button>
          </div>
        </div>

        {/* Global Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-800/50">
          <div className="space-y-1">
            <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">Engenhos de Chatbots Ativos</p>
            <p className="text-xl font-bold font-mono text-white flex items-center gap-2">
              {bots.length} <span className="text-[10px] text-emerald-400 font-sans font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">Online</span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">Taxa de Resposta Média</p>
            <p className="text-xl font-bold font-mono text-indigo-400">99.98%</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">Giro Mensal de Mensagens</p>
            <p className="text-xl font-bold font-mono text-emerald-400">124.870 <span className="text-[10px] text-gray-500 font-sans">chats</span></p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">Tempo de Resposta por Gateway</p>
            <p className="text-xl font-bold font-mono text-blue-400">&lt; 150ms</p>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Bot Selection and Configuration Form (Columns: 7) */}
        <div className="space-y-6 lg:col-span-7">
          
          {/* Bots List Slider/Selector */}
          <div className="bg-[#0B101D] border border-gray-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-slate-400" />
              Selecione ou Edite uma Inteligência Ativa ({bots.length})
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bots.map((b) => {
                const isSelected = b.id === selectedBotId;
                const plColors = {
                  whatsapp: "text-emerald-400 bg-emerald-400/5 border-emerald-400/20",
                  web: "text-blue-400 bg-blue-400/5 border-blue-400/20",
                  telegram: "text-sky-400 bg-sky-400/5 border-sky-400/20",
                  app: "text-purple-400 bg-purple-400/5 border-purple-400/20"
                };

                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBotId(b.id)}
                    className={`flex items-start text-left p-3 rounded-xl border transition-all relative cursor-pointer group ${
                      isSelected
                        ? "bg-[#0E1528] border-blue-500/80 shadow-md shadow-blue-500/5 text-white"
                        : "bg-slate-950/40 border-gray-850 hover:border-gray-750 text-gray-300 hover:bg-slate-900/40"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-xl shrink-0 ${b.avatarColor} flex items-center justify-center font-bold text-white uppercase text-sm`}>
                      {b.name.substring(0, 2)}
                    </div>
                    <div className="ml-3 flex-1 min-w-0 pr-2">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold truncate block group-hover:text-blue-400 transition">{b.name}</span>
                        {isSelected && <div className="h-1.5 w-1.5 bg-blue-400 rounded-full shrink-0"></div>}
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5 truncate">{b.description || "Sem descrição disponível."}</p>
                      
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className={`text-[8px] font-mono uppercase px-2 py-0.5 rounded-full border ${plColors[b.platform] || "text-gray-400 border-gray-800"}`}>
                          {b.platform}
                        </span>
                        <span className="text-[8.5px] text-gray-500 font-mono">
                          {b.keywords.length} gatilhos
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic workspace TABS */}
          <div className="flex items-center gap-2 border-b border-gray-800 pb-px">
            <button
              onClick={() => setTabWorkspace("visual")}
              className={`pb-3 px-1 text-xs uppercase tracking-wider font-bold transition-all relative border-b-2 flex items-center gap-1.5 cursor-pointer ${
                tabWorkspace === "visual" ? "text-blue-400 border-blue-500" : "text-gray-500 hover:text-white border-transparent"
              }`}
            >
              <Settings className="h-3.5 w-3.5" />
              Parâmetros do Bot
            </button>
            <button
              onClick={() => setTabWorkspace("fluxo")}
              className={`pb-3 px-1 text-xs uppercase tracking-wider font-bold transition-all relative border-b-2 flex items-center gap-1.5 cursor-pointer ${
                tabWorkspace === "fluxo" ? "text-blue-400 border-blue-500" : "text-gray-500 hover:text-white border-transparent"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              Gatilhos & Intenções ({botKeywords.length})
            </button>
            <button
              onClick={() => setTabWorkspace("codigo")}
              className={`pb-3 px-1 text-xs uppercase tracking-wider font-bold transition-all relative border-b-2 flex items-center gap-1.5 cursor-pointer ${
                tabWorkspace === "codigo" ? "text-blue-400 border-blue-500" : "text-gray-500 hover:text-white border-transparent"
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              Código & Integração
            </button>
            <button
              onClick={() => setTabWorkspace("metricas")}
              className={`pb-3 px-1 text-xs uppercase tracking-wider font-bold transition-all relative border-b-2 flex items-center gap-1.5 cursor-pointer ${
                tabWorkspace === "metricas" ? "text-blue-400 border-blue-500" : "text-gray-500 hover:text-white border-transparent"
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5" />
              Métricas & Saúde
            </button>
          </div>

          {/* Tab Content Rendering */}
          <div className="bg-[#0B101D] border border-gray-800 rounded-2xl p-6">
            
            {/* Visual Params tab */}
            {tabWorkspace === "visual" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Comportamento Geral</h3>
                    <p className="text-[11px] text-gray-400">Configure as bases de tom de voz, identidade e dados de recepção.</p>
                  </div>
                  <button
                    onClick={handleDeleteBot}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-950/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 hover:text-rose-300 text-[10px] font-bold uppercase rounded-lg transition"
                    title="Excluir este chatbot do painel"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Excluir Bot
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bot Name Form */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Nome da Inteligência</label>
                    <input
                      type="text"
                      className="w-full bg-[#0E1524] border border-gray-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all font-medium"
                      value={botName}
                      onChange={(e) => setBotName(e.target.value)}
                      placeholder="Ex: Suporte KoreLink"
                    />
                  </div>

                  {/* Platform selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Canal Primário de Implantação</label>
                    <select
                      className="w-full bg-[#0E1524] border border-gray-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all font-medium cursor-pointer"
                      value={botPlatform}
                      onChange={(e) => setBotPlatform(e.target.value as any)}
                    >
                      <option value="whatsapp">📱 WhatsApp Business (Meta API)</option>
                      <option value="web">🌐 Website Widget (Script Embed)</option>
                      <option value="telegram">✈️ Telegram Bot API</option>
                      <option value="app">📲 KoreNexus Smart Companion App</option>
                    </select>
                  </div>
                </div>

                {/* Avatar color styling selector */}
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Cor Visual do Avatar</label>
                  <div className="flex items-center gap-3">
                    {[
                      { bg: "bg-blue-600", label: "Kore Azul" },
                      { bg: "bg-indigo-500", label: "Índigo Tech" },
                      { bg: "bg-teal-500", label: "Verde Clínico" },
                      { bg: "bg-fuchsia-500", label: "Fúcsia E-com" },
                      { bg: "bg-amber-600", label: "Laranja Delivery" },
                      { bg: "bg-rose-500", label: "Vermelho Urgente" },
                      { bg: "bg-slate-700", label: "Cinza Neutro" }
                    ].map((col) => {
                      const active = botAvatarColor === col.bg;
                      return (
                        <button
                          key={col.bg}
                          onClick={() => setBotAvatarColor(col.bg)}
                          className={`h-7 w-7 rounded-full ${col.bg} border-2 flex items-center justify-center transition hover:scale-110 cursor-pointer ${
                            active ? "border-white" : "border-transparent"
                          }`}
                          title={col.label}
                        >
                          {active && <Check className="h-3 w-3 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Greeting text */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Mensagem de Saudação Automática</label>
                    <span className="text-[9px] text-slate-500 font-mono">Primeira interação enviada</span>
                  </div>
                  <textarea
                    rows={4}
                    className="w-full bg-[#0E1524] border border-gray-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all font-medium leading-relaxed font-mono"
                    value={botGreeting}
                    onChange={(e) => setBotGreeting(e.target.value)}
                    placeholder="Olá! Como posso ajudar você hoje?"
                  />
                </div>

                {/* System Prompt Behavior */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Instruções de Personalidade (Prompt Sistêmico)</label>
                    <span className="text-[9px] text-blue-400 font-mono flex items-center gap-0.5">
                      <Sparkles className="h-2.5 w-2.5" /> IA Ativa
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    className="w-full bg-[#0E1524] border border-gray-800 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all font-medium leading-relaxed"
                    value={botPrompt}
                    onChange={(e) => setBotPrompt(e.target.value)}
                    placeholder="Instrua como o assistente deve responder falas complexas..."
                  />
                  <span className="text-[9.5px] text-gray-500 leading-snug block">
                    Nosso motor dinâmico utiliza essas diretrizes para deduzir respostas quando as palavras-chave declaradas na aba "Gatilhos" não forem satisfeitas no diálogo do cliente.
                  </span>
                </div>

                {/* Save button */}
                <div className="pt-3 border-t border-gray-800/60 flex justify-end">
                  <button
                    onClick={handleSaveBot}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-lg shadow-blue-500/5 cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Salvar Mudanças do Bot
                  </button>
                </div>
              </div>
            )}

            {/* Keyword intents trigger tab */}
            {tabWorkspace === "fluxo" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white">Gatilhos de Conversas por Palavra-chave</h3>
                  <p className="text-[11px] text-gray-400">Configure correspondências fixas para redirecionar ou responder as dúvidas mais frequentes dos clientes.</p>
                </div>

                {/* Fast Trigger Creator */}
                <div className="bg-[#0E1524] border border-gray-800 rounded-xl p-4 space-y-4">
                  <h4 className="text-[10.5px] font-bold font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Plus className="h-4 w-4 text-emerald-400" /> Registrar Novo Gatilho Fixo
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-4 space-y-1">
                      <label className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider block">Gatilho (Palavra ou Opção)</label>
                      <input
                        type="text"
                        className="w-full bg-[#0B101D] border border-gray-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-all font-mono"
                        value={newTrigger}
                        onChange={(e) => setNewTrigger(e.target.value)}
                        placeholder="Ex: 1 ou lentidao"
                      />
                    </div>
                    <div className="md:col-span-6 space-y-1">
                      <label className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider block">Resposta do Bot para este Gatilho</label>
                      <input
                        type="text"
                        className="w-full bg-[#0B101D] border border-gray-800 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        placeholder="Ex: Para emitirmos sua segunda via..."
                      />
                    </div>
                    <button
                      onClick={handleAddKeyword}
                      className="md:col-span-2 w-full py-2 px-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition shrink-0 cursor-pointer text-center"
                    >
                      Registrar
                    </button>
                  </div>
                </div>

                {/* List of Registered Keywords */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono tracking-wider uppercase font-bold">
                    <span>Gatilhos Ativos ({botKeywords.length})</span>
                    <span>Ação</span>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {botKeywords.map((k) => (
                      <div 
                        key={k.trigger} 
                        className="bg-slate-950/40 border border-gray-850 hover:border-gray-800/80 rounded-xl p-3 flex items-start justify-between gap-4 transition"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold font-mono uppercase bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                              {k.trigger}
                            </span>
                            <span className="text-[9px] text-gray-500 font-mono">Regra de Gatilho correspondente</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-2 font-sans leading-relaxed">{k.reply}</p>
                        </div>

                        <button
                          onClick={() => handleDeleteKeyword(k.trigger)}
                          className="p-1 px-1.5 bg-rose-950/10 hover:bg-rose-950/30 border border-rose-500/10 hover:border-rose-500/30 text-rose-400 hover:text-rose-300 rounded-lg transition shrink-0 cursor-pointer"
                          title="Remover este gatilho"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}

                    {botKeywords.length === 0 && (
                      <div className="py-8 text-center text-gray-500 text-xs flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="h-7 w-7 text-gray-600" />
                        Nenhum gatilho ou intenção de palavra-chave definida para este bot.
                        <br /><span className="text-[10px] text-gray-600">Ele usará apenas o fluxo generativo do seu Prompt Sistêmico!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fast sync warning */}
                <div className="p-3.5 rounded-xl bg-blue-950/10 border border-blue-500/10 text-gray-400 text-[10px] sm:text-xs leading-relaxed flex items-start gap-2">
                  <AlertCircle className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold mb-0.5">Sincronização em Tempo Real</strong>
                    As alterações adicionadas nessas tabelas de intenções refletem instantaneamente no painel de simulação à direita ("Visualizar de Celular") sem que você precise salvar manualmente a página!
                  </div>
                </div>

              </div>
            )}

            {/* Embedded integrations hub tab */}
            {tabWorkspace === "codigo" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white">Integrações de Canais Digitais</h3>
                  <p className="text-[11px] text-gray-400">Guia de deploy, chaves e códigos de incorporação do seu Bot inteligente.</p>
                </div>

                {/* Embedded Widget */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                      <Globe className="h-4 w-4" /> 1. Incorporar em Websites (HTML Widget Code)
                    </span>
                    <button
                      onClick={() => copyToClipboard(webEmbedCode, "HTML Widget")}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white text-[10px] font-mono cursor-pointer transition bg-[#0E1524] border border-gray-800 px-2 py-1 rounded-lg"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copiar
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-3.5 rounded-xl text-[10px] font-mono text-emerald-400 leading-normal overflow-auto max-h-48 border border-slate-900 border-l-[3px] border-l-indigo-500">
                    {webEmbedCode}
                  </pre>
                  <p className="text-[10px] text-gray-500">Copie e cole esse snippet de código antes da tag de fechamento <code className="text-gray-400 font-mono">&lt;/body&gt;</code> do seu portal HTML ou painéis corporativos (Svelte, React, Angular, etc.).</p>
                </div>

                {/* WhatsApp Cloud API Meta Integration Webhook instructions */}
                <div className="space-y-2 pt-4 border-t border-gray-800/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <Phone className="h-4 w-4" /> 2. WhatsApp Business API (Verificação / Webhook Meta)
                    </span>
                    <button
                      onClick={() => copyToClipboard(whatsappPayloadCode, "JSON Meta Payload")}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white text-[10px] font-mono cursor-pointer transition bg-[#0E1524] border border-gray-800 px-2 py-1 rounded-lg"
                    >
                      <Copy className="h-3.5 w-3.5" /> Copiar JSON Payload
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[10.5px] text-gray-400 font-semibold uppercase tracking-wide">Configuração do Webhook Meta:</p>
                      <div className="bg-slate-950 p-3 rounded-lg space-y-1.5 border border-slate-900">
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
                          <span>URL DO WEBHOOK</span>
                        </div>
                        <p className="text-[10px] font-mono text-white select-all break-all bg-slate-900 px-2 py-1.5 rounded border border-gray-800">
                          https://api.korenexus.com.br/v2/webhooks/whatsapp/{currentBot.id}
                        </p>
                        
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-1.5">
                          <span>TOKEN DE VERIFICAÇÃO</span>
                        </div>
                        <p className="text-[10px] font-mono text-white select-all break-all bg-slate-900 px-2 py-1.5 rounded border border-gray-800">
                          korenexus_token_verify_sec_{currentBot.id.replace("-", "_")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-450 leading-relaxed text-gray-400">
                      <p className="font-semibold text-slate-300">Como ativar no Meta Developers:</p>
                      <ol className="list-decimal list-inside space-y-1 text-[11px]">
                        <li>Acesse o portal de desenvolvedores do Facebook</li>
                        <li>Selecione seu aplicativo e adicione o produto "WhatsApp"</li>
                        <li>Vá em Configurações &gt; Webhooks</li>
                        <li>Clique em Configurar e cole a URL e o Token gerado ao lado</li>
                        <li>Inscreva seu webhook no campo de gatilhos de "messages"</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="p-3.5 rounded-xl bg-indigo-950/10 border border-indigo-500/10 text-gray-400 text-[10px] sm:text-xs leading-relaxed flex items-start gap-2">
                    <ShieldCheck className="h-4.5 w-4.5 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold mb-0.5">Camada de Segurança de Endpoints (Filtro Anti-DDoS)</strong>
                      Nossos gateways possuem redundância e roteamento próprio via Cloudflare, bloqueando automaticamente invasões, comportamentos erráticos ou tentativas de injeção de prompt por parte de clientes em canais abertos.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Metrics & performance audit tab */}
            {tabWorkspace === "metricas" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-white">Métricas de Atendimento & Performance</h3>
                  <p className="text-[11px] text-gray-400">Auditoria ao vivo e estatísticas históricas de conversões de lead deste bot específico.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#0E1524] border border-gray-800 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Conversas</span>
                    <p className="text-lg font-bold font-mono text-white">{botStats.chats}</p>
                    <span className="text-[9px] text-emerald-400 flex items-center gap-0.5">📈 +18% esta semana</span>
                  </div>
                  <div className="bg-[#0E1524] border border-gray-800 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Retenção no Bot</span>
                    <p className="text-lg font-bold font-mono text-indigo-400">{botStats.retention}%</p>
                    <span className="text-[9px] text-gray-500">Sem transbordo humano</span>
                  </div>
                  <div className="bg-[#0E1524] border border-gray-800 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Transbordo Humano</span>
                    <p className="text-lg font-bold font-mono text-rose-400">{botStats.transfers}%</p>
                    <span className="text-[9px] text-gray-500">Intervenções manuais</span>
                  </div>
                  <div className="bg-[#0E1524] border border-gray-800 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider block">Satisfação (CSAT)</span>
                    <p className="text-lg font-bold font-mono text-amber-500">{botStats.satisfaction.toFixed(1)} / 5.0</p>
                    <span className="text-[9px] text-emerald-400">Excelente padrão de tom</span>
                  </div>
                </div>

                {/* Simulation diagnostics status */}
                <div className="space-y-3.5 pt-4 border-t border-gray-800/40">
                  <span className="text-[10.5px] font-bold font-mono text-slate-400 uppercase tracking-widest block">
                    Gargalos de Gatilhos e Resoluções
                  </span>
                  
                  <div className="space-y-2">
                    <div className="bg-slate-950/40 border border-gray-850 rounded-xl p-3 flex items-center justify-between text-xs text-gray-300">
                      <span className="font-semibold text-slate-300">Tempo de ociosidade de canal</span>
                      <span className="text-indigo-400 font-mono font-medium">Médio 14 segundos</span>
                    </div>
                    <div className="bg-slate-950/40 border border-gray-850 rounded-xl p-3 flex items-center justify-between text-xs text-gray-300">
                      <span className="font-semibold text-slate-300">Principais termos sem correspondência ativa</span>
                      <span className="text-amber-500 font-mono font-medium">"nota fiscal", "desconto extra", "endereço filial"</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-500 leading-relaxed font-sans">
                    💡 <strong>Dica da KoreNexus:</strong> Com base nos termos não correspondidos, crie gatilhos fixos para "nota fiscal" ou "desconto extra" na aba "Gatilhos & Intenções" para melhorar a retenção automatizada da inteligência em até 14%!
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Side: High Fidelity WhatsApp & Chat Emulator Workspace (Columns: 5) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 text-emerald-400" />
              Visualizar de Celular / Simulador Live
            </h3>
            <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold animate-pulse bg-indigo-500/10 px-2 py-0.5 border border-indigo-500/20 rounded-full">
              Hospedado
            </span>
          </div>

          {/* High-Fidelity Phone Frame Container */}
          <div className="relative mx-auto max-w-[340px] w-full bg-[#0a0d14] border-[7px] border-slate-800 rounded-[40px] shadow-2xl overflow-hidden aspect-[9/18.5] flex flex-col">
            
            {/* Phone notch aesthetic */}
            <div className="absolute top-[2px] left-1/2 -translate-x-1/2 h-4 w-28 bg-[#1e293b] rounded-b-xl z-50 flex items-center justify-center">
              <div className="h-1.5 w-1.5 bg-slate-950 rounded-full mr-2"></div>
              <div className="h-1 w-8 bg-slate-800 rounded-full"></div>
            </div>

            {/* Smart simulated top bar */}
            <div className="h-9 bg-[#075e54]/90 text-white pt-5 px-5 flex items-center justify-between text-[10px] font-sans shrink-0 z-40 filter backdrop-blur-md border-b border-white/5">
              <span className="font-medium">15:57</span>
              <div className="flex items-center gap-1">
                <span className="font-medium text-[8.5px]">4G+</span>
                <div className="h-2 w-3.5 border border-white/80 rounded-[2px] p-[1px] flex items-center">
                  <div className="h-full w-[85%] bg-white rounded-[1px]"></div>
                </div>
              </div>
            </div>

            {/* High fidelity top row WhatsApp styled header */}
            <div className="h-14 bg-[#075e54] text-white px-3 flex items-center justify-between shrink-0 z-40 shadow-md">
              <div className="flex items-center gap-2">
                {/* Simulated back arrow */}
                <ArrowRight className="h-4 w-4 rotate-180 opacity-80 shrink-0" />
                
                {/* Main Avatar */}
                <div className={`h-9 w-9 rounded-full ${botAvatarColor} flex items-center justify-center font-bold text-white text-xs shrink-0 select-none shadow-inner`}>
                  {botName ? botName.substring(0, 2).toUpperCase() : "KB"}
                </div>
                
                {/* Title & Status */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold leading-tight truncate">{botName || "Atendimento Comercial"}</h4>
                  <p className="text-[8.5px] text-emerald-200 flex items-center gap-1 mt-0.5">
                    <span className="h-1 w-1 bg-emerald-400 rounded-full animate-ping"></span>
                    online agora
                  </p>
                </div>
              </div>

              {/* Top Icons */}
              <div className="flex items-center gap-2.5 text-white/90">
                <Phone className="h-3.5 w-3.5 cursor-pointer hover:text-emerald-200 transition" />
                <Calendar className="h-3.5 w-3.5 cursor-pointer hover:text-emerald-200 transition" />
              </div>
            </div>

            {/* Message Body Wall (Mocking WhatsApp conversation wallpaper) */}
            <div 
              className="flex-1 overflow-y-auto p-3 space-y-3 relative"
              style={{
                backgroundColor: "#efe7dd",
                backgroundImage: "radial-gradient(#dfd5ca 1px, transparent 1px)",
                backgroundSize: "16px 16px"
              }}
            >
              <div className="text-center my-1.5 shrink-0">
                <span className="bg-[#d1e8fc] text-[#2e5070] text-[8.5px] font-sans font-bold py-0.5 px-2 rounded-lg shadow-sm uppercase tracking-wide">
                  CRIPTOGRAFADO POR KORENEXUS SECURITY
                </span>
              </div>

              {/* Bot greeting and conversation stack */}
              {chatHistory.map((msg, idx) => {
                const isBot = msg.role === "assistant";
                return (
                  <div 
                    key={idx} 
                    className={`flex ${isBot ? "justify-start" : "justify-end"} w-full`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm relative ${
                        isBot 
                          ? "bg-white text-gray-800 rounded-tl-none border-l-[3px] border-l-emerald-600" 
                          : "bg-[#d9fdd3] text-gray-900 rounded-tr-none"
                      }`}
                    >
                      {/* Message Content */}
                      <p className="break-words whitespace-pre-line font-sans font-medium text-[11px] text-gray-900">{msg.content}</p>
                      
                      {/* Meta time line */}
                      <div className="flex items-center justify-end gap-1 mt-1 text-[8px] text-gray-400 font-mono">
                        <span>{msg.time}</span>
                        {!isBot && (
                          <div className="flex items-center text-blue-500 text-[9px] font-bold">
                            ✓✓
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Bot is typing feedback */}
              {isTyping && (
                <div className="flex justify-start w-full">
                  <div className="bg-white text-gray-500 rounded-2xl rounded-tl-none px-3.5 py-1.5 shadow-sm text-[10px] font-mono italic flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Text Message Input Row */}
            <div className="p-2.5 bg-[#f0f0f0] flex items-center gap-2 shrink-0 border-t border-gray-300">
              <div className="flex-1 bg-white rounded-full px-3 py-1.5 flex items-center border border-gray-300 shadow-sm min-h-9">
                <input
                  type="text"
                  placeholder="Mensagem..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendSimulatorMessage();
                  }}
                  className="w-full bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none font-sans font-medium"
                />
              </div>

              <button
                onClick={handleSendSimulatorMessage}
                disabled={!chatInput.trim()}
                className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                  chatInput.trim() 
                    ? "bg-[#00a884] text-white hover:scale-105 shadow-md" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

          </div>

          {/* Quick tips emulator explanation */}
          <div className="bg-[#0B101D] border border-gray-800 rounded-xl p-3.5 text-[10px] sm:text-xs text-slate-450 text-gray-400 space-y-1">
            <span className="text-white font-bold block mb-0.5">Teste o seu Atendimento</span>
            Simule conversas como se estivesse no smartphone real de um cliente! experimente digitar os gatilhos cadastrados na tabela ou termos livres para analisar o prompt de comportamento do bot.
          </div>

        </div>

      </div>

    </div>
  );
}
