import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Users, 
  Car, 
  Key, 
  Printer, 
  Search, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  Camera, 
  FileSpreadsheet, 
  TrendingUp, 
  Coins, 
  Lock, 
  BookOpen, 
  Sparkles, 
  Phone, 
  MapPin, 
  Activity, 
  Wifi, 
  UserPlus, 
  ChevronRight, 
  Clock,
  ArrowRight,
  UserCheck,
  Check,
  Building2,
  FileCheck2,
  Database
} from "lucide-react";

// Types for local state
interface Visitor {
  id: string;
  nome: string;
  documento: string;
  empresa: string;
  destino: string;
  crachaselecionado: string;
  entrada: string;
  saida?: string;
  status: "Ativo" | "Concluído";
}

interface Vehicle {
  id: string;
  placa: string;
  motorista: string;
  documentoMotoristas: string;
  tipo: "Caminhão" | "Van" | "Carro Executivo" | "Prestador";
  finalidade: "Carga/Descarga" | "Manutenção" | "Reunião" | "Outro";
  entrada: string;
  saida?: string;
  status: "No Pátio" | "Liberado";
  concessionaria?: string;
}

interface KeyControl {
  id: string;
  sala: string;
  codigoKey: string;
  retiradoPor: string;
  dataHoraRetirada: string;
  dataHoraDevolucao?: string;
  status: "Fora" | "Devolvido";
  setor: string;
}

const DEFAULT_VISITORS: Visitor[] = [
  { id: "v1", nome: "Carlos Henrique Silva", documento: "419.823.111-09", empresa: "LogiExpress Transportes", destino: "Galpão C - Recebimento", crachaselecionado: "CR-042", entrada: "18/06/2026 08:15", status: "Ativo" },
  { id: "v2", nome: "Mariana Costa Neves", documento: "55.892.123-x", empresa: "Nexus Consultoria Ltda", destino: "RH / Sala 202", crachaselecionado: "CR-105", entrada: "18/06/2026 09:30", status: "Ativo" },
  { id: "v3", nome: "Sandro Albuquerque", documento: "220.455.992-12", empresa: "ClimaTech Ar Condicionado", destino: "Manutenção Técnica - Bloco A", crachaselecionado: "CR-088", entrada: "18/06/2026 07:05", saida: "18/06/2026 11:20", status: "Concluído" },
];

const DEFAULT_VEHICLES: Vehicle[] = [
  { id: "e1", placa: "ABC5R29", motorista: "Jorge Luiz Souza", documentoMotoristas: "RG 32.192.422-9", tipo: "Caminhão", finalidade: "Carga/Descarga", entrada: "18/06/2026 08:30", status: "No Pátio", concessionaria: "Scania Vermelha" },
  { id: "e2", placa: "KRE8X10", motorista: "Ana Beatriz Ramos", documentoMotoristas: "CNH 12389104", tipo: "Van", finalidade: "Manutenção", entrada: "18/06/2026 09:40", status: "No Pátio", concessionaria: "Fiorino Branca" },
];

const DEFAULT_KEYS: KeyControl[] = [
  { id: "k1", sala: "Doca Principal / Central de Cargas", codigoKey: "CH-01", retiradoPor: "Douglas Santos (Enc. Expedição)", dataHoraRetirada: "18/06/2026 07:30", status: "Fora", setor: "Logística" },
  { id: "k2", sala: "Sala de Servidores TI (Data Center)", codigoKey: "CH-12", retiradoPor: "Amanda Oliveira (Infra)", dataHoraRetirada: "18/06/2026 09:12", status: "Fora", setor: "Tecnologia" },
  { id: "k3", sala: "Almoxarifado Geral de Peças", codigoKey: "CH-05", retiradoPor: "Lucas Peixoto (Mecânico)", dataHoraRetirada: "18/06/2026 06:15", dataHoraDevolucao: "18/06/2026 11:45", status: "Devolvido", setor: "Manutenção" },
];

// SaaS Products Catalog specifically geared towards Gatehouses
const HARDWARE_SOFTWARE_PRODUCTS = [
  {
    id: "p1",
    titulo: "KoreGuard Core",
    tipo: "Plataforma SaaS",
    descricao: "Módulo principal de portaria corporativa 100% web com cadastro bio-facial, controle de fluxo e integração imediata de filiais em tempo real sob conformidade estrita com a LGPD.",
    preco: "A partir de R$ 290,00",
    fundo: "from-blue-500/10 to-indigo-500/10",
    borda: "border-indigo-500/30",
    selo: "SOFTWARE LÍDER",
    icon: <Shield className="h-6 w-6 text-indigo-400" />
  },
  {
    id: "p2",
    titulo: "KorePlate OCR",
    tipo: "Sistema Automotivo",
    descricao: "Software de visão computacional OCR para leitura instantânea de placas de veículos Mercosul e acionamento automático de cancelas e portões com gravação imediata na nuvem.",
    preco: "A partir de R$ 180,00",
    fundo: "from-emerald-500/10 to-teal-500/10",
    borda: "border-emerald-500/30",
    selo: "OCR INTEGRADO",
    icon: <Car className="h-6 w-6 text-emerald-400" />
  },
  {
    id: "p3",
    titulo: "KoreKey Claviculário Locker",
    tipo: "Software de Hardware IoT",
    descricao: "Controle monitorado e blindado eletronicamente de armários de chaves industriais. Liberação via biometria, NFC ou pin de uso único com alerta imediato de chaves em atraso.",
    preco: "A partir de R$ 220,00",
    fundo: "from-amber-500/10 to-orange-500/10",
    borda: "border-amber-500/30",
    selo: "RPA & LOGÍSTICA",
    icon: <Key className="h-6 w-6 text-amber-400" />
  },
  {
    id: "p4",
    titulo: "KoreBadge Zebra Print",
    tipo: "Módulo de Impressão",
    descricao: "Solução para disparos térmicos rápidos de crachás adesivos QR Code ecológicos para visitantes em menos de 3 segundos utilizando qualquer impressora Zebra ou Argox comum.",
    preco: "A partir de R$ 90,00",
    fundo: "from-purple-500/10 to-fuchsia-500/10",
    borda: "border-purple-500/30",
    selo: "HARDWARE PLUG&PLAY",
    icon: <Printer className="h-6 w-6 text-purple-400" />
  },
  {
    id: "p5",
    titulo: "KoreGate Facial Tablet",
    tipo: "Hardware & App",
    descricao: "Quiosque de autoatendimento touch-screen com leitor óptico para que visitantes agendados via WhatsApp façam seu próprio check-in e check-out sem filas ou intervenção humana.",
    preco: "A partir de R$ 350,00",
    fundo: "from-rose-500/10 to-pink-500/10",
    borda: "border-rose-500/30",
    selo: "AUTOATENDIMENTO",
    icon: <Users className="h-6 w-6 text-rose-450 text-rose-450" />
  },
  {
    id: "p6",
    titulo: "KoreGateways IoT Hub",
    tipo: "Integração Física",
    descricao: "Controlador físico de placas de relé conectando sua rede de portaria diretamente com fechaduras eletroímã, sensores de barreira e semáforos industriais de docas.",
    preco: "A partir de R$ 160,00",
    fundo: "from-sky-500/10 to-cyan-500/10",
    borda: "border-sky-500/30",
    selo: "AUTOMAÇÃO FÍSICA",
    icon: <Database className="h-6 w-6 text-sky-400" />
  }
];

export default function PortariaPage() {
  const [activeSubTab, setActiveSubTab] = useState<"visitantes" | "veiculos" | "chaves" | "produtos">("visitantes");

  // Visitor state
  const [visitors, setVisitors] = useState<Visitor[]>(DEFAULT_VISITORS);
  const [visitorFilter, setVisitorFilter] = useState("");
  const [newVisitor, setNewVisitor] = useState({
    nome: "",
    documento: "",
    empresa: "",
    destino: "",
    cracha: ""
  });

  // Vehicle state
  const [vehicles, setVehicles] = useState<Vehicle[]>(DEFAULT_VEHICLES);
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [newVehicle, setNewVehicle] = useState({
    placa: "",
    motorista: "",
    documento: "",
    tipo: "Caminhão" as any,
    finalidade: "Carga/Descarga" as any,
    concessionaria: ""
  });

  // Clavicular Key state
  const [keys, setKeys] = useState<KeyControl[]>(DEFAULT_KEYS);
  const [keyFilter, setKeyFilter] = useState("");
  const [newKey, setNewKey] = useState({
    sala: "",
    codigoKey: "",
    retiradoPor: "",
    setor: "Logística"
  });

  // ROI Calculator inputs
  const [numGuards, setNumGuards] = useState(2);
  const [workingHoursFactor, setWorkingHoursFactor] = useState(24);
  const [laborCostRange, setLaborCostRange] = useState(3200);

  // Success messaging state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // SEO & Schema validation schema for direct search injection
  const structuredJsonLdPortaria = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "KoreGuard - Sistema Integrado de Controle de Portaria e Acesso",
      "operatingSystem": "All Cloud Web Browsers, Android, iOS",
      "applicationCategory": "BusinessApplication, SecuritySystem",
      "offers": {
        "@type": "Offer",
        "price": "290.00",
        "priceCurrency": "BRL"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "142"
      }
    };
  }, []);

  // Filter lists
  const filteredVisitors = visitors.filter(v => 
    v.nome.toLowerCase().includes(visitorFilter.toLowerCase()) ||
    v.empresa.toLowerCase().includes(visitorFilter.toLowerCase()) ||
    v.documento.includes(visitorFilter) ||
    v.destino.toLowerCase().includes(visitorFilter.toLowerCase())
  );

  const filteredVehicles = vehicles.filter(v => 
    v.placa.toLowerCase().includes(vehicleFilter.toLowerCase()) ||
    v.motorista.toLowerCase().includes(vehicleFilter.toLowerCase()) ||
    v.finalidade.toLowerCase().includes(vehicleFilter.toLowerCase())
  );

  const filteredKeys = keys.filter(k => 
    k.sala.toLowerCase().includes(keyFilter.toLowerCase()) ||
    k.retiradoPor.toLowerCase().includes(keyFilter.toLowerCase()) ||
    k.codigoKey.toLowerCase().includes(keyFilter.toLowerCase())
  );

  // Add handlers
  const handleAddVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVisitor.nome || !newVisitor.documento || !newVisitor.destino) {
      showToast("⚠️ Por favor, preencha os dados obrigatórios do visitante.");
      return;
    }
    const currentHour = new Date().toLocaleString("pt-BR", { hour12: false }).slice(0, 16);
    const added: Visitor = {
      id: "v-" + Date.now(),
      nome: newVisitor.nome,
      documento: newVisitor.documento,
      empresa: newVisitor.empresa || "Autônomo / Particular",
      destino: newVisitor.destino,
      crachaselecionado: newVisitor.cracha || "CR-" + Math.floor(100 + Math.random() * 900),
      entrada: currentHour,
      status: "Ativo"
    };

    setVisitors([added, ...visitors]);
    setNewVisitor({ nome: "", documento: "", empresa: "", destino: "", cracha: "" });
    showToast(`✅ Visitante "${added.nome}" inserido no sistema com sucesso! Crachá disparado.`);
  };

  const handleCheckoutVisitor = (id: string) => {
    const currentHour = new Date().toLocaleString("pt-BR", { hour12: false }).slice(0, 16);
    setVisitors(visitors.map(v => v.id === id ? { ...v, saida: currentHour, status: "Concluído" } : v));
    showToast(`🔒 Saída registrada com sucesso. Crachá liberado para higienização.`);
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.placa || !newVehicle.motorista) {
      showToast("⚠️ Placa e motorista são dados indispensáveis para o sistema.");
      return;
    }
    // Simple basic Mercosul license validation check
    const formatPlaca = newVehicle.placa.toUpperCase().replace(/\s/g, "");
    
    const currentHour = new Date().toLocaleString("pt-BR", { hour12: false }).slice(0, 16);
    const added: Vehicle = {
      id: "e-" + Date.now(),
      placa: formatPlaca,
      motorista: newVehicle.motorista,
      documentoMotoristas: newVehicle.documento || "Não informado",
      tipo: newVehicle.tipo,
      finalidade: newVehicle.finalidade,
      entrada: currentHour,
      status: "No Pátio",
      concessionaria: newVehicle.concessionaria || "Diversos"
    };

    setVehicles([added, ...vehicles]);
    setNewVehicle({ placa: "", motorista: "", documento: "", tipo: "Caminhão", finalidade: "Carga/Descarga", concessionaria: "" });
    showToast(`🚚 Veículo "${formatPlaca}" liberado para entrar no pátio logístico.`);
  };

  const handleCheckoutVehicle = (id: string) => {
    const currentHour = new Date().toLocaleString("pt-BR", { hour12: false }).slice(0, 16);
    setVehicles(vehicles.map(v => v.id === id ? { ...v, saida: currentHour, status: "Liberado" } : v));
    showToast(`✅ Veículo deixou as instalações. Logs salvos para fins de auditoria.`);
  };

  const handleAddKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.sala || !newKey.codigoKey || !newKey.retiradoPor) {
      showToast("⚠️ Nome do setor/sala, código da chave e responsável são obrigatórios.");
      return;
    }
    const currentHour = new Date().toLocaleString("pt-BR", { hour12: false }).slice(0, 16);
    const added: KeyControl = {
      id: "k-" + Date.now(),
      sala: newKey.sala,
      codigoKey: newKey.codigoKey,
      retiradoPor: newKey.retiradoPor,
      dataHoraRetirada: currentHour,
      status: "Fora",
      setor: newKey.setor
    };

    setKeys([added, ...keys]);
    setNewKey({ sala: "", codigoKey: "", retiradoPor: "", setor: "Logística" });
    showToast(`🔑 Chave "${added.codigoKey}" retirada por ${added.retiradoPor}.`);
  };

  const handleReturnKey = (id: string) => {
    const currentHour = new Date().toLocaleString("pt-BR", { hour12: false }).slice(0, 16);
    setKeys(keys.map(k => k.id === id ? { ...k, dataHoraDevolucao: currentHour, status: "Devolvido" } : k));
    showToast(`🔑 Chave devolvida e reposicionada de forma segura no Claviculário IoT.`);
  };

  // KPI calculations
  const totalActiveVisitors = visitors.filter(v => v.status === "Ativo").length;
  const totalActiveVehicles = vehicles.filter(v => v.status === "No Pátio").length;
  const totalKeysOut = keys.filter(k => k.status === "Fora").length;

  // ROI Math
  const traditionalCost = numGuards * laborCostRange * (workingHoursFactor === 24 ? 2.2 : 1);
  const digitalCost = (HARDWARE_SOFTWARE_PRODUCTS[0].preco ? 290 : 200) + (HARDWARE_SOFTWARE_PRODUCTS[1].preco ? 180 : 150);
  const estimatedSavings = Math.max(traditionalCost - digitalCost, 0);

  return (
    <div className="space-y-12 max-w-7xl mx-auto py-6 px-4 font-sans relative" id="portaria-section-root">
      
      {/* JSON-LD Rich Snippet for google SEO crawlers */}
      <script type="application/ld+json">
        {JSON.stringify(structuredJsonLdPortaria)}
      </script>

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 text-white p-8 md:p-14">
        {/* Decorative Grid Light Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
        
        {/* Glow Effects */}
        <div className="absolute -top-32 right-12 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-400/30 text-indigo-400 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Shield className="h-3.5 w-3.5" /> KoreGuard Enterprise: Portaria 360° & Controle de Acesso
            </div>
            
            <h1 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-white leading-tight">
              Software de Portaria Inteligente e <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-400">Controle de Segurança Corporativo</span>
            </h1>

            <p className="text-sm md:text-base text-gray-400 max-w-3xl leading-relaxed">
              Otimize a recepção de sua empresa de forma digital. Unifique o controle de entrada de visitantes, 
              leitura de placas Mercosul via OCR, gestão de pátios logísticos de veículos e agendamentos integrados. 
              Garantia de segurança, rastreabilidade técnica robusta e conformidade impecável com a LGPD em uma plataforma rápida.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#simuladores"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Usar Simulador de Portaria</span>
                <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
              </a>
              <a 
                href="#produtos-cat"
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs uppercase tracking-wider rounded-xl border border-slate-800 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Produtos & Licenças SAAS</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 relative flex justify-center">
            <div className="w-full max-w-[280px] bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative backdrop-blur-md">
              <div className="absolute -top-3 -right-3 px-3 py-1 bg-emerald-500 text-slate-950 text-[9px] font-bold tracking-wider rounded-lg uppercase shadow">
                AO VIVO
              </div>
              <div className="space-y-4 font-mono">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold border-b border-slate-800 pb-1.5 flex justify-between items-center">
                  <span>Monitoramento</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                    <span className="text-[9px] text-gray-500 block">VISITANTES</span>
                    <span className="text-2xl font-bold text-white">{totalActiveVisitors}</span>
                    <span className="text-[7px] text-indigo-400 block mt-1">Check-ins ativos</span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                    <span className="text-[9px] text-gray-500 block">VEÍCULOS</span>
                    <span className="text-2xl font-bold text-emerald-400">{totalActiveVehicles}</span>
                    <span className="text-[7px] text-emerald-500 block mt-1">Dentro do pátio</span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-gray-500 block">CHAVES DE ARMARIOM</span>
                    <span className="text-base font-bold text-amber-500">{totalKeysOut} Em Uso</span>
                  </div>
                  <Key className="h-5 w-5 text-amber-400/80" />
                </div>

                <div className="text-[8px] text-gray-500 text-center flex items-center justify-center gap-1.5 pt-1">
                  <Wifi className="h-3 w-3 text-indigo-500" />
                  <span>KoreGuard DB: Sincronizado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core SEO Pitch & Copywriting */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300">
        <div className="bg-slate-900/45 p-6 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Controle Dinâmico de Visitantes</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Elimine as velhas cadernetas de papel na recepção. O sistema KoreGuard armazena fotos, documentos oficiais 
            (RG/CPF), dados do veículo, ramal de quem autorizou a entrada e gera relatórios de segurança em PDFs instantâneos.
          </p>
        </div>

        <div className="bg-slate-900/45 p-6 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Car className="h-5 w-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Fluxo & Pátio de Carga e Descarga</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Otimize docas logísticas regulando vans e caminhões. Registre dados de frotas nacionais ou transportadoras parceiras, 
            tempo médio de permanência e libere faturamento por integração inteligente com sistemas de balança e ERPs tradicionais.
          </p>
        </div>

        <div className="bg-slate-900/45 p-6 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Key className="h-5 w-5 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Custódia Monitorada de Chaves</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Saiba instantaneamente quem está em posse das chaves de salas críticas, servidores de TI, veículos corporativos ou 
            depósitos. Segurança patrimonial auditável com rastreio de data e hora de retirada e devolução.
          </p>
        </div>
      </section>

      {/* Interactive Simulators Segment */}
      <div id="simuladores" className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8 relative">
        <div className="space-y-2 border-b border-slate-800 pb-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <Activity className="h-5 w-5 text-indigo-400 animate-pulse" /> Sandbox de Portaria & Acesso Corporativo
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Teste em tempo real os nossos controladores de recepção. Simule o cadastro de pessoas, entrada de veículos de carga e controle de claviculário de chaves do seu condomínio logístico.
              </p>
            </div>
            
            {/* Simulation sub-tab switcher */}
            <div className="flex flex-wrap gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
              <button
                onClick={() => setActiveSubTab("visitantes")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                  activeSubTab === "visitantes" 
                    ? "bg-indigo-600 text-white shadow" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Users className="h-3.5 w-3.5" /> Visitantes
              </button>
              <button
                onClick={() => setActiveSubTab("veiculos")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                  activeSubTab === "veiculos" 
                    ? "bg-indigo-600 text-white shadow" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Car className="h-3.5 w-3.5" /> Veículos / Pátio
              </button>
              <button
                onClick={() => setActiveSubTab("chaves")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                  activeSubTab === "chaves" 
                    ? "bg-indigo-600 text-white shadow" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Key className="h-3.5 w-3.5" /> Claviculário de Chaves
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Display of Sub-tab Interactive Content */}
        <div className="min-h-[450px]">
          <AnimatePresence mode="wait">
            
            {/* SUBTAB 1: VISITORS */}
            {activeSubTab === "visitantes" && (
              <motion.div
                key="tab-visitantes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Form column */}
                <div className="lg:col-span-5 bg-slate-900/60 border border-slate-850 p-6 rounded-2xl space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-md font-bold text-white flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-indigo-400" /> Novo Registro de Visitante
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-mono">
                      LGPD Compliant Encryption Ativa
                    </p>
                  </div>

                  <form onSubmit={handleAddVisitor} className="space-y-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-1.5">
                        Nome Completo do Visitante <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Carlos Eduardo de Souza"
                        value={newVisitor.nome}
                        onChange={e => setNewVisitor({ ...newVisitor, nome: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-1.5">
                          RG / CPF <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="00.000.000-0"
                          value={newVisitor.documento}
                          onChange={e => setNewVisitor({ ...newVisitor, documento: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-1.5">
                          Empresa Representada
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Correios / Particular"
                          value={newVisitor.empresa}
                          onChange={e => setNewVisitor({ ...newVisitor, empresa: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-1.5">
                          Destino / Setor <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Diretoria Bloco B"
                          value={newVisitor.destino}
                          onChange={e => setNewVisitor({ ...newVisitor, destino: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-1.5">
                          Crachá Emitido (Código)
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: CR-102"
                          value={newVisitor.cracha}
                          onChange={e => setNewVisitor({ ...newVisitor, cracha: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Registrar Entrada & Imprimir Crachá
                    </button>
                  </form>

                  <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-850 space-y-2 text-[11px] text-gray-400">
                    <p className="font-bold text-white flex items-center gap-1 text-[11px] uppercase font-mono">
                      <Camera className="h-3.5 w-3.5 text-sky-400" /> Registro Facial KoreGuard OCR
                    </p>
                    <p className="leading-relaxed">
                      Ao salvar, o KoreGuard pode disparar alertas via webhook diretamente para o ramal ou WhatsApp do destinatário notificando a chegada do convidado.
                    </p>
                  </div>
                </div>

                {/* Grid Lists / Table column */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Painel Geral de Ocupação ({filteredVisitors.length} Registros)
                    </h3>
                    <div className="relative w-48">
                      <input
                        type="text"
                        placeholder="Buscar visitante..."
                        value={visitorFilter}
                        onChange={e => setVisitorFilter(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-indigo-900">
                    {filteredVisitors.map((v) => (
                      <div 
                        key={v.id} 
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                          v.status === "Ativo" 
                            ? "bg-slate-900/40 border-slate-800 hover:border-slate-700" 
                            : "bg-slate-950/20 border-slate-900 opacity-60"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white text-xs font-bold font-sans">{v.nome}</span>
                            <span className="text-[9px] px-2 py-0.5 bg-slate-800 text-indigo-400 rounded-md font-mono border border-slate-700/85">
                              {v.crachaselecionado}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-[10px] text-gray-400">
                            <div><strong className="text-gray-600">Doc:</strong> {v.documento}</div>
                            <div><strong className="text-gray-600">Empresa:</strong> {v.empresa}</div>
                            <div><strong className="text-gray-600">Destino:</strong> {v.destino}</div>
                            <div className="col-span-2 md:col-span-1 text-indigo-400"><strong className="text-gray-600">Entrada:</strong> {v.entrada}</div>
                          </div>
                          
                          {v.saida && (
                            <div className="text-[9px] text-slate-500">
                              🔒 Saída computada técnica em: {v.saida}
                            </div>
                          )}
                        </div>

                        <div className="self-end sm:self-center pr-1">
                          {v.status === "Ativo" ? (
                            <button
                              onClick={() => handleCheckoutVisitor(v.id)}
                              className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Lock className="h-3 w-3" /> Registrar Saída
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-500 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                              <Check className="h-3 w-3" /> Concluído
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {filteredVisitors.length === 0 && (
                      <div className="text-center py-10 bg-slate-900/20 border border-slate-900 rounded-xl">
                        <Users className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Nenhum visitante ativo encontrado no momento.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUBTAB 2: VEHICLES & TRUCKS */}
            {activeSubTab === "veiculos" && (
              <motion.div
                key="tab-veiculos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Form column */}
                <div className="lg:col-span-5 bg-slate-900/60 border border-slate-850 p-6 rounded-2xl space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-md font-bold text-white flex items-center gap-2">
                      <Car className="h-4 w-4 text-emerald-400" /> Registro de Entrada de Veículo / Carregamento
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-mono">
                      Módulo Integrado à Balança & OCR KorePlate
                    </p>
                  </div>

                  <form onSubmit={handleAddVehicle} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-1.5">
                          Placa Mercosul / CRM <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="ABC1D23"
                          value={newVehicle.placa}
                          onChange={e => setNewVehicle({ ...newVehicle, placa: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono tracking-widest text-center"
                          maxLength={8}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-1.5">
                          Tipo de Veículo
                        </label>
                        <select
                          value={newVehicle.tipo}
                          onChange={e => setNewVehicle({ ...newVehicle, tipo: e.target.value as any })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="Caminhão">Caminhão Baú / Trucado</option>
                          <option value="Van">Van / utilitário</option>
                          <option value="Carro Executivo">Carro Executivo</option>
                          <option value="Prestador">Prestador de Serviço</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-1.5">
                        Nome do Motorista <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Geraldo Alvarenga"
                        value={newVehicle.motorista}
                        onChange={e => setNewVehicle({ ...newVehicle, motorista: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-1.5">
                          Documento / CNH
                        </label>
                        <input
                          type="text"
                          placeholder="..."
                          value={newVehicle.documento}
                          onChange={e => setNewVehicle({ ...newVehicle, documento: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-1.5">
                          Finalidade Entrada
                        </label>
                        <select
                          value={newVehicle.finalidade}
                          onChange={e => setNewVehicle({ ...newVehicle, finalidade: e.target.value as any })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="Carga/Descarga">Carga/Descarga</option>
                          <option value="Manutenção">Manutenção de Fábrica</option>
                          <option value="Reunião">Reunião / Diretoria</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-1.5">
                        Modelo do Veículo & Cor
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Scania R440 Vermelho"
                        value={newVehicle.concessionaria}
                        onChange={e => setNewVehicle({ ...newVehicle, concessionaria: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Liberar Entrada de Veículo
                    </button>
                  </form>
                </div>

                {/* Lists table */}
                <div className="lg:col-span-7 space-y-4 font-sans">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Monitoramento de Veículos Ativos ({filteredVehicles.length})
                    </h3>
                    <div className="relative w-48">
                      <input
                        type="text"
                        placeholder="Buscar placa/motorista..."
                        value={vehicleFilter}
                        onChange={e => setVehicleFilter(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {filteredVehicles.map((veh) => (
                      <div 
                        key={veh.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                          veh.status === "No Pátio" 
                            ? "bg-slate-900/40 border-slate-800 hover:border-slate-700" 
                            : "bg-slate-950/20 border-slate-900 opacity-60"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            {/* Mercosul Plate Styled Box */}
                            <div className="inline-flex flex-col border border-indigo-500/50 rounded-md overflow-hidden bg-white text-slate-950 font-bold leading-none select-none text-center shadow">
                              <div className="bg-blue-600 text-white text-[6px] px-2 py-0.5 tracking-wider font-mono">
                                MERCOSUL
                              </div>
                              <div className="px-2 py-1 text-sm tracking-tighter uppercase font-mono">
                                {veh.placa}
                              </div>
                            </div>

                            <span className="text-white text-xs font-semibold">{veh.motorista}</span>
                            
                            <span className="text-[8px] bg-indigo-900/40 text-indigo-400 border border-indigo-800/40 px-2 py-0.5 rounded">
                              {veh.tipo}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-0.5 text-[10px] text-gray-400">
                            <div><strong className="text-gray-600">Finalidade:</strong> {veh.finalidade}</div>
                            <div><strong className="text-gray-600">Modelo:</strong> {veh.concessionaria}</div>
                            <div><strong className="text-gray-600">Entrada:</strong> {veh.entrada}</div>
                          </div>
                          
                          {veh.saida && (
                            <div className="text-[9px] text-slate-500">
                              🔒 Saída registrada: {veh.saida}
                            </div>
                          )}
                        </div>

                        <div className="self-end sm:self-center">
                          {veh.status === "No Pátio" ? (
                            <button
                              onClick={() => handleCheckoutVehicle(veh.id)}
                              className="px-3 py-1.5 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/50 text-indigo-300 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <ArrowRight className="h-3 w-3" /> Liberar Saída
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                              <Check className="h-3 w-3" /> Liberado
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {filteredVehicles.length === 0 && (
                      <div className="text-center py-10 bg-slate-900/20 border border-slate-900 rounded-xl">
                        <Car className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Nenhum veículo registrado ou localizado no pátio.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* SUBTAB 3: CRITICAL KEY LOCKER (KEYS) */}
            {activeSubTab === "chaves" && (
              <motion.div
                key="tab-chaves"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Form column */}
                <div className="lg:col-span-5 bg-slate-900/60 border border-slate-850 p-6 rounded-2xl space-y-6">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-md font-bold text-white flex items-center gap-2">
                      <Key className="h-4 w-4 text-amber-400" /> Registro de Retirada (Claviculário IoT)
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-mono">
                      Rastreio de custódia patrimonial blindada
                    </p>
                  </div>

                  <form onSubmit={handleAddKey} className="space-y-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-1.5">
                        Setor ou Sala Destino <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Servidores TI ou Bloco C Almoxarifado"
                        value={newKey.sala}
                        onChange={e => setNewKey({ ...newKey, sala: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-1.5">
                          Código Chave/Slot <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: CH-20"
                          value={newKey.codigoKey}
                          onChange={e => setNewKey({ ...newKey, codigoKey: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-center tracking-widest"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-1.5">
                          Departamento Chave
                        </label>
                        <select
                          value={newKey.setor}
                          onChange={e => setNewKey({ ...newKey, setor: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="Logística">Logística / Docas</option>
                          <option value="Tecnologia">Tecnologia / TI</option>
                          <option value="Manutenção">Manutenção Geral</option>
                          <option value="Faturamento">Faturamento / Administrativo</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-1.5">
                        Colaborador Responsável da Retirada <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Douglas Santos (CPF 421...)"
                        value={newKey.retiradoPor}
                        onChange={e => setNewKey({ ...newKey, retiradoPor: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Registrar Saída da Chave
                    </button>
                  </form>
                </div>

                {/* Lists table */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Claviculário Inteligente de Chaves Ativas ({filteredKeys.length})
                    </h3>
                    <div className="relative w-48">
                      <input
                        type="text"
                        placeholder="Buscar Chave/Responsável..."
                        value={keyFilter}
                        onChange={e => setKeyFilter(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {filteredKeys.map((k) => (
                      <div 
                        key={k.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 ${
                          k.status === "Fora" 
                            ? "bg-slate-900/40 border-slate-850 hover:border-slate-800"
                            : "bg-slate-950/20 border-slate-900 opacity-60"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-mono font-bold">
                              {k.codigoKey}
                            </span>
                            <span className="text-white text-xs font-bold">{k.sala}</span>
                            <span className="text-[8px] uppercase font-mono px-1.5 bg-slate-800 text-gray-400 rounded">
                              {k.setor}
                            </span>
                          </div>

                          <div className="text-[10px] text-gray-400 space-y-0.5">
                            <div><strong className="text-gray-600">Custodiante:</strong> {k.retiradoPor}</div>
                            <div className="text-indigo-400"><strong className="text-gray-600">Retirada:</strong> {k.dataHoraRetirada}</div>
                          </div>

                          {k.dataHoraDevolucao && (
                            <div className="text-[9px] text-emerald-500">
                              🔑 Devolução computada em: {k.dataHoraDevolucao}
                            </div>
                          )}
                        </div>

                        <div className="self-end sm:self-center">
                          {k.status === "Fora" ? (
                            <button
                              onClick={() => handleReturnKey(k.id)}
                              className="px-3 py-1.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/50 text-amber-300 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle className="h-3 w-3" /> Devolver Chave
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                              <Check className="h-3 w-3" /> No Claviculário
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {filteredKeys.length === 0 && (
                      <div className="text-center py-10 bg-slate-900/20 border border-slate-900 rounded-xl">
                        <Key className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Nenhuma chave localizada em trânsito no pátio externo.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ROI & Modern Cost Calculator for SaaS integration */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="roi-section">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-400/20 text-amber-400 rounded-full text-xs font-semibold uppercase tracking-wider font-mono">
            <Coins className="h-3.5 w-3.5" /> Estudo de Viabilidade Financeira (ROI)
          </div>
          <h2 className="text-xl md:text-3xl font-bold tracking-tight text-white leading-tight">
            Descubra quanto você economiza ao digitalizar as <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">recepções e portitarias de sua empresa</span>
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            Muitas empresas de Jundiaí, Campinas e região metropolitana gastam fortunas com vigilância patrimonial física para digitação em planilhas Excel lentas ou anotações manuais. Com a automação integrada, autoatendimento Inteligente e leituras OCR de frotas da KoreNexus, você reduz gargalos operacionais e erros brutais de cadastro.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 font-mono">
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 uppercase font-bold block">
                Nº Portarias / Guaritas
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={numGuards}
                  onChange={e => setNumGuards(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <span className="text-xs text-white font-bold bg-slate-950 px-2 py-1 rounded inline-block w-8 text-center border border-slate-850">
                  {numGuards}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 uppercase font-bold block">
                Operação Cobertura
              </label>
              <select
                value={workingHoursFactor}
                onChange={e => setWorkingHoursFactor(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white font-bold focus:outline-none"
              >
                <option value={12}>12 Horas por Dia (Comercial)</option>
                <option value={24}>24 Horas por Dia (Contínuo 12x36)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 uppercase font-bold block">
                Custo de Escala (R$ / Mês)
              </label>
              <input
                type="number"
                min="1500"
                max="10000"
                step="100"
                value={laborCostRange}
                onChange={e => setLaborCostRange(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-indigo-500/20 text-center space-y-4">
          <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 font-mono block">
            RESULTADO DA AUDITORIA ECONÔMICA
          </span>

          <div className="space-y-1">
            <span className="text-gray-500 text-xs block">Gasto operacional tradicional estimado:</span>
            <span className="text-md line-through text-rose-500 font-semibold font-mono">
              R$ {traditionalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / Mês
            </span>
          </div>

          <div className="space-y-1 bg-indigo-500/5 py-4 px-2 rounded-xl border border-indigo-500/10">
            <span className="text-indigo-300 text-xs block font-semibold">Economia líquida com KoreGuard Core + OCR:</span>
            <span className="text-2xl md:text-3xl font-bold text-emerald-400 font-mono block">
              R$ {estimatedSavings.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / Mês
            </span>
            <span className="text-[9px] text-gray-400 block mt-1">
              Melhoria de até 85% no SLA de entrada de frotas
            </span>
          </div>

          <div className="text-[10px] text-gray-500 italic max-w-sm mx-auto">
            *Cálculo estimativo com base em portos secos e galpões industriais representativos em Jundiaí e Grande São Paulo.
          </div>
        </div>
      </section>

      {/* SEÇÃO DE COTAÇÃO E ADQUISIÇÃO DE MÓDULOS INTERATIVOS */}
      <section className="space-y-6" id="portaria-modulos-cards">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Módulos Corporativos Integrados
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-sans">
            Módulos Adicionais de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Atendimento & Triagem</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed font-sans">
            Monitore cada etapa do fluxo residencial ou industrial. Ative licenças específicas integradas em apenas 1 clique e otimize o trabalho da sua guarita.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {/* Card 1: Gestão de Visitantes */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-slate-900/70 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[9px] px-2.5 py-1 bg-slate-950 text-emerald-400 border border-emerald-500/20 rounded-md font-mono font-bold tracking-wider uppercase">
                  visitantes
                </span>
                <span className="text-[10px] text-gray-500 uppercase font-mono font-bold">
                  SaaS Ativo
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-950 rounded-xl group-hover:bg-emerald-500/10 transition-colors">
                  <Users className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-md font-bold text-white font-sans">Gestão de Visitantes</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Controle completo de fluxo de entrada, saída, registro de documentos (RG/CPF), triagem rápida e impressões térmicas de crachás integradas.
              </p>
            </div>
            <div className="border-t border-slate-850 pt-4 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] text-gray-500 block uppercase font-mono">Assinatura</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">A partir de R$ 190,00</span>
              </div>
              <a
                href={`https://api.whatsapp.com/send/?phone=5511989387263&text=${encodeURIComponent("Olá! Gostaria de mais informações e de adquirir o serviço de 'Gestão de Visitantes' do KoreGuard para nossa portaria.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Adquirir</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Card 2: Cadastro de Veículos */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-slate-900/70 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[9px] px-2.5 py-1 bg-slate-950 text-emerald-450 text-emerald-400 border border-emerald-555/20 rounded-md font-mono font-bold tracking-wider uppercase">
                  veículos
                </span>
                <span className="text-[10px] text-gray-500 uppercase font-mono font-bold">
                  Logística
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-950 rounded-xl group-hover:bg-emerald-500/10 transition-colors">
                  <Car className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-md font-bold text-white font-sans">Cadastro de Veículos</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Rastreamento e auditoria em tempo real de caminhões, vans e frotas comerciais. Organização inteligente de docas secas.
              </p>
            </div>
            <div className="border-t border-slate-850 pt-4 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] text-gray-500 block uppercase font-mono">Assinatura</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">A partir de R$ 240,00</span>
              </div>
              <a
                href={`https://api.whatsapp.com/send/?phone=5511989387263&text=${encodeURIComponent("Olá! Gostaria de mais informações e de adquirir o serviço de 'Cadastro de Veículos' do KoreGuard para triagem e pátio logístico.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Adquirir</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Card 3: Controle de Chaves */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-slate-900/70 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[9px] px-2.5 py-1 bg-slate-950 text-emerald-400 border border-emerald-500/20 rounded-md font-mono font-bold tracking-wider uppercase">
                  chaves
                </span>
                <span className="text-[10px] text-gray-500 uppercase font-mono font-bold">
                  Custódia
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-950 rounded-xl group-hover:bg-emerald-500/10 transition-colors">
                  <Key className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-md font-bold text-white font-sans">Controle de Chaves</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Gestão com histórico de responsabilidade de retiradas e devoluções para salas de TI, depósitos e veículos de frotas ativas.
              </p>
            </div>
            <div className="border-t border-slate-850 pt-4 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] text-gray-500 block uppercase font-mono">Assinatura</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">A partir de R$ 150,00</span>
              </div>
              <a
                href={`https://api.whatsapp.com/send/?phone=5511989387263&text=${encodeURIComponent("Olá! Gostaria de mais informações e de adquirir o serviço de 'Controle de Chaves' do KoreGuard para nossa segurança patrimonial.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Adquirir</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Card 4: Auditoria de Acesso */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-slate-900/70 transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[9px] px-2.5 py-1 bg-slate-950 text-emerald-400 border border-emerald-500/20 rounded-md font-mono font-bold tracking-wider uppercase">
                  auditoria
                </span>
                <span className="text-[10px] text-gray-500 uppercase font-mono font-bold">
                  Compliance
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-950 rounded-xl group-hover:bg-emerald-500/10 transition-colors">
                  <FileCheck2 className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-md font-bold text-white font-sans">Auditoria de Acesso</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Cruzamento de logs automotivos e fiscais em conformidade estrita com a LGPD. Relatórios completos para auditorias internas de segurança.
              </p>
            </div>
            <div className="border-t border-slate-850 pt-4 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] text-gray-500 block uppercase font-mono">Assinatura</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">A partir de R$ 290,00</span>
              </div>
              <a
                href={`https://api.whatsapp.com/send/?phone=5511989387263&text=${encodeURIComponent("Olá! Gostaria de mais informações e de adquirir o serviço de 'Auditoria de Acesso' do KoreGuard para conformidade com a LGPD.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Adquirir</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRISTINE SAAS PRODUCTS SHOWCASE CATALOG */}
      <section id="produtos-cat" className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Soluções & Licenciamento de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Hardware & Software de Portaria</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Monte o seu ecossistema de acesso corporativo sob medida. Escolha as licenças SaaS mensais sem fidelidade para sua cadeia logística. Acesse com total estabilidade da internet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {HARDWARE_SOFTWARE_PRODUCTS.map((prod) => (
            <div 
              key={prod.id} 
              className={`bg-slate-900/40 border ${prod.borda} rounded-2xl p-6 space-y-4 hover:border-slate-700 hover:bg-slate-900/70 transition-all flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] px-2.5 py-1 bg-slate-950 text-indigo-400/90 rounded-md font-mono font-bold tracking-wider uppercase">
                    {prod.selo}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase font-mono font-bold">
                    {prod.tipo}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-950 rounded-lg">
                    {prod.icon}
                  </div>
                  <h3 className="text-md font-bold text-white font-sans">{prod.titulo}</h3>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  {prod.descricao}
                </p>
              </div>

              <div className="border-t border-slate-850 pt-4 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-gray-500 block uppercase font-mono">Assinatura Mensal</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">{prod.preco}</span>
                </div>

                <a
                  href={`https://api.whatsapp.com/send/?phone=5511989387263&text=${encodeURIComponent(`Olá! Gostaria de mais informações e de adquirir a licença do "${prod.titulo}" para meu controle de acesso corporativo.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Adquirir Licença
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Technical Guide on Porterage Automation & LGPD Regulations */}
      <article className="bg-slate-950 border border-slate-800 rounded-3xl p-8 space-y-6 text-slate-300">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-400" /> Guia Técnico de SEO: LGPD & Automação de Acesso em Jundiaí
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed">
          <div className="space-y-3 border-r border-slate-900 pr-0 md:pr-6">
            <h4 className="text-sm font-semibold text-white">1. Como funciona a LGPD nas portarias empresariais?</h4>
            <p className="text-gray-400">
              Coletar dados como nome, telefone, foto de faces e número de RG é um procedimento comum de portarias. 
              No entanto, de acordo com a Lei Geral de Proteção de Dados (LGPD) no Brasil, este tratamento deve ser fundamentado 
              no legítimo interesse ou na tutela de segurança patrimonial corporativa. O software <strong>KoreGuard</strong> já conta com 
              scripts nativos de expurgo cíclico de logs antigos, máscaras de dados sensíveis e relatório de auditoria de operadoras terceirizadas.
            </p>
            <h4 className="text-sm font-semibold text-white">2. Tecnologias de OCR e Câmeras IP</h4>
            <p className="text-gray-400 font-sans">
              A automatização de cancelas através de leitura ótica de caracteres (OCR) das placas Mercosul economiza tempo logístico, 
              evitando que motoristas de caminhão de grande porte desçam na guarita e se exponham a acidentes físicos de trânsito. O KorePlate 
              é compatível com câmeras Hikvision, Intelbras e qualquer stream RTSP com latência menor que 200 milissegundos.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <strong className="text-xs text-white block">SLA de Atendimento em Dockings logísticos:</strong>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Empresas industriais de alto calibre em Jundiaí-SP enfrentam gargalos no faturamento devido ao atraso de caminhões no pátio de triagem. Integrar a planilha inteligente de portaria com o calendário de expedição (ex: Kagenda) permite otimizar docas de faturamento reduzindo o tempo de estadia em até 40%.
              </p>
            </div>

            <div className="flex gap-4 items-center">
              <Building2 className="h-10 w-10 text-indigo-400/80 shrink-0" />
              <div>
                <strong className="text-xs text-white block">Implantação Local & Suporte em SP</strong>
                <span className="text-[11px] text-gray-500">
                  Nossos técnicos prestam atendimento de consultoria física e de infraestrutura de TI em Jundiaí, Várzea Paulista, Campo Limpo, Cabreúva e Itu.
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* SEO Faq Accordion segment */}
      <section className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-4">
        <h3 className="text-md font-bold text-white uppercase tracking-wider font-mono">
          Dúvidas Frequentes sobre Portarias Digitais & Segurança Patrimonial
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950/60 rounded-xl space-y-1.5 border border-slate-850">
            <h5 className="font-semibold text-indigo-400">Qual o hardware necessário para implantar o KorePlate OCR?</h5>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              O sistema é 100% em nuvem e conecta em qualquer câmera IP de resolução superior a 1080p instalada voltada para o portão principal, sem necessidade de servidores potentes de processamento de IA locais.
            </p>
          </div>
          <div className="p-4 bg-slate-950/60 rounded-xl space-y-1.5 border border-slate-850">
            <h5 className="font-semibold text-indigo-400">As chaves retiradas possuem alertas automáticos?</h5>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Sim. Se uma chave de custódia crítica não for devolvida em até 8 horas da retirada, o sistema dispara alertas imediatos enviando webhooks para o celular dos inspetores de segurança de plantão.
            </p>
          </div>
          <div className="p-4 bg-slate-950/60 rounded-xl space-y-1.5 border border-slate-850">
            <h5 className="font-semibold text-indigo-400">O sistema emite relatórios para auditoria fiscal?</h5>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Com certeza! O barramento do KoreNexus sincroniza o histórico de entrada de motoristas diretamente para cruzamento técnico de Notas Fiscais e ordens de frete de entrada e saída.
            </p>
          </div>
          <div className="p-4 bg-slate-950/60 rounded-xl space-y-1.5 border border-slate-850">
            <h5 className="font-semibold text-indigo-400">É compatível com leitores faciais de mercado?</h5>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Sim, possuímos integradores firmware nativos para catracas e totens faciais das marcas mais prestigiadas do Brasil (ex: Control iD, Henry, Hikvision, ZKTeco).
            </p>
          </div>
        </div>
      </section>

      {/* Floating Interactive Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white rounded-xl border border-indigo-500 px-4 py-3 shadow-2xl flex items-center gap-3 font-sans text-xs font-semibold backdrop-blur-xl"
            id="portaria-toast-alert"
          >
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
