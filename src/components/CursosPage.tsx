import React, { useState, useEffect } from "react";
import { GraduationCap, Sparkles, BookOpen, Clock, ShieldCheck, Award, Maximize2, Minimize2 } from "lucide-react";
import FaqSection from "./FaqSection";

export default function CursosPage() {
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Esc keyboard shortcut to exit full screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullScreen(false);
      }
    };
    if (isFullScreen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullScreen]);

  return (
    <div className="space-y-8 animate-fade-in w-full">
      {/* Dynamic Immersive Header */}
      <div className="bg-gradient-to-r from-blue-950/40 via-[#0B0E17]/90 to-indigo-950/40 border border-slate-850 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
            <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">Formação de Excelência KoreNexus</span>
          </div>
          
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Portal de Cursos e Treinamentos Sob Medida
          </h1>
          
          <p className="text-xs md:text-sm text-slate-350 leading-relaxed max-w-2xl font-sans">
            Capacite seus colaboradores a operar nossos sistemas ERP, dominar integrações síncronas de faturamento Sefaz, ou acelerar sua carreira em tecnologia com nossas formações corporativas e de engenharia.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="flex items-center gap-2 bg-[#06080e]/60 p-3 rounded-xl border border-slate-900">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-200 font-bold block">100% Verificado</span>
                <span className="text-[9px] text-slate-500 font-mono">Certificado NF sênior</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#06080e]/60 p-3 rounded-xl border border-slate-900">
              <Clock className="h-4 w-4 text-indigo-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-200 font-bold block">No Seu Ritmo</span>
                <span className="text-[9px] text-slate-500 font-mono">AcessoVitalício h24</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#06080e]/60 p-3 rounded-xl border border-slate-900">
              <Award className="h-4 w-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-200 font-bold block">Selo Promissor</span>
                <span className="text-[9px] text-slate-500 font-mono">Metodologia KoreNexus</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#06080e]/60 p-3 rounded-xl border border-slate-900">
              <BookOpen className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-200 font-bold block">Material Completo</span>
                <span className="text-[9px] text-slate-500 font-mono">Vídeo, PDF e APIs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Portal Widget Container (Full-Screen / Full-Site immersive embed) */}
      <div className="space-y-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
            <h2 className="text-sm font-mono font-bold text-slate-350 uppercase tracking-widest">
              Plataforma de Matrículas Ativas (Full Site Screen)
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFullScreen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/20 text-indigo-300 font-bold rounded-lg text-xs font-mono transition cursor-pointer select-none active:scale-[0.98]"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Colocar em Tela Cheia</span>
            </button>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span>Widget Sincronizado</span>
            </div>
          </div>
        </div>

        {/* Embedded Iframe styled to use maximum available viewport space */}
        <div className={
          isFullScreen
            ? "fixed inset-0 z-[150] bg-[#0A0D14] flex flex-col p-4 md:p-6"
            : "bg-[#0b0e14] rounded-2xl shadow-3xl relative h-[85vh] min-h-[750px] border border-slate-800 flex flex-col overflow-hidden"
        }>
          
          {/* Header bar only when in full screen */}
          {isFullScreen && (
            <div className="flex items-center justify-between pb-3 border-b border-slate-850 mb-3 bg-[#0A0D14]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-600/10 rounded-lg border border-indigo-500/20">
                  <GraduationCap className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">Modo de Aprendizagem Expandido</h3>
                  <p className="text-[10px] text-slate-500 font-mono">KoreNexus Learn Bright Certify Cursos</p>
                </div>
              </div>
              <button
                onClick={() => setIsFullScreen(false)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono font-bold border border-red-500/20 cursor-pointer transition select-none active:scale-[0.98]"
              >
                <Minimize2 className="h-4 w-4" />
                <span>Sair da Tela Cheia [Esc]</span>
              </button>
            </div>
          )}

          {/* Loading status overlay */}
          {!iframeLoaded && (
            <div className="absolute inset-0 bg-[#0A0D14] flex flex-col items-center justify-center gap-4 z-10 p-6 text-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin"></div>
                <GraduationCap className="h-5 w-5 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-200 font-bold text-xs font-sans">Carregando catálogo completo de certificações...</p>
                <p className="text-[10px] text-slate-500 font-mono">Acessando portal de cursos learn-bright-certify.lovable.app</p>
              </div>
            </div>
          )}

          {/* Secure and continuous direct full screen integration */}
          <iframe
            src="https://learn-bright-certify.lovable.app"
            title="KoreNexus Learn Bright Certify Cursos"
            className="w-full h-full border-0 bg-white rounded-xl"
            onLoad={() => setIframeLoaded(true)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* SEO rich semantic schema blocks to boost organic indexability of this course section in SP */}
      <div className="bg-[#0b0e16]/80 border border-slate-850 rounded-2xl p-6 space-y-4 font-sans text-xs text-slate-400 leading-relaxed">
        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
          Diretrizes de SEO e Rastreamento de Soluções Educacionais SP
        </h3>
        <p>
          A KoreNexus garante conformidade estrutural completa para mecanismos de busca sobre nossos treinamentos em <strong>Jundiaí</strong>, <strong>Várzea Paulista</strong>, <strong>Campo Limpo Paulista</strong> e arredores regionais. Cada treinamento síncrono é indexado contendo:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400 text-[11px]">
            <li><strong>Treinamento KoreERP:</strong> Reduza em até 80% o tempo necessário para treinar novos funcionários de sua fábrica no manuseio de inventário e módulos fiscais.</li>
            <li><strong>Treinamento KoreCRM:</strong> Capacite sua força de vendas corporativa a dominar relatórios avançados de acompanhamento, faturamento em lote e metas.</li>
          </ul>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400 text-[11px]">
            <li><strong>Capacitação Kflow AI:</strong> Entenda a arquitetura de canais de relacionamento inteligentes e configuração correta de robôs para validação fiscal rápida de XMLs.</li>
            <li><strong>Treinamento de Integradores:</strong> Formação direta sobre como estruturar barramentos de APIs seguros em conformidade com as exigências técnicas municipais paulistas.</li>
          </ul>
        </div>
      </div>

      {/* Frequently Asked Questions Section targeting data security, deadlines, and direct support in Jundiaí */}
      <FaqSection pageId="cursos" />
    </div>
  );
}
