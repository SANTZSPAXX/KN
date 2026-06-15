import React, { useEffect, useState, useRef } from "react";
import { 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  Box, 
  Compass, 
  Info, 
  Download, 
  Server, 
  Cpu, 
  Sliders, 
  FileText,
  Workflow,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function KoreCadPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeModel, setActiveModel] = useState("Layout Geral");
  const [selectedAxis, setSelectedAxis] = useState<"isometrico" | "topo" | "frontal">("isometrico");
  const [showWireframe, setShowWireframe] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamic script insertion to reliably boot the embed.js on view mounting
    const scriptId = "korecad-embed-script";
    
    // Clean up if there is an existing script
    const existing = document.getElementById(scriptId);
    if (existing) {
      existing.remove();
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://korecad.lovable.app/embed.js";
    script.async = true;
    
    // Append to body after a tiny delay so React finishes DOM painting
    const timer = setTimeout(() => {
      document.body.appendChild(script);
    }, 100);

    return () => {
      clearTimeout(timer);
      const current = document.getElementById(scriptId);
      if (current) {
        current.remove();
      }
    };
  }, [reloadKey]);

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Erro ao ativar tela cheia nativa: ", err);
        // Fallback to absolute viewport full screen state
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Monitor fullscreen change events (e.g. user pressed ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      } else {
        setIsFullscreen(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const triggerResetReload = () => {
    setReloadKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 font-sans relative" id="korecad-tab-root">
      {/* Intro Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-850 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 font-mono text-[9px] uppercase font-bold tracking-widest animate-pulse">
              Engine CAD Ativa v3.0
            </span>
            <span className="text-[10px] text-gray-500 font-mono">ID: KORE_CAD_LIVE</span>
          </div>
          <h2 className="text-3xl font-display font-extrabold text-white mt-1">KoreCad 3D & Layout Designer</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Visualizador CAD e modelador de layouts espaciais embarcado diretamente no ERP KoreNexus. Insira novos elementos industriais, configure dimensões e projete fluxos logísticos de forma autônoma.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={triggerResetReload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111622] hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Reciclar renderizador WebGL e reler embed"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Recarregar Canvas</span>
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#8B5CF6] hover:bg-purple-700 text-white shadow-lg shadow-purple-600/15 transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            <span>{isFullscreen ? "Sair da Tela Cheia" : "Modo Real Tela Cheia"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: CAD Workspace (Left) and Tech telemetry / metrics (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* CAD Canvas Viewer Box (Takes 8 columns or 12 when fullscreen) */}
        <div 
          ref={containerRef}
          className={`lg:col-span-9 bg-[#080B11] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-300 flex flex-col ${
            isFullscreen ? "fixed inset-0 z-50 w-full h-full rounded-none border-none lg:col-span-12" : "min-h-[640px]"
          }`}
          id="korecad-canvas-container"
        >
          {/* Internal Canvas Header / Floating HUD status */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 items-center pointer-events-none">
            <div className="px-3 py-1.5 bg-slate-950/85 backdrop-blur border border-slate-800 rounded-xl text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1.5 shadow-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE GL RENDERING</span>
            </div>
            
            <div className="px-3 py-1.5 bg-slate-950/85 backdrop-blur border border-slate-800 rounded-xl text-[10px] font-mono text-slate-350 flex items-center gap-1.5 shadow-lg">
              <Box className="h-3 w-3 text-purple-400 animate-spin" />
              <span>Modelo: {activeModel}</span>
            </div>
          </div>

          <div className="absolute top-4 right-4 z-10 flex gap-1.5">
            <button
              onClick={handleToggleFullscreen}
              className="p-2 bg-slate-950/85 hover:bg-slate-900 active:scale-95 backdrop-blur border border-slate-800 rounded-xl text-slate-300 hover:text-white transition cursor-pointer shadow-lg pointer-events-auto"
              title="Alternar preenchimento total de tela"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>

          {/* Embed CAD Canvas Mountpoint */}
          <div className="flex-1 w-full bg-[#03060B] flex flex-col justify-center relative">
            {/* The HTML Embed provided by user */}
            <div 
              key={reloadKey}
              className="w-full h-full relative flex items-center justify-center min-h-[640px]" 
              id="korecad-embed-wrapper"
            >
              <div 
                data-korecad 
                data-height="640" 
                className="w-full min-h-[640px] absolute inset-0 rounded-2xl overflow-hidden"
              ></div>
            </div>
          </div>

          {/* Floating Workspace Controls footer inside HUD */}
          <div className="bg-[#05080E] border-t border-slate-850 px-5 py-3.5 flex flex-wrap justify-between items-center gap-3 z-10 select-none text-[11px] font-mono text-gray-500">
            <div className="flex flex-wrap gap-5">
              <span>EIXOS: <span className="text-purple-400 font-bold">X, Y, Z (Automáticos)</span></span>
              <span>GRID: <span className="text-slate-300 font-bold">1m / Unidade</span></span>
              <span>FPS: <span className="text-emerald-400 font-bold">60.0 fps (100%)</span></span>
            </div>
            <div>
              <span>KoreCad Lovable Embedded Engine • click and drag to orbit</span>
            </div>
          </div>
        </div>

        {/* Telemetry and Controls Panel (Right Side - 3 Columns) */}
        {!isFullscreen && (
          <div className="lg:col-span-3 flex flex-col gap-6 font-sans">
            
            {/* Quick Model and Config HUD */}
            <div className="bg-[#0A0D14]/75 border border-slate-800 p-5 rounded-3xl space-y-4 shadow-lg">
              <div className="flex items-center gap-2 border-b border-gray-850 pb-3 text-purple-400">
                <Sliders className="h-4 w-4 text-purple-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">Controles & Variáveis</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-semibold font-mono uppercase">Modelo de Layout Ativo</label>
                  <select 
                    value={activeModel}
                    onChange={(e) => {
                      setActiveModel(e.target.value);
                      triggerResetReload();
                    }}
                    className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-xl p-2.5 outline-none focus:ring-1 focus:ring-purple-500 font-sans"
                  >
                    <option value="Layout Geral">Layout Geral - Galpão Central</option>
                    <option value="Armazém Setor A">Armazém Setor A - Logística</option>
                    <option value="Docas de Expedição">Docas de Expedição & Cargas</option>
                    <option value="Prateleira Inteligente">Prateleira Modular Inteligente</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 pt-1">
                  <label className="text-[10px] text-slate-400 font-semibold font-mono uppercase">Perspectiva Inicial</label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    {(["isometrico", "topo", "frontal"] as const).map((axis) => (
                      <button
                        key={axis}
                        type="button"
                        onClick={() => setSelectedAxis(axis)}
                        className={`py-1 text-[9px] font-mono font-bold capitalize rounded-lg transition-all ${
                          selectedAxis === axis 
                            ? "bg-purple-605 bg-purple-600 text-white shadow" 
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                        }`}
                      >
                        {axis}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-350">
                    <input 
                      type="checkbox"
                      checked={showWireframe}
                      onChange={(e) => setShowWireframe(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-950 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-950 h-3.5 w-3.5 cursor-pointer"
                    />
                    <span>Visualizar Esqueleto (Wireframe)</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={triggerResetReload}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full text-[11px] font-bold transition shadow-lg shadow-purple-600/10 cursor-pointer flex items-center justify-center gap-1.5 font-sans"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Atualizar Sincronização CAD</span>
                </button>
              </div>
            </div>

            {/* Quick System Diagnostics */}
            <div className="bg-[#0A0D14]/70 border border-slate-800 p-5 rounded-3xl space-y-3.5 shadow-lg">
              <div className="flex items-center gap-1.5 text-slate-200">
                <Cpu className="h-4 w-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Telemetria WebGL2</h4>
              </div>

              <div className="space-y-2 font-mono text-[10px] text-gray-400">
                <div className="flex justify-between border-b border-slate-850/60 pb-1.5">
                  <span className="text-slate-500">Versão de Protocolo:</span>
                  <span className="text-slate-350 font-bold">Lovable SSE v1</span>
                </div>
                <div className="flex justify-between border-b border-slate-850/60 pb-1.5">
                  <span className="text-slate-500">Device de Render:</span>
                  <span className="text-emerald-400 font-bold">GPU Hardware Accel</span>
                </div>
                <div className="flex justify-between border-b border-slate-850/60 pb-1.5">
                  <span className="text-slate-500">Vesting Espacial:</span>
                  <span className="text-slate-350">True Linear (1.0)</span>
                </div>
                <div className="flex justify-between pb-0.5">
                  <span className="text-slate-500">Status no Cloud:</span>
                  <span className="text-purple-400 font-bold">CONECTADO</span>
                </div>
              </div>
            </div>

            {/* User Documentation Tip */}
            <div className="bg-slate-950/40 border border-slate-850/70 p-4.5 rounded-2xl flex gap-3 shadow-lg">
              <Info className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-[10px] text-slate-400 leading-relaxed font-sans">
                <strong className="text-white block mb-0.5 font-semibold font-sans">Instalação e Medições rápidas</strong>
                Controle a transição e simulação clicando no modelo para ativar órbitas no canvas. Arraste com o botão esquerdo para rotacionar e clique com o botão direito para arrastar.
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
