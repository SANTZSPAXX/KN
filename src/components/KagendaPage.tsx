import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  Clock, 
  Truck, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Plus, 
  Filter, 
  DollarSign, 
  Users, 
  BarChart2, 
  ShieldCheck, 
  Check, 
  Maximize2 
} from "lucide-react";

interface Slot {
  id: string;
  doca: string;
  hora: string;
  status: "disponivel" | "ocupado" | "reservado";
  transportadora?: string;
  placa?: string;
  carga?: string;
}

const INITIAL_SLOTS: Slot[] = [
  { id: "s1", doca: "Doca 01", hora: "08:00", status: "ocupado", transportadora: "TransBrasil S/A", placa: "ABC-1234", carga: "Seca (Paletizado)" },
  { id: "s2", doca: "Doca 01", hora: "10:00", status: "disponivel" },
  { id: "s3", doca: "Doca 01", hora: "13:30", status: "ocupado", transportadora: "Fretar Rápido", placa: "KXX-9090", carga: "Seca (Industrial)" },
  { id: "s4", doca: "Doca 02", hora: "08:30", status: "ocupado", transportadora: "Rápido Sudoeste", placa: "MOP-4567", carga: "Frigorificada (Carnes)" },
  { id: "s5", doca: "Doca 02", hora: "11:00", status: "disponivel" },
  { id: "s6", doca: "Doca 02", hora: "14:30", status: "disponivel" },
  { id: "s7", doca: "Doca 03 (Especial)", hora: "09:00", status: "disponivel" },
  { id: "s8", doca: "Doca 03 (Especial)", hora: "12:00", status: "ocupado", transportadora: "AgroLog Agro", placa: "ZZY-8811", carga: "Granel (Grãos)" },
  { id: "s9", doca: "Doca 03 (Especial)", hora: "15:00", status: "disponivel" },
];

export default function KagendaPage() {
  // Slots State
  const [slots, setSlots] = useState<Slot[]>(INITIAL_SLOTS);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // New Booking Form State
  const [carrier, setCarrier] = useState("");
  const [plate, setPlate] = useState("");
  const [cargoType, setCargoType] = useState("Seca");
  const [message, setMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters State
  const [filterDoca, setFilterDoca] = useState("Todas");
  const [filterStatus, setFilterStatus] = useState("Todos");

  // ROI Calculator Sliders State
  const [trucksPerDay, setTrucksPerDay] = useState(15);
  const [avgWaitMinutes, setAvgWaitMinutes] = useState(90);
  const [idleCostPerHour, setIdleCostPerHour] = useState(150);

  // Calculate ROI Metrics
  const hoursWastedPerMonth = Math.round((trucksPerDay * (avgWaitMinutes / 60)) * 26);
  const currentCostPerMonth = Math.round(hoursWastedPerMonth * idleCostPerHour);
  
  // Kagenda optimizes dwell time by 80% (reduced coordination mistakes and pre-booked slots)
  const hoursWastedWithKagenda = Math.round(hoursWastedPerMonth * 0.18); 
  const monthlySavings = currentCostPerMonth - Math.round(hoursWastedWithKagenda * idleCostPerHour);
  const annualSavings = monthlySavings * 12;

  // Handle slot reservation submissions
  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId) {
      setMessage("Selecione um slot de doca disponível acima!");
      return;
    }
    if (!carrier.trim() || !plate.trim()) {
      setMessage("Por favor, preencha a Transportadora e a Placa do Caminhão!");
      return;
    }

    // Update state
    setSlots(prev => prev.map(s => {
      if (s.id === selectedSlotId) {
        return {
          ...s,
          status: "reservado",
          transportadora: carrier,
          placa: plate.toUpperCase(),
          carga: cargoType,
        };
      }
      return s;
    }));

    setSuccessMsg(`✅ Slot agendado com sucesso! Veículo ${plate.toUpperCase()} direcionado.`);
    setMessage("");
    // Reset inputs
    setCarrier("");
    setPlate("");
    setSelectedSlotId(null);

    // Timeout alert success
    setTimeout(() => {
      setSuccessMsg("");
    }, 5000);
  };

  const activeSlot = slots.find(s => s.id === selectedSlotId);

  return (
    <div className="space-y-12">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 border border-gray-800 bg-gradient-to-br from-[#0F1321] via-[#12182c] to-[#0A0D14]" id="kagenda-hero">
        <div className="absolute inset-0 bg-[radial-gradient(#1e243d_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full text-xs font-semibold text-blue-400">
            <Calendar className="h-3.5 w-3.5 text-blue-400" />
            <span>Kagenda • Solução Corporativa de Fluxo Síncrono</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-medium text-white tracking-tight leading-tight font-sans">
            Kagenda: O Sistema de Agendamento Inteligente para <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Logística e Portarias</span>
          </h1>

          <p className="text-sm md:text-md text-slate-300 leading-relaxed font-sans max-w-2xl">
            Acabe com frotas ociosas, filas quilométricas de caminhões na rua e custos ocultos de diárias e estadias. O <strong>Kagenda</strong> sincroniza transportadoras, docas e pessoal de recepção em tempo real em uma interface integrada de alta performance.
          </p>

          <div className="flex flex-wrap gap-5 pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
              <div className="text-xs text-slate-300 font-sans"><strong>-80%</strong> Tempo de Espera</div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
              <div className="text-xs text-slate-300 font-sans"><strong>Dwell Time</strong> Sob Controle</div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
              <div className="text-xs text-slate-300 font-sans"><strong>Check-In</strong> Automatizado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns (Live Interactive Scheduling Simulator and ROI tool) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (DOCK VIEW AND SCHEDULER SIMULATOR) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#111622] border border-gray-800 rounded-3xl p-6" id="kagenda-scheduler-cabinet">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-wider block">PAINEL OPERACIONAL</span>
                <h3 className="text-md font-sans font-bold text-white flex items-center gap-2">
                  <Truck className="h-4.5 w-4.5 text-blue-500" />
                  Grade de Escalas e Docas (Simulador)
                </h3>
              </div>

              {/* Filters on screen */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <select
                  value={filterDoca}
                  onChange={(e) => setFilterDoca(e.target.value)}
                  className="bg-[#0A0D14] border border-gray-800 text-[11px] text-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Todas">Todas Docas</option>
                  <option value="Doca 01">Doca 01</option>
                  <option value="Doca 02">Doca 02</option>
                  <option value="Doca 03 (Especial)">Doca 03</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[#0A0D14] border border-gray-800 text-[11px] text-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Todos">Todos Status</option>
                  <option value="disponivel">Disponível</option>
                  <option value="ocupado">Ocupado</option>
                  <option value="reservado">Reservado</option>
                </select>
              </div>
            </div>

            {/* Instruction note */}
            <p className="text-[11px] text-gray-400 font-sans mb-4 leading-normal">
              Abaixo são exibidos os slots de docamento para hoje. Clique em um slot marcado como <span className="text-emerald-400 font-semibold font-mono">Disponível</span> para preencher o formulário e agendar uma nova entrada de simulação.
            </p>

            {/* Slots Cards List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1">
              {slots
                .filter(s => {
                  const matchD = filterDoca === "Todas" || s.doca === filterDoca;
                  const matchS = filterStatus === "Todos" || s.status === filterStatus;
                  return matchD && matchS;
                })
                .map(s => {
                  const isDisp = s.status === "disponivel";
                  const isOcup = s.status === "ocupado";
                  const isRes = s.status === "reservado";
                  const isSelected = selectedSlotId === s.id;

                  return (
                    <div
                      key={s.id}
                      onClick={() => isDisp && setSelectedSlotId(s.id)}
                      className={`p-3.5 border rounded-2xl transition-all cursor-pointer flex flex-col justify-between h-[125px] ${
                        isSelected 
                          ? "ring-2 ring-blue-500 bg-[#161d31] border-blue-500" 
                          : isDisp 
                          ? "bg-[#0A0D14]/80 border-gray-800 hover:border-blue-500/40" 
                          : isOcup 
                          ? "bg-[#111622] border-gray-850 opacity-75 cursor-not-allowed" 
                          : "bg-blue-950/20 border-blue-900/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-mono font-bold">{s.doca}</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span className="text-[10px] font-semibold text-slate-200 font-mono">{s.hora}</span>
                        </div>
                      </div>

                      <div className="truncate my-2">
                        {isDisp && (
                          <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            LIVRE (Reservar)
                          </span>
                        )}
                        {isOcup && (
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-[#FF4C4C] font-mono font-bold uppercase tracking-wider block">OCUPADO (CARGA)</span>
                            <span className="text-[10px] font-sans text-gray-300 block truncate font-bold">{s.transportadora}</span>
                            <span className="text-[9px] font-mono text-gray-500 block">Placa: {s.placa}</span>
                          </div>
                        )}
                        {isRes && (
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-indigo-400 font-mono font-bold uppercase tracking-wider block">SIMULADO</span>
                            <span className="text-[10px] font-sans text-[#E0E7FF] block truncate font-semibold">{s.transportadora}</span>
                            <span className="text-[9px] font-mono text-indigo-300/70 block">Placa: {s.placa}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-gray-500 font-mono border-t border-gray-800/60 pt-1.5">
                        <span>Carga: {isDisp ? "N/A" : s.carga}</span>
                        {isSelected && <span className="text-blue-400 font-bold uppercase">Marcado</span>}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* SIMULATE CARRIER BOOKING FORM */}
          <div className="bg-[#111622] border border-gray-800 rounded-3xl p-6" id="kagenda-form-cabinet">
            <h4 className="text-sm font-sans font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4 text-blue-500" />
              Efetuar Novo Agendamento (Simulador)
            </h4>

            {activeSlot ? (
              <div className="bg-[#141b2e] border border-blue-500/20 rounded-2xl p-3.5 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-indigo-300 font-mono block">SLOT DE PORTARIA SELECIONADO</span>
                  <strong className="text-xs text-white">{activeSlot.doca} às {activeSlot.hora}</strong>
                </div>
                <button
                  onClick={() => setSelectedSlotId(null)}
                  className="text-[9px] font-mono text-gray-400 hover:text-white underline"
                >
                  Cancelar seleção
                </button>
              </div>
            ) : (
              <div className="bg-[#0A0D14] border border-gray-850 rounded-2xl p-4 text-center mb-4">
                <AlertCircle className="h-5 w-5 text-indigo-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Você não marcou nenhum slot ainda. Clique nos cards disponíveis (LIVRE) acima antes de preencher o formulário.</p>
              </div>
            )}

            <form onSubmit={handleReserve} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1.5 col-span-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Transportadora</label>
                <input
                  type="text"
                  disabled={!activeSlot}
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder="EX: Souza Logistics Ltda"
                  className="w-full bg-[#0A0D14] border border-gray-800 px-3 py-2 text-xs rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500 font-sans disabled:opacity-40"
                />
              </div>

              <div className="space-y-1.5 col-span-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Placa do Cavalo/Carreta</label>
                <input
                  type="text"
                  disabled={!activeSlot}
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  maxLength={8}
                  placeholder="EX: KGW-1F92"
                  className="w-full bg-[#0A0D14] border border-gray-800 px-3 py-2 text-xs rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500 font-mono disabled:opacity-40"
                />
              </div>

              <div className="space-y-1.5 col-span-1">
                <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Categoria de Carga</label>
                <select
                  disabled={!activeSlot}
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  className="w-full bg-[#0A0D14] border border-gray-800 px-3 py-2 text-xs rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500 font-sans disabled:opacity-40"
                >
                  <option value="Seca (Industrial)">Carga Seca (Barris/Paletes)</option>
                  <option value="Frigorificada">Frigorificada / Alimentar</option>
                  <option value="Granel (Serragem)">Granel Agrícola / Químico</option>
                  <option value="Peças / Motores">Containers e Peças Soltas</option>
                </select>
              </div>

              {/* Message Log response */}
              <div className="md:col-span-3 pt-2">
                {message && <p className="text-[10px] font-mono text-amber-400 mb-2">{message}</p>}
                
                <button
                  type="submit"
                  disabled={!activeSlot}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 text-white rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  Sincronizar Escala de Doca Comercial
                </button>
              </div>
            </form>

            <AnimatePresence>
              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-400 font-mono flex items-center gap-2"
                >
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN (ROI CALCULATOR AND VALUE PROPOSAL) - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ROI METRICS TOOL */}
          <div className="bg-[#111622] border border-gray-800 rounded-3xl p-6" id="kagenda-roi-calculator">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-sans font-bold text-white">Calculadora de ROI Econômico</h3>
                <p className="text-[9px] text-gray-400 font-sans">Simule a produtividade operacional de gargalos financeiros e atrasos nas docas.</p>
              </div>
            </div>

            {/* Parameter Sliders */}
            <div className="space-y-4 font-sans text-xs border-b border-gray-820 pb-5 mb-5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Fluxo Diário de Caminhões:</span>
                  <span className="text-white font-mono font-bold">{trucksPerDay} veículos / dia</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="80"
                  value={trucksPerDay}
                  onChange={(e) => setTrucksPerDay(Number(e.target.value))}
                  className="w-full h-1 bg-[#0A0D14] rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Espera Média de Descarregamento atual:</span>
                  <span className="text-white font-mono font-bold">{avgWaitMinutes} minutos</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="240"
                  step="10"
                  value={avgWaitMinutes}
                  onChange={(e) => setAvgWaitMinutes(Number(e.target.value))}
                  className="w-full h-1 bg-[#0A0D14] rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Custo Base Ocioso (Por hora de espera):</span>
                  <span className="text-white font-mono font-bold">R$ {idleCostPerHour} / hora</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="400"
                  step="10"
                  value={idleCostPerHour}
                  onChange={(e) => setIdleCostPerHour(Number(e.target.value))}
                  className="w-full h-1 bg-[#0A0D14] rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-[9px] text-gray-500 leading-normal block">
                  *Inclui diárias adicionais de motoristas, multas de transportadoras (estadias/demurrage) e pessoal logístico ocioso.
                </span>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4 font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#0A0D14] border border-gray-850 rounded-2xl">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">OPERAÇÃO SEM CONTROLE</span>
                  <h4 className="text-xs text-red-400 font-mono font-bold mt-1">R$ {currentCostPerMonth.toLocaleString("pt-BR")}/mês</h4>
                  <span className="text-[9px] text-gray-500 leading-none">{hoursWastedPerMonth} horas ociosas</span>
                </div>

                <div className="p-3.5 bg-blue-950/20 border border-blue-900/30 rounded-2xl">
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-extrawide block font-bold">ECONOMIA ESTIMADA</span>
                  <h4 className="text-xs text-emerald-400 font-mono font-bold mt-1">R$ {monthlySavings.toLocaleString("pt-BR")}/mês</h4>
                  <span className="text-[9px] text-emerald-500/80 leading-none">Redução de tempo crítico</span>
                </div>
              </div>

              <div className="bg-[#141b2c] p-4 rounded-2xl text-center border border-indigo-500/25">
                <span className="text-[10px] font-mono text-indigo-400 uppercase block font-bold">VALOR PRESERVADO ANUAl (ROI)</span>
                <p className="text-lg font-mono font-bold text-white mt-1">R$ {annualSavings.toLocaleString("pt-BR")}</p>
                <div className="w-full bg-[#0A0D14] h-2.5 rounded-full mt-3 overflow-hidden border border-gray-800">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full" style={{ width: "81%" }} />
                </div>
                <span className="text-[8px] text-indigo-300 leading-normal block mt-1.5">Sistemas sob medida amortizam o investimento em menos de 45 dias operacionais.</span>
              </div>
            </div>
          </div>

          {/* DOCK CAPABILITIES SPECS SHEET */}
          <div className="bg-[#111622] border border-gray-800 rounded-3xl p-6 space-y-4" id="kagenda-capabilities">
            <h4 className="text-sm font-sans font-bold text-white">Principais Pilares de Eficiência Operacional</h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-[#0A0D14]/65 border border-gray-850 rounded-2xl flex gap-3">
                <div className="p-2 bg-blue-600/10 rounded-xl text-blue-400 shrink-0 h-9 w-9 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-white">Sincronização Bidirecional</h5>
                  <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                    Transportadoras agendam os slots disponíveis diretamente no sistema de forma transparente. Zero e-mails trocados, zero conflitos de grade.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#0A0D14]/65 border border-gray-850 rounded-2xl flex gap-3">
                <div className="p-2 bg-blue-600/10 rounded-xl text-blue-400 shrink-0 h-9 w-9 flex items-center justify-center">
                  <BarChart2 className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-white">Indicadores de Dwell & Turnaround Time</h5>
                  <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                    Obtenha métricas exatas de permanência no pátio, medindo a eficiência de equipes de carregamento por turnos.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#0A0D14]/65 border border-gray-850 rounded-2xl flex gap-3">
                <div className="p-2 bg-blue-600/10 rounded-xl text-blue-400 shrink-0 h-9 w-9 flex items-center justify-center">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-white">Filas de Triagem & Roteamento Dinâmico</h5>
                  <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                    Se o veículo atrasar, o sistema reposiciona o slot dinamicamente, permitindo passar o próximo da fila e evitando docas ociosas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER SECTION: SYSTEM DEPLOYMENT ADVANTAGES */}
      <div className="bg-[#111622] rounded-3xl p-8 border border-gray-800 font-sans">
        <h4 className="text-md font-bold text-white mb-6">Por que um Sistema de Agendamento sob medida é vital?</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-gray-400">
          <div className="space-y-2">
            <strong className="text-white block font-bold font-sans">1. Integração com Sistemas Legados (ERP)</strong>
            <p>
              O Kagenda conecta-se à sua planilha de faturamento, SAP, TOTVS ou ERP corporativo próprio via API, importando notas fiscais (NFs) e quantidades de metros cúbicos para sugerir o tempo exato de descarga ideal em cada doca.
            </p>
          </div>

          <div className="space-y-2">
            <strong className="text-white block font-bold font-sans">2. Flexibilidade Completa para Pequenas Empresas</strong>
            <p>
              Não adaptamos seu negócio ao nosso software; adaptamos o Kagenda ao seu fluxo específico. Seja uma distribuidora com 1 única doca ou uma indústria de grande porte operando 24 horas por dia, as janelas operacionais seguem sua regra de negócio única.
            </p>
          </div>

          <div className="space-y-2">
            <strong className="text-white block font-bold font-sans">3. Autonomia às Transportadoras Credenciadas</strong>
            <p>
              Chega de ligações intermináveis ou planilhas compartilhadas no WhatsApp expostas a falhas de segurança. O transportador acessa o painel de parceiro com um link dedicado, visualiza o grid parametrizado e escolhe seu horário operacional.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
