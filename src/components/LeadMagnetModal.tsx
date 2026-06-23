import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, CheckCircle2, ArrowRight, Server, FileText, Smartphone } from "lucide-react";
import { db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";

interface LeadMagnetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadMagnetModal({ isOpen, onClose }: LeadMagnetProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [necessidade, setNecessidade] = useState("erp");
  const [detalhes, setDetalhes] = useState("");

  // Validation feedback state
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Simple robust inputs sanitization
    if (!nome.trim() || nome.trim().length < 3) {
      setValidationError("Por favor, preencha seu nome completo (mínimo de 3 caracteres).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Indique um endereço de e-mail corporativo válido.");
      return;
    }

    const cleanedWhatsapp = whatsapp.replace(/\D/g, "");
    if (cleanedWhatsapp.length < 10) {
      setValidationError("O número de WhatsApp deve conter pelo menos 10 dígitos com DDL.");
      return;
    }

    setIsLoading(true);

    // Construct unified client-attracting Deal object for CRM Kanban pipeline
    const leadId = "lead-" + Date.now();
    const newDeal = {
      id: leadId,
      cliente: nome,
      contatoEmail: email,
      contatoTelefone: whatsapp,
      titulo: `Auditoria: ${necessidade.toUpperCase()}`,
      valor: necessidade === "erp" ? 85000 : necessidade === "kflow" ? 45000 : necessidade === "mobile" ? 60000 : 30000,
      etapa: "prospect",
      prioridade: "alta" as const,
      canal: "Site Hub",
      observacoes: detalhes ? `Foco: ${necessidade}. Notas: ${detalhes}` : `Mapeamento de arquitetura solicitado pelo site para foco em ${necessidade}.`,
      dataCriacao: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 1. Save locally to ensure instant interface reaction
    try {
      const localSaved = localStorage.getItem("korenexus_funil_deals");
      let currentDeals = [];
      if (localSaved) {
        currentDeals = JSON.parse(localSaved);
      }
      currentDeals.unshift(newDeal);
      localStorage.setItem("korenexus_funil_deals", JSON.stringify(currentDeals));
    } catch (err) {
      console.warn("localStorage persistence failed:", err);
    }

    // 2. Persist to Firestore Cloud if active
    const saveToCloud = async () => {
      try {
        await setDoc(doc(db, "deals", leadId), newDeal);
        console.log("Lead successfully stored to Firestore deals collection!");
      } catch (err) {
        console.warn("Could not save lead to Firestore. Falling back to local cache storage.", err);
      }
    };

    saveToCloud().finally(() => {
      setIsLoading(false);
      setStep("success");
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal body */}
        <motion.div
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          className="bg-[#0D111A] border border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl z-10 relative"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#0F1420] border-b border-gray-850 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-blue-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase">Consultoria Estratégica Gratuita</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-full text-gray-400 hover:text-white transition cursor-pointer"
              title="Fechar formulário"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6">
            {step === "form" ? (
              <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                <div className="text-center pb-2">
                  <h3 className="text-base font-display font-semibold text-white">Mapeamento Técnico de Arquitetura</h3>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    Nossos engenheiros analisarão sua infraestrutura de software gratuitamente para elaborar uma proposta conceitual sob medida.
                  </p>
                </div>

                {validationError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] rounded-xl font-mono leading-relaxed">
                     ⚠️ {validationError}
                  </div>
                )}

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Seu Nome *</label>
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: João da Silva"
                      className="w-full bg-[#111622] border border-gray-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition placeholder-gray-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">E-mail Corporativo *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ex: joao@empresa.com"
                        className="w-full bg-[#111622] border border-gray-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition placeholder-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Direct WhatsApp *</label>
                      <input
                        type="text"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="Ex: 11 98888-8888"
                        className="w-full bg-[#111622] border border-gray-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition placeholder-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Qual é o seu foco primordial?</label>
                    <select
                      value={necessidade}
                      onChange={(e) => setNecessidade(e.target.value)}
                      className="w-full bg-[#111622] border border-gray-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition cursor-pointer"
                    >
                      <option value="erp">Sistema ERP personalizado / Mapeamento Comercial</option>
                      <option value="kflow">Motor Kflow AI - Automação sênior de APIs</option>
                      <option value="mobile">Aplicativo Móvel iOS ou Android</option>
                      <option value="audit">DevOps, Sefaz & Integração de Notas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">Conte um pouco sobre as dores de sua empresa</label>
                    <textarea
                      value={detalhes}
                      onChange={(e) => setDetalhes(e.target.value)}
                      placeholder="Ex: Atualmente temos gargalos na emissão de notas e reconciliação dos boletos da planilha..."
                      className="w-full bg-[#111622] border border-gray-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none h-16 resize-none transition placeholder-gray-600"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-750 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/10"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-1 font-mono">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processando Auditoria...
                      </span>
                    ) : (
                      <>
                        <span>Solicitar Auditoria de Arquitetura</span>
                        <ArrowRight className="h-3.5 w-3.5 text-white/80" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // Stunning Thank-you page conversion screen with actions!
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-5"
              >
                <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce mb-2">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-base font-display font-semibold text-white">Solicitação de Auditoria Gravada!</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed max-w-sm mx-auto">
                    Olá <strong>{nome}</strong>! Nossa infraestrutura de engenharia reservou um horário de análise. Iremos entrar em contato pelo e-mail <strong>{email}</strong> ou pelo WhatsApp cadastrado dadas as próximas 2 horas úteis.
                  </p>
                </div>

                {/* Exclusive bonus voucher given as a direct thank you page gift */}
                <div className="p-4 bg-slate-950/60 border border-emerald-500/20 rounded-2xl max-w-sm mx-auto text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1 px-2.5 bg-emerald-500/10 text-emerald-400 border-l border-b border-emerald-500/20 font-mono text-[8px] uppercase tracking-wider font-bold">
                    Cupom de Boas-Vindas
                  </div>
                  
                  <span className="text-[9px] font-mono text-gray-400 block uppercase">Oferta Exclusiva Pos-Conversão</span>
                  <p className="text-xs font-bold text-white mt-1">Voucher de 10% Off de Integração Kflow</p>
                  <div className="mt-3 flex items-center justify-between bg-[#111622] p-2 rounded-xl border border-gray-800">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider">KORENEXUSNEWLOGO</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("KORENEXUSNEWLOGO");
                      }}
                      className="text-[9px] font-mono px-2 py-1 bg-slate-900 border border-gray-800 hover:text-white text-gray-400 rounded-md hover:bg-slate-800 transition"
                    >
                      Copiar Código
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-slate-900 border border-gray-800 hover:bg-slate-850 hover:text-white text-slate-300 text-xs font-semibold rounded-full transition cursor-pointer"
                  >
                    Navegar pelo Catálogo
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
