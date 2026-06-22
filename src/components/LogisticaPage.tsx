import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Boxes, 
  Search, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Layers, 
  Wrench, 
  Terminal, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Percent, 
  Building2, 
  Calculator, 
  Map, 
  Truck, 
  BadgeDollarSign, 
  ShoppingBag, 
  RefreshCw, 
  FileText, 
  Smartphone, 
  HelpCircle,
  Briefcase,
  Users
} from "lucide-react";

// Interfaces for our interactive Logistics Modules

// 1. Storage Slot (WMS)
interface WarehouseSlot {
  id: string;
  corredor: string;
  nivel: string;
  status: "Livre" | "Ocupado" | "Reservado";
  produto?: string;
  quantidade?: number;
  zona: "Seco" | "Frio" | "Químicos" | "E-commerce";
}

// 2. Stock Item (Estoque)
interface StockItem {
  id: string;
  sku: string;
  nome: string;
  categoria: string;
  quantidade: number;
  unidade: string;
  localizacao: string;
  estoqueMinimo: number;
}

// 3. Withdrawal Log (Retiradas)
interface WithdrawalLog {
  id: string;
  sku: string;
  produto: string;
  quantidade: number;
  solicitante: string;
  setor: string;
  dataHora: string;
  finalidade: string;
}

// 4. Sales / CRM Order
interface SalesOrder {
  id: string;
  cliente: string;
  data: string;
  valor: number;
  itens: string;
  status: "Lead" | "Aguardando NF" | "Faturado & Separando" | "Expedido";
  ufDestino: string;
}

export default function LogisticaPage() {
  const [activeLogisticsTab, setActiveLogisticsTab] = useState<"wms" | "estoque" | "crm" | "nfe" | "diagnostico">("wms");

  // --- STATE FOR WMS VIRTUAL LAYOUT ---
  const [selectedZone, setSelectedZone] = useState<string>("Todos");
  const [warehouseSlots, setWarehouseSlots] = useState<WarehouseSlot[]>([
    { id: "A1-1", corredor: "A1", nivel: "Nível 1", status: "Ocupado", produto: "Modem Fibra Optica 10G", quantidade: 140, zona: "E-commerce" },
    { id: "A1-2", corredor: "A1", nivel: "Nível 2", status: "Ocupado", produto: "Roteador Wi-Fi 6E Pro", quantidade: 60, zona: "E-commerce" },
    { id: "A1-3", corredor: "A1", nivel: "Nível 3", status: "Reservado", produto: "Roteador Core KN-80", quantidade: 30, zona: "E-commerce" },
    { id: "A2-1", corredor: "A2", nivel: "Nível 1", status: "Ocupado", produto: "Servidor Blade S1", quantidade: 12, zona: "Químicos" },
    { id: "A2-2", corredor: "A2", nivel: "Nível 2", status: "Ocupado", produto: "Baterias de Lítio KN-Power", quantidade: 80, zona: "Químicos" },
    { id: "A2-3", corredor: "A2", nivel: "Nível 3", status: "Ocupado", produto: "Painel Solar Silício Monocristalino", quantidade: 40, zona: "Químicos" },
    { id: "B1-1", corredor: "B1", nivel: "Nível 1", status: "Ocupado", produto: "Cabos Categoria 6A (bobina)", quantidade: 45, zona: "Seco" },
    { id: "B1-2", corredor: "B1", nivel: "Nível 2", status: "Ocupado", produto: "Switches Industriais Poe", quantidade: 25, zona: "Seco" },
    { id: "B1-3", corredor: "B1", nivel: "Nível 3", status: "Ocupado", produto: "Nobreak Online Rackmount 3kVA", quantidade: 15, zona: "Seco" },
    { id: "B2-1", corredor: "B2", nivel: "Nível 1", status: "Reservado", produto: "Sensores Ópticos KN-500", quantidade: 200, zona: "Frio" },
    { id: "B2-2", corredor: "B2", nivel: "Nível 2", status: "Ocupado", produto: "Módulo SFP+ 10G SR Multi-modo", quantidade: 350, zona: "Frio" },
    { id: "B2-3", corredor: "B2", nivel: "Nível 3", status: "Ocupado", produto: "Patch Panel 24P Cat6A Shielded", quantidade: 85, zona: "Frio" },
    { id: "A3-1", corredor: "A3", nivel: "Nível 1", status: "Ocupado", produto: "Cabo Fibra Optica Drop Flat 1KM", quantidade: 18, zona: "Seco" },
    { id: "A3-2", corredor: "A3", nivel: "Nível 2", status: "Ocupado", produto: "Câmera Monitoramento IP 4K PTZ", quantidade: 55, zona: "Seco" },
    { id: "A3-3", corredor: "A3", nivel: "Nível 3", status: "Livre", zona: "Seco" },
    { id: "B3-1", corredor: "B3", nivel: "Nível 1", status: "Ocupado", produto: "Servidor Storage NAS 24TB", quantidade: 8, zona: "E-commerce" },
    { id: "B3-2", corredor: "B3", nivel: "Nível 2", status: "Livre", zona: "E-commerce" },
    { id: "B3-3", corredor: "B3", nivel: "Nível 3", status: "Livre", zona: "E-commerce" },
  ]);

  const [slotFormData, setSlotFormData] = useState({
    slotId: "A1-2",
    produto: "",
    quantidade: 10,
    zona: "E-commerce" as const,
    status: "Ocupado" as const
  });
  const [wmsMessage, setWmsMessage] = useState<string | null>(null);

  // --- STATE FOR STOCK & WITHDRAWALS ---
  const [stockItems, setStockItems] = useState<StockItem[]>([
    { id: "st-1", sku: "FIB-10G-MDM", nome: "Modem Fibra Optica 10G", categoria: "Equipamentos", quantidade: 140, unidade: "Unid.", localizacao: "A1-1", estoqueMinimo: 50 },
    { id: "st-2", sku: "ROT-CORE-80", nome: "Roteador Core KN-80", categoria: "Equipamentos", quantidade: 30, unidade: "Unid.", localizacao: "A1-3", estoqueMinimo: 10 },
    { id: "st-3", sku: "SRV-BLD-S1", nome: "Servidor Blade S1", categoria: "Servidores", quantidade: 12, unidade: "Unid.", localizacao: "A2-1", estoqueMinimo: 5 },
    { id: "st-4", sku: "BAT-LIT-KNP", nome: "Baterias de Lítio KN-Power", categoria: "Energia", quantidade: 80, unidade: "Kit", localizacao: "A2-2", estoqueMinimo: 20 },
    { id: "st-5", sku: "CAB-CAT6-45", nome: "Cabos Categoria 6A (bobina)", categoria: "Infraestrutura", quantidade: 45, unidade: "Bobinas", localizacao: "B1-1", estoqueMinimo: 15 },
    { id: "st-6", sku: "SWI-IND-POE", nome: "Switches Industriais Poe", categoria: "Equipamentos", quantidade: 25, unidade: "Unid.", localizacao: "B1-2", estoqueMinimo: 8 },
    { id: "st-7", sku: "ROT-WIFI6E-PRO", nome: "Roteador Wi-Fi 6E Pro", categoria: "Equipamentos", quantidade: 60, unidade: "Unid.", localizacao: "A1-2", estoqueMinimo: 15 },
    { id: "st-8", sku: "SLR-PNL-MONO", nome: "Painel Solar Silício Monocristalino", categoria: "Energia", quantidade: 40, unidade: "Unid.", localizacao: "A2-3", estoqueMinimo: 10 },
    { id: "st-9", sku: "UPS-NBLK-3KVA", nome: "Nobreak Online Rackmount 3kVA", categoria: "Energia", quantidade: 15, unidade: "Unid.", localizacao: "B1-3", estoqueMinimo: 5 },
    { id: "st-10", sku: "SFP-10G-SRMM", nome: "Módulo SFP+ 10G SR Multi-modo", categoria: "Infraestrutura", quantidade: 350, unidade: "Unid.", localizacao: "B2-2", estoqueMinimo: 100 },
    { id: "st-11", sku: "PCH-PNL-24CS", nome: "Patch Panel 24P Cat6A Shielded", categoria: "Infraestrutura", quantidade: 85, unidade: "Unid.", localizacao: "B2-3", estoqueMinimo: 20 },
    { id: "st-12", sku: "FIB-DROP-FLAT1", nome: "Cabo Fibra Optica Drop Flat 1KM", categoria: "Infraestrutura", quantidade: 18, unidade: "Bobinas", localizacao: "A3-1", estoqueMinimo: 5 },
    { id: "st-13", sku: "CAM-IP-4KPTZ", nome: "Câmera Monitoramento IP 4K PTZ", categoria: "Equipamentos", quantidade: 55, unidade: "Unid.", localizacao: "A3-2", estoqueMinimo: 12 },
    { id: "st-14", sku: "NAS-STG-24TB", nome: "Servidor Storage NAS 24TB", categoria: "Servidores", quantidade: 8, unidade: "Unid.", localizacao: "B3-1", estoqueMinimo: 3 },
  ]);

  const [withdrawalLogs, setWithdrawalLogs] = useState<WithdrawalLog[]>([
    { id: "wlog-1", sku: "FIB-10G-MDM", produto: "Modem Fibra Optica 10G", quantidade: 5, solicitante: "Fernanda Lima", setor: "Técnico Externa", dataHora: "18/06/2026 08:35", finalidade: "Atendimento Cliente Jundiaí Centro" },
    { id: "wlog-2", sku: "CAB-CAT6-45", produto: "Cabos Categoria 6A (bobina)", quantidade: 2, solicitante: "Carlos Braga", setor: "Infraestrutura", dataHora: "18/06/2026 09:12", finalidade: "Instalação Fibra em Fábrica Metalúrgica" },
  ]);

  const [newStockItem, setNewStockItem] = useState({
    sku: "",
    nome: "",
    categoria: "Equipamentos",
    quantidade: 0,
    unidade: "Unid.",
    localizacao: "",
    estoqueMinimo: 5
  });

  const [newWithdrawal, setNewWithdrawal] = useState({
    itemId: "st-1",
    quantidade: 1,
    solicitante: "",
    setor: "Técnico Externa",
    finalidade: ""
  });

  const [stockSearch, setStockSearch] = useState("");
  const [stockSuccess, setStockSuccess] = useState<string | null>(null);
  const [stockError, setStockError] = useState<string | null>(null);

  // --- STATE FOR SALES & CRM KANBAN ---
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([
    { id: "ped-101", cliente: "TecnoInd Jundiaí Ltda", data: "18/06/2026", valor: 14500, itens: "2x Servidor Blade S1, 5x Switches Poe", status: "Lead", ufDestino: "SP" },
    { id: "ped-102", cliente: "Construtora Alfa Oeste", data: "18/06/2026", valor: 8900, itens: "10x Roteador Core KN-80, 4x Bobinas Cabo", status: "Aguardando NF", ufDestino: "SP" },
    { id: "ped-103", cliente: "Hospital Geral Campinas", data: "17/06/2026", valor: 22000, itens: "15x Roteador Core KN-80, 50x Modems 10G", status: "Faturado & Separando", ufDestino: "SP" },
    { id: "ped-104", cliente: "Logística Speed Rio", data: "16/06/2026", valor: 11000, itens: "5x Bobinas Cabo, 20x Modems 10G", status: "Expedido", ufDestino: "RJ" },
  ]);

  const [newOrderForm, setNewOrderForm] = useState({
    cliente: "",
    itens: "",
    valor: 1500,
    ufDestino: "SP",
    status: "Lead" as const
  });

  // --- STATE FOR INVOICE ISSUANCE (EMISSÃO DE NOTAS) ---
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<string>("ped-102");
  const [taxSystem, setTaxSystem] = useState<"Simples Nacional" | "Lucro Presumido" | "Lucro Real">("Lucro Presumido");
  const [cofinsRate, setCofinsRate] = useState<number>(3); // 3.0%
  const [pisRate, setPisRate] = useState<number>(0.65); // 0.65%
  const [ipiRate, setIpiRate] = useState<number>(5); // 5.0%
  const [icmsRate, setIcmsRate] = useState<number>(18); // default SP state ICMS
  const [invoiceIssuedLogo, setInvoiceIssuedLogo] = useState<boolean>(false);
  const [activeInvoiceXml, setActiveInvoiceXml] = useState<string | null>(null);

  // --- STATE FOR SUPPLY DIAGNOSTIC SIMULATORS (SOLUÇÃO DE PROBLEMAS) ---
  const [selectedProblem, setSelectedProblem] = useState<string>("picking_delay");
  
  // Safety Stock Calculator Parameters
  const [calcDailySales, setCalcDailySales] = useState<number>(10);
  const [calcLeadTime, setCalcLeadTime] = useState<number>(5);
  const [calcDailySalesStd, setCalcDailySalesStd] = useState<number>(2.5); // Desvio padrão vendas
  const [calcLeadTimeStd, setCalcLeadTimeStd] = useState<number>(1); // Desvio padrão prazo de entrega
  const [calcServiceFactor, setCalcServiceFactor] = useState<number>(1.65); // 95% nível de serviço

  // Computed results for Safety Stock
  const computedSafetyStock = useMemo(() => {
    // Formula: Z * sqrt( (LeadTime * stdSales^2) + (Sales^2 * stdLeadTime^2) )
    const term1 = calcLeadTime * Math.pow(calcDailySalesStd, 2);
    const term2 = Math.pow(calcDailySales, 2) * Math.pow(calcLeadTimeStd, 2);
    const safety = calcServiceFactor * Math.sqrt(term1 + term2);
    return Math.ceil(safety);
  }, [calcDailySales, calcLeadTime, calcDailySalesStd, calcLeadTimeStd, calcServiceFactor]);

  const computedReorderPoint = useMemo(() => {
    // ROP = (Média de consumo diário * Lead Time) + Estoque de Segurança
    const consumption = calcDailySales * calcLeadTime;
    return Math.ceil(consumption + computedSafetyStock);
  }, [calcDailySales, calcLeadTime, computedSafetyStock]);

  // Handle slot reallocation
  const handleUpdateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = warehouseSlots.map(s => {
      if (s.id === slotFormData.slotId) {
        return {
          ...s,
          status: slotFormData.status,
          produto: slotFormData.status === "Livre" ? undefined : slotFormData.produto || s.produto || "Material Geral",
          quantidade: slotFormData.status === "Livre" ? undefined : slotFormData.quantidade
        };
      }
      return s;
    });
    setWarehouseSlots(updated);
    setWmsMessage(`Slot ${slotFormData.slotId} atualizado com sucesso no layout WMS.`);
    setTimeout(() => setWmsMessage(null), 4000);
  };

  // Add new item to stock ledger
  const handleAddStockItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStockItem.sku || !newStockItem.nome) {
      setStockError("SKU e Nome do Produto são obrigatórios.");
      return;
    }
    const duplicate = stockItems.some(i => i.sku.toUpperCase() === newStockItem.sku.toUpperCase());
    if (duplicate) {
      setStockError("Já existe um produto com este SKU no estoque.");
      return;
    }

    const newItem: StockItem = {
      id: `st-${stockItems.length + 1}`,
      sku: newStockItem.sku.toUpperCase(),
      nome: newStockItem.nome,
      categoria: newStockItem.categoria,
      quantidade: Number(newStockItem.quantidade),
      unidade: newStockItem.unidade,
      localizacao: newStockItem.localizacao || "N/A",
      estoqueMinimo: Number(newStockItem.estoqueMinimo)
    };

    setStockItems([...stockItems, newItem]);
    setNewStockItem({ sku: "", nome: "", categoria: "Equipamentos", quantidade: 0, unidade: "Unid.", localizacao: "", estoqueMinimo: 5 });
    setStockSuccess(`Item [${newItem.sku}] ${newItem.nome} inserido com sucesso.`);
    setStockError(null);
    setTimeout(() => setStockSuccess(null), 4000);
  };

  // Register physical stock withdrawal with check & balances
  const handleRegisterWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWithdrawal.solicitante) {
      setStockError("Por favor informe o solicitante da retirada.");
      return;
    }

    const selectedItem = stockItems.find(i => i.id === newWithdrawal.itemId);
    if (!selectedItem) {
      setStockError("Item não encontrado.");
      return;
    }

    if (selectedItem.quantidade < newWithdrawal.quantidade) {
      setStockError(`Operação Negada: O estoque atual de ${selectedItem.nome} (${selectedItem.quantidade} ${selectedItem.unidade}) é menor do que a quantidade solicitada (${newWithdrawal.quantidade} ${selectedItem.unidade}).`);
      return;
    }

    // Deduct stock
    const updatedStock = stockItems.map(item => {
      if (item.id === selectedItem.id) {
        return { ...item, quantidade: item.quantidade - newWithdrawal.quantidade };
      }
      return item;
    });
    setStockItems(updatedStock);

    // Add withdrawal log
    const newLog: WithdrawalLog = {
      id: `wlog-${withdrawalLogs.length + 1}`,
      sku: selectedItem.sku,
      produto: selectedItem.nome,
      quantidade: newWithdrawal.quantidade,
      solicitante: newWithdrawal.solicitante,
      setor: newWithdrawal.setor,
      dataHora: new Date().toLocaleString("pt-BR"),
      finalidade: newWithdrawal.finalidade || "Expedição de Rotina"
    };

    setWithdrawalLogs([newLog, ...withdrawalLogs]);
    setNewWithdrawal({ itemId: "st-1", quantidade: 1, solicitante: "", setor: "Técnico Externa", finalidade: "" });
    setStockSuccess(`Retirada física efetuada com sucesso. Estoque atualizado de ${selectedItem.nome}.`);
    setStockError(null);
    setTimeout(() => setStockSuccess(null), 4000);
  };

  // Register Sales Order (CRM pipeline)
  const handleAddSalesOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.cliente || !newOrderForm.itens) {
      setStockError("Por favor informe o cliente e os itens do pedido.");
      return;
    }

    const o: SalesOrder = {
      id: `ped-${salesOrders.length + 101}`,
      cliente: newOrderForm.cliente,
      data: new Date().toLocaleDateString("pt-BR"),
      valor: Number(newOrderForm.valor),
      itens: newOrderForm.itens,
      status: newOrderForm.status,
      ufDestino: newOrderForm.ufDestino.toUpperCase()
    };

    setSalesOrders([...salesOrders, o]);
    setNewOrderForm({ cliente: "", itens: "", valor: 1500, ufDestino: "SP", status: "Lead" });
    setStockSuccess(`Pedido ${o.id} adicionado ao CRM com sucesso.`);
    setTimeout(() => setStockSuccess(null), 4000);
  };

  // Change sale order status
  const handleUpdateOrderStatus = (orderId: string, status: SalesOrder["status"]) => {
    setSalesOrders(salesOrders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Computed Invoice Tax Calculations based on parameters
  const currentInvoiceOrder = useMemo(() => {
    return salesOrders.find(o => o.id === selectedInvoiceOrder) || salesOrders[0];
  }, [salesOrders, selectedInvoiceOrder]);

  const taxCalculations = useMemo(() => {
    if (!currentInvoiceOrder) return { subtotal: 0, icms: 0, pis: 0, cofins: 0, ipi: 0, total: 0 };
    const subtotal = currentInvoiceOrder.valor;
    const icmsFactor = icmsRate / 100;
    const pisFactor = pisRate / 100;
    const cofinsFactor = cofinsRate / 100;
    const ipiFactor = ipiRate / 100;

    let computedIcms = subtotal * icmsFactor;
    let computedPis = subtotal * pisFactor;
    let computedCofins = subtotal * cofinsFactor;
    let computedIpi = subtotal * ipiFactor;

    // Simples Nacional simplification
    if (taxSystem === "Simples Nacional") {
      computedIcms = subtotal * 0.035; // Alíquota unificada de ICMS embutida
      computedPis = 0;
      computedCofins = 0;
      computedIpi = 0;
    }

    return {
      subtotal,
      icms: computedIcms,
      pis: computedPis,
      cofins: computedCofins,
      ipi: computedIpi,
      total: subtotal + computedIpi // IPI is usually added on top of total, while ICMS is inside or aggregated depending on state
    };
  }, [currentInvoiceOrder, taxSystem, cofinsRate, pisRate, ipiRate, icmsRate]);

  // Simulate issuing invoice XML/NFe
  const triggerInvoiceIssuance = () => {
    setInvoiceIssuedLogo(true);
    const mockXML = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe Id="NFe3526067461942143645500100000000120150918712" versao="4.00">
      <ide>
        <cUF>35</cUF>
        <cNF>00000101</cNF>
        <natOp>Venda de mercadoria adquirida de terceiros</natOp>
        <mod>55</mod>
        <serie>1</serie>
        <nNF>${currentInvoiceOrder?.id.replace("ped-", "") || "1"}</nNF>
        <dhEmi>${new Date().toISOString()}</dhEmi>
        <tpNF>1</tpNF>
      </ide>
      <emit>
        <CNPJ>74.619.421/0001-04</CNPJ>
        <xNome>KoreNexus Soluções Logísticas & ERP Integrado</xNome>
        <xFant>KoreNexus</xFant>
      </emit>
      <dest>
        <xNome>${currentInvoiceOrder?.cliente || "Consumidor Final"}</xNome>
        <UF>${currentInvoiceOrder?.ufDestino || "SP"}</UF>
      </dest>
      <det nItem="1">
        <prod>
          <xProd>${currentInvoiceOrder?.itens || "Material de Conectividade Corporativa"}</xProd>
          <vProd>${taxCalculations.subtotal.toFixed(2)}</vProd>
        </prod>
        <imposto>
          <ICMS><vICMS>${taxCalculations.icms.toFixed(2)}</vICMS></ICMS>
          <IPI><vIPI>${taxCalculations.ipi.toFixed(2)}</vIPI></IPI>
          <PIS><vPIS>${taxCalculations.pis.toFixed(2)}</vPIS></PIS>
          <COFINS><vCOFINS>${taxCalculations.cofins.toFixed(2)}</vCOFINS></COFINS>
        </imposto>
      </det>
      <total>
        <ICMSTot>
          <vBC>${taxCalculations.subtotal.toFixed(2)}</vBC>
          <vICMS>${taxCalculations.icms.toFixed(2)}</vICMS>
          <vPIS>${taxCalculations.pis.toFixed(2)}</vPIS>
          <vCOFINS>${taxCalculations.cofins.toFixed(2)}</vCOFINS>
          <vIPI>${taxCalculations.ipi.toFixed(2)}</vIPI>
          <vProd>${taxCalculations.subtotal.toFixed(2)}</vProd>
          <vNF>${taxCalculations.total.toFixed(2)}</vNF>
        </ICMSTot>
      </total>
    </infNFe>
  </NFe>
</nfeProc>`;
    setActiveInvoiceXml(mockXML);
    setTimeout(() => setInvoiceIssuedLogo(false), 2500);
  };

  // Filtered stocks lists
  const filteredStock = useMemo(() => {
    return stockItems.filter(item => {
      const matchText = item.nome.toLowerCase().includes(stockSearch.toLowerCase()) || 
                        item.sku.toLowerCase().includes(stockSearch.toLowerCase()) ||
                        item.categoria.toLowerCase().includes(stockSearch.toLowerCase());
      return matchText;
    });
  }, [stockItems, stockSearch]);

  const filteredSlots = useMemo(() => {
    if (selectedZone === "Todos") return warehouseSlots;
    return warehouseSlots.filter(s => s.zona === selectedZone);
  }, [warehouseSlots, selectedZone]);

  // Ratio of occupied slots
  const warehouseOccupancy = useMemo(() => {
    const occupied = warehouseSlots.filter(s => s.status === "Ocupado").length;
    const reserved = warehouseSlots.filter(s => s.status === "Reservado").length;
    return Math.round(((occupied + reserved * 0.5) / warehouseSlots.length) * 100);
  }, [warehouseSlots]);

  return (
    <div className="space-y-12">
      {/* HEADER SEO E INTRO DU LOGÍSTICA */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 p-8 md:p-12" id="logistica-seo-hero">
        <div className="absolute top-0 right-0 p-8 opacity-10 select-none pointer-events-none">
          <Boxes className="h-64 w-64 text-emerald-400" />
        </div>
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-400/30 text-blue-400 rounded-full text-xs font-semibold uppercase tracking-wider font-mono">
            <Boxes className="h-3.5 w-3.5 text-blue-400" /> KoreNexus Supply Chain Suite
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
            WMS Integrado & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Inteligência de Estoque</span>
          </h1>
          <p className="text-sm md:text-md text-gray-400 leading-relaxed font-sans">
            Gerencie o layout físico da sua armazenagem (WMS), rastreie retiradas e estoques mínimos com integridade, simplifique a emissão de notas fiscais, controle faturamentos no CRM e diagnostique gargalos logísticos com nossas calculadoras de supply chain.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="text-[10px] px-2.5 py-1 bg-slate-900 border border-slate-800 text-gray-300 font-mono rounded">
              🔍 SEO Sincronizado
            </span>
            <span className="text-[10px] px-2.5 py-1 bg-slate-900 border border-slate-800 text-gray-300 font-mono rounded">
              📦 Logística Portuária & Industrial
            </span>
            <span className="text-[10px] px-2.5 py-1 bg-slate-900 border border-slate-800 text-gray-300 font-mono rounded">
              ⚙️ WMS Corredores & Níveis
            </span>
          </div>
        </div>
      </section>

      {/* METRICAS GLOBAIS DE OPERAÇÃO */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="logistica-widgets-resumo">
        <div className="bg-[#0F1420]/60 border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase font-bold">Ocupação do WMS</span>
            <span className="text-2xl font-bold text-white font-mono block">{warehouseOccupancy}%</span>
            <span className="text-[9px] text-gray-400 block font-sans">Capacidade ativa em bins</span>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <Layers className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#0F1420]/60 border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase font-bold">Variedade no Estoque</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono block">{stockItems.length} SKUs</span>
            <span className="text-[9px] text-red-400 font-sans block flex items-center gap-0.5">
              <AlertTriangle className="h-2.5 w-2.5 inline" /> 
              {stockItems.filter(i => i.quantidade < i.estoqueMinimo).length} itens abaixo da segurança
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <Boxes className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#0F1420]/60 border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase font-bold">Faturamento Ativo</span>
            <span className="text-2xl font-bold text-indigo-400 font-mono block">
              R$ {salesOrders.reduce((sum, o) => sum + o.valor, 0).toLocaleString("pt-BR")}
            </span>
            <span className="text-[9px] text-gray-400 block font-sans">{salesOrders.length} ordens de vendas corporativas</span>
          </div>
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
            <BadgeDollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-[#0F1420]/60 border border-slate-800/80 rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 font-mono uppercase font-bold">Saídas Hoje</span>
            <span className="text-2xl font-bold text-amber-500 font-mono block">{withdrawalLogs.length} ordens</span>
            <span className="text-[9px] text-gray-400 block font-sans">Retiradas técnicas ativas na doca</span>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <Truck className="h-6 w-6" />
          </div>
        </div>
      </section>

      {/* INTERACTIVE COMPONENT TABS (WMS, STOCK, SALES/CRM, INVOICING, DIAGNOSTICS) */}
      <div className="border border-slate-850 rounded-3xl bg-slate-950/40 p-4 sm:p-6 space-y-8" id="logistica-interativo">
        
        {/* TAB OPTIONS BUTTONS BAR */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-850 pb-6 overflow-x-auto scrollbar-none" id="logistica-opcao-abas-switcher">
          <button
            onClick={() => setActiveLogisticsTab("wms")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeLogisticsTab === "wms"
                ? "bg-indigo-650 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/20"
                : "bg-slate-900/50 hover:bg-slate-900 text-gray-400 hover:text-white border border-slate-800"
            }`}
          >
            <Layers className="h-4 w-4 text-indigo-400" />
            <span>WMS Virtual</span>
          </button>

          <button
            onClick={() => setActiveLogisticsTab("estoque")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeLogisticsTab === "estoque"
                ? "bg-emerald-650 text-white shadow-lg shadow-emerald-600/25 border border-emerald-500/20"
                : "bg-slate-900/50 hover:bg-slate-900 text-gray-400 hover:text-white border border-slate-800"
            }`}
          >
            <Boxes className="h-4 w-4 text-emerald-400" />
            <span>Estoque & Retiradas</span>
          </button>

          <button
            onClick={() => setActiveLogisticsTab("crm")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeLogisticsTab === "crm"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25 border border-violet-500/20"
                : "bg-slate-900/50 hover:bg-slate-900 text-gray-400 hover:text-white border border-slate-800"
            }`}
          >
            <BadgeDollarSign className="h-4 w-4 text-violet-400" />
            <span>Vendas & CRM</span>
          </button>

          <button
            onClick={() => setActiveLogisticsTab("nfe")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeLogisticsTab === "nfe"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 border border-blue-500/20"
                : "bg-slate-900/50 hover:bg-slate-900 text-gray-400 hover:text-white border border-slate-800"
            }`}
          >
            <FileText className="h-4 w-4 text-blue-400" />
            <span>Notas Fiscais NF-e</span>
          </button>

          <button
            onClick={() => setActiveLogisticsTab("diagnostico")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeLogisticsTab === "diagnostico"
                ? "bg-amber-600 text-white shadow-lg shadow-amber-600/25 border border-amber-500/20"
                : "bg-slate-900/50 hover:bg-slate-900 text-gray-400 hover:text-white border border-slate-800"
            }`}
          >
            <Calculator className="h-4 w-4 text-amber-450 text-amber-400" />
            <span>Diagnóstico e Modelagem</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeLogisticsTab === "wms" && (
            <motion.div
              key="tab-wms"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {/* TAB 1: VISÃO GERAL DO WMS (LAYOUT ARMAZENAGEM) */}
              <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-4">
            <div className="space-y-1">
              <h2 className="text-lg md:text-xl font-bold text-white font-sans flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-400" /> WMS Virtual: Layout do Armazém
              </h2>
              <p className="text-xs text-gray-400">
                Visualização do endereçamento por corredores e níveis. Monitore e realoque posições de paletes instantaneamente.
              </p>
            </div>
            
            {/* Zone Filter */}
            <div className="flex flex-wrap gap-1.5 bg-slate-900/80 p-1 border border-slate-800 rounded-xl">
              {["Todos", "Seco", "Frio", "Químicos", "E-commerce"].map(z => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(z)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    selectedZone === z ? "bg-indigo-650 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Endereçamento Grid */}
            <div className="lg:col-span-2 space-y-4">
              <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider block">Endereços Físicos no Armazém (Corredor - Nível)</span>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredSlots.map(slot => (
                  <div
                    key={slot.id}
                    onClick={() => {
                      setSlotFormData({
                        slotId: slot.id,
                        produto: slot.produto || "",
                        quantidade: slot.quantidade || 0,
                        zona: slot.zona,
                        status: slot.status
                      });
                    }}
                    className={`p-4 border rounded-2xl transition-all cursor-pointer flex flex-col justify-between h-32 select-none group ${
                      slot.status === "Livre" 
                        ? "bg-slate-900/20 border-slate-800 hover:border-blue-500" 
                        : slot.status === "Reservado"
                        ? "bg-amber-500/5 border-amber-500/20 hover:border-amber-400"
                        : "bg-indigo-500/5 border-indigo-500/20 hover:border-indigo-400"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-white font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{slot.id}</span>
                        <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                          slot.status === "Livre" 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : slot.status === "Reservado"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-indigo-500/10 text-indigo-400"
                        }`}>
                          {slot.status}
                        </span>
                      </div>
                      {slot.status !== "Livre" ? (
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-white font-semibold line-clamp-1">{slot.produto}</p>
                          <p className="text-[9px] text-gray-400 font-mono">Qtd: {slot.quantidade}</p>
                        </div>
                      ) : (
                        <p className="text-[9px] text-gray-500">Espaço Vazio</p>
                      )}
                    </div>
                    <div className="text-[8px] text-gray-500 flex justify-between items-center border-t border-slate-850 pt-1.5">
                      <span className="capitalize">{slot.zona}</span>
                      <ChevronRight className="h-3 w-3 text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WMS Slot Alocador Form */}
            <div className="bg-[#0F1420]/50 border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-indigo-400 text-xs font-mono block">Controle e Alocação</span>
                <h3 className="text-sm font-bold text-white">Editar Endereço: {slotFormData.slotId}</h3>
              </div>

              {wmsMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>{wmsMessage}</span>
                </div>
              )}

              <form onSubmit={handleUpdateSlot} className="space-y-4 text-xs">
                <div>
                  <label className="text-gray-400 block mb-1">Status da Posição</label>
                  <select
                    value={slotFormData.status}
                    onChange={(e) => setSlotFormData({ ...slotFormData, status: e.target.value as any })}
                    className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-indigo-500"
                  >
                    <option value="Livre">Livre (Desocupar slot)</option>
                    <option value="Reservado">Reservado</option>
                    <option value="Ocupado">Ocupado</option>
                  </select>
                </div>

                {slotFormData.status !== "Livre" && (
                  <>
                    <div>
                      <label className="text-gray-400 block mb-1">Produto Guardado</label>
                      <input
                        type="text"
                        placeholder="Ex: Modem Fibra Optica 10G"
                        value={slotFormData.produto}
                        required
                        onChange={(e) => setSlotFormData({ ...slotFormData, produto: e.target.value })}
                        className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 block mb-1">Quantidade em Estoque</label>
                      <input
                        type="number"
                        min="1"
                        value={slotFormData.quantidade}
                        required
                        onChange={(e) => setSlotFormData({ ...slotFormData, quantidade: Number(e.target.value) })}
                        className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-indigo-500"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl font-bold font-sans cursor-pointer transition"
                >
                  Confirmar Layout WMS
                </button>
              </form>
            </div>
          </div>
        </section>
            </motion.div>
          )}

          {/* TAB 2: CONTROLE DE ESTOQUE & RETIRADAS (COM SALVAGUARDAS) */}
          {activeLogisticsTab === "estoque" && (
            <motion.div
              key="tab-estoque"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg md:text-xl font-bold text-white font-sans flex items-center gap-2">
                <Boxes className="h-5 w-5 text-emerald-400" /> Registro de Estoque & Retiradas Técnicas
              </h2>
              <p className="text-xs text-gray-400">
                Lançamento físico de entradas, baixas, saídas sob demanda e controle de estoque de segurança de peças e materiais.
              </p>
            </div>

            {/* Local ledger actions */}
            <div className="relative flex items-center max-w-sm w-full md:w-64">
              <Search className="h-3.5 w-3.5 absolute left-3 text-gray-500" />
              <input
                type="text"
                placeholder="Filtrar por SKU ou nome..."
                value={stockSearch}
                onChange={(e) => setStockSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-[#0A0E1A] border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {stockSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{stockSuccess}</span>
            </div>
          )}

          {stockError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{stockError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Stock ledger list (Left) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[#050914] border border-slate-850 rounded-2xl overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900/60 text-gray-400 border-b border-slate-800">
                      <th className="p-3 font-mono">SKU</th>
                      <th className="p-3">Nome do Item</th>
                      <th className="p-3">Categoria</th>
                      <th className="p-3 text-right">Saldo Físico</th>
                      <th className="p-3">Endereço (WMS)</th>
                      <th className="p-3 text-center">Status Mín.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStock.map((item) => {
                      const isLowStock = item.quantidade < item.estoqueMinimo;
                      return (
                        <tr key={item.id} className="border-b border-slate-850 hover:bg-slate-900/20 transition-all font-sans">
                          <td className="p-3 font-mono font-bold text-gray-300">{item.sku}</td>
                          <td className="p-3 text-white font-semibold">{item.nome}</td>
                          <td className="p-3 text-gray-400">{item.categoria}</td>
                          <td className="p-3 text-right font-mono text-white">
                            <span className={isLowStock ? "text-amber-500 font-bold" : "text-emerald-400 font-bold"}>
                              {item.quantidade}
                            </span>{" "}
                            <span className="text-[10px] text-gray-500">{item.unidade}</span>
                          </td>
                          <td className="p-3 font-mono text-gray-400">{item.localizacao}</td>
                          <td className="p-3 text-center">
                            {isLowStock ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] rounded-md uppercase font-bold animate-pulse">
                                <AlertTriangle className="h-2.5 w-2.5" /> Recomprar
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-555/20 text-emerald-400 text-[9px] rounded-md uppercase font-bold">
                                Seguro
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {filteredStock.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-gray-500">Nenhum item filtrado no inventário.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Recent Withdrawal Logs */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-amber-500" /> Relatório Recente de Baixas e Retiradas
                </h4>
                <div className="bg-[#050914] border border-slate-850 rounded-2xl p-4 divide-y divide-slate-850/60 max-h-48 overflow-y-auto">
                  {withdrawalLogs.map(log => (
                    <div key={log.id} className="py-2.5 flex items-center justify-between text-xs font-sans">
                      <div>
                        <p className="text-white font-semibold">{log.produto} <span className="text-[10px] text-gray-500 font-mono">({log.sku})</span></p>
                        <p className="text-[10px] text-gray-400">Solicitante: <span className="text-gray-300 font-medium">{log.solicitante}</span> · Setor: <span className="text-gray-300 font-medium">{log.setor}</span></p>
                        <p className="text-[9px] text-gray-500 mt-0.5">Finalidade: {log.finalidade}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-red-400 font-bold block font-mono">-{log.quantidade} unid.</span>
                        <span className="text-[9px] text-gray-500 font-mono block">{log.dataHora}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rapid Actions Form: Nova Retirada ou Novo Item (Right) */}
            <div className="space-y-6">
              
              {/* Form 1: Lançar Nova Retirada */}
              <div className="bg-[#0F1420]/50 border border-slate-800/80 rounded-2xl p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ArrowDownLeft className="h-4 w-4 text-orange-400" /> Registrar Saída Manual
                  </h3>
                  <p className="text-[10px] text-gray-400">Dedução física em lote imediata do inventário ativo.</p>
                </div>

                <form onSubmit={handleRegisterWithdrawal} className="space-y-4 text-xs">
                  <div>
                    <label className="text-gray-400 block mb-1">Selecionar Item</label>
                    <select
                      value={newWithdrawal.itemId}
                      onChange={(e) => setNewWithdrawal({ ...newWithdrawal, itemId: e.target.value })}
                      className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                    >
                      {stockItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.nome} ({item.sku}) - Qtd: {item.quantidade}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-400 block mb-1">Quantidade</label>
                      <input
                        type="number"
                        min="1"
                        value={newWithdrawal.quantidade}
                        onChange={(e) => setNewWithdrawal({ ...newWithdrawal, quantidade: Number(e.target.value) })}
                        className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 block mb-1">Setor Relacionado</label>
                      <select
                        value={newWithdrawal.setor}
                        onChange={(e) => setNewWithdrawal({ ...newWithdrawal, setor: e.target.value })}
                        className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                      >
                        <option value="Técnico Externa">Técnico Externa</option>
                        <option value="Infraestrutura">Infraestrutura</option>
                        <option value="Manutenção Fábrica">Manutenção Fábrica</option>
                        <option value="Expedição Filial">Expedição Filial</option>
                        <option value="Vendas">Vendas</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Solicitante (Nome)</label>
                    <input
                      type="text"
                      placeholder="Ex: Fernanda Lima"
                      value={newWithdrawal.solicitante}
                      onChange={(e) => setNewWithdrawal({ ...newWithdrawal, solicitante: e.target.value })}
                      className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-gray-400 block mb-1">Motivo / Destino</label>
                    <input
                      type="text"
                      placeholder="Ex: Suporte ao cliente KN em Itu"
                      value={newWithdrawal.finalidade}
                      onChange={(e) => setNewWithdrawal({ ...newWithdrawal, finalidade: e.target.value })}
                      className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold font-sans cursor-pointer transition"
                  >
                    Efetivar Retirada
                  </button>
                </form>
              </div>

              {/* Form 2: Cadastrar Novo Item */}
              <div className="bg-[#0F1420]/30 border border-slate-850 rounded-2xl p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Plus className="h-4 w-4 text-emerald-400" /> Cadastrar Novo SKU
                  </h3>
                </div>

                <form onSubmit={handleAddStockItem} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-gray-500 block mb-1">SKU Código</label>
                      <input
                        type="text"
                        placeholder="Ex: ROT-CORE-75"
                        value={newStockItem.sku}
                        onChange={(e) => setNewStockItem({ ...newStockItem, sku: e.target.value })}
                        className="w-full bg-[#070B14] border border-gray-850 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1">Categoria</label>
                      <select
                        value={newStockItem.categoria}
                        onChange={(e) => setNewStockItem({ ...newStockItem, categoria: e.target.value })}
                        className="w-full bg-[#070B14] border border-gray-850 rounded-lg px-2.5 py-1.5 text-white"
                      >
                        <option value="Equipamentos">Equipamentos</option>
                        <option value="Servidores">Servidores</option>
                        <option value="Energia">Energia</option>
                        <option value="Infraestrutura">Infraestrutura</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-500 block mb-1">Nome do Produto</label>
                    <input
                      type="text"
                      placeholder="Ex: Roteador Cisco v3"
                      value={newStockItem.nome}
                      onChange={(e) => setNewStockItem({ ...newStockItem, nome: e.target.value })}
                      className="w-full bg-[#070B14] border border-gray-850 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-gray-500 block mb-1">Inicial</label>
                      <input
                        type="number"
                        min="0"
                        value={newStockItem.quantidade}
                        onChange={(e) => setNewStockItem({ ...newStockItem, quantidade: Number(e.target.value) })}
                        className="w-full bg-[#070B14] border border-gray-850 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1">Est. Mín.</label>
                      <input
                        type="number"
                        min="1"
                        value={newStockItem.estoqueMinimo}
                        onChange={(e) => setNewStockItem({ ...newStockItem, estoqueMinimo: Number(e.target.value) })}
                        className="w-full bg-[#070B14] border border-gray-850 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1">Endereço</label>
                      <input
                        type="text"
                        placeholder="Ex: B1-3"
                        value={newStockItem.localizacao}
                        onChange={(e) => setNewStockItem({ ...newStockItem, localizacao: e.target.value })}
                        className="w-full bg-[#070B14] border border-gray-850 rounded-lg px-2.5 py-1.5 text-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold font-sans cursor-pointer transition"
                  >
                    Adicionar ao Inventário
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>
            </motion.div>
          )}

          {/* TAB 3: VENDAS & CRM (KANBAN DE PEDIDOS DO ERP) */}
          {activeLogisticsTab === "crm" && (
            <motion.div
              key="tab-crm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <section className="space-y-6" id="crm-vendas-view">
          <div className="space-y-1">
            <h2 className="text-lg md:text-xl font-bold text-white font-sans flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" /> Pipeline de Vendas & Faturamentos CRM CRM
            </h2>
            <p className="text-xs text-gray-400">
              Fluxo integrado de ordens de vendas. Prossiga pedidos de síncronos comerciais desde o Lead corporativo até o Expedido.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            
            {/* Lead Column */}
            <div className="bg-[#0A0D18] border border-slate-850 rounded-2xl p-3 space-y-3 flex flex-col justify-between h-[360px] overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-blue-500/10 pb-1.5">
                  <span className="text-[10px] font-bold text-blue-400 uppercase font-mono tracking-wider flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-blue-500 rounded-full inline-block animate-ping" />
                    Lead / Negociação
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono font-bold">
                    {salesOrders.filter(o => o.status === "Lead").length}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {salesOrders.filter(o => o.status === "Lead").map(order => (
                    <div key={order.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-white truncate max-w-[80%]">{order.cliente}</h4>
                        <span className="text-[8px] font-mono text-gray-500 font-semibold">{order.id}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">{order.itens}</p>
                      <div className="flex justify-between items-center text-[10px] border-t border-slate-800/40 pt-1.5">
                        <span className="text-indigo-400 font-mono font-bold">R$ {order.valor.toLocaleString("pt-BR")}</span>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "Aguardando NF")}
                          className="px-1.5 py-0.5 bg-indigo-500/10 hover:bg-indigo-650 text-indigo-400 hover:text-white rounded text-[8px] font-bold transition flex items-center gap-0.5 cursor-pointer"
                        >
                          Faturar <ArrowRight className="h-2 w-2" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Aguardando NF Column */}
            <div className="bg-[#0A0D18] border border-slate-850 rounded-2xl p-3 space-y-3 flex flex-col justify-between h-[360px] overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-purple-500/10 pb-1.5">
                  <span className="text-[10px] font-bold text-purple-400 uppercase font-mono tracking-wider flex items-center gap-1">
                    Aguardando NF
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono font-bold">
                    {salesOrders.filter(o => o.status === "Aguardando NF").length}
                  </span>
                </div>

                <div className="space-y-2">
                  {salesOrders.filter(o => o.status === "Aguardando NF").map(order => (
                    <div key={order.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-white truncate max-w-[80%]">{order.cliente}</h4>
                        <span className="text-[8px] font-mono text-gray-500 font-semibold">{order.id}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">{order.itens}</p>
                      <div className="flex justify-between items-center text-[10px] border-t border-slate-800/40 pt-1.5">
                        <span className="text-indigo-300 font-mono font-bold">R$ {order.valor.toLocaleString("pt-BR")}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setSelectedInvoiceOrder(order.id);
                              // Scroll into invoice section smoothly
                              document.getElementById("emissor-nota-fiscal")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-400/20 hover:bg-purple-650 text-purple-400 hover:text-white rounded text-[8px] font-bold transition flex items-center gap-0.5 cursor-pointer"
                          >
                            Parametrizar NF-e
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "Faturado & Separando")}
                            className="px-1 py-0.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-650 hover:text-white rounded text-[8px] font-bold transition cursor-pointer"
                            title="Apenas avança sem pré-calcular"
                          >
                            Avançar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Faturado & Separando Column */}
            <div className="bg-[#0A0D18] border border-slate-850 rounded-2xl p-3 space-y-3 flex flex-col justify-between h-[360px] overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-amber-500/10 pb-1.5">
                  <span className="text-[10px] font-bold text-amber-500 uppercase font-mono tracking-wider flex items-center gap-1">
                    Separando no WMS
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono font-bold">
                    {salesOrders.filter(o => o.status === "Faturado & Separando").length}
                  </span>
                </div>

                <div className="space-y-2">
                  {salesOrders.filter(o => o.status === "Faturado & Separando").map(order => (
                    <div key={order.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-white truncate max-w-[80%]">{order.cliente}</h4>
                        <span className="text-[8px] font-mono text-gray-500 font-semibold">{order.id}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">{order.itens}</p>
                      <div className="flex justify-between items-center text-[10px] border-t border-slate-800/40 pt-1.5">
                        <span className="text-amber-500 font-mono font-bold">R$ {order.valor.toLocaleString("pt-BR")}</span>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "Expedido")}
                          className="px-1.5 py-0.5 bg-amber-550/10 hover:bg-amber-600 text-amber-500 hover:text-slate-950 rounded text-[8px] font-bold transition flex items-center gap-0.5 cursor-pointer"
                        >
                          Expedir <Truck className="h-2 w-2" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Expedido Column */}
            <div className="bg-[#0A0D18] border border-slate-850 rounded-2xl p-3 space-y-3 flex flex-col justify-between h-[360px] overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-500/10 pb-1.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono tracking-wider flex items-center gap-1">
                    Expedido / Despachado
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono font-bold">
                    {salesOrders.filter(o => o.status === "Expedido").length}
                  </span>
                </div>

                <div className="space-y-2">
                  {salesOrders.filter(o => o.status === "Expedido").map(order => (
                    <div key={order.id} className="p-3 bg-[#0A1612] border border-emerald-500/20 rounded-xl space-y-2 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-semibold uppercase tracking-wider rounded-bl border-l border-b border-emerald-500/20">
                        Atiço
                      </div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-white truncate max-w-[80%]">{order.cliente}</h4>
                        <span className="text-[8px] font-mono text-emerald-555 text-emerald-400">{order.id}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">{order.itens}</p>
                      <div className="flex justify-between items-center text-[10px] border-t border-emerald-500/10 pt-1.5">
                        <span className="text-emerald-400 font-mono font-bold">R$ {order.valor.toLocaleString("pt-BR")}</span>
                        <div className="flex items-center gap-1 text-[8px] text-emerald-555 text-emerald-400 font-bold">
                          <CheckCircle className="h-3 w-3" /> Despachado ({order.ufDestino})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Quick CRM Order Launcher */}
          <div className="p-4 bg-[#0F1420]/30 border border-slate-850 rounded-2xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-3">Lançamento Rápido de Ordem de Venda</h3>
            <form onSubmit={handleAddSalesOrder} className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs items-end">
              <div>
                <label className="text-gray-500 block mb-1">Cliente Corporativo</label>
                <input
                  type="text"
                  placeholder="Ex: AutoPeças Jundiaí"
                  value={newOrderForm.cliente}
                  required
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, cliente: e.target.value })}
                  className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Itens Vendidos</label>
                <input
                  type="text"
                  placeholder="Ex: 5x Roteador Core, 10x Bobinas"
                  value={newOrderForm.itens}
                  required
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, itens: e.target.value })}
                  className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-1.5 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-500 block mb-1">Valor Venda</label>
                  <input
                    type="number"
                    min="1"
                    value={newOrderForm.valor}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, valor: Number(e.target.value) })}
                    className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-2 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">UF Destino</label>
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="SP"
                    value={newOrderForm.ufDestino}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, ufDestino: e.target.value })}
                    className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-2 py-1.5 text-white font-mono text-center uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Estágio Inicial</label>
                <select
                  value={newOrderForm.status}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, status: e.target.value as any })}
                  className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-1.5 text-white"
                >
                  <option value="Lead">Lead em Negócio</option>
                  <option value="Aguardando NF">Aguardando Faturamento</option>
                  <option value="Faturado & Separando">Separar no WMS</option>
                </select>
              </div>
              <button
                type="submit"
                className="py-2 px-3 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Registrar Pedido No ERP
              </button>
            </form>
          </div>
        </section>
            </motion.div>
          )}

          {/* TAB 4: EMISSÃO DE NOTAS FISCAIS (PARAMETRIZAÇÃO TRIBUTÁRIA SÍNCRONA) */}
          {activeLogisticsTab === "nfe" && (
            <motion.div
              key="tab-nfe"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <section className="space-y-6" id="emissor-nota-fiscal">
          <div className="space-y-1">
            <h2 className="text-lg md:text-xl font-bold text-white font-sans flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-400" /> Emissor Síncrono de Notas Fiscais (NF-e)
            </h2>
            <p className="text-xs text-gray-400">
              Mapeie alíquotas fiscais e configure ICMS, IPI, PIS e COFINS automaticamente. Simule emissões XML instantaneamente para homologação.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Tax Engine Parameters Panel */}
            <div className="lg:col-span-5 bg-[#0F1420]/50 border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider block">1. Parametrizador de Impostos do ERP</span>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-gray-400 block mb-1">Venda Pendente Selecionada</label>
                  <select
                    value={selectedInvoiceOrder}
                    onChange={(e) => setSelectedInvoiceOrder(e.target.value)}
                    className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-2 text-white"
                  >
                    {salesOrders.map(order => (
                      <option key={order.id} value={order.id}>
                        {order.id} - {order.cliente} (R$ {order.valor.toLocaleString("pt-BR")})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-400 block mb-1">Regime Tributário Corrente</label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-900/50 p-1 border border-slate-800 rounded-xl">
                    {["Simples Nacional", "Lucro Presumido", "Lucro Real"].map((sys) => (
                      <button
                        key={sys}
                        type="button"
                        onClick={() => setTaxSystem(sys as any)}
                        className={`py-1.5 rounded-lg text-[9px] font-bold tracking-tight transition-colors ${
                          taxSystem === sys ? "bg-indigo-650 text-white" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {sys}
                      </button>
                    ))}
                  </div>
                </div>

                {taxSystem !== "Simples Nacional" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 block mb-1">PIS (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={pisRate}
                          onChange={(e) => setPisRate(Number(e.target.value))}
                          className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-2 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-1">COFINS (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={cofinsRate}
                          onChange={(e) => setCofinsRate(Number(e.target.value))}
                          className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-2 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 block mb-1">IPI (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={ipiRate}
                          onChange={(e) => setIpiRate(Number(e.target.value))}
                          className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-2 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-1">Média ICMS Destino (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="25"
                          step="1"
                          value={icmsRate}
                          onChange={(e) => setIcmsRate(Number(e.target.value))}
                          className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-2 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-slate-900 p-4 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Base de Cálculo (Preço do Item)</span>
                    <span className="font-mono text-white">R$ {taxCalculations.subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-[11px]">
                    <span>ICMS computado ({taxSystem === "Simples Nacional" ? "Média Simples" : `${icmsRate}%`})</span>
                    <span className="font-mono text-white">- R$ {taxCalculations.icms.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  {taxSystem !== "Simples Nacional" && (
                    <>
                      <div className="flex justify-between text-gray-400 text-[11px]">
                        <span>PIS ({pisRate}%)</span>
                        <span className="font-mono text-white">- R$ {taxCalculations.pis.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-gray-400 text-[11px]">
                        <span>COFINS ({cofinsRate}%)</span>
                        <span className="font-mono text-white">- R$ {taxCalculations.cofins.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-gray-400 text-[11px] border-b border-slate-800 pb-1.5">
                    <span>IPI Adicionado ({ipiRate}%)</span>
                    <span className="font-mono text-white">+ R$ {taxCalculations.ipi.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white text-xs pt-1.5">
                    <span>Total da NF-e</span>
                    <span className="font-mono text-indigo-400">R$ {taxCalculations.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={triggerInvoiceIssuance}
                  className="w-full py-2 bg-gradient-to-r from-blue-650 to-indigo-650 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-bold font-sans cursor-pointer transition flex items-center justify-center gap-1.5 shadow-lg shadow-blue-950/40"
                >
                  <FileText className="h-4 w-4" /> Transmitir NF-e ao Sefaz (Simulado)
                </button>
              </div>
            </div>

            {/* XML NF-e Mock Output Terminal (Right) */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] text-gray-500 font-mono font-bold uppercase tracking-wider block">2. XML Estruturado Gerada por KoreNexus</span>
              
              <div className="bg-[#050914] border border-slate-850 rounded-2xl p-4 h-[330px] overflow-auto font-mono text-[10px] text-[#A8FF53] relative">
                {invoiceIssuedLogo && (
                  <div className="absolute inset-0 bg-slate-950/80 filter backdrop-blur-sm flex flex-col justify-center items-center text-center text-white space-y-2">
                    <RefreshCw className="h-8 w-8 text-blue-400 animate-spin" />
                    <span className="font-sans text-xs font-bold font-mono">Assinando XML digitalmente...</span>
                    <span className="font-sans text-[10px] text-gray-500">Enviando lote ao servidor do Sefaz SP</span>
                  </div>
                )}
                
                {activeInvoiceXml ? (
                  <pre className="whitespace-pre-wrap">{activeInvoiceXml}</pre>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-center text-gray-500 text-xs font-sans space-y-3">
                    <Terminal className="h-8 w-8 text-gray-700" />
                    <p>Aguardando transição ou clique no botão para computar o barramento fiscal.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
            </motion.div>
          )}

          {/* TAB 5: CENTRAL DE DIAGNÓSTICOS & SOLUÇÃO DE PROBLEMAS (CALCULADORAS E SOLUÇÕES REAIS) */}
          {activeLogisticsTab === "diagnostico" && (
            <motion.div
              key="tab-diagnostico"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <section className="space-y-6" id="diagnosticos-supply-chain">
          <div className="space-y-1">
            <h2 className="text-lg md:text-xl font-bold text-white font-sans flex items-center gap-2">
              <Wrench className="h-5 w-5 text-emerald-400" /> Diagnóstico de Problemas Logísticos
            </h2>
            <p className="text-xs text-gray-400">
              Descubra resoluções interativas imediatas para gargalos do cotidiano logístico e supply chain. Use simuladores matemáticos estruturados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Problema Select Sidebar */}
            <div className="space-y-2">
              <button
                onClick={() => setSelectedProblem("picking_delay")}
                className={`w-full p-4.5 rounded-2xl border text-left cursor-pointer transition-all space-y-1 flex flex-col justify-center ${
                  selectedProblem === "picking_delay" 
                    ? "bg-slate-900 border-indigo-500 text-white shadow-lg" 
                    : "bg-slate-950/60 border-slate-850 text-gray-400 hover:border-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-amber-500" />
                  <span className="text-xs font-bold tracking-tight">1. Lentidão na Expedição</span>
                </div>
                <p className="text-[10px] text-gray-500 font-sans leading-tight pl-6">Tempo de picking elevado e erros de separação.</p>
              </button>

              <button
                onClick={() => setSelectedProblem("stock_accuracy")}
                className={`w-full p-4.5 rounded-2xl border text-left cursor-pointer transition-all space-y-1 flex flex-col justify-center ${
                  selectedProblem === "stock_accuracy" 
                    ? "bg-slate-900 border-indigo-500 text-white shadow-lg" 
                    : "bg-slate-950/60 border-slate-850 text-gray-400 hover:border-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                  <span className="text-xs font-bold tracking-tight">2. Divergências de Estoque</span>
                </div>
                <p className="text-[10px] text-gray-500 font-sans leading-tight pl-6">Diferença entre saldo lógico do sistema e estoque físico.</p>
              </button>

              <button
                onClick={() => setSelectedProblem("safety_stock_calc")}
                className={`w-full p-4.5 rounded-2xl border text-left cursor-pointer transition-all space-y-1 flex flex-col justify-center ${
                  selectedProblem === "safety_stock_calc" 
                    ? "bg-slate-900 border-indigo-500 text-white shadow-lg" 
                    : "bg-slate-950/60 border-slate-850 text-gray-400 hover:border-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span className="text-xs font-bold tracking-tight">3. Rupturas de Estoque</span>
                </div>
                <p className="text-[10px] text-gray-500 font-sans leading-tight pl-6">Perguntas de vendas por falta de estoque e atrasos de fornecedor.</p>
              </button>
            </div>

            {/* Diagnostic Resolution Panel */}
            <div className="md:col-span-3 bg-slate-905 bg-[#0A0D17] border border-slate-850 rounded-3xl p-6">
              <AnimatePresence mode="wait">
                
                {/* Resolution 1: Picking Delay */}
                {selectedProblem === "picking_delay" && (
                  <motion.div
                    key="picking_res"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-2 text-white font-sans">
                      <Clock className="h-5 w-5 text-amber-500" />
                      <h3 className="text-sm font-bold">Diagnóstico: Lentidão Física & Otimização de Caminho</h3>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      Seus operadores de guarita e pátio estão demorando muito tempo para achar materiais? O problema é a topologia do layout de picking. A KoreNexus propõe endereçamento síncrono. Veja abaixo como o algoritmo de ordenação WMS reorganiza a lista de picking baseado nas coordenadas.
                    </p>

                    <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-2xl space-y-3 font-sans text-xs">
                      <span className="text-[10px] text-indigo-400 font-mono font-bold block">💡 Solução KoreNexus Integrada</span>
                      <ul className="space-y-2 text-[11px] text-gray-300">
                        <li className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>Mapeamento ABC Automático:</strong> Os produtos de maior giro (E-commerce) são colocados nas posições mais próximas ao portão de saída.</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>Roteamento em S:</strong> O app de celulares síncrono da KoreNexus otimiza o caminho do repositor em zigue-zague evitando que ele volte no mesmo corredor duas vezes.</span>
                        </li>
                      </ul>

                      {/* Mock Interactive Route Simulator */}
                      <div className="border border-slate-800 p-3 bg-slate-950 rounded-xl space-y-2 mt-4 text-xs">
                        <h4 className="text-[10px] text-gray-400 uppercase font-mono font-semibold">Simulador de Expedição Síncrona</h4>
                        <div className="flex flex-wrap items-center gap-2 text-gray-300 font-mono text-[9px]">
                          <span>Início (Docas)</span>
                          <ChevronRight className="h-3 w-3 text-gray-600" />
                          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">Corredor A1 [Modem]</span>
                          <ChevronRight className="h-3 w-3 text-gray-600" />
                          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">Corredor A1 [Roteador]</span>
                          <ChevronRight className="h-3 w-3 text-gray-600" />
                          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">Corredor B1 [Switches]</span>
                          <ChevronRight className="h-3 w-3 text-gray-600" />
                          <span>Finalizado (Embalagem)</span>
                        </div>
                        <p className="text-[9px] text-[#A8FF53] italic">Economia de até 35% nas distâncias percorridas.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Resolution 2: Stock Accuracy */}
                {selectedProblem === "stock_accuracy" && (
                  <motion.div
                    key="accuracy_res"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-2 text-white font-sans">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <h3 className="text-sm font-bold">Diagnóstico: Falta de Acuracidade e Perdas de Materiais</h3>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      A divergência de estoque ocorre principalmente por registros informais de retirada por técnicos ou extravios na arrumação.
                    </p>

                    <div className="bg-[#110B0C] border border-red-500/10 p-4 rounded-2xl space-y-3 font-sans text-xs">
                      <span className="text-[10px] text-red-400 font-mono font-bold block">💡 Soluções Tecnológicas Aplicáveis</span>
                      <div className="space-y-3 text-[11px] text-gray-300">
                        <div className="space-y-1">
                          <h4 className="text-white font-semibold flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 bg-red-500 rounded-full" />
                            Bloqueio por Alçada e Login Único (SSO)
                          </h4>
                          <p className="pl-3 text-gray-400 leading-normal">O técnico só pode apagar ou remover o item inserindo o seu QR Code no coletor do portão de retirada.</p>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-white font-semibold flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 bg-red-500 rounded-full" />
                            Inventários Cíclicos Monitorados
                          </h4>
                          <p className="pl-3 text-gray-400 leading-normal">Sistemas de WMS KoreNexus travam as posições divergentes até a conferência em bando, diminuindo a ociosidade do supervisor.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Resolution 3: Safety Stock Complex Calculator */}
                {selectedProblem === "safety_stock_calc" && (
                  <motion.div
                    key="safety_calc_res"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-2 text-white font-sans">
                      <Calculator className="h-5 w-5 text-emerald-400" />
                      <h3 className="text-sm font-bold">Diagnóstico: Ponto de Ressuprimento (ROP) & Estoque de Segurança</h3>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      As rupturas acontecem porque as empresas compram baseadas em sentimentos, e não no modelo estatístico logístico clássico. Calcule abaixo o estoque exato de segurança recomendável de acordo com as variâncias de entrega.
                    </p>

                    {/* Interactive Calculator Interface */}
                    <div className="border border-slate-800 p-4 bg-slate-900/40 rounded-2xl space-y-4 text-xs font-sans">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1">
                        <Calculator className="h-4 w-4 text-emerald-400" /> Calculador Estatístico de Segurança
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-gray-400 block mb-1" title="Vendas diárias médias">Venda Média (Dia)</label>
                          <input
                            type="number"
                            value={calcDailySales}
                            onChange={(e) => setCalcDailySales(Number(e.target.value))}
                            className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-2.5 py-1.5 text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-gray-400 block mb-1" title="Prazo do fornecedor médio em dias">Lead Time (Dias)</label>
                          <input
                            type="number"
                            value={calcLeadTime}
                            onChange={(e) => setCalcLeadTime(Number(e.target.value))}
                            className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-2.5 py-1.5 text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-gray-400 block mb-1">Insegurança Vendas (StdDev)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={calcDailySalesStd}
                            onChange={(e) => setCalcDailySalesStd(Number(e.target.value))}
                            className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-2.5 py-1.5 text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-gray-400 block mb-1">Insegurança Entrega (StdDev)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={calcLeadTimeStd}
                            onChange={(e) => setCalcLeadTimeStd(Number(e.target.value))}
                            className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-2.5 py-1.5 text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-gray-400 block mb-1">Nível de Atendimento Desejado</label>
                          <select
                            value={calcServiceFactor}
                            onChange={(e) => setCalcServiceFactor(Number(e.target.value))}
                            className="w-full bg-[#070B14] border border-gray-800 rounded-xl px-3 py-1.5 text-white"
                          >
                            <option value={1.28}>90% (Fator Z = 1.28)</option>
                            <option value={1.65}>95% (Fator Z = 1.65) - Indicado Comercial</option>
                            <option value={1.96}>97.5% (Fator Z = 1.96)</option>
                            <option value={2.33}>99% (Fator Z = 2.33) - Rigor de Indústria</option>
                          </select>
                        </div>
                        <div className="flex flex-col justify-end">
                          <p className="text-[10px] text-gray-500 leading-tight">O Fator Z estatístico pondera a probabilidade de a demanda não ultrapassar o estoque de segurança estimado.</p>
                        </div>
                      </div>

                      {/* Computed dynamic mathematical outputs standard in Logistics Endorsement */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-white rounded-xl">
                          <span className="text-[9px] text-indigo-400 block uppercase font-mono tracking-wider">Estoque de Segurança Recomendado</span>
                          <span className="text-xl font-bold font-mono text-white inline-block">{computedSafetyStock}</span> <span className="text-[10px] text-gray-400">unid.</span>
                          <p className="text-[9px] text-gray-400 mt-1">Margem segura estatística no WMS.</p>
                        </div>

                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-white rounded-xl">
                          <span className="text-[9px] text-emerald-400 block uppercase font-mono tracking-wider">Ponto de Ressuprimento (ROP)</span>
                          <span className="text-xl font-bold font-mono text-white inline-block">{computedReorderPoint}</span> <span className="text-[10px] text-gray-400">unid.</span>
                          <p className="text-[9px] text-gray-400 mt-1">Compre quando o estoque atingir este nível.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </section>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* WHATSAPP CONSULTANCY ADQUISIÇÃO (CTA CALL TO ACTION SPECIFIC TO LOGISTICS) */}
      <section className="bg-gradient-to-r from-indigo-950/40 via-slate-950 to-blue-950/40 border border-indigo-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6" id="logistica-adquirir-cta">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded text-[9px] font-bold uppercase font-mono">
            Licenciamento Ativo
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-sans">
            Gostaria de Integrar o <span className="text-blue-400">WMS & Emissor de Notas Fiscais</span> em Seu Negócio?
          </h2>
          <p className="text-xs text-gray-400 max-w-2xl font-sans">
            Sincronize todo o fluxo operacional com o barramento ERP de Jundiaí e região da KoreNexus. Nosso time técnico homologa sua base em menos de 48 horas.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4">
          <div className="text-center sm:text-right">
            <span className="text-[9px] text-gray-500 block font-mono uppercase">Assinatura Completa</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">A partir de R$ 490,00</span>
          </div>

          <a
            href={`https://api.whatsapp.com/send/?phone=5511989387263&text=${encodeURIComponent("Olá! Estou no site da KoreNexus e gostaria de mais informações e de adquirir o módulo de 'Logística Virtual e WMS' integrado com o ERP.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl tracking-wider transition-all shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer uppercase"
          >
            <span>Falar com especialista</span>
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </section>

    </div>
  );
}
