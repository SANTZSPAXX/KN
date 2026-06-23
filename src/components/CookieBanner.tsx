import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Eye, Settings, Check, X } from "lucide-react";

export default function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Granular Cookie Consent state
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: true,
    performance: true,
    marketing: false
  });

  useEffect(() => {
    // Check local storage for consent decision
    const consent = localStorage.getItem("korenexus_cookie_consent");
    if (!consent) {
      // Show banner after 2 seconds delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const consentData = {
      necessary: true,
      analytics: true,
      performance: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem("korenexus_cookie_consent", JSON.stringify(consentData));
    setIsOpen(false);
  };

  const handleAcceptSelected = () => {
    const consentData = {
      ...preferences,
      necessary: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem("korenexus_cookie_consent", JSON.stringify(consentData));
    setIsOpen(false);
  };

  const handleDeclineAll = () => {
    const consentData = {
      necessary: true,
      analytics: false,
      performance: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem("korenexus_cookie_consent", JSON.stringify(consentData));
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-50 p-5 bg-[#0A0D14]/95 border border-gray-800 rounded-3xl backdrop-blur-md shadow-2xl flex flex-col space-y-4"
          id="cookie-consent-bar"
        >
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-indigo-600/10 border border-indigo-500/25 rounded-2xl text-indigo-400 shrink-0 mt-0.5">
              <Shield className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-white tracking-wide font-display">
                Privacidade & Regulamentos (LGPD)
              </h4>
              <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                A KoreNexus utiliza cookies inteligentes e criptografados para otimizar velocidade de navegação, analisar tráfego e assegurar logs em conformidade estrita com a LGPD.
              </p>
            </div>
          </div>

          {/* Granular Preferences Details */}
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="border-t border-gray-850 pt-3 space-y-2.5"
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-gray-300 font-bold">Cookies Necessários</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-0.5 uppercase">
                  <Check className="h-3 w-3" /> Obrigatório
                </span>
              </div>
              <p className="text-[9px] text-gray-500 leading-relaxed font-sans">
                Garantem a integridade da conexão do dev server, autenticação dos painéis de planilhas e persistência de dados mínimos de sessão.
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                <span className="text-gray-300 font-bold">Análise & Métricas</span>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="rounded border-gray-800 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer h-3.5 w-3.5"
                />
              </div>
              <p className="text-[9px] text-gray-500 leading-relaxed font-sans">
                Coleta dados agregados anonimizados sobre cliques, velocidade do servidor, e taxas de conversão de leads de faturamento.
              </p>

              <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                <span className="text-gray-300 font-bold">Personalização Teclado/UI</span>
                <input
                  type="checkbox"
                  checked={preferences.performance}
                  onChange={(e) => setPreferences({ ...preferences, performance: e.target.checked })}
                  className="rounded border-gray-800 bg-slate-950 text-indigo-600 focus:ring-0 cursor-pointer h-3.5 w-3.5"
                />
              </div>
              <p className="text-[9px] text-gray-500 leading-relaxed font-sans">
                Salva preferências estéticas locais (Dark mode nativo e atalhos rápidos/visuais do console Kflow).
              </p>
            </motion.div>
          )}

          {/* Buttons Action Group */}
          <div className="flex flex-col gap-1.5 pt-1.5">
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <button
                onClick={handleAcceptAll}
                className="py-2.5 px-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/10 cursor-pointer text-center whitespace-nowrap"
              >
                Aceitar Todos
              </button>
              <button
                onClick={showDetails ? handleAcceptSelected : handleDeclineAll}
                className="py-2.5 px-3 bg-[#131924] hover:bg-[#1A2232] border border-gray-800 text-gray-300 font-semibold rounded-xl cursor-pointer text-center"
              >
                {showDetails ? "Salvar Seleção" : "Recusar"}
              </button>
            </div>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="py-1.5 text-center text-[10px] font-mono text-gray-500 hover:text-indigo-400 flex items-center justify-center gap-1 transition"
            >
              <Settings className="h-3 w-3" />
              <span>{showDetails ? "Ocultar preferências de cookies" : "Gerenciar cookies granularmente"}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
