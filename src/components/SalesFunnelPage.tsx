import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Percent, 
  Sliders, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  Briefcase, 
  AlertCircle, 
  Sparkles, 
  CheckCircle, 
  Flame, 
  CloudLightning, 
  Database, 
  RefreshCw,
  Search,
  Check,
  Building,
  HelpCircle
} from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";

// Stage definition
export interface FunnelStage {
  id: string;
  name: string;
  color: string;
  borderColor: string;
  textColor: string;
  icon: string;
  description: string;
}

export const STAGES: FunnelStage[] = [
  { id: "prospect", name: "Prospecção", color: "bg-blue-500/10", borderColor: "border-blue-500/20", textColor: "text-blue-400", icon: "📥", description: "Leads frios identificados" },
  { id: "qualificado", name: "Qualificação", color: "bg-amber-500/10", borderColor: "border-amber-500/20", textColor: "text-amber-400", icon: "🎯", description: "Contato feito & interesse verificado" },
  { id: "proposta", name: "Proposta Enviada", color: "bg-purple-500/10", borderColor: "border-purple-500/20", textColor: "text-purple-400", icon: "📖", description: "Valores & termos enviados" },
  { id: "negociacao", name: "Negociação", color: "bg-pink-500/10", borderColor: "border-pink-500/20", textColor: "text-pink-400", icon: "🤝", description: "Ajuste de detalhes e fechamento" },
  { id: "ganho", name: "Fechado Ganho", color: "bg-emerald-500/10", borderColor: "border-emerald-500/25", textColor: "text-emerald-400", icon: "🎉", description: "Contrato assinado & faturado" },
  { id: "perdido", name: "Arquivado / Perdido", color: "bg-rose-500/10", borderColor: "border-rose-500/20", textColor: "text-rose-400", icon: "❌", description: "Desistências ou sem fit" }
];

export interface Deal {
  id: string;
  cliente: string;
  contatoEmail: string;
  contatoTelefone: string;
  titulo: string;
  valor: number;
  etapa: string;
  prioridade: "baixa" | "media" | "alta";
  canal: string;
  observacoes: string;
  dataCriacao: string;
  updatedAt: string;
  isCustomManual?: boolean;
}

const DEFAULT_DEALS: Deal[] = [
  {
    id: "deal-1",
    cliente: "Mineração Vale do Sul S.A.",
    contatoEmail: "diretoria@valedosul.com.br",
    contatoTelefone: "(11) 98765-4321",
    titulo: "Implantação KoreCRM ERP Industrial",
    valor: 145000,
    etapa: "negociacao",
    prioridade: "alta",
    canal: "Site",
    observacoes: "Cliente demonstrou muito interesse no módulo de rastreamento de frotas e conciliação bancária rápida Sefaz.",
    dataCriacao: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "deal-2",
    cliente: "Alimentos Bonanza Ltda",
    contatoEmail: "compras@bonanza.com.br",
    contatoTelefone: "(31) 99878-1234",
    titulo: "Upgrade de Licença Premium 15 Usuários",
    valor: 28000,
    etapa: "proposta",
    prioridade: "media",
    canal: "WhatsApp",
    observacoes: "Aguardando aprovação do financeiro do grupo sobre a proposta de 12x sem juros.",
    dataCriacao: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "deal-3",
    cliente: "Tecnologia Nexus S/A",
    contatoEmail: "ceo@nexusinc.com",
    contatoTelefone: "(21) 98555-9000",
    titulo: "Integração Hub Sefaz & SDK Automação",
    valor: 75000,
    etapa: "prospect",
    prioridade: "alta",
    canal: "Parceria",
    observacoes: "Lead de alta relevância que conheceu nosso utilitário de leitura de chaves Sefaz no Sandbox.",
    dataCriacao: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "deal-4",
    cliente: "Drogarias Central Paulista",
    contatoEmail: "financeiro@centralpaulista.com.br",
    contatoTelefone: "(19) 3254-8888",
    titulo: "Módulo Fiscal Integrado (SPED & NFe)",
    valor: 48000,
    etapa: "ganho",
    prioridade: "media",
    canal: "Cold Call",
    observacoes: "Fechado e implantado com sucesso! Treinamento agendado para o próximo dia útil.",
    dataCriacao: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "deal-5",
    cliente: "SoftWorks Brasil",
    contatoEmail: "contato@softworks.com",
    contatoTelefone: "(51) 9777-6655",
    titulo: "Consultoria RPA & Automatização de Fluxo",
    valor: 19500,
    etapa: "qualificado",
    prioridade: "baixa",
    canal: "Indicação",
    observacoes: "Reunião de escopo concluída. Precisa de fluxograma síncrono Kflow.",
    dataCriacao: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function SalesFunnelPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbMode, setDbMode] = useState<"nuvem" | "local">("nuvem");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("todas");

  // Form states for new/editing deal
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  
  const [formCliente, setFormCliente] = useState<string>("");
  const [formTitulo, setFormTitulo] = useState<string>("");
  const [formValor, setFormValor] = useState<number>(15000);
  const [formEmail, setFormEmail] = useState<string>("");
  const [formTelefone, setFormTelefone] = useState<string>("");
  const [formEtapa, setFormEtapa] = useState<string>("prospect");
  const [formPrioridade, setFormPrioridade] = useState<"baixa" | "media" | "alta">("media");
  const [formCanal, setFormCanal] = useState<string>("Site");
  const [formObservacoes, setFormObservacoes] = useState<string>("");

  // Simulated ROI Optimization Slider
  const [simulatedConversionBoost, setSimulatedConversionBoost] = useState<number>(10);

  // Fetch Deals
  useEffect(() => {
    fetchDeals();
  }, [dbMode]);

  const fetchDeals = async () => {
    setLoading(true);
    setErrorMessage(null);

    const localSaved = localStorage.getItem("korenexus_funil_deals");

    if (dbMode === "local") {
      if (localSaved) {
        setDeals(JSON.parse(localSaved));
      } else {
        localStorage.setItem("korenexus_funil_deals", JSON.stringify(DEFAULT_DEALS));
        setDeals(DEFAULT_DEALS);
      }
      setLoading(false);
      return;
    }

    try {
      const dealsCol = collection(db, "deals");
      const querySnapshot = await getDocs(dealsCol);
      
      if (querySnapshot.empty) {
        // Seed initial deals in firebase
        for (const defaultDeal of DEFAULT_DEALS) {
          await setDoc(doc(db, "deals", defaultDeal.id), defaultDeal);
        }
        setDeals(DEFAULT_DEALS);
      } else {
        const dealsList: Deal[] = [];
        querySnapshot.forEach((docSnap) => {
          dealsList.push(docSnap.data() as Deal);
        });
        setDeals(dealsList);
      }
    } catch (err: any) {
      console.warn("Erro ao buscar da Nuvem Firestore. Forçando fallback local.", err);
      setDbMode("local");
      if (localSaved) {
        setDeals(JSON.parse(localSaved));
      } else {
        localStorage.setItem("korenexus_funil_deals", JSON.stringify(DEFAULT_DEALS));
        setDeals(DEFAULT_DEALS);
      }
      setErrorMessage("Não foi possível conectar com o banco de dados Nuvem. Ativamos o Modo Local (Offline completo) automaticamente.");
    } finally {
      setLoading(false);
    }
  };

  // Save changes to db/localStorage
  const saveDeal = async (updatedDealsList: Deal[], singleChangedDeal?: Deal) => {
    const listString = JSON.stringify(updatedDealsList);
    localStorage.setItem("korenexus_funil_deals", listString);
    setDeals(updatedDealsList);

    if (dbMode === "nuvem" && singleChangedDeal) {
      try {
        await setDoc(doc(db, "deals", singleChangedDeal.id), singleChangedDeal);
      } catch (err: any) {
        console.error("Erro ao persistir na cloud:", err);
        setErrorMessage("Erro de gravação Cloud. Sincronizamos localmente.");
      }
    }
  };

  // Delete deal
  const handleDeleteDeal = async (id: string) => {
    const freshList = deals.filter(d => d.id !== id);
    setDeals(freshList);
    localStorage.setItem("korenexus_funil_deals", JSON.stringify(freshList));

    if (dbMode === "nuvem") {
      try {
        await deleteDoc(doc(db, "deals", id));
        showNotification("Negócio removido da Nuvem!");
      } catch (err) {
        setErrorMessage("Não foi possível deletar da nuvem.");
      }
    } else {
      showNotification("Negócio removido localmente!");
    }
  };

  // Move stage fast
  const moveDealStage = async (id: string, direction: "next" | "prev", forceStage?: string) => {
    const currentDeal = deals.find(d => d.id === id);
    if (!currentDeal) return;

    let nextEtapa = currentDeal.etapa;
    if (forceStage) {
      nextEtapa = forceStage;
    } else {
      const currentIndex = STAGES.findIndex(s => s.id === currentDeal.etapa);
      if (direction === "next" && currentIndex < STAGES.length - 1) {
        nextEtapa = STAGES[currentIndex + 1].id;
      } else if (direction === "prev" && currentIndex > 0) {
        nextEtapa = STAGES[currentIndex - 1].id;
      }
    }

    if (nextEtapa === currentDeal.etapa) return;

    const updatedDeal: Deal = {
      ...currentDeal,
      etapa: nextEtapa,
      updatedAt: new Date().toISOString()
    };

    const newDeals = deals.map(d => d.id === id ? updatedDeal : d);
    await saveDeal(newDeals, updatedDeal);
    showNotification(`Etapa atualizada para: ${STAGES.find(s => s.id === nextEtapa)?.name}`);
  };

  const showNotification = (txt: string) => {
    setSuccessMessage(txt);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Clean form state
  const resetForm = () => {
    setIsEditingId(null);
    setFormCliente("");
    setFormTitulo("");
    setFormValor(15000);
    setFormEmail("");
    setFormTelefone("");
    setFormEtapa("prospect");
    setFormPrioridade("media");
    setFormCanal("Site");
    setFormObservacoes("");
    setShowForm(false);
  };

  // Handle edit clicked
  const handleEditClick = (d: Deal) => {
    setIsEditingId(d.id);
    setFormCliente(d.cliente);
    setFormTitulo(d.titulo);
    setFormValor(d.valor);
    setFormEmail(d.contatoEmail || "");
    setFormTelefone(d.contatoTelefone || "");
    setFormEtapa(d.etapa);
    setFormPrioridade(d.prioridade);
    setFormCanal(d.canal || "Site");
    setFormObservacoes(d.observacoes || "");
    setShowForm(true);
  };

  // Submit deal Create / Update
  const handleSubmitDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCliente.trim() || !formTitulo.trim()) {
      setErrorMessage("Por favor, preencha o Nome do Cliente e o Título do Negócio.");
      return;
    }

    const currentId = isEditingId || `deal-${Date.now()}`;
    const newDeal: Deal = {
      id: currentId,
      cliente: formCliente.trim(),
      titulo: formTitulo.trim(),
      valor: formValor,
      contatoEmail: formEmail.trim(),
      contatoTelefone: formTelefone.trim(),
      etapa: formEtapa,
      prioridade: formPrioridade,
      canal: formCanal,
      observacoes: formObservacoes.trim(),
      dataCriacao: isEditingId ? (deals.find(d => d.id === isEditingId)?.dataCriacao || new Date().toISOString()) : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedList: Deal[];
    if (isEditingId) {
      updatedList = deals.map(d => d.id === isEditingId ? newDeal : d);
      showNotification("Negócio atualizado com sucesso!");
    } else {
      updatedList = [newDeal, ...deals];
      showNotification("Novo negócio adicionado ao funil!");
    }

    await saveDeal(updatedList, newDeal);
    resetForm();
  };

  // Calculation helpers
  const activeDeals = deals.filter(d => d.etapa !== "perdido" && d.etapa !== "ganho");
  const wonDeals = deals.filter(d => d.etapa === "ganho");
  const lostDeals = deals.filter(d => d.etapa === "perdido");

  const totalWonValue = wonDeals.reduce((sum, d) => sum + d.valor, 0);
  const totalPipelineValue = deals.reduce((sum, d) => sum + d.valor, 0);
  const activePipelineValue = activeDeals.reduce((sum, d) => sum + d.valor, 0);
  const totalLeadsCount = deals.length;

  const realConversionRate = totalLeadsCount > 0 
    ? Math.round((wonDeals.length / totalLeadsCount) * 100) 
    : 0;

  // Simulate boost
  const simulatedRevenueBoost = Math.round(activePipelineValue * (simulatedConversionBoost / 100));

  // Smart Insights generator
  const getSmartInsights = () => {
    const list: string[] = [];
    
    // 1. High value warning
    const bigDeals = activeDeals.filter(d => d.valor >= 50000);
    if (bigDeals.length > 0) {
      list.push(`🔥 Alta Oportunidade: Atualmente você possui ${bigDeals.length} negócio(s) de alto escalão (acima de R$ 50k) pendente(s). Priorize reuniões diretas de escopo ERP.`);
    }

    // 2. Proposta stagnation
    const propostas = utilsFilterDealsStage("proposta");
    if (propostas.length > 0) {
      list.push(`⏳ Propostas Ativas: Existem ${propostas.length} leads com propostas enviadas recebendo prospecção. Considere enviar o cupom de implementação síncrona KoreNexus.`);
    }

    // 3. Negociacao nudge
    const negociacoes = utilsFilterDealsStage("negociacao");
    if (negociacoes.length > 0) {
      list.push(`🤝 Toque do Sucesso: ${negociacoes.length} lead(s) na reta final de negociação comercial de licenciamento. Garanta um acompanhamento telefônico hoje.`);
    }

    if (list.length === 0) {
      list.push("✨ Ótimo trabalho! Seu pipeline está bem distribuído. Adicione novos leads para impulsionar as conversões síncronas de vendas.");
    }

    return list;
  };

  const utilsFilterDealsStage = (stageId: string) => {
    return deals.filter(
      (d) => 
        d.etapa === stageId && 
        (priorityFilter === "todas" || d.prioridade === priorityFilter) &&
        (d.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
         d.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
         d.canal.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-950 font-sans">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold tracking-widest flex items-center gap-1">
              <Sparkles className="h-3 w-3 animate-spin text-emerald-400" />
              Módulo CRM Integrado
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
          <h2 className="text-3xl font-display font-light text-white tracking-tight">
            KoreCRM <strong className="font-semibold text-emerald-400">Funil de Vendas</strong>
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl mt-1">
            Gestor dinâmico de pipeline de leads corporativos integrado com simulação de conversões fiscais e persistência síncrona Nuvem.
          </p>
        </div>

        {/* Database Sync toggles & Actions */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="flex items-center gap-1 bg-[#05070a] border border-gray-950 rounded-lg p-1 text-xs">
            <button
              onClick={() => setDbMode("nuvem")}
              className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-all text-[10px] uppercase ${
                dbMode === "nuvem"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Database className="h-3 w-3" />
              <span>Nuvem Firestore</span>
            </button>
            <button
              onClick={() => setDbMode("local")}
              className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-all text-[10px] uppercase ${
                dbMode === "local"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <CloudLightning className="h-3 w-3" />
              <span>Offline Local</span>
            </button>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1.8 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <Plus className="h-3.8 w-3.8" />
            <span>Novo Lead</span>
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS & ALERTS */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-start gap-2.5 font-sans"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Nota do Sistema</span>
              {errorMessage}
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white text-md">×</button>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-start gap-2.5 font-sans"
          >
            <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Operação Concluída</span>
              {successMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* METRICS DASHBOARD CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans text-white">
        <div className="p-4 bg-[#05070a]/60 border border-slate-850 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-medium block uppercase tracking-wider">Faturado Ganho</span>
            <span className="text-xl font-bold font-mono text-emerald-400">R$ {totalWonValue.toLocaleString("pt-BR")},00</span>
            <span className="text-[9px] text-gray-400 block mt-0.5">{wonDeals.length} negócios fechados</span>
          </div>
        </div>

        <div className="p-4 bg-[#05070a]/60 border border-slate-850 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-medium block uppercase tracking-wider">Pipeline Ativo</span>
            <span className="text-xl font-bold font-mono text-blue-400">R$ {activePipelineValue.toLocaleString("pt-BR")},00</span>
            <span className="text-[9px] text-gray-400 block mt-0.5">{activeDeals.length} oportunidades em andamento</span>
          </div>
        </div>

        <div className="p-4 bg-[#05070a]/60 border border-slate-850 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Percent className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-medium block uppercase tracking-wider font-sans">Taxa de Conversão</span>
            <span className="text-xl font-bold font-mono text-purple-400">{realConversionRate}%</span>
            <span className="text-[9px] text-gray-400 block mt-0.5">Relação Ganho / Leads Totais</span>
          </div>
        </div>

        <div className="p-4 bg-[#05070a]/60 border border-slate-850 rounded-2xl flex items-center gap-4">
          <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-medium block uppercase tracking-wider">Ticket Médio</span>
            <span className="text-xl font-bold font-mono text-pink-400">
              R$ {totalLeadsCount > 0 ? Math.round(totalPipelineValue / totalLeadsCount).toLocaleString("pt-BR") : 0},00
            </span>
            <span className="text-[9px] text-gray-400 block mt-0.5">Média de R$ por prospecção</span>
          </div>
        </div>
      </div>

      {/* FILTER & ADVANCED SIMULATION WORK DESK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* FILTERS & SEARCH */}
        <div className="p-5 bg-[#05070a]/90 border border-slate-850/80 rounded-2xl text-white space-y-4">
          <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400 flex items-center gap-2">
            <Search className="h-3.8 w-3.8 text-emerald-400" />
            <span>Filtro & Busca Leads</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-gray-400 font-semibold block mb-1.5">Pesquisar Empresa, Título ou Canal</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: Alimentos Bonanza, Vale..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#030406] border border-gray-900 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3.5 top-2.5 text-gray-500 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-gray-400 font-semibold block mb-1.5">Filtro de Prioridade</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full bg-[#030406] border border-gray-900 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/30 font-sans"
              >
                <option value="todas">Todas as Prioridades</option>
                <option value="alta">🔴 Alta Prioridade</option>
                <option value="media">🟡 Média Prioridade</option>
                <option value="baixa">🔵 Baixa Prioridade</option>
              </select>
            </div>
          </div>
        </div>

        {/* INTEL ROI CONVERSION OPTIMIZATION SLIDER */}
        <div className="p-5 bg-[#05070a]/90 border border-slate-850/80 rounded-2xl text-white space-y-4 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-widest font-bold text-emerald-400 flex items-center gap-2">
                <Sliders className="h-3.8 w-3.8" />
                <span>Simulador de ROI & Conversão CRM</span>
              </h3>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                Otimização Ativa
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
              Arraste o controle para simular como uma melhora na eficiência comercial e implantação de ferramentas síncronas de follow-up do KoreCRM pode acelerar seu pipeline de R$ {activePipelineValue.toLocaleString("pt-BR")} em faturamento.
            </p>

            <div className="mt-4 bg-[#030406] p-4 rounded-xl border border-gray-900 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Impulso de Conversão:</span>
                  <span className="text-emerald-400 font-bold">+{simulatedConversionBoost}% de vendas</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  step="1"
                  value={simulatedConversionBoost}
                  onChange={(e) => setSimulatedConversionBoost(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-gray-600 font-mono">
                  <span>Mínimo: +2% (Conversão Rápida)</span>
                  <span>Máximo: +40% (Escalabilidade Industrial)</span>
                </div>
              </div>

              <div className="text-center md:border-l md:border-gray-900 md:pl-4 space-y-1">
                <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Receita Estimada Nova</span>
                <div className="text-lg font-bold text-emerald-400 font-mono">
                  + R$ {simulatedRevenueBoost.toLocaleString("pt-BR")},00
                </div>
                <span className="text-[9px] bg-emerald-500/10 text-gray-400 py-0.5 px-2 rounded-full border border-emerald-500/15">
                  ROI Síncrono Estimado
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SMART INSIGHTS COMERCIAL */}
      <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl text-white font-sans">
        <h4 className="text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-2 flex items-center gap-1.5">
          <Flame className="h-4 w-4 text-emerald-400 animate-pulse" />
          Sugestões & Alertas Inteligentes do KoreCRM
        </h4>
        <div className="space-y-2 text-xs">
          {getSmartInsights().map((insight, idx) => (
            <div key={idx} className="flex gap-2 p-2.5 rounded-lg bg-[#05070a]/70 border border-slate-900">
              <span className="mt-0.5">💎</span>
              <p className="text-slate-300 leading-relaxed font-sans">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* KANBAN BOARD */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-white gap-3 font-sans">
          <RefreshCw className="h-8 w-8 text-emerald-400 animate-spin" />
          <p className="text-xs text-gray-500">Buscando funil de vendas na Nuvem...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start font-sans">
          {STAGES.map((stage) => {
            const stageDeals = utilsFilterDealsStage(stage.id);
            const stageSum = stageDeals.reduce((sum, d) => sum + d.valor, 0);

            return (
              <div 
                key={stage.id} 
                className={`p-3 rounded-2xl border ${stage.color} ${stage.borderColor} flex flex-col gap-3 min-h-[400px] transition-all`}
              >
                {/* Stage title */}
                <div className="flex items-center justify-between pb-1.5 border-b border-gray-900">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="text-sm">{stage.icon}</span>
                    <span className="text-xs font-bold text-white tracking-tight truncate block">
                      {stage.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-900 border border-gray-850 px-2 py-0.5 rounded-md text-gray-400 font-bold shrink-0">
                    {stageDeals.length}
                  </span>
                </div>

                {/* Sub-header value target */}
                <div className="flex justify-between items-center text-[10px] text-gray-400 bg-slate-950/50 p-1.5 rounded-lg font-mono px-2">
                  <span>Meta/Acúmulo:</span>
                  <span className={`font-bold ${stage.textColor}`}>R$ {stageSum.toLocaleString("pt-BR")}</span>
                </div>

                {/* Cards container */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                  <AnimatePresence initial={false}>
                    {stageDeals.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 border border-dashed border-gray-850/40 rounded-xl bg-slate-950/20 px-2">
                        <span className="text-lg opacity-40 mb-1">📭</span>
                        <span className="text-[10px]">Sem leads ativas</span>
                      </div>
                    ) : (
                      stageDeals.map((deal) => {
                        return (
                          <motion.div
                            key={deal.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="p-3.5 bg-slate-950/90 hover:bg-slate-950 border border-slate-900 rounded-xl text-white shadow-xl flex flex-col gap-2.5 border-l-3 group relative transition-all"
                            style={{ borderLeftColor: stage.id === "ganho" ? "#10b981" : stage.id === "perdido" ? "#ef4444" : "#475569" }}
                          >
                            {/* Card Priority badges */}
                            <div className="flex justify-between items-center">
                              <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.8 py-0.4 rounded font-mono ${
                                deal.prioridade === "alta"
                                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/15"
                                  : deal.prioridade === "media"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/15"
                                  : "bg-blue-500/10 text-blue-400 border border-blue-500/15"
                              }`}>
                                {deal.prioridade}
                              </span>
                              <span className="text-[9px] text-gray-500 font-mono font-bold block shrink-0 bg-slate-900 px-1 rounded border border-gray-850">
                                {deal.canal}
                              </span>
                            </div>

                            {/* Info text */}
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors tracking-tight line-clamp-1 leading-relaxed">
                                {deal.cliente}
                              </h4>
                              <p className="text-[10px] text-gray-400 line-clamp-1">
                                {deal.titulo}
                              </p>
                              <div className="text-xs font-bold font-mono text-emerald-400 mt-1">
                                R$ {deal.valor.toLocaleString("pt-BR")},00
                              </div>
                            </div>

                            {/* Contact info details box */}
                            {(deal.contatoEmail || deal.contatoTelefone) && (
                              <div className="pt-2 border-t border-gray-900/60 flex flex-col gap-1 text-[9px] text-gray-400">
                                {deal.contatoEmail && (
                                  <span className="flex items-center gap-1 leading-none truncate">
                                    <Mail className="h-2.5 w-2.5 shrink-0" />
                                    <span className="truncate">{deal.contatoEmail}</span>
                                  </span>
                                )}
                                {deal.contatoTelefone && (
                                  <span className="flex items-center gap-1 leading-none truncate">
                                    <Phone className="h-2.5 w-2.5 shrink-0" />
                                    <span>{deal.contatoTelefone}</span>
                                  </span>
                                )}
                              </div>
                            )}

                            {deal.observacoes && (
                              <p className="text-[9px] text-slate-500 line-clamp-2 leading-relaxed bg-slate-900/40 p-1.5 rounded border border-slate-900/70 select-none">
                                {deal.observacoes}
                              </p>
                            )}

                            {/* Controls actions quick list */}
                            <div className="pt-2 border-t border-gray-900/60 flex items-center justify-between gap-1 mt-1">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => moveDealStage(deal.id, "prev")}
                                  className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-gray-400 hover:text-white transition-colors cursor-pointer border border-gray-850"
                                  title="Mover para Etapa Anterior"
                                >
                                  <ArrowLeft className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => moveDealStage(deal.id, "next")}
                                  className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-gray-400 hover:text-white transition-colors cursor-pointer border border-gray-850"
                                  title="Avançar Etapa"
                                >
                                  <ArrowRight className="h-3 w-3" />
                                </button>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleEditClick(deal)}
                                  className="p-1 text-[9px] font-bold rounded bg-slate-900 hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer border border-gray-850"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteDeal(deal.id)}
                                  className="p-1 rounded bg-slate-900 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer border border-gray-850"
                                  title="Remover Negócio"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL FORM FOR NEW/EDITING DEAL */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-w-lg w-full text-white"
            >
              {/* Form title header */}
              <div className="p-4 bg-slate-950 border-b border-gray-900 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💼</span>
                  <h4 className="text-sm font-bold tracking-tight">
                    {isEditingId ? "Editar Negócio / Oportunidade" : "Novo Lead Registrado no KoreCRM"}
                  </h4>
                </div>
                <button 
                  onClick={resetForm} 
                  className="text-gray-400 hover:text-white text-lg font-bold"
                >
                  ×
                </button>
              </div>

              {/* Form elements */}
              <form onSubmit={handleSubmitDeal} className="p-5 space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                      Cliente / Nome Comercial <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Mineração Vale do Sul S.A."
                      value={formCliente}
                      onChange={(e) => setFormCliente(e.target.value)}
                      className="w-full bg-[#030406] border border-gray-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                      Oportunidade / Título do Negócio <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Implantação ERP Completa ou Licenciamento"
                      value={formTitulo}
                      onChange={(e) => setFormTitulo(e.target.value)}
                      className="w-full bg-[#030406] border border-gray-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                      Valor Financeiro (R$) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formValor}
                      onChange={(e) => setFormValor(Number(e.target.value))}
                      className="w-full bg-[#030406] border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                      Canal de Aquisição
                    </label>
                    <select
                      value={formCanal}
                      onChange={(e) => setFormCanal(e.target.value)}
                      className="w-full bg-[#030406] border border-gray-800 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="Site">Site Oficial</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Indicação">Indicação de Parceiro</option>
                      <option value="Cold Call">Prospecção Fria (Telefone)</option>
                      <option value="Parceria">Afiliação & Parceria</option>
                      <option value="Evento">Eventos / Feiras</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                      Telefone de Contato
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: (11) 98765-4321"
                      value={formTelefone}
                      onChange={(e) => setFormTelefone(e.target.value)}
                      className="w-full bg-[#030406] border border-gray-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                      E-mail do Responsável
                    </label>
                    <input
                      type="email"
                      placeholder="Ex: compras@empresa.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full bg-[#030406] border border-gray-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                      Etapa Inicial do Funil
                    </label>
                    <select
                      value={formEtapa}
                      onChange={(e) => setFormEtapa(e.target.value)}
                      className="w-full bg-[#030406] border border-gray-800 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-emerald-500/50"
                    >
                      {STAGES.map((s) => (
                        <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                      Prioridade Comercial
                    </label>
                    <select
                      value={formPrioridade}
                      onChange={(e) => setFormPrioridade(e.target.value as "baixa" | "media" | "alta")}
                      className="w-full bg-[#030406] border border-gray-800 rounded-lg px-2 py-2 text-xs focus:outline-none focus:border-emerald-500/50"
                    >
                      <option value="alta">🔴 Alta Prioridade</option>
                      <option value="media">🟡 Média Prioridade</option>
                      <option value="baixa">🔵 Baixa Prioridade</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                      Informativos / Histórico / Observação
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Histórico rápido do lead, barreiras, follow-ups necessários..."
                      value={formObservacoes}
                      onChange={(e) => setFormObservacoes(e.target.value)}
                      className="w-full bg-[#030406] border border-gray-800 rounded-lg p-3 text-xs focus:outline-none focus:border-emerald-500/50 resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-900 flex justify-end gap-3.5">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg transition-colors cursor-pointer"
                  >
                    {isEditingId ? "Atualizar Negócio" : "Criador Síncrono"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
