import React, { useEffect, useRef } from "react";
import { FileSpreadsheet, RefreshCw, Layers } from "lucide-react";

export default function SheetsBetaPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = "korenexus-sheets-script";
    
    // Clean up any lingering scripts of the same ID
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    // Reset container contents
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    // Create the script element
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://excelonlinekorenexus.lovable.app/embed.js";
    script.setAttribute("data-target", "#korenexus");
    script.setAttribute("data-height", "720");
    script.async = true;

    // Append to body to load and execute
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5 font-sans">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">KoreNexus Embedded Solutions</span>
          <h2 className="text-2xl font-display font-bold text-white font-sans flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-emerald-400 animate-pulse" />
            <span>Sheets Beta V1</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans max-w-2xl">
            Sua planilha corporativa inteligente integrada ao ecossistema KoreNexus para faturamento, simulações e análise imediata de dados fiscais ERP.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-mono font-semibold uppercase">
            Sistemas Ativo
          </span>
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-mono font-semibold uppercase">
            v1.0-Beta
          </span>
        </div>
      </div>

      {/* Main Sandbox Frame Container */}
      <div className="bg-[#0b1220] border border-gray-800 rounded-3xl p-4 md:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Dynamic target container */}
        <div 
          ref={containerRef}
          id="korenexus" 
          className="w-full rounded-2xl overflow-hidden border border-gray-800/80 min-h-[720px] bg-slate-950/30 font-sans text-center relative flex flex-col justify-center items-center"
        >
          {/* Fallback spinner while script attaches */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-xs z-0 pointer-events-none p-6">
            <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin mb-3" />
            <span className="text-xs font-mono text-gray-300 font-semibold uppercase tracking-wider">Injetando Planilha Inteligente...</span>
            <span className="text-[10px] font-sans text-gray-400 mt-1.5 max-w-xs text-center leading-relaxed">
              Carregando conexões do barramento de dados bidirecionais do KoreNexus Sheets.
            </span>
          </div>
        </div>
      </div>

      {/* Info Warning Footer */}
      <div className="p-4 bg-slate-950/40 border border-gray-850 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-gray-400 font-mono font-sans">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-emerald-400" />
          <span>Faturas, XMLs e tabelas de faturamento local podem ser consolidadas síncronas em formato de planilhas.</span>
        </div>
        <span className="text-gray-500 text-right">KoreNexus Data Sheets</span>
      </div>
    </div>
  );
}
