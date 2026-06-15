import React, { useState, useEffect } from "react";
import { SpreadsheetData, TabKey } from "../types";
import { Save, Plus, Trash2, Download, Send, CheckCircle2, AlertCircle, Github, Eye, EyeOff, Key, Settings, Database, Lock, ShieldCheck, RefreshCw, Layers, Activity, Globe, Gauge, Sparkles, FileSpreadsheet, Upload } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SeoMetricasView from "./SeoMetricasView";
import { googleSignIn, getCachedAccessToken, initGoogleAuth } from "../utils/googleAuth";

// Firebase integration
import { db } from "../firebase";
import { collection, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";
import { getApiUrl, safeFetch } from "../utils/api";

interface AdminSpreadsheetProps {
  data: SpreadsheetData;
  onUpdateData: (newData: SpreadsheetData) => void;
  onRefresh: () => void;
  adminEmail: string;
}

export default function AdminSpreadsheet({ data, onUpdateData, onRefresh, adminEmail }: AdminSpreadsheetProps) {
  const [activeTab, setActiveTab] = useState<TabKey | "configuracoes" | "seo-metricas">("produtos");
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; field: string } | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  // Custom Notification Form state
  const [pushTitle, setPushTitle] = useState("");
  const [pushBody, setPushBody] = useState("");
  const [pushStatus, setPushStatus] = useState<string | null>(null);

  // GitHub Auto-Deploy State
  const [deployStatus, setDeployStatus] = useState<{ loading: boolean; message: string | null; error: boolean } | null>(null);

  // Google Sheets integration state
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [sheetsActionStatus, setSheetsActionStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    // Listen to Google Auth state
    const unsubscribe = initGoogleAuth(
      (user, token) => {
        setGoogleToken(token);
      },
      () => {
        setGoogleToken(getCachedAccessToken());
      }
    );
    return () => unsubscribe();
  }, []);

  const handleConnectGoogle = async () => {
    setSheetsActionStatus(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleToken(result.accessToken);
        setSheetsActionStatus({ type: "success", message: `Conectado com sucesso como ${result.user.email}!` });
      }
    } catch (err: any) {
      setSheetsActionStatus({ type: "error", message: `Falha na autenticação: ${err.message}` });
    }
  };

  const handleSyncSheets = async () => {
    if (!googleToken) {
      setSheetsActionStatus({ type: "error", message: "Conecte sua conta do Google primeiro." });
      return;
    }
    const spreadsheetId = configKeys.GOOGLE_SPREADSHEET_ID;
    if (!spreadsheetId) {
      setSheetsActionStatus({ type: "error", message: "Configure o ID da Planilha Google nas configurações primeiro." });
      return;
    }

    setIsSyncing(true);
    setSheetsActionStatus(null);

    try {
      const response = await safeFetch("/api/admin/sheets/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          accessToken: googleToken,
          spreadsheetId: spreadsheetId
        })
      });

      const result = await response.json();
      if (result.success) {
        let detailsStr = "";
        if (result.details) {
          detailsStr = " (" + Object.entries(result.details).map(([k, v]) => `${k}: ${v}`).join(", ") + ")";
        }
        setSheetsActionStatus({
          type: "success",
          message: `${result.message}${detailsStr}`
        });
        onRefresh(); // Refresh current client view
      } else {
        setSheetsActionStatus({ type: "error", message: result.message || "Erro desconhecido na sincronização." });
      }
    } catch (err: any) {
      setSheetsActionStatus({ type: "error", message: "Erro de conexão: " + err.message });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportToSheets = async () => {
    if (!googleToken) {
      setSheetsActionStatus({ type: "error", message: "Conecte sua conta do Google primeiro." });
      return;
    }
    const spreadsheetId = configKeys.GOOGLE_SPREADSHEET_ID;
    if (!spreadsheetId) {
      setSheetsActionStatus({ type: "error", message: "Configure o ID da Planilha Google nas configurações primeiro." });
      return;
    }

    const confirmExport = window.confirm(
      "Você tem certeza que deseja EXPORTAR a base local estruturada para o Google Sheets? Isso criará ou sobrescreverá as abas necessárias."
    );
    if (!confirmExport) return;

    setIsExporting(true);
    setSheetsActionStatus(null);

    try {
      const response = await safeFetch("/api/admin/sheets/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          accessToken: googleToken,
          spreadsheetId: spreadsheetId
        })
      });

      const result = await response.json();
      if (result.success) {
        setSheetsActionStatus({ type: "success", message: result.message });
      } else {
        setSheetsActionStatus({ type: "error", message: result.message || "Erro desconhecido na exportação." });
      }
    } catch (err: any) {
      setSheetsActionStatus({ type: "error", message: "Erro de conexão: " + err.message });
    } finally {
      setIsExporting(false);
    }
  };

  // Api Keys & Configs State
  const [configKeys, setConfigKeys] = useState({
    GEMINI_API_KEY: "",
    GNEWS_API_KEY: "",
    UPTIME_ROBOT_API_KEY: "",
    GITHUB_USER: "",
    GITHUB_EMAIL: "",
    GITHUB_TOKEN: "",
    GOOGLE_SPREADSHEET_ID: "",
    DB_PATH: "data/spreadsheet.json",
    KFLOW_CACHE_FILE: "data/kflow_cache.json",
    CHAT_CACHE_FILE: "data/chat_cache.json"
  });
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [configStatus, setConfigStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch API Keys and Secrets from database safely
  const fetchConfigKeys = async () => {
    setLoadingConfig(true);
    setConfigStatus(null);
    try {
      const response = await safeFetch("/api/admin/config/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail })
      });
      const res = await response.json();
      if (res.success && res.config) {
        setConfigKeys({
          GEMINI_API_KEY: res.config.GEMINI_API_KEY || "",
          GNEWS_API_KEY: res.config.GNEWS_API_KEY || "",
          UPTIME_ROBOT_API_KEY: res.config.UPTIME_ROBOT_API_KEY || "",
          GITHUB_USER: res.config.GITHUB_USER || "",
          GITHUB_EMAIL: res.config.GITHUB_EMAIL || "",
          GITHUB_TOKEN: res.config.GITHUB_TOKEN || "",
          GOOGLE_SPREADSHEET_ID: res.config.GOOGLE_SPREADSHEET_ID || "",
          DB_PATH: res.config.DB_PATH || "data/spreadsheet.json",
          KFLOW_CACHE_FILE: res.config.KFLOW_CACHE_FILE || "data/kflow_cache.json",
          CHAT_CACHE_FILE: res.config.CHAT_CACHE_FILE || "data/chat_cache.json"
        });
      } else {
        setConfigStatus({ type: "error", message: res.error || "Falha técnica na busca de segredos." });
      }
    } catch (err: any) {
      setConfigStatus({ type: "error", message: "Erro de conexão ao buscar chaves: " + err.message });
    } finally {
      setLoadingConfig(false);
    }
  };

  // Save new secrets and API Keys directly to config.json and reload in server memory
  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setConfigStatus(null);
    try {
      const response = await safeFetch("/api/admin/config/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminEmail,
          newConfig: configKeys
        })
      });
      const res = await response.json();
      if (res.success) {
        setConfigStatus({ type: "success", message: "Chaves e segredos operacionais salvos e aplicados síncronos na memória!" });
        onRefresh();
        setTimeout(() => setConfigStatus(null), 5000);
      } else {
        setConfigStatus({ type: "error", message: res.error || "Erro para registrar chaves no backend." });
      }
    } catch (err: any) {
      setConfigStatus({ type: "error", message: "Erro de rede ao salvar novas chaves: " + err.message });
    }
  };

  // Export full backup consolidates all Google Sheets database tables and active secrets
  const handleExportFullBackup = async () => {
    setExportLoading(true);
    setConfigStatus(null);
    try {
      const response = await safeFetch("/api/admin/config/export-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail })
      });
      const res = await response.json();
      if (res.success && res.bundle) {
        const fileContent = JSON.stringify(res.bundle, null, 2);
        const encodedUri = "data:text/json;charset=utf-8," + encodeURIComponent(fileContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", res.filename || `korenexus_backup_full_${Date.now()}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setConfigStatus({ type: "success", message: "Sucesso! Cópia de faturamento, dados locais de planilha do Sheets e chaves operativas exportado e salvo com sucesso." });
        setTimeout(() => setConfigStatus(null), 5000);
      } else {
        setConfigStatus({ type: "error", message: res.error || "Erro síncrono consolidando backup." });
      }
    } catch (err: any) {
      setConfigStatus({ type: "error", message: "Sem conexão de faturamento para exportação: " + err.message });
    } finally {
      setExportLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "configuracoes") {
      fetchConfigKeys();
    }
  }, [activeTab]);

  const handlePushToGithub = async () => {
    setDeployStatus({ loading: true, message: "Iniciando build de otimização e empacotamento com o token de SSO...", error: false });
    try {
      const response = await safeFetch("/api/admin/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail }),
      });
      const res = await response.json();
      if (res.success) {
        setDeployStatus({
          loading: false,
          message: "🎉 SUCESSO! Código empacotado e enviado via SSL para 'github.com/SANTZSPAXX/KN.git'!",
          error: false,
        });
      } else {
        setDeployStatus({
          loading: false,
          message: `Falha técnica no Deploy: ${res.error || res.details || "Verifique chaves ou diretório local"}`,
          error: true,
        });
      }
    } catch (err: any) {
      setDeployStatus({
        loading: false,
        message: `Falha de rede com o servidor KoreNexus: ${err.message}`,
        error: true,
      });
    }
  };

  // Define column metadata for spreadsheet rendering
  const tabColumns: Record<TabKey, { key: string; label: string; placeholder: string }[]> = {
    produtos: [
      { key: "id", label: "ID (Código)", placeholder: "pX" },
      { key: "nome", label: "Nome do Produto", placeholder: "Novo ERP" },
      { key: "descricao", label: "Descrição Detalhada", placeholder: "Sistema customizado para..." },
      { key: "categoria", label: "Categoria", placeholder: "ERP / CRM / Automação" },
      { key: "preco", label: "Preço Comercial", placeholder: "Sob Consulta" },
      { key: "status", label: "Status", placeholder: "Ativo / Beta / Novo" }
    ],
    ferramentas: [
      { key: "id", label: "ID", placeholder: "fX" },
      { key: "nome", label: "Nome da Ferramenta", placeholder: "Validador" },
      { key: "tipo", label: "Tipo / Tag", placeholder: "API / Financeiro / DevOps" },
      { key: "utilidade", label: "Utilidade Principal", placeholder: "Calculadora automática de..." },
      { key: "link", label: "URL de Acesso", placeholder: "#" },
      { key: "status", label: "Status", placeholder: "Estável / Beta" }
    ],
    apps: [
      { key: "id", label: "ID", placeholder: "aX" },
      { key: "nome", label: "Nome do App", placeholder: "KoreForça" },
      { key: "plataforma", label: "Plataforma", placeholder: "Android / iOS" },
      { key: "descricao", label: "Descrição", placeholder: "App portátil para..." },
      { key: "downloads", label: "Downloads", placeholder: "10k+" },
      { key: "detalhes", label: "Detalhes Técnicos", placeholder: "Sincronização offline automática" },
      { key: "link", label: "Link de Download", placeholder: "https://..." }
    ],
    promocoes: [
      { key: "id", label: "ID", placeholder: "prX" },
      { key: "titulo", label: "Nome da Promoção", placeholder: "UI Figma Grátis" },
      { key: "desconto", label: "Benefício / Desconto", placeholder: "100% OFF / 15% OFF" },
      { key: "validade", label: "Data de Validade", placeholder: "31-12-2026" },
      { key: "cupom", label: "Cupom de Ativação", placeholder: "KOREANEXUS" },
      { key: "condicao", label: "Condições Comerciais", placeholder: "Na contratação de..." }
    ],
    blog: [
      { key: "id", label: "ID", placeholder: "bX" },
      { key: "titulo", label: "Título do Artigo", placeholder: "Como automatizar..." },
      { key: "resumo", label: "Resumo Curto", placeholder: "Neste artigo abordamos..." },
      { key: "categoria", label: "Categoria", placeholder: "Sistemas / UX / Mercado" },
      { key: "data", label: "Data Publicação", placeholder: "08/06/2026" },
      { key: "autor", label: "Autor", placeholder: "Fabio Kore" },
      { key: "leitura", label: "Tempo de Leitura", placeholder: "5 min" }
    ],
    notificacoes: [
      { key: "id", label: "ID", placeholder: "nX" },
      { key: "titulo", label: "Título do Push", placeholder: "Aviso importante..." },
      { key: "corpo", label: "Corpo do Alerta", placeholder: "Texto complementar que dispara..." },
      { key: "data", label: "Data e Hora", placeholder: "08/06/2026 às 18:00" },
      { key: "enviadoPor", label: "Remetente Admin", placeholder: "admin@korenexus.com" }
    ]
  };

  const activeRows = data[activeTab] || [];
  const activeCols = tabColumns[activeTab] || [];

  // Cell interaction: cell values changes
  const handleCellChange = (rowIndex: number, field: string, value: string) => {
    const updatedRows = [...activeRows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [field]: value
    };

    const updatedData = {
      ...data,
      [activeTab]: updatedRows
    };

    onUpdateData(updatedData);
  };

  // Add new blank row at the end mimicking Excel insert
  const handleAddRow = () => {
    const newIdCode = activeTab.substring(0, 2) + (activeRows.length + 1);
    const newRow: Record<string, string> = { id: newIdCode };
    
    activeCols.forEach(col => {
      if (col.key !== "id") {
        newRow[col.key] = "";
      }
    });

    const updatedRows = [...activeRows, newRow];
    const updatedData = {
      ...data,
      [activeTab]: updatedRows
    };

    onUpdateData(updatedData);
    setEditingCell({ rowIndex: updatedRows.length - 1, field: activeCols[1]?.key || "nome" });
  };

  // Delete row
  const handleDeleteRow = (rowIndex: number) => {
    const updatedRows = activeRows.filter((_, idx) => idx !== rowIndex);
    const updatedData = {
      ...data,
      [activeTab]: updatedRows
    };
    onUpdateData(updatedData);
  };

  // Save specific tab to database express endpoint and sync in real-time with Google Cloud Firestore
  const handleSaveSpreadsheet = async () => {
    if (activeTab === "configuracoes") {
      await handleSaveConfig();
      return;
    }
    if (activeTab === "seo-metricas") {
      setSaveStatus({ type: "error", message: "A aba 'SEO & Métricas' possui caráter estritamente de exibição e leitura de logs. Não há dados editáveis nesta aba para salvar." });
      setTimeout(() => setSaveStatus(null), 5000);
      return;
    }

    setSaveStatus(null);
    let apiSaved = false;
    let apiErrorMsg = "";

    try {
      const response = await safeFetch("/api/spreadsheet-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tabName: activeTab,
          rows: activeRows
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          apiSaved = true;
        } else {
          apiErrorMsg = result.error || "Erro retornado pelo backend.";
        }
      } else {
        apiErrorMsg = `Status HTTP ${response.status}`;
      }
    } catch (err: any) {
      console.warn("Express backend offline ou inacessível. O sistema irá sincronizar diretamente no Firebase Cloud Firestore:", err.message);
      apiErrorMsg = err.message;
    }

    try {
      const colName = activeTab as string;
      const validCollections = ["produtos", "ferramentas", "apps", "promocoes", "blog", "notificacoes"];
      
      if (validCollections.includes(colName)) {
        // Retrieve all document IDs currently in Firestore to identify deletes
        const querySnapshot = await getDocs(collection(db, colName));
        const existingIds = new Set<string>();
        querySnapshot.forEach((doc) => {
          existingIds.add(doc.id);
        });

        const activeIds = new Set(activeRows.map((r: any) => String(r.id)));

        // Add or update items
        for (const row of activeRows) {
          if (row.id) {
            await setDoc(doc(db, colName, String(row.id)), row);
          }
        }

        // Purge deleted items from Firestore
        for (const oldId of existingIds) {
          if (!activeIds.has(oldId)) {
            await deleteDoc(doc(db, colName, oldId));
          }
        }
        
        if (apiSaved) {
          setSaveStatus({ type: "success", message: `Tabela '${activeTab.toUpperCase()}' salva e sincronizada em tempo real com o Firestore!` });
        } else {
          setSaveStatus({ type: "success", message: `Salvo no modo Serverless! Tabela '${activeTab.toUpperCase()}' persistida diretamente no Firestore Cloud.` });
        }
        onRefresh();
        setTimeout(() => setSaveStatus(null), 5000);
      } else {
        // Not a standard collection, but if api worked we are fine
        if (apiSaved) {
          setSaveStatus({ type: "success", message: `Tabela '${activeTab.toUpperCase()}' salva com sucesso no servidor!` });
          onRefresh();
        } else {
          setSaveStatus({ type: "error", message: `Erro ao salvar: O servidor backend está offline (${apiErrorMsg}) e a aba '${activeTab}' não pôde ser sincronizada.` });
        }
        setTimeout(() => setSaveStatus(null), 5000);
      }
    } catch (firebaseErr: any) {
      console.error("Ambos os salvamentos falharam (Backend & Firestore):", firebaseErr);
      if (apiSaved) {
        setSaveStatus({ type: "success", message: `Salvo localmente no servidor, mas a sincronização na nuvem do Firestore falhou: ${firebaseErr.message}` });
      } else {
        setSaveStatus({ type: "error", message: `Erro ao salvar alterações corporativas. Servidor offline (${apiErrorMsg}) e o Firestore Cloud falhou: ${firebaseErr.message}` });
      }
      setTimeout(() => setSaveStatus(null), 6000);
    }
  };

  // Export spreadsheet tab to CSV format
  const handleExportCSV = () => {
    if (activeRows.length === 0) return;
    
    const headers = activeCols.map(col => col.label).join(";");
    const rows = activeRows.map(row => 
      activeCols.map(col => {
        const val = (row as any)[col.key] || "";
        // Sanitize string to avoid broken csv formatting
        return `"${val.toString().replace(/"/g, '""')}"`;
      }).join(";")
    );
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `korenexus_planilha_${activeTab}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dispatch Push Notification to all active client users
  const handleDispatchPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle || !pushBody) return;
    
    setPushStatus("Aguardando...");
    try {
      const response = await safeFetch("/api/notifications/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: pushTitle,
          corpo: pushBody,
          enviadoPor: adminEmail
        })
      });

      const result = await response.json();
      if (result.success) {
        setPushStatus("Sucesso! Notificação disparada para todos os usuários em tempo real.");
        setPushTitle("");
        setPushBody("");
        onRefresh(); // Refresh spreadsheet sheets
        setTimeout(() => setPushStatus(null), 5000);
      } else {
        setPushStatus("Falha ao disparar. " + result.error);
      }
    } catch (err: any) {
      setPushStatus("Erro de rede: " + err.message);
    }
  };

  return (
    <div className="w-full bg-[#111622] border border-gray-800 rounded-3xl p-6 overflow-hidden">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5 mb-6">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Planilha de Negócios KoreNexus - Banco de Dados em Tempo Real
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Modo Corporativo Admin • Conectado como <span className="text-blue-400 font-bold font-mono">{adminEmail}</span>
          </p>
        </div>

        {/* Action Controls for Active Spreadsheet */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs bg-[#0A0D14] hover:bg-gray-800 text-slate-200 hover:text-white rounded-full border border-gray-800 transition cursor-pointer"
            title="Baixar Tabela Ativa formato Comercial .CSV"
            id="btn-export-csv"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Exportar Planilha (CSV)</span>
            <span className="sm:hidden">CSV</span>
          </button>
          
          <button
            onClick={handleSaveSpreadsheet}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition shadow-lg shadow-blue-600/20 cursor-pointer"
            title="Persistir todas alterações no servidor central"
            id="btn-save-spreadsheet"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Salvar Alterações</span>
          </button>

          <button
            onClick={handlePushToGithub}
            disabled={deployStatus?.loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs rounded-full font-bold transition shadow-lg cursor-pointer ${
              deployStatus?.loading
                ? "bg-slate-800 text-gray-500 cursor-not-allowed border border-gray-700"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
            }`}
            title="Fazer build do Vite e dar Push no repositório GitHub via SSO"
            id="btn-deploy-github"
          >
            <Github className={`h-3.5 w-3.5 ${deployStatus?.loading ? "animate-spin" : ""}`} />
            <span>{deployStatus?.loading ? "Efetuando Deploy..." : "Deploy Git (SSO)"}</span>
          </button>
        </div>
      </div>

      {/* Google Sheets Live Integration Sync Control */}
      <div className="bg-[#0b1220]/60 border border-[#0d5c3a]/30 p-4 rounded-2xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5 font-sans">
              Segurança e Sincronização Google Sheets
              <span className={`h-1.5 w-1.5 rounded-full ${googleToken ? "bg-emerald-500 animate-pulse" : "bg-yellow-500"}`} />
            </h3>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">
              {googleToken 
                ? `Modulo autenticado e sincronizado síncrono no ecossistema.` 
                : "Autentique com sua conta comercial do Google para desbloquear a sincronização em tempo de execução."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {!googleToken ? (
            <button
              onClick={handleConnectGoogle}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-purple-600/15 cursor-pointer w-full md:w-auto justify-center"
            >
              <Key className="h-3.5 w-3.5" />
              <span>Conectar Conta Google</span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={handleSyncSheets}
                disabled={isSyncing || isExporting}
                className={`flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/15 cursor-pointer w-full md:w-auto justify-center ${
                  (isSyncing || isExporting) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Sincronizando..." : "Sincronizar (Sheets ➔ Local)"}</span>
              </button>

              <button
                onClick={handleExportToSheets}
                disabled={isSyncing || isExporting}
                className={`flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition border border-slate-700 cursor-pointer w-full md:w-auto justify-center ${
                  (isSyncing || isExporting) ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Seed / sobrescrever worksheets com seus dados locais atuais"
              >
                <Upload className={`h-3.5 w-3.5 ${isExporting ? "animate-pulse" : ""}`} />
                <span>{isExporting ? "Exportando..." : "Exportar (Local ➔ Sheets)"}</span>
              </button>
              
              <button
                onClick={() => setGoogleToken(null)}
                className="text-[10px] text-slate-400 hover:text-red-400 hover:underline px-2 cursor-pointer font-sans"
              >
                Desconectar
              </button>
            </div>
          )}
        </div>
      </div>

      {sheetsActionStatus && (
        <div className={`p-3.5 mb-6 rounded-2xl flex items-start gap-2.5 text-xs font-sans ${
          sheetsActionStatus.type === "success" 
            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
            : "bg-red-500/10 border border-red-500/20 text-red-400"
        }`}>
          {sheetsActionStatus.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
          <div className="flex-1">
            <p className="font-semibold">{sheetsActionStatus.type === "success" ? "Sucesso!" : "Aviso / Erro:"}</p>
            <p className="mt-0.5 font-mono text-[11px] opacity-90">{sheetsActionStatus.message}</p>
          </div>
          <button 
            onClick={() => setSheetsActionStatus(null)} 
            className="text-[10px] hover:underline cursor-pointer select-none opacity-60 self-center font-sans"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Tabs Navigation corresponding to spreadsheet tabs */}
      <div className="flex flex-wrap md:flex-nowrap justify-between gap-4 bg-[#0A0D14]/80 p-1.5 rounded-2xl mb-6 border border-gray-800 items-center">
        <div className="flex flex-wrap gap-1">
          {(Object.keys(tabColumns) as TabKey[]).map((tabKey) => {
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => {
                  setActiveTab(tabKey);
                  setEditingCell(null);
                }}
                className={`px-4 py-2 text-xs rounded-xl font-bold transition capitalize cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
                id={`tab-${tabKey}`}
              >
                📊 {tabKey === "promocoes" ? "Promoções" : tabKey === "notificacoes" ? "Notificações" : tabKey}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => {
              setActiveTab("seo-metricas");
              setEditingCell(null);
            }}
            className={`px-4 py-2 text-xs rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "seo-metricas"
                ? "bg-[#10B981] text-white shadow-md shadow-[#10B981]/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-dashed border-gray-800"
            }`}
            id="tab-seo-metricas"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>SEO & Métricas Live</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("configuracoes");
              setEditingCell(null);
            }}
            className={`px-4 py-2 text-xs rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "configuracoes"
                ? "bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-dashed border-gray-800"
            }`}
            id="tab-configuracoes"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>Configurações & Backups</span>
          </button>
        </div>
      </div>

      {/* Save Status Alert Banner */}
      <AnimatePresence>
        {saveStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-2 p-3 rounded-2xl text-xs mb-5 border ${
              saveStatus.type === "success"
                ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-400"
                : "bg-rose-950/40 border-rose-500/20 text-rose-400"
            }`}
          >
            {saveStatus.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>{saveStatus.message}</span>
          </motion.div>
        )}

        {deployStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-start gap-2.5 p-4 rounded-2xl text-xs mb-5 border leading-relaxed font-mono ${
              deployStatus.loading
                ? "bg-slate-950/80 border-indigo-500/20 text-indigo-400"
                : deployStatus.error
                ? "bg-rose-950/40 border-rose-500/20 text-rose-400"
                : "bg-emerald-950/40 border-emerald-500/20 text-emerald-400"
            }`}
          >
            {deployStatus.loading ? (
              <svg className="animate-spin h-4 w-4 text-indigo-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : deployStatus.error ? (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
            )}
            <div className="flex-1 whitespace-pre-line">
              {deployStatus.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conditionally render spreadsheet interactive tools vs Settings Panel */}
      {activeTab === "configuracoes" ? (
        <div className="space-y-6">
          <AnimatePresence>
            {configStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center gap-2 p-3 rounded-2xl text-xs mb-1 border ${
                  configStatus.type === "success"
                    ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-400"
                    : "bg-rose-950/40 border-rose-500/20 text-rose-400"
                }`}
              >
                {configStatus.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                <span>{configStatus.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Secrets Form */}
            <form onSubmit={handleSaveConfig} className="lg:col-span-8 bg-[#0A0D14]/50 border border-gray-800 p-6 rounded-3xl space-y-5">
              <div className="flex items-center gap-2 border-b border-gray-850 pb-3">
                <Lock className="h-5 w-5 text-purple-400" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Chaves de API & Chaves de Comunicação</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Defina chaves seguras que integram o robô de IA Kflow, notícias locais e monitor de status.</p>
                </div>
              </div>

              {loadingConfig ? (
                <div className="py-12 flex flex-col items-center justify-center text-gray-450 gap-2">
                  <RefreshCw className="animate-spin h-6 w-6 text-purple-500" />
                  <span className="text-[11px] font-mono font-bold">Buscando chaves seguras no cofre operacional...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                    {/* Gemini AI API KEY */}
                    <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-slate-300 font-semibold font-sans flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                          Gemini API Key
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowSecrets(prev => ({ ...prev, gemini: !prev.gemini }))}
                          className="text-[10px] text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {showSecrets.gemini ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          <span>{showSecrets.gemini ? "Ocultar" : "Mostrar"}</span>
                        </button>
                      </div>
                      <input
                        type={showSecrets.gemini ? "text" : "password"}
                        placeholder="Insira sua GEMINI_API_KEY do Google AI Studio"
                        value={configKeys.GEMINI_API_KEY}
                        onChange={(e) => setConfigKeys(prev => ({ ...prev, GEMINI_API_KEY: e.target.value }))}
                        className="bg-[#0A0D14] text-slate-100 placeholder-gray-655 rounded-xl border border-gray-800 px-4 py-2.5 text-xs focus:ring-1 focus:ring-purple-500 outline-none w-full font-mono text-[11px]"
                      />
                    </div>

                    {/* GNews API KEY */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-slate-300 font-semibold font-sans flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                          GNews API Key
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowSecrets(prev => ({ ...prev, gnews: !prev.gnews }))}
                          className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {showSecrets.gnews ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          <span>{showSecrets.gnews ? "Ocultar" : "Mostrar"}</span>
                        </button>
                      </div>
                      <input
                        type={showSecrets.gnews ? "text" : "password"}
                        placeholder="Insira sua chave correspondente do portal GNews"
                        value={configKeys.GNEWS_API_KEY}
                        onChange={(e) => setConfigKeys(prev => ({ ...prev, GNEWS_API_KEY: e.target.value }))}
                        className="bg-[#0A0D14] text-slate-100 placeholder-gray-655 rounded-xl border border-gray-800 px-4 py-2.5 text-xs focus:ring-1 focus:ring-purple-500 outline-none w-full font-mono text-[11px]"
                      />
                    </div>

                    {/* Uptime Robot API KEY */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-slate-300 font-semibold font-sans flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                          Uptime Robot API Key
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowSecrets(prev => ({ ...prev, uptime: !prev.uptime }))}
                          className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {showSecrets.uptime ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          <span>{showSecrets.uptime ? "Ocultar" : "Mostrar"}</span>
                        </button>
                      </div>
                      <input
                        type={showSecrets.uptime ? "text" : "password"}
                        placeholder="Chave pública do UptimeRobot para monitoramento"
                        value={configKeys.UPTIME_ROBOT_API_KEY}
                        onChange={(e) => setConfigKeys(prev => ({ ...prev, UPTIME_ROBOT_API_KEY: e.target.value }))}
                        className="bg-[#0A0D14] text-slate-100 placeholder-gray-655 rounded-xl border border-gray-800 px-4 py-2.5 text-xs focus:ring-1 focus:ring-purple-500 outline-none w-full font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-b border-gray-850 pb-2 pt-3">
                    <Github className="h-4 w-4 text-indigo-400" />
                    <h3 className="text-xs font-semibold text-white">Chaves de Integração Git Deploy (SSO)</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
                    {/* GITHUB USER */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-300 font-semibold font-sans flex items-center gap-1.5">
                        GitHub Username
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: SANTZSPAXX"
                        value={configKeys.GITHUB_USER}
                        onChange={(e) => setConfigKeys(prev => ({ ...prev, GITHUB_USER: e.target.value }))}
                        className="bg-[#0A0D14] text-slate-100 placeholder-gray-655 rounded-xl border border-gray-800 px-4 py-2.5 text-xs focus:ring-1 focus:ring-purple-500 outline-none w-full font-mono text-[11px]"
                      />
                    </div>

                    {/* GITHUB EMAIL */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-slate-300 font-semibold font-sans flex items-center gap-1.5">
                        GitHub Email
                      </label>
                      <input
                        type="email"
                        placeholder="Ex: admin@github.com"
                        value={configKeys.GITHUB_EMAIL}
                        onChange={(e) => setConfigKeys(prev => ({ ...prev, GITHUB_EMAIL: e.target.value }))}
                        className="bg-[#0A0D14] text-slate-100 placeholder-gray-655 rounded-xl border border-gray-800 px-4 py-2.5 text-xs focus:ring-1 focus:ring-purple-500 outline-none w-full font-mono text-[11px]"
                      />
                    </div>

                    {/* GITHUB TOKEN */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-slate-300 font-semibold font-sans flex items-center gap-1.5">
                          GitHub Token
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowSecrets(prev => ({ ...prev, gtoken: !prev.gtoken }))}
                          className="text-[10px] text-slate-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {showSecrets.gtoken ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          <span>{showSecrets.gtoken ? "Ocultar" : "Mostrar"}</span>
                        </button>
                      </div>
                      <input
                        type={showSecrets.gtoken ? "text" : "password"}
                        placeholder="ghp_..."
                        value={configKeys.GITHUB_TOKEN}
                        onChange={(e) => setConfigKeys(prev => ({ ...prev, GITHUB_TOKEN: e.target.value }))}
                        className="bg-[#0A0D14] text-slate-100 placeholder-gray-655 rounded-xl border border-gray-800 px-4 py-2.5 text-xs focus:ring-1 focus:ring-purple-500 outline-none w-full font-mono text-[11px]"
                      />
                    </div>

                    {/* GOOGLE SPREADSHEET ID */}
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-slate-300 font-semibold font-sans flex items-center gap-1.5">
                          ID da Planilha Google (Google Sheets ID)
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Ex: 1sBcdFv_K5k2O3r..."
                        value={configKeys.GOOGLE_SPREADSHEET_ID}
                        onChange={(e) => setConfigKeys(prev => ({ ...prev, GOOGLE_SPREADSHEET_ID: e.target.value }))}
                        className="bg-[#0A0D14] text-slate-100 placeholder-gray-500 rounded-xl border border-gray-800 px-4 py-2.5 text-xs focus:ring-1 focus:ring-purple-500 outline-none w-full font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end font-sans">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xs font-bold transition shadow-lg shadow-purple-600/20 cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Salvar e Autenticar Chaves</span>
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Backups Card */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-[#0A0D14]/50 border border-gray-800 p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-850 pb-3 text-purple-400">
                  <Database className="h-5 w-5" />
                  <h3 className="text-sm font-semibold text-white">Full Backup de Conexão</h3>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-sans font-sans">
                  Exporta imediatamente em formato JSON consolidado todas as tabelas de planilhas do Sheets do KoreNexus (faturamento, produtos, posts do blog...) juntas com os tokens e chaves ativas do sistema local.
                </p>
                <p className="text-xs text-gray-500 leading-relaxed font-sans font-sans">
                  Este arquivo backup contém tudo que o site precisa para funcionar e se recompor de forma síncrona se importado.
                </p>
                <div className="pt-3">
                  <button
                    onClick={handleExportFullBackup}
                    disabled={exportLoading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-800 disabled:to-slate-800 text-white text-xs font-bold rounded-full transition shadow-lg shadow-blue-500/10 cursor-pointer flex items-center justify-center gap-2 font-sans"
                  >
                    {exportLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <Download className="h-4 w-4 text-white animate-bounce" />
                    )}
                    <span>{exportLoading ? "Recuperando dados..." : "Exportar Todas as Chaves e Sheets"}</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950/40 border border-gray-850 p-5 rounded-2xl space-y-2 font-mono text-[10px] text-gray-400">
                <div className="flex items-center gap-1.5 text-purple-405 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Ambiente Seguro SSL</span>
                </div>
                <p className="leading-relaxed">
                  • As chaves alteradas no formulário entram em vigor imediatamente na memória dinâmica do servidor sem exigir reinicialização.
                </p>
                <p className="leading-relaxed">
                  • Seus tokens de deploy de SSH/GitHub SSO são criptografados síncronos e nunca expostos ao navegador por medidas de privacidade de segurança.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "seo-metricas" ? (
        <SeoMetricasView data={data} onRefresh={onRefresh} adminEmail={adminEmail} />
      ) : (
        <>
          {/* Spreadsheet Interactive Grid */}
          <div className="relative border border-gray-800 rounded-2xl overflow-hidden bg-[#0A0D14]">
            <div className="overflow-x-auto w-full max-h-[400px]">
              <table className="w-full text-left border-collapse table-auto text-xs font-mono">
                <thead>
                  <tr className="bg-[#111622] border-b border-gray-800 text-slate-300">
                    <th className="p-3 w-12 text-center border-r border-gray-800 select-none text-gray-500">#</th>
                    {activeCols.map((col) => (
                      <th key={col.key} className="p-3 border-r border-gray-800 min-w-[150px] font-semibold uppercase tracking-wider text-gray-400">
                        {col.label}
                      </th>
                    ))}
                    <th className="p-3 text-center w-16">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRows.length === 0 ? (
                    <tr>
                      <td colSpan={activeCols.length + 2} className="p-8 text-center text-gray-500 italic">
                        Aba vazia. Clique em "Adicionar Linha" para iniciar o preenchimento.
                      </td>
                    </tr>
                  ) : (
                    activeRows.map((row: any, rowIndex) => (
                      <tr key={`${row.id || 'row'}-${rowIndex}`} className="border-b border-gray-850 hover:bg-gray-800/10 text-slate-200 group">
                        <td className="p-3 text-center bg-[#111622]/40 border-r border-gray-800 text-gray-500 select-none">
                          {rowIndex + 1}
                        </td>
                        
                        {activeCols.map((col) => {
                          const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.field === col.key;
                          const cellValue = row[col.key] !== undefined ? row[col.key] : "";
                          const isId = col.key === "id";

                          return (
                            <td
                              key={col.key}
                              className={`p-1 border-r border-gray-800 ${isId ? "bg-slate-900/20 text-blue-400 font-bold" : "cursor-pointer"}`}
                              onClick={() => {
                                if (!isId) {
                                   setEditingCell({ rowIndex, field: col.key });
                                }
                              }}
                            >
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={cellValue}
                                  onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
                                  onBlur={() => setEditingCell(null)}
                                  placeholder={col.placeholder}
                                  autoFocus
                                  className="w-full h-full p-2 bg-[#0A0D14] text-white border border-blue-500/40 outline-none focus:ring-1 focus:ring-blue-500 rounded-lg"
                                  onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        setEditingCell(null);
                                      }
                                  }}
                                />
                              ) : (
                                <div className="p-2 truncate min-h-[32px] flex items-center" title="Clique duas vezes para editar esta célula">
                                  {cellValue !== "" ? (
                                    cellValue
                                  ) : (
                                    <span className="text-gray-650 italic font-sans">vazio</span>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}

                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleDeleteRow(rowIndex)}
                            className="p-1 px-2 text-rose-500 hover:text-white hover:bg-rose-500/20 rounded transition opacity-50 group-hover:opacity-100 cursor-pointer"
                            title="Remover linha"
                            id={`btn-delete-row-${rowIndex}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom add bar matching Excel style */}
            <div className="bg-[#111622] p-3 border-t border-gray-800 flex justify-between items-center">
              <button
                onClick={handleAddRow}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0A0D14] hover:bg-gray-800 border border-gray-800 rounded-full text-slate-300 hover:text-white transition cursor-pointer text-xs font-semibold"
                id="btn-add-row"
              >
                <Plus className="h-3.5 w-3.5 text-blue-400" />
                <span>Inserir Linha (Excel)</span>
              </button>
              
              <span className="text-gray-500 text-[10px]">
                {activeRows.length} linhas carregadas nesta aba corporativa
              </span>
            </div>
          </div>

          {/* Push Notification Panel Launcher */}
          <div className="mt-8 border-t border-gray-800 pt-6">
            <h3 className="text-md font-display font-bold text-white mb-3 flex items-center gap-2">
              <Send className="h-4 w-4 text-blue-400" />
              Disparador Real-Time de Notificações Push
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Envie novidades ou alertas gerais. Este componente se comunica via Server-Sent Events (SSE). Todos os usuários navegando na KoreNexus no momento verão a notificação descer da tela imediatamente de forma fluida.
            </p>

            <form onSubmit={handleDispatchPush} className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#0A0D14]/40 p-5 rounded-2xl border border-gray-800">
              <div className="md:col-span-4 flex flex-col gap-1.5">
                <label className="text-xs text-slate-300 font-medium font-sans">Título do Comunicado</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 🛠️ Lançamento de Nova API"
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                  className="bg-[#0A0D14] text-white rounded-full border border-gray-800 px-4 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none w-full font-sans"
                />
              </div>

              <div className="md:col-span-6 flex flex-col gap-1.5 font-sans">
                <label className="text-xs text-slate-300 font-medium">Corpo / Mensagem Curta</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Liberamos a documentação pública da nossa API de cálculo de margem logística, acesse o painel de APIs..."
                  value={pushBody}
                  onChange={(e) => setPushBody(e.target.value)}
                  className="bg-[#0A0D14] text-white rounded-full border border-gray-800 px-4 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none w-full"
                />
              </div>

              <div className="md:col-span-2 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition shadow-lg shadow-blue-600/15 cursor-pointer font-sans"
                  id="btn-dispatch-push"
                >
                  Disparar Push 🚀
                </button>
              </div>
            </form>

            {pushStatus && (
              <div className="mt-3 text-xs font-mono text-blue-405 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping"></span>
                <span>{pushStatus}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
