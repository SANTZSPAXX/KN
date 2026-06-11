import React, { useState } from "react";
import { 
  ArrowLeft, 
  ChevronRight, 
  Cpu, 
  Terminal, 
  Smartphone, 
  Calendar, 
  User, 
  Clock, 
  Download, 
  CheckCircle, 
  FileText, 
  ShieldCheck, 
  BookOpen, 
  Lock, 
  Send,
  Code,
  Layers,
  Wrench,
  ExternalLink,
  Activity
} from "lucide-react";
import { Produto, Ferramenta, AppModel, BlogPost } from "../types";
import { motion } from "motion/react";

// Accent-normalization slug utility
export function toSlug(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

// 1. BlogPost Detail Screen
interface PostDetailPageProps {
  post: BlogPost;
  onBack: () => void;
}

export function PostDetailPage({ post, onBack }: PostDetailPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto py-6 space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition group border border-gray-800 px-4 py-2 rounded-full bg-[#111622] cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para o Blog</span>
        </button>

        {post.url && (
          <a 
            href={post.url} 
            target="_blank" 
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold transition border border-blue-500/20 px-4 py-2 rounded-full bg-blue-500/5 cursor-pointer self-start sm:self-auto"
          >
            <span>Ver Fonte Original</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Hero Header */}
      <div className="space-y-4">
        <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold uppercase font-mono tracking-wider">
          {post.categoria}
        </span>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white leading-tight mt-2">
          {post.titulo}
        </h1>
        <p className="text-sm md:text-base text-gray-400 font-sans leading-relaxed">
          {post.resumo}
        </p>

        {/* Autor e data */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-4 border-t border-gray-800/80">
          <div className="flex items-center gap-1.5 bg-[#111622] px-3 py-1.5 rounded-full border border-gray-800">
            <User className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-slate-300 font-medium">Por: {post.autor}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-gray-500" />
            <span>Publicado em: {post.data}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-500" />
            <span>Leitura: {post.leitura}</span>
          </div>
        </div>
      </div>

      {/* Main post text content box */}
      <div className="bg-[#111622]/55 border border-gray-800 rounded-3xl p-6 md:p-10 space-y-6 text-gray-300 text-sm md:text-base leading-relaxed font-sans">
        {post.conteudo ? (
          <div className="space-y-6">
            {post.conteudo.split("\n\n").map((paragrafo, idx) => {
              if (paragrafo.startsWith("###")) {
                return (
                  <h3 key={idx} className="text-lg md:text-xl font-display font-bold text-white pt-4 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
                    {paragrafo.replace("###", "").trim()}
                  </h3>
                );
              }
              if (paragrafo.startsWith("##")) {
                return (
                  <h2 key={idx} className="text-xl md:text-2xl font-display font-bold text-white pt-6 border-b border-gray-800 pb-2">
                    {paragrafo.replace("##", "").trim()}
                  </h2>
                );
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {paragrafo}
                </p>
              );
            })}
          </div>
        ) : (
          <p className="italic text-gray-500">Postagem resumida, entre em contato para receber o Whitepaper completo de sua implementação.</p>
        )}
      </div>

      {/* Premium Author Signature card */}
      <div className="bg-gradient-to-r from-blue-900/15 to-emerald-950/10 border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase shadow-lg">
            YO
          </div>
          <div>
            <h4 className="text-white text-xs font-bold font-mono uppercase tracking-wide">ASSINATURA EDITORAL</h4>
            <p className="text-sm font-bold text-slate-200 mt-0.5">{post.autor}</p>
            <p className="text-[10px] text-gray-400">Diretoria de Engenharia & Arquitetura CoreNexus Sistemas</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono text-[#34D399] bg-[#10b981]/10 px-2.5 py-1 rounded border border-emerald-500/20 font-bold block">
            REVISÃO COMPACTA LGPD • ID DO POST #{post.id}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// 2. Product Detail Screen
interface ProductDetailPageProps {
  p: Produto;
  onBack: () => void;
}

export function ProductDetailPage({ p, onBack }: ProductDetailPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-5xl mx-auto py-6 space-y-8"
    >
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition group border border-gray-800 px-4 py-2 rounded-full bg-[#111622]"
      >
        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
        <span>Ver Todos os Produtos</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Essential details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 font-mono text-[9px] uppercase font-bold tracking-wider">
                {p.categoria}
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold font-mono uppercase tracking-widest rounded">
                {p.status}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight">
              {p.nome}
            </h1>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed font-sans">
              {p.descricao}
            </p>
          </div>

          {/* Interactive Specification Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="bg-[#111622] border border-gray-800 p-5 rounded-2xl">
              <Cpu className="h-5 w-5 text-blue-400 mb-3" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Integração Remota</h4>
              <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                Suporta chamadas JSON-over-HTTP e Webhooks em tempo de execução com latência média documentada sob os 120ms.
              </p>
            </div>
            <div className="bg-[#111622] border border-gray-800 p-5 rounded-2xl">
              <ShieldCheck className="h-5 w-5 text-emerald-400 mb-3" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Segurança e Proteção</h4>
              <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
                Mecanismos de autenticação rotativa via tokens JWT de expiração rápida, mitigando ataques de personificação.
              </p>
            </div>
          </div>

          {/* Simulated API Integration Snippet */}
          <div className="bg-[#05070c] border border-gray-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">INTEGRAÇÃO CORE_GATEWAY</span>
              <span className="text-[8px] text-blue-400 font-bold">NODEJS / CJS</span>
            </div>
            <pre className="text-slate-300 text-[10px] md:text-xs overflow-x-auto p-2 leading-relaxed select-all">
{`const { CoreNexusClient } = require("@korenexus/sdk");

const client = new CoreNexusClient({
  gatewayToken: process.env.KORE_GATEWAY_TOKEN,
  environment: "production"
});

// Inicializando consulta automatizada sobre o produto
async function runQuery() {
  const response = await client.integrar({
    produtoId: "${p.id}",
    service: "${toSlug(p.nome)}"
  });
  console.log("Status de execução:", response.status);
}`}
            </pre>
          </div>
        </div>

        {/* Right Column: Commercial action card */}
        <div className="bg-gradient-to-br from-[#111622] to-[#0A0D14] border border-gray-800 p-6 rounded-3xl h-fit space-y-6">
          <div>
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">PREÇO CONFIGURADO</span>
            <span className="text-2xl md:text-3xl font-extrabold text-[#34D399] tracking-tight mt-1.5 block">
              {p.preco}
            </span>
            <p className="text-[10px] text-gray-500 mt-1 leading-normal font-sans">
              Valores base passíveis de alteração com base na escala de conexões mensais necessárias para a nuvem da sua empresa.
            </p>
          </div>

          <div className="border-t border-gray-850 pt-4 space-y-3.5">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              <span>Instalação Grátis em Ambiente Sandbox</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              <span>Suporte a SLA Dedicado de até 99.8%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              <span>Conformidade estrita LGPD e SSL256</span>
            </div>
          </div>

          <a 
            href={`https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Encontrei%20o%20produto%20${p.nome}%20na%20plataforma%20e%20gostaria%20de%20conversar%20sobre%20sua%20implantação%20institucional.`}
            target="_blank"
            referrerPolicy="no-referrer"
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-xs shadow-lg shadow-blue-600/20"
          >
            <span>Falar com o Comercial</span>
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// 3. Tool Detail Screen
interface ToolDetailPageProps {
  f: Ferramenta;
  onBack: () => void;
}

export function ToolDetailPage({ f, onBack }: ToolDetailPageProps) {
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[Kernel CoreNexus Ready] Tool initialized: ${f.nome}`,
    `[Security Status] Safe sandboxing context active. Ready for validation queries.`
  ]);

  const handleSimulateTerminal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const payload = terminalInput.trim();
    let reply = "";

    if (f.nome.toLowerCase().includes("valid")) {
      reply = `[Validation Mock Service] Analisando payload: "${payload}" => Sefaz/RFB CNPJ verificado com sucesso. Situação cadastral: ATIVA!`;
    } else if (f.nome.toLowerCase().includes("calc")) {
      reply = `[Calc Engine] Analisando números informados: "${payload}" => Lucro Bruto estimado: 35.8% (Ok). Margem de segurança ajustada.`;
    } else {
      reply = `[KoreEngine] Processando entrada "${payload}" => Comando compilado em 12ms. Logs arquivados com sucesso na planilha corporativa.`;
    }

    setTerminalLogs(prev => [...prev, `> ${terminalInput}`, reply]);
    setTerminalInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto py-6 space-y-8"
    >
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition group border border-gray-800 px-4 py-2 rounded-full bg-[#111622]"
      >
        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
        <span>Ver Todas as Ferramentas</span>
      </button>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 font-mono text-[9px] uppercase font-bold tracking-wider">
            {f.tipo}
          </span>
          <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-bold font-mono uppercase rounded">
            {f.status || "Interna"}
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight">
          {f.nome}
        </h1>
        <p className="text-sm md:text-base text-gray-400 leading-relaxed font-sans">
          Ferramenta utilitária de alta performance projetada para acelerar a validação e formatação automática de pipelines.
        </p>
      </div>

      {/* Terminal Emulator Workspace */}
      <div className="bg-[#05070c] border border-gray-800 rounded-3xl overflow-hidden font-mono text-xs flex flex-col h-[320px] shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-[#111622] border-b border-gray-800/80 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/65"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500/65"></span>
            <span className="h-3 w-3 rounded-full bg-green-500/65"></span>
            <span className="text-[10px] text-gray-400 ml-2 font-mono uppercase tracking-wider font-bold">Simulador Interativo: {f.nome}</span>
          </div>
          <span className="text-[9px] text-[#34D399] tracking-wider font-bold">SALA_DEMO: ATIVA</span>
        </div>

        {/* Console Logs */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-slate-300">
          {terminalLogs.map((log, index) => (
            <p key={index} className={`leading-relaxed whitespace-pre-wrap ${log.startsWith(">") ? "text-blue-400" : "text-emerald-400"}`}>
              {log}
            </p>
          ))}
        </div>

        {/* Input prompt */}
        <form onSubmit={handleSimulateTerminal} className="border-t border-gray-800 flex items-center bg-[#070b14] px-4 py-2.5">
          <span className="text-blue-500 font-bold mr-2 shrink-0">&gt;</span>
          <input 
            type="text" 
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            placeholder="Digite algo para simular um teste rápido no validador..."
            className="flex-1 bg-transparent text-white outline-none border-none text-xs"
          />
          <button type="submit" className="text-[10px] text-gray-400 hover:text-white border border-gray-800 px-2 py-1 rounded bg-[#111622] transition shrink-0 ml-2">
            Testar
          </button>
        </form>
      </div>

      {/* Logistics Utilidade Grid Card */}
      <div className="bg-[#111622] border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-slate-400 text-xs font-bold font-mono uppercase tracking-wider">UTILIDADE DOCUMENTADA</h4>
          <p className="text-white text-sm mt-1 leading-normal font-sans font-medium">{f.utilidade}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {f.link && f.link !== "#" && f.link.trim() !== "" && (
            <a 
              href={f.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-xs shadow-lg shrink-0 flex items-center gap-1.5"
              id={`use-tool-btn-${f.id}`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Usar Ferramenta</span>
            </a>
          )}
          <a 
            href={`https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Utilizei%20o%20validador%20${f.nome}%20pelo%20site%20e%20gostaria%20de%20saber%20como%20utilizar%20esse%20módulo%20comercialmente.`}
            target="_blank"
            referrerPolicy="no-referrer"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-xs shadow-lg shrink-0"
          >
            Solicitar Integração de Módulo
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// 4. App Detail Screen
interface AppDetailPageProps {
  a: AppModel;
  onBack: () => void;
}

export function AppDetailPage({ a, onBack }: AppDetailPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto py-6 space-y-8"
    >
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition group border border-gray-800 px-4 py-2 rounded-full bg-[#111622]"
      >
        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
        <span>Ver Todos os Aplicativos</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Left column info */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 font-mono text-[9px] uppercase font-bold tracking-wider">
                {a.plataforma}
              </span>
              <span className="text-gray-400 text-xs font-mono">
                Downloads estimados: {a.downloads}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight">
              {a.nome}
            </h1>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed font-sans">
              {a.descricao}
            </p>
          </div>

          <div className="bg-[#111622] border border-gray-800 p-5 rounded-2xl">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Diferenciais Técnicos e Operacionais</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {a.detalhes}
            </p>
          </div>
        </div>

        {/* Simulated Mobile Mockup column */}
        <div className="bg-[#111622] border-2 border-gray-850 p-4 rounded-3xl h-[420px] flex flex-col justify-between shadow-2xl relative">
          <div className="w-1/3 h-5 bg-[#05070c] mx-auto rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2"></div>
          
          <div className="text-center pt-8">
            <span className="text-[10px] text-gray-400 font-mono font-bold block uppercase">Visualização de App</span>
            <span className="text-md font-bold text-white tracking-tight mt-1.5 block">{a.nome}</span>
          </div>

          <div className="my-auto bg-[#070b14] border border-gray-800 p-4 rounded-2xl text-center space-y-2">
            <Smartphone className="h-8 w-8 text-blue-400 mx-auto" />
            <h5 className="text-[10px] font-bold text-slate-300">Suporte Offline Ativo</h5>
            <p className="text-[9px] text-gray-400 font-sans leading-relaxed">Este app sincroniza no SQLite interno da empresa com replicação automática de canais via ServiceWorker corporativo.</p>
          </div>

          {a.link && a.link !== "#" && a.link.trim() !== "" ? (
            <a 
              href={a.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-650 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-[11px]"
              id={`download-app-btn-${a.id}`}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Baixar Aplicativo</span>
            </a>
          ) : (
            <a 
              href={`https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Baixei%20o%20app%20${a.nome}%20pelo%20site%20e%20gostaria%20comercialmente%20de%20falar%20sobre%2520suporte.`}
              target="_blank"
              referrerPolicy="no-referrer"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-[11px]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Demonstração (.APK)</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// 5. Documentation Page
interface DocumentationPageProps {
  produtos: Produto[];
  ferramentas: Ferramenta[];
  apps: AppModel[];
  onBack: () => void;
}

export function DocumentationPage({ produtos, ferramentas, apps, onBack }: DocumentationPageProps) {
  const [activeSegment, setActiveSegment] = useState<"api" | "produtos" | "ferramentas" | "notificacoes">("api");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-8 py-6"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-white flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-blue-400" />
            Documentação Técnica do Ecossistema
          </h1>
          <p className="text-xs text-gray-400 mt-1">Descrições, rotas de integração, payloads de feedback e interoperabilidade integrada LGPD.</p>
        </div>
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-white border border-gray-800 px-3.5 py-1.5 rounded-full bg-[#111622] transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar para o Início</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          <button
            onClick={() => setActiveSegment("api")}
            className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition flex items-center gap-2 ${
              activeSegment === "api"
                ? "bg-blue-600/10 border-blue-500 text-blue-400 font-extrabold"
                : "bg-[#111622] border-transparent text-gray-400 hover:bg-gray-800"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>API Gateway (/api/chat)</span>
          </button>

          <button
            onClick={() => setActiveSegment("produtos")}
            className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition flex items-center gap-2 ${
              activeSegment === "produtos"
                ? "bg-blue-600/10 border-blue-500 text-blue-400 font-extrabold"
                : "bg-[#111622] border-transparent text-gray-400 hover:bg-gray-800"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Catálogo Dinâmico de Produtos</span>
          </button>

          <button
            onClick={() => setActiveSegment("ferramentas")}
            className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition flex items-center gap-2 ${
              activeSegment === "ferramentas"
                ? "bg-blue-600/10 border-blue-500 text-blue-400 font-extrabold"
                : "bg-[#111622] border-transparent text-gray-400 hover:bg-gray-800"
            }`}
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>Módulos de Ferramentas</span>
          </button>

          <button
            onClick={() => setActiveSegment("notificacoes")}
            className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold transition flex items-center gap-2 ${
              activeSegment === "notificacoes"
                ? "bg-blue-600/10 border-blue-500 text-blue-400 font-extrabold"
                : "bg-[#111622] border-transparent text-gray-400 hover:bg-gray-800"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Servidor SSE de Notificações</span>
          </button>
        </div>

        {/* Content detail area */}
        <div className="lg:col-span-3 space-y-6">
          
          {activeSegment === "api" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-400" />
                API de Mensageria e Inteligência (/api/chat)
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                A API atua como endpoint de redirecionamento proxy inteligente enviando mensagens ao gateway estruturado de IA. A resposta simula logs técnicos de atendimento e sugestões baseadas no escopo operacional da CoreNexus.
              </p>
              
              <div className="bg-[#05070c] border border-gray-800 rounded-xl p-5 space-y-3 font-mono text-xs">
                <p className="text-emerald-400 text-[10px] font-bold">POST /api/chat</p>
                <p className="text-gray-400 text-[10px]">Exemplo de Payload:</p>
                <pre className="text-slate-300 overflow-x-auto text-[10px] max-w-full">
{`{
  "message": "Quais produtos corporativos vocês desenvolvem?"
}`}
                </pre>
                <p className="text-gray-400 text-[10px]">Estrutura da Resposta:</p>
                <pre className="text-slate-300 overflow-x-auto text-[10px] max-w-full">
{`{
  "response": "Nós desenvolvemos o KoreERP, KoreSefaz e diversos ecossistemas customizados sob medida."
}`}
                </pre>
              </div>
            </div>
          )}

          {activeSegment === "produtos" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-400" />
                Sistemas Corporativos Habilitados para Integração
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Relação dinâmica de dados síncronos lidos em tempo real na planilha do banco de dados corporativo, servidos em formato JSON na rota canônica catalogada a seguir:
              </p>
              
              <div className="bg-[#05070c] border border-gray-800 rounded-xl p-4 font-mono text-xs space-y-2">
                <span className="text-blue-400 font-bold">GET /api/spreadsheet-data</span>
                <span className="text-[10px] text-gray-500 block">Retorna todo o conteúdo sínclito da planilha master, incluindo as seguintes ferramentas e produtos catalogados:</span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                  {produtos.map(p => (
                    <div key={p.id} className="bg-[#111622] p-2 border border-gray-800/80 rounded font-bold text-slate-300 text-[8px] md:text-[9px]">
                      {p.nome} ({p.categoria})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSegment === "ferramentas" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-400" />
                Módulos de Validação do CoreNexus
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Nossos validadores e calculadores de taxas operam em containers de latência ultrabaixa para validações em tempo cirúrgico antes da emissão de dados de faturamento.
              </p>

              <div className="space-y-3">
                {ferramentas.map(f => (
                  <div key={f.id} className="border border-gray-800 p-4 rounded-xl bg-[#111622]/65">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-200">{f.nome}</span>
                      <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{f.status}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">{f.utilidade}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSegment === "notificacoes" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                Servidor SSE (Server-Sent Events) de Notificações
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Suporta transmissão de canais em tempo real baseada em HTTP de mão única. Permite que canais logísticos atualizem demonstrativos corporativos na tela do cliente instantaneamente sem long-polling.
              </p>

              <div className="bg-[#05070c] border border-gray-800 rounded-xl p-4 font-mono text-xs">
                <p className="text-[10px] text-blue-400 font-bold">GET /api/notifications/subscribe</p>
                <p className="text-[10px] text-gray-400 mt-1">Conecta à transmissão contínua com headers Content-Type: text/event-stream.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}

// 6. Privacy Policy Page
interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-4xl mx-auto py-6 space-y-8 font-sans"
    >
      <div className="flex items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white flex items-center gap-2">
            <Lock className="h-6 w-6 text-emerald-400" />
            Política de Privacidade e Proteção de Dados (LGPD)
          </h1>
          <p className="text-xs text-gray-400 mt-1">Declaração de coleta, armazenamento local e conformidade corporativa com a lei nº 13.709/2018.</p>
        </div>
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-gray-300 border border-gray-850 px-3.5 py-1.5 rounded-full bg-[#111622] hover:text-white transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar</span>
        </button>
      </div>

      <div className="bg-[#111622]/55 border border-gray-800 rounded-3xl p-6 md:p-10 space-y-6 text-gray-300 text-xs md:text-sm leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-white font-bold text-sm tracking-wide">1. Introdução e Finalidade</h3>
          <p>
            A CoreNexus Tecnologia Orgânica (doravante designada como "CoreNexus" ou "Plataforma") valoriza a segurança, privacidade e integridade dos dados fornecidos por parceiros, desenvolvedores e administradores corporativos. Esta declaração descreve de forma clara e objetiva nossas obrigações legais com clientes finais coletados e transmitidos.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-white font-bold text-sm tracking-wide">2. Tipos de Dados Coletados</h3>
          <p>
            Processamos unicamente dados operacionais de faturamento base necessários para a catalogação de sistemas e ferramentas sob coordenação editorial. Para o envio de mensageria com o assistente inteligente ChatKore, apenas as perguntas escritas de forma explícita são transmitidas de volta para processamento nos canais API em tempo real.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-white font-bold text-sm tracking-wide">3. Armazenamento e Exibição Sínclita</h3>
          <p>
            As planilhas de faturamento são armazenadas localmente no arquivo estático JSON do servidor de banco de dados nativo sob mitigação contra intrusões de porta aberta. De acordo com a lei geral brasileira de proteção de dados (LGPD), nenhum e-mail privado é exibido publicamente no frontend da aplicação de forma ostensiva.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-white font-bold text-sm tracking-wide">4. Contato de Encarregados de Proteção de Dados (DPO)</h3>
          <p>
            Qualquer usuário ou entidade legal detém direitos expressos de solicitar a alteração ou exclusão definitiva do histórico de publicações do blog e das ferramentas enviando uma notificação legal simplificada diretamente para nosso encarregado corporativo de tecnologia pelo canal comercial ou e-mail representativo oficial: <span className="text-blue-400 font-mono">contato@korenexus.com.br</span>.
          </p>
        </section>
      </div>
    </motion.div>
  );
}
