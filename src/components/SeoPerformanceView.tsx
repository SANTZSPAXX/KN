import React, { useState, useMemo } from "react";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  Layers, 
  Globe, 
  Activity, 
  FileText, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  Info, 
  Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SpreadsheetData } from "../types";
import { validateAndFixMetadata } from "../App";

interface SeoPerformanceViewProps {
  data: SpreadsheetData;
  onRefresh: () => void;
  adminEmail: string;
}

interface PageSeoRow {
  id: string;
  name: string;
  path: string;
  type: "Estática" | "Dinâmica";
  rawTitle: string;
  rawDescription: string;
  url: string;
}

export default function SeoPerformanceView({ data, onRefresh, adminEmail }: SeoPerformanceViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "optimized" | "warnings">("all");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [recalculating, setRecalculating] = useState(false);

  // Generate the full page list including static routes and database items
  const pagesList = useMemo(() => {
    const list: PageSeoRow[] = [
      {
        id: "static-inicio",
        name: "Página Inicial (Home)",
        path: "/",
        type: "Estática",
        rawTitle: "KoreNexus | Softwares sob Medida, ERP & IA em Jundiaí e Várzea Paulista",
        rawDescription: "A KoreNexus desenvolve soluções digitais, ERPs industriais e apps sob medida para empresas de Jundiaí, Várzea e região. Otimize seus processos com suporte local.",
        url: "https://korenexus.com.br/"
      },
      {
        id: "static-produtos",
        name: "Página de Produtos",
        path: "/produtos",
        type: "Estática",
        rawTitle: "Sistemas ERP sob Medida e Gestão Industrial em Jundiaí e Várzea | KoreNexus",
        rawDescription: "Sistemas ERP e soluções personalizadas para indústrias e comércios de Jundiaí, Várzea Paulista, Campo Limpo Paulista e região. Otimize seus processos.",
        url: "https://korenexus.com.br/produtos"
      },
      {
        id: "static-kagenda",
        name: "Kagenda (Agendamento)",
        path: "/kagenda",
        type: "Estática",
        rawTitle: "Agendamento Online Corporativo | Jundiaí, Várzea e Campo Limpo | Kagenda",
        rawDescription: "Sistema de agendamento online corporativo de alta escalabilidade. Conecte clientes com sua equipe de forma fácil em Jundiaí, Várzea e região.",
        url: "https://korenexus.com.br/kagenda"
      },
      {
        id: "static-kflow",
        name: "Kflow RPA & IA",
        path: "/kflow",
        type: "Estática",
        rawTitle: "Kflow AI | Robôs de Automação e RPA em Jundiaí e Região SP",
        rawDescription: "Criação de robôs virtuais auto-gerenciáveis (RPA) para integrar sistemas legados e gerar conhecimento automático para empresas de Jundiaí e região.",
        url: "https://korenexus.com.br/kflow"
      },
      {
        id: "static-ferramentas",
        name: "Ferramentas Sefaz & DevOps",
        path: "/ferramentas",
        type: "Estática",
        rawTitle: "Ferramentas Sefaz, Validadores e DevOps sob Medida | KoreNexus",
        rawDescription: "Validadores e motores fiscais rápidos integrados. DevOps, consultas e utilitários sob medida criados pela KoreNexus.",
        url: "https://korenexus.com.br/ferramentas"
      },
      {
        id: "static-ferramentas-fiscais",
        name: "Ferramentas - Validadores Fiscais",
        path: "/ferramentas/fiscais",
        type: "Estática",
        rawTitle: "Formatadores e Validadores Fiscais Sefaz Online | KoreNexus",
        rawDescription: "Valide notas fiscais XML de forma instantânea e gratuita. Corrija erros de emissão, calcule impostos e simplifique seu faturamento.",
        url: "https://korenexus.com.br/ferramentas/fiscais"
      },
      {
        id: "static-ferramentas-sandbox",
        name: "Ferramentas - Sandbox de APIs",
        path: "/ferramentas/sandbox",
        type: "Estática",
        rawTitle: "Simulador Sandbox e Ferramentas para Desenvolvedores | KoreNexus",
        rawDescription: "Acelere suas integrações. Decodifique tokens JWT, teste expressões regulares e valide payloads de faturamento em um ambiente seguro de testes.",
        url: "https://korenexus.com.br/ferramentas/sandbox"
      },
      {
        id: "static-ferramentas-fifty",
        name: "Ferramentas - 50 Utilitários de Produtividade",
        path: "/ferramentas/fifty",
        type: "Estática",
        rawTitle: "50 Ferramentas Gratuitas de Produtividade e SEO | KoreNexus",
        rawDescription: "Ganhe tempo no dia a dia: utilitários rápidos para gerar contratos, otimizar SEO, formatar dados e otimizar sua rotina de trabalho em um só lugar.",
        url: "https://korenexus.com.br/ferramentas/fifty"
      },
      {
        id: "static-ferramentas-gqcode",
        name: "Ferramentas - QR Code & Pix",
        path: "/ferramentas/gqcode",
        type: "Estática",
        rawTitle: "Gerador de QR Code e Pix Dinâmico Online | KoreNexus",
        rawDescription: "Crie códigos QR de alta densidade e chaves Pix em conformidade com o Banco Central para automatizar as cobranças da sua empresa de maneira simples.",
        url: "https://korenexus.com.br/ferramentas/gqcode"
      },
      {
        id: "static-apps",
        name: "Aplicativos (Apps)",
        path: "/apps",
        type: "Estática",
        rawTitle: "Criação de Apps iOS e Android em Jundiaí e Várzea Paulista | KoreNexus",
        rawDescription: "Fábrica de aplicativos móveis nativos e híbridos de alta confiabilidade em Jundiaí, Várzea Paulista, Campo Limpo Paulista, Cabreúva, Louveira, Itupeva e SP.",
        url: "https://korenexus.com.br/apps"
      },
      {
        id: "static-chatbots",
        name: "Chatbots e Conversas IA",
        path: "/chatbots",
        type: "Estática",
        rawTitle: "Fábrica de Chatbots WhatsApp e Atendimento IA | KoreNexus",
        rawDescription: "Reduza o tempo de atendimento da sua empresa em até 80%. Integre robôs inteligentes no WhatsApp e automatize fluxos de vendas e suporte ao cliente 24/7.",
        url: "https://korenexus.com.br/chatbots"
      },
      {
        id: "static-promocoes",
        name: "Cupons & Promoções",
        path: "/promocoes",
        type: "Estática",
        rawTitle: "Descontos de Cupom para Desenvolvimento de Sistemas e TI Jundiaí | KoreNexus",
        rawDescription: "Aproveite cupons de desconto exclusivos para contratação e desenvolvimento de sistemas sob medida e consultorias corporativas.",
        url: "https://korenexus.com.br/promocoes"
      },
      {
        id: "static-apis",
        name: "Portal de APIs Públicas",
        path: "/apis",
        type: "Estática",
        rawTitle: "Catálogo de APIs e Integração de Sistemas Rápidos | KoreNexus",
        rawDescription: "Consulte nosso catálogo público de microsserviços rápidos e APIs integradas de alta performance para faturamento, CEP, CNPJ e validações.",
        url: "https://korenexus.com.br/apis"
      },
      {
        id: "static-status",
        name: "Monitor de Status de Serviços",
        path: "/status",
        type: "Estática",
        rawTitle: "Monitoramento de Estabilidade e SLA de Sistemas | KoreNexus",
        rawDescription: "Verifique o status operacional de toda a estrutura de sistemas corporativos hospedados pela KoreNexus. Transparência de uptime 24/7.",
        url: "https://korenexus.com.br/status"
      },
      {
        id: "static-blog",
        name: "Blog Kflow (Índice)",
        path: "/blog",
        type: "Estática",
        rawTitle: "Blog Kflow | Inovações, Robótica Industrial e Tecnologia em Jundiaí",
        rawDescription: "Artigos, análises de mercado sobre desenvolvimento de software, automações industriais e inteligência artificial para o crescimento de negócios em Jundiaí e região.",
        url: "https://korenexus.com.br/blog"
      },
      {
        id: "static-sobre",
        name: "Sobre a KoreNexus",
        path: "/sobre",
        type: "Estática",
        rawTitle: "Fábrica de Software e Consultoria de TI em Jundiaí e Várzea | KoreNexus",
        rawDescription: "Conheça a KoreNexus, seu parceiro confiável em Jundiaí e região metropolitana para o desenvolvimento de softwares rápidos e de alta usabilidade.",
        url: "https://korenexus.com.br/sobre"
      },
      {
        id: "static-cursos",
        name: "Cursos e Capacitação",
        path: "/cursos",
        type: "Estática",
        rawTitle: "Cursos de Programação, ERP e Tecnologia em Jundiaí e Várzea | KoreNexus",
        rawDescription: "Formações completas e treinamentos práticos de ERP, APIs e automações Sefaz. Certificações profissionais sob a metodologia corporativa KoreNexus em Jundiaí, SP.",
        url: "https://korenexus.com.br/cursos"
      },
      {
        id: "static-diagnostico",
        name: "Ferramenta de Diagnóstico",
        path: "/diagnostico",
        type: "Estática",
        rawTitle: "Diagnóstico de Eficiência & Auditoria de ERP | KoreNexus",
        rawDescription: "Responda à nossa auditoria rápida e descubra os principais gargalos e vazamentos de margem financeira do seu ERP tradicional com nosso roteiro de automação gratis.",
        url: "https://korenexus.com.br/diagnostico"
      },
      {
        id: "static-playground",
        name: "Playground de APIs",
        path: "/playground",
        type: "Estática",
        rawTitle: "Playground Interativo de APIs e Teste de Código Online | KoreNexus",
        rawDescription: "Simule requisições HTTP, teste códigos JavaScript e analise respostas de APIs em nosso playground virtual integrado para programadores e integradores corporativos.",
        url: "https://korenexus.com.br/playground"
      },
      {
        id: "static-portaria",
        name: "Portaria Inteligente (Módulo)",
        path: "/portaria",
        type: "Estática",
        rawTitle: "Portaria Inteligente e Controle de Acesso Veicular | KoreNexus",
        rawDescription: "Aumente a segurança e a agilidade da sua indústria. Controle pátios com leitura de placas por OCR, reconhecimento facial e gerenciamento de frotas integrado.",
        url: "https://korenexus.com.br/portaria"
      },
      {
        id: "static-logistica",
        name: "Logística & Estoque (Módulo)",
        path: "/logistica",
        type: "Estática",
        rawTitle: "WMS Inteligente, Estoque e Automação Logística | KoreNexus",
        rawDescription: "Controle seu estoque de ponta a ponta. Nosso sistema WMS integra o faturamento fiscal síncrono com a movimentação real de materiais em menos de 2 segundos.",
        url: "https://korenexus.com.br/logistica"
      },
      {
        id: "static-documentacao",
        name: "Documentação de APIs",
        path: "/documentacao-apis",
        type: "Estática",
        rawTitle: "Documentação de Sistemas e Integration de APIs | KoreNexus",
        rawDescription: "Acesse especificações de software, tutoriais de segurança cibernética e recursos de acoplamento de microsserviços rápidos criados pela KoreNexus.",
        url: "https://korenexus.com.br/documentacao-apis"
      },
      {
        id: "static-privacidade",
        name: "Política de Privacidade",
        path: "/politica-de-privacidade",
        type: "Estática",
        rawTitle: "Diretrizes de Privacidade e RGPD/LGPD | KoreNexus",
        rawDescription: "Nossa política estrita de controle, criptografia SSL e governança de dados integrados na nuvem em conformidade com as leis vigentes no Brasil.",
        url: "https://korenexus.com.br/politica-de-privacidade"
      }
    ];

    // Hydrate Dynamic Products from spreadsheet data
    if (data.produtos && Array.isArray(data.produtos)) {
      data.produtos.forEach((prod: any) => {
        if (!prod || !prod.nome) return;
        const slug = prod.nome.toLowerCase().replace(/\s+/g, "-");
        list.push({
          id: `dyn-prod-${prod.id || slug}`,
          name: `Produto: ${prod.nome}`,
          path: `/produtos/${slug}`,
          type: "Dinâmica",
          rawTitle: `${prod.nome} | Sistemas Prontos de ERP KoreNexus`,
          rawDescription: `Implante o módulo ${prod.nome} hoje mesmo para unificar estoque, ordens de serviço e faturamento seguro com suporte local em Várzea e Jundiaí. ${prod.descricao || ""}`.substring(0, 195) + "...",
          url: `https://korenexus.com.br/produtos/${slug}`
        });
      });
    }

    // Hydrate Dynamic Tools from spreadsheet data
    if (data.ferramentas && Array.isArray(data.ferramentas)) {
      data.ferramentas.forEach((tool: any) => {
        if (!tool || !tool.nome) return;
        const slug = tool.nome.toLowerCase().replace(/\s+/g, "-");
        list.push({
          id: `dyn-tool-${tool.id || slug}`,
          name: `Ferramenta: ${tool.nome}`,
          path: `/ferramentas/${slug}`,
          type: "Dinâmica",
          rawTitle: `${tool.nome} Online: Otimize Processos Gratuitamente | KoreNexus`,
          rawDescription: `Aumente a produtividade da sua equipe com a ferramenta online ${tool.nome}. Faça validações rápidas de XML, auditorias de dados Sefaz e elimine gargalos burocráticos. ${tool.utilidade || ""}`.substring(0, 195) + "...",
          url: `https://korenexus.com.br/ferramentas/${slug}`
        });
      });
    }

    // Hydrate Dynamic Apps from spreadsheet data
    if (data.apps && Array.isArray(data.apps)) {
      data.apps.forEach((app: any) => {
        if (!app || !app.nome) return;
        const slug = app.nome.toLowerCase().replace(/\s+/g, "-");
        list.push({
          id: `dyn-app-${app.id || slug}`,
          name: `Aplicativo: ${app.nome}`,
          path: `/aplicativos/${slug}`,
          type: "Dinâmica",
          rawTitle: `Desenvolvimento do App ${app.nome} em Jundiaí | KoreNexus`,
          rawDescription: `Criamos e publicamos o aplicativo ${app.nome} em lojas iOS e Android. Desempenho nativo com sincronia local offline e de alta retenção. ${app.descricao || ""}`.substring(0, 195) + "...",
          url: `https://korenexus.com.br/aplicativos/${slug}`
        });
      });
    }

    // Hydrate Dynamic Blog Articles from spreadsheet data
    if (data.blog && Array.isArray(data.blog)) {
      data.blog.forEach((post: any) => {
        if (!post || !post.titulo) return;
        const slug = post.titulo.toLowerCase().replace(/\s+/g, "-");
        list.push({
          id: `dyn-blog-${post.id || slug}`,
          name: `Artigo: ${post.titulo}`,
          path: `/blog/${slug}`,
          type: "Dinâmica",
          rawTitle: `${post.titulo} | Blog Kflow KoreNexus`,
          rawDescription: `${post.resumo || "Aprenda sobre inovações industriais, robótica automatizada e as melhores tendências de IA para tracionar sua empresa paulista."}`.substring(0, 195) + "...",
          url: `https://korenexus.com.br/blog/${slug}`
        });
      });
    }

    return list;
  }, [data]);

  // Run each row through the validateAndFixMetadata function
  const validatedPages = useMemo(() => {
    return pagesList.map(page => {
      // Create rich JSON-LD schema matching the type of page to satisfy live Google validations perfectly
      let schemaType = "WebSite";
      const extraFields: Record<string, any> = {};

      if (page.id.startsWith("dyn-prod-")) {
        schemaType = "Product";
        extraFields.offers = {
          "@type": "Offer",
          "price": "149.90",
          "priceCurrency": "BRL",
          "valueAddedTaxIncluded": "true",
          "availability": "https://schema.org/InStock"
        };
      } else if (page.id.startsWith("dyn-tool-")) {
        schemaType = "WebApplication";
        extraFields.operatingSystem = "All";
        extraFields.applicationCategory = "BusinessApplication";
      } else if (page.id.startsWith("dyn-app-")) {
        schemaType = "MobileApplication";
        extraFields.operatingSystem = "iOS, Android";
        extraFields.applicationCategory = "BusinessApplication";
      } else if (page.id.startsWith("dyn-blog-")) {
        schemaType = "TechArticle";
        extraFields.headline = page.rawTitle;
        extraFields.datePublished = "2026-06-23T17:00:00Z";
        extraFields.author = {
          "@type": "Person",
          "name": "Yugny Ohany Miotelo"
        };
        extraFields.publisher = {
          "@type": "Organization",
          "name": "KoreNexus",
          "url": "https://korenexus.com.br",
          "image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Av. Nove de Julho",
            "addressLocality": "Jundiaí",
            "addressRegion": "SP",
            "postalCode": "13208-001",
            "addressCountry": "BR"
          }
        };
      } else {
        // Standard WebSite
        schemaType = "WebSite";
        extraFields.url = page.url || "https://korenexus.com.br";
        extraFields.name = "KoreNexus";
      }

      const rawJsonLd = {
        "@context": "https://schema.org",
        "@type": schemaType,
        "name": page.rawTitle,
        "description": page.rawDescription,
        "url": page.url,
        ...extraFields
      };

      const result = validateAndFixMetadata(page.rawTitle, page.rawDescription, rawJsonLd);
      
      return {
        ...page,
        verifiedTitle: result.verifiedTitle,
        verifiedDesc: result.verifiedDesc,
        warnings: result.warnings,
        isValid: result.warnings.length === 0
      };
    });
  }, [pagesList]);

  // Calculate summary metrics
  const metricsSummary = useMemo(() => {
    const total = validatedPages.length;
    const optimized = validatedPages.filter(p => p.isValid).length;
    const withWarnings = total - optimized;
    const score = total > 0 ? Math.round((optimized / total) * 100) : 100;
    
    return { total, optimized, withWarnings, score };
  }, [validatedPages]);

  // Handle manual audit re-run animation
  const handleReRunAudit = () => {
    setRecalculating(true);
    setTimeout(() => {
      setRecalculating(false);
      onRefresh();
    }, 1200);
  };

  // Toggle row expansion for warnings details
  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter and search logic
  const filteredPages = useMemo(() => {
    return validatedPages.filter(page => {
      const matchSearch = 
        page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.rawTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.rawDescription.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      if (statusFilter === "optimized") return page.isValid;
      if (statusFilter === "warnings") return !page.isValid;

      return true;
    });
  }, [validatedPages, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header Info Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/40 border border-gray-800">
        <div>
          <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            Painel de Desempenho SEO Corporativo
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Auditoria em tempo real de metatags estruturadas, títulos, descrições e integridade de tags canonicals e microdados de indexadores.
          </p>
        </div>

        <button
          onClick={handleReRunAudit}
          disabled={recalculating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl text-xs font-bold transition border border-blue-500/20 cursor-pointer w-full md:w-auto justify-center"
        >
          <RefreshCw className={`h-4 w-4 ${recalculating ? "animate-spin" : ""}`} />
          <span>{recalculating ? "Reavaliando Tags..." : "Recalcular Integridade SEO"}</span>
        </button>
      </div>

      {/* Stats Summary Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-gray-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">Total de Páginas</span>
            <span className="text-2xl font-extrabold text-white">{metricsSummary.total}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-gray-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">Metatags Otimizadas</span>
            <span className="text-2xl font-extrabold text-white">{metricsSummary.optimized}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-gray-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider">Pendentes de Ajuste</span>
            <span className="text-2xl font-extrabold text-white">{metricsSummary.withWarnings}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-slate-350 block uppercase font-mono tracking-wider">Score Global SEO</span>
            <span className="text-2xl font-black text-white">{metricsSummary.score}%</span>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar página por título, descrição, slug ou tipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 shrink-0 bg-slate-950/80 border border-gray-800 rounded-xl p-1">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition ${
              statusFilter === "all" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Todas ({metricsSummary.total})
          </button>
          <button
            onClick={() => setStatusFilter("optimized")}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition ${
              statusFilter === "optimized" ? "bg-emerald-500/15 text-emerald-400" : "text-slate-400 hover:text-emerald-400"
            }`}
          >
            Otimizadas ({metricsSummary.optimized})
          </button>
          <button
            onClick={() => setStatusFilter("warnings")}
            className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition ${
              statusFilter === "warnings" ? "bg-amber-500/15 text-amber-400" : "text-slate-400 hover:text-amber-400"
            }`}
          >
            Pendentes ({metricsSummary.withWarnings})
          </button>
        </div>
      </div>

      {/* Main Pages SEO Report Table */}
      <div className="bg-[#0A0D14] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-[#111622]/55">
                <th className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono w-1/4">Página & URL</th>
                <th className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono w-1/4">Meta Title</th>
                <th className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono w-1/3">Meta Description</th>
                <th className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono text-center">Validação (Status)</th>
                <th className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono text-right w-[60px]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-850">
              {filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="h-8 w-8 text-slate-600" />
                      <p className="text-xs text-slate-400 font-sans">Nenhuma página encontrada correspondente aos filtros.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPages.map(page => {
                  const isExpanded = !!expandedRows[page.id];
                  
                  return (
                    <React.Fragment key={page.id}>
                      <tr 
                        onClick={() => toggleRow(page.id)}
                        className={`hover:bg-slate-900/40 transition cursor-pointer ${isExpanded ? "bg-slate-900/20" : ""}`}
                      >
                        {/* Page & URL */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white font-sans">{page.name}</span>
                              <span className={`px-2 py-0.5 text-[8px] rounded-full font-mono font-bold leading-none ${
                                page.type === "Estática" 
                                  ? "bg-slate-800 text-slate-350 border border-gray-700" 
                                  : "bg-blue-950/50 text-blue-400 border border-blue-900/30"
                              }`}>
                                {page.type}
                              </span>
                            </div>
                            <a 
                              href={page.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 font-mono tracking-tight"
                            >
                              <span className="truncate max-w-[200px]">{page.path}</span>
                              <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                            </a>
                          </div>
                        </td>

                        {/* Title Column */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed" title={page.rawTitle}>
                              {page.rawTitle}
                            </span>
                            <span className={`text-[9px] font-mono ${
                              page.rawTitle.length < 30 || page.rawTitle.length > 60 
                                ? "text-amber-500 font-medium" 
                                : "text-emerald-500"
                            }`}>
                              {page.rawTitle.length} caracteres
                            </span>
                          </div>
                        </td>

                        {/* Description Column */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed" title={page.rawDescription}>
                              {page.rawDescription}
                            </span>
                            <span className={`text-[9px] font-mono ${
                              page.rawDescription.length < 50 || page.rawDescription.length > 160 
                                ? "text-amber-500 font-medium" 
                                : "text-emerald-500"
                            }`}>
                              {page.rawDescription.length} caracteres
                            </span>
                          </div>
                        </td>

                        {/* Validation Status Badge */}
                        <td className="px-5 py-4 text-center">
                          {page.isValid ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                              Otimizada
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              <span className="h-1 w-1 rounded-full bg-amber-500 animate-pulse"></span>
                              Avisos ({page.warnings.length})
                            </span>
                          )}
                        </td>

                        {/* Toggle Arrow Column */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end">
                            <button
                              type="button"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Warnings Box */}
                      <AnimatePresence>
                        {isExpanded && (
                          <tr>
                            <td colSpan={5} className="p-0 bg-slate-950/40">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden border-b border-gray-850"
                              >
                                <div className="px-6 py-4 space-y-3">
                                  {/* Title & Desc character guidelines */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] font-sans border-b border-gray-800/60 pb-3">
                                    <div className="space-y-1">
                                      <p className="text-slate-350 font-semibold uppercase font-mono text-[9px]">Requisitos de Title Tag</p>
                                      <p className="text-slate-400 leading-relaxed">
                                        Recomendado entre <strong className="text-white">30 e 60 caracteres</strong>. Títulos fora desse limite podem ser truncados ou desconsiderados na SERP do Google.
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-slate-350 font-semibold uppercase font-mono text-[9px]">Requisitos de Meta Description</p>
                                      <p className="text-slate-400 leading-relaxed">
                                        Recomendado entre <strong className="text-white">50 e 160 caracteres</strong>. Essencial para atrair cliques (CTR orgânico) de potenciais clientes.
                                      </p>
                                    </div>
                                  </div>

                                  {/* Auto-Fix recommendations and warnings logs */}
                                  <div className="space-y-2">
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                                      <Info className="h-3.5 w-3.5 text-blue-400" />
                                      Resultado da Auditoria (validateAndFixMetadata)
                                    </h4>

                                    {page.warnings.length === 0 ? (
                                      <div className="p-3 bg-emerald-950/20 border border-emerald-500/10 rounded-xl flex items-start gap-2.5 text-emerald-400 text-xs">
                                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                                        <div>
                                          <p className="font-bold">Totalmente Otimizada para SEO!</p>
                                          <p className="text-[11px] text-slate-400 mt-0.5">Tudo correto com os limites de comprimento de texto, JSON-LD microdados e tags og:properties.</p>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-1.5">
                                        {page.warnings.map((warning, index) => (
                                          <div key={index} className="p-2.5 bg-amber-950/20 border border-amber-500/10 rounded-xl flex items-start gap-2 text-amber-300 text-[11px] font-sans">
                                            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                            <span>{warning}</span>
                                          </div>
                                        ))}

                                        {/* Auto-fixed Output details */}
                                        <div className="p-3 bg-blue-950/15 border border-blue-500/10 rounded-xl space-y-1 text-slate-300 text-[11px] font-sans">
                                          <p className="font-bold text-blue-400">Correções Propostas Aplicadas Automaticamente:</p>
                                          <p><span className="text-slate-400">Título Verificado:</span> {page.verifiedTitle}</p>
                                          <p className="truncate"><span className="text-slate-400">Descrição Verificada:</span> {page.verifiedDesc}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
