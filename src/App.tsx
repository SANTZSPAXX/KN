import React, { useState, useEffect } from "react";
import { SpreadsheetData, TabKey, Message, Produto, Ferramenta, AppModel, Promocao, BlogPost, Notificacao } from "./types";
import BrandingLogo from "./components/BrandingLogo";
import AdminSpreadsheet from "./components/AdminSpreadsheet";
import ChatKore from "./components/ChatKore";
import KagendaPage from "./components/KagendaPage";
import KflowPage from "./components/KflowPage";
import KoreNexusWidget from "./components/KoreNexusWidget";
import SearchPalette from "./components/SearchPalette";
import CookieBanner from "./components/CookieBanner";
import LeadMagnetModal from "./components/LeadMagnetModal";
import FaqSection from "./components/FaqSection";
import { 
  PostDetailPage, 
  ProductDetailPage, 
  ToolDetailPage, 
  AppDetailPage, 
  DocumentationPage, 
  PrivacyPolicyPage,
  toSlug
} from "./components/SlugPages";
import { 
  Home, 
  Layers, 
  Wrench, 
  Smartphone, 
  MessageSquare, 
  Percent, 
  Cpu, 
  Activity, 
  FileText, 
  Info, 
  Lock, 
  ChevronRight, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Copy, 
  Check, 
  Bell, 
  TrendingUp, 
  ArrowRight,
  RefreshCw,
  LogOut,
  Clock,
  ShieldCheck,
  Sparkles,
  Calendar,
  Zap,
  Sliders,
  Search,
  Database,
  CheckCircle,
  BarChart2,
  Play,
  Filter,
  AlertCircle,
  ArrowUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

import { PublicApiItem, NEW_PUBLIC_APIS_LIST as PUBLIC_APIS_LIST } from "./data/publicApis";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("inicio");
  const [db, setDb] = useState<SpreadsheetData>({
    produtos: [],
    ferramentas: [],
    apps: [],
    promocoes: [],
    blog: [],
    notificacoes: []
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [activeNotification, setActiveNotification] = useState<Notificacao | null>(null);
  
  // Admin Login State
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  
  // News and AI Blog generation states
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState<boolean>(false);
  const [newsError, setNewsError] = useState<string>( "");

  // Blog detailed modal / route detail states
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [selectedTool, setSelectedTool] = useState<Ferramenta | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppModel | null>(null);
  const [isDocPage, setIsDocPage] = useState<boolean>(false);
  const [isPrivPage, setIsPrivPage] = useState<boolean>(false);
  const [show404, setShow404] = useState<boolean>(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // States for stunning dynamic Home & About interactive widgets
  const [simSystemType, setSimSystemType] = useState<string>("erp");
  const [simInefficiency, setSimInefficiency] = useState<string>("media");
  const [simTeamSize, setSimTeamSize] = useState<number>(15);
  const [simActiveStep, setSimActiveStep] = useState<number>(0);
  const [sobreSelectedFilter, setSobreSelectedFilter] = useState<string>("todos");

  // Synchronize component state with address bar path (Deep Linking / RPA slugs)
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const segments = path.split("/").filter(Boolean);
      
      // Reset page states
      setSelectedProduct(null);
      setSelectedTool(null);
      setSelectedApp(null);
      setIsDocPage(false);
      setIsPrivPage(false);
      setShow404(false);

      if (segments.length === 0) {
        setActiveTab("inicio");
        setSelectedPost(null);
      } else {
        const firstSegment = segments[0];

        if (firstSegment === "documentacao") {
          setIsDocPage(true);
          setActiveTab("");
          setSelectedPost(null);
          return;
        }

        if (firstSegment === "privacidade") {
          setIsPrivPage(true);
          setActiveTab("");
          setSelectedPost(null);
          return;
        }

        const validTabs = ["inicio", "produtos", "ferramentas", "apps", "chatkore", "promocoes", "apis", "status", "blog", "admin-dashboard", "sobre"];
        if (validTabs.includes(firstSegment)) {
          setActiveTab(firstSegment);
          
          if (firstSegment === "blog" && segments[1]) {
            const postSlug = segments[1];
            let found = db.blog.find(p => {
              const pSlug = slugify(p.titulo);
              return pSlug === postSlug || p.id === postSlug;
            });

            if (!found && newsArticles && newsArticles.length > 0) {
              const mappedNews = newsArticles.map((a, idx) => ({
                id: `gnews-${idx}`,
                titulo: a.title,
                resumo: a.description || "Sem resumo disponível do portal de notícias.",
                categoria: "Notícias Globais",
                data: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("pt-BR") : "Recente",
                autor: a.source?.name || "Global News",
                leitura: "3 min",
                conteudo: a.content || a.description || "Conteúdo completo indisponível na pré-visualização. Por favor, utilize o botão de visualizar fonte original acima para ler a notícia na íntegra.",
                url: a.url,
                image: a.image
              }));
              found = mappedNews.find(p => slugify(p.titulo) === postSlug || p.id === postSlug);
            }

            if (found) {
              setSelectedPost(found);
            } else {
              setShow404(true);
            }
          } else if (firstSegment === "produtos" && segments[1]) {
            const prodSlug = segments[1];
            const foundProd = db.produtos.find(p => slugify(p.nome) === prodSlug || p.id === prodSlug);
            if (foundProd) {
              setSelectedProduct(foundProd);
            } else {
              setShow404(true);
            }
          } else if (firstSegment === "ferramentas" && segments[1]) {
            const toolSlug = segments[1];
            const foundTool = db.ferramentas.find(f => slugify(f.nome) === toolSlug || f.id === toolSlug);
            if (foundTool) {
              setSelectedTool(foundTool);
            } else {
              setShow404(true);
            }
          } else if (firstSegment === "apps" && segments[1]) {
            const appSlug = segments[1];
            const foundApp = db.apps.find(a => slugify(a.nome) === appSlug || a.id === appSlug);
            if (foundApp) {
              setSelectedApp(foundApp);
            } else {
              setShow404(true);
            }
          } else {
            setSelectedPost(null);
            // If sub-segments exist for single-segment tabs, trigger 404
            if (segments.length > 1) {
              setShow404(true);
            }
          }
        } else {
          setShow404(true);
        }
      }
    };

    if (!loading) {
      handleUrlChange();
    }

    window.addEventListener("popstate", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [db, loading, newsArticles]);

  // Push state to URL when tabs or selected post changes
  useEffect(() => {
    let targetPath = "";
    if (isDocPage) {
      targetPath = "/documentacao";
    } else if (isPrivPage) {
      targetPath = "/privacidade";
    } else if (selectedProduct) {
      targetPath = `/produtos/${slugify(selectedProduct.nome)}`;
    } else if (selectedTool) {
      targetPath = `/ferramentas/${slugify(selectedTool.nome)}`;
    } else if (selectedApp) {
      targetPath = `/apps/${slugify(selectedApp.nome)}`;
    } else {
      const validTabs = ["inicio", "produtos", "ferramentas", "apps", "chatkore", "promocoes", "apis", "status", "blog", "admin-dashboard", "sobre"];
      if (activeTab && validTabs.includes(activeTab)) {
        targetPath = `/${activeTab}`;
        if (activeTab === "blog" && selectedPost) {
          targetPath = `/blog/${slugify(selectedPost.titulo)}`;
        }
      }
    }

    if (targetPath && window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
  }, [activeTab, selectedPost, selectedProduct, selectedTool, selectedApp, isDocPage, isPrivPage]);
  
  // UI interaction states & SEO automation controls
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [subscribedNewsletter, setSubscribedNewsletter] = useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");

  // Dynamic SEO Metatags & Schema Markup JSON-LD Generator
  useEffect(() => {
    let resolvedTitle = "KoreNexus | Softwares sob Medida, Integração de ERP & IA";
    let resolvedDesc = "A KoreNexus desenvolve sistemas sob medida de alta usabilidade, ERPs industriais, automações, aplicativos mobile e APIs de IA integradas para elevar seu faturamento.";
    let jsonLd: any = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": resolvedTitle,
      "description": resolvedDesc,
      "url": window.location.href,
      "publisher": {
        "@type": "Organization",
        "name": "KoreNexus",
        "logo": {
          "@type": "ImageObject",
          "url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"
        }
      }
    };

    if (selectedProduct) {
      resolvedTitle = `${selectedProduct.nome} | Sistema Personalizado KoreNexus`;
      resolvedDesc = `${selectedProduct.descricao || "Descubra os detalhes técnicos e operacionais de nosso sistema sob medida."} Categoria: ${selectedProduct.categoria}.`;
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": selectedProduct.nome,
        "description": selectedProduct.descricao,
        "category": selectedProduct.categoria,
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "BRL",
          "valueAddedTaxIncluded": "true",
          "availability": "https://schema.org/InStock"
        }
      };
    } else if (selectedTool) {
      resolvedTitle = `${selectedTool.nome} | Ferramenta Integrada KoreNexus`;
      resolvedDesc = `Explore o ${selectedTool.nome} - Tipo: ${selectedTool.tipo}. Utilidade prática: ${selectedTool.utilidade || "Automação digital sênior."}`;
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": selectedTool.nome,
        "operatingSystem": "All",
        "applicationCategory": "BusinessApplication",
        "browserRequirements": "Requires JavaScript. Requires HTML5."
      };
    } else if (selectedApp) {
      resolvedTitle = `${selectedApp.nome} | Aplicativo Mobile KoreNexus`;
      resolvedDesc = `Aplicativo Mobile ${selectedApp.nome} para ${selectedApp.plataforma}. Detalhes: ${selectedApp.descricao}. Downloads: ${selectedApp.downloads}.`;
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "MobileApplication",
        "name": selectedApp.nome,
        "operatingSystem": selectedApp.plataforma,
        "applicationCategory": "BusinessApplication"
      };
    } else if (selectedPost && activeTab === "blog") {
      resolvedTitle = `${selectedPost.titulo} | Blog KoreNexus`;
      resolvedDesc = selectedPost.resumo || "Artigo de tecnologia e sistemas corporativos de alta integridade da KoreNexus.";
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": selectedPost.titulo,
        "description": selectedPost.resumo,
        "datePublished": new Date().toISOString(),
        "author": {
          "@type": "Person",
          "name": selectedPost.autor || "Yugny Ohany Miotelo"
        },
        "publisher": {
          "@type": "Organization",
          "name": "KoreNexus"
        }
      };
    } else if (isDocPage) {
      resolvedTitle = "Documentação Técnica KoreNexus | APIs & SDKs";
      resolvedDesc = "Acesse a documentação corporativa central da KoreNexus. Recomendações e exemplos de integração de APIs e segurança digital de processos.";
    } else if (isPrivPage) {
      resolvedTitle = "Política de Privacidade | Diretrizes de Segurança KoreNexus";
      resolvedDesc = "Nossos compromissos e termos corporativos de proteção de dados, segurança em transações, integridade de microsserviços e conformidade da LGPD.";
    } else {
      // Base tab titles
      const tabTitleMap: Record<string, string> = {
        inicio: "KoreNexus | Softwares sob Medida, Integração de ERP & IA",
        produtos: "Nossos Produtos e Sistemas ERP sob Medida | KoreNexus",
        kagenda: "Kagenda | Calendário de Agendamento Corporativo | KoreNexus",
        kflow: "Kflow AI | Motor Neural de Automações Sênior",
        ferramentas: "Ferramentas & Utilitários de DevOps & Sefaz | KoreNexus",
        apps: "Aplicativos Móveis Personalizados iOS e Android | KoreNexus",
        chatkore: "ChatKore | Assistente de Relacionamento Comercial",
        promocoes: "Cupons e Promoções Exclusivas Corporativas | KoreNexus",
        apis: "Explorer de APIs Públicas Integradas | KoreNexus",
        status: "Uptime Monitor em Tempo Real dos Servidores KoreNexus",
        blog: "Blog Kflow | Inovações, RPA e Engenharia de Sistemas",
        sobre: "Sobre a KoreNexus | Engenharia Operacional sob Medida",
      };
      if (activeTab && tabTitleMap[activeTab]) {
        resolvedTitle = tabTitleMap[activeTab];
      }
    }

    // Apply document title
    document.title = resolvedTitle;

    // Apply Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", resolvedDesc);

    // Apply OpenGraph meta tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", resolvedTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", resolvedDesc);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute("content", window.location.href);

    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement("meta");
      ogImage.setAttribute("property", "og:image");
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute("content", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80");

    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement("meta");
      ogType.setAttribute("property", "og:type");
      document.head.appendChild(ogType);
    }
    ogType.setAttribute("content", selectedPost ? "article" : "website");

    let ogLocale = document.querySelector('meta[property="og:locale"]');
    if (!ogLocale) {
      ogLocale = document.createElement("meta");
      ogLocale.setAttribute("property", "og:locale");
      document.head.appendChild(ogLocale);
    }
    ogLocale.setAttribute("content", "pt_BR");

    // Dynamic Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", window.location.origin + window.location.pathname);

    // Hreflang Tags (Acessibilidade e SEO Multilingue)
    let hreflangPt = document.querySelector('link[hreflang="pt-br"]');
    if (!hreflangPt) {
      hreflangPt = document.createElement("link");
      hreflangPt.setAttribute("rel", "alternate");
      hreflangPt.setAttribute("hreflang", "pt-br");
      document.head.appendChild(hreflangPt);
    }
    hreflangPt.setAttribute("href", window.location.origin + window.location.pathname);

    let hreflangDefault = document.querySelector('link[hreflang="x-default"]');
    if (!hreflangDefault) {
      hreflangDefault = document.createElement("link");
      hreflangDefault.setAttribute("rel", "alternate");
      hreflangDefault.setAttribute("hreflang", "x-default");
      document.head.appendChild(hreflangDefault);
    }
    hreflangDefault.setAttribute("href", window.location.origin + window.location.pathname);

    // Injet Schema Markup dynamically
    let scriptTag = document.getElementById("korenexus-schema-jsonld");
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "korenexus-schema-jsonld";
      scriptTag.setAttribute("type", "application/ld+json");
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLd);

  }, [activeTab, selectedPost, selectedProduct, selectedTool, selectedApp, isDocPage, isPrivPage]);

  // Keyboard shortcuts and window scroll accessibility listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts if user is typing in form fields
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.getAttribute("contenteditable") === "true"
      ) {
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key.toLowerCase() === "t") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (e.key.toLowerCase() === "c") {
        e.preventDefault();
        setIsLeadModalOpen(true);
      }
    };

    const handleScroll = () => {
      // Show scroll back to top button when scrolled 400px down
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // AI Blog generation states
  const [aiTopic, setAiTopic] = useState<string>("");
  const [generatingBlog, setGeneratingBlog] = useState<boolean>(false);
  const [generationStatus, setGenerationStatus] = useState<string>("");
  const [generationError, setGenerationError] = useState<string>("");
  const [selectedApiTab, setSelectedApiTab] = useState<string>("kflow");

  // Public APIs Explorer state
  const [apiSearch, setApiSearch] = useState<string>("");
  const [selectedApiCategory, setSelectedApiCategory] = useState<string>("Todos");
  const [activeApiTest, setActiveApiTest] = useState<any>(null);
  const [terminalOutput, setTerminalOutput] = useState<string>("");
  const [terminalLoading, setTerminalLoading] = useState<boolean>(false);

  // Uptime Monitor status states
  const [uptimeMonitors, setUptimeMonitors] = useState<any[]>([]);
  const [uptimeLoading, setUptimeLoading] = useState<boolean>(false);
  const [uptimeError, setUptimeError] = useState<string>("");

  // Sub-tab for blog view (to toggle between standard articles and industry news stream)
  const [selectedBlogTab, setSelectedBlogTab] = useState<string>("company");

  // Fetch Uptime Robot monitors status
  const fetchUptimeRobotStatus = async () => {
    setUptimeLoading(true);
    setUptimeError("");
    try {
      const res = await fetch("/api/uptime-status");
      if (res.ok) {
        const data = await res.json();
        if (data.stat === "ok" && data.monitors) {
          setUptimeMonitors(data.monitors);
        } else {
          setUptimeError(data.error?.message || "Erro retornado pela API de monitoramento.");
        }
      } else {
        setUptimeError("Instabilidade temporária na consulta de status.");
      }
    } catch (err) {
      setUptimeError("Erro na conexão com o servidor de monitoramento.");
    } finally {
      setUptimeLoading(false);
    }
  };

  // Fetch 24h GNews technology articles
  const fetchNews24h = async () => {
    setNewsLoading(true);
    setNewsError("");
    try {
      const res = await fetch("/api/news24h");
      if (res.ok) {
        const data = await res.json();
        setNewsArticles(data.articles || []);
      } else {
        setNewsError("Falha ao carregar notícias de tempo real.");
      }
    } catch (err) {
      setNewsError("Erro na conexão com o feed de notícias.");
    } finally {
      setNewsLoading(false);
    }
  };

  // AI Blog article generator handler
  const handleGenerateBlogAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setGeneratingBlog(true);
    setGenerationStatus("Conectando ao gateway de fluxo K...");
    setGenerationError("");

    try {
      const response = await fetch("/api/generate-blog-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setGenerationStatus("Artigo gerado com sucesso pela IA Kflow e publicado!");
        setAiTopic("");
        // Reload spreadsheet database to include the new post
        fetchSpreadsheetData();
        setTimeout(() => setGenerationStatus(""), 5000);
      } else {
        setGenerationError(data.error || "Ocorreu um erro no processamento do artigo.");
      }
    } catch (err: any) {
      setGenerationError("Erro de comunicação com o servidor: " + err.message);
    } finally {
      setGeneratingBlog(false);
    }
  };

  // Fetch full spreadsheet data on mount
  const fetchSpreadsheetData = async () => {
    try {
      const res = await fetch("/api/spreadsheet-data");
      if (res.ok) {
        const data = await res.json();
        setDb(data);
      }
    } catch (err) {
      console.error("Erro ao carregar planilha de dados", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "apis" || activeTab === "blog") {
      fetchNews24h();
    }
    if (activeTab === "status") {
      fetchUptimeRobotStatus();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchSpreadsheetData();

    // Establish live SSE subscription for Push Notifications
    const eventSource = new EventSource("/api/notifications/subscribe");
    
    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "notification" && payload.data) {
          // Play a subtle notification chime
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
            osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.4);
          } catch(e) {}

          setActiveNotification(payload.data);
          
          // Auto close banner in 7 seconds
          setTimeout(() => {
            setActiveNotification(null);
          }, 7000);
        }
      } catch (err) {
        console.error("Erro processando alerta SSE:", err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleAdminVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("/api/auth/verify-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail })
      });
      const result = await response.json();

      if (response.ok && result.isAdmin) {
        setIsAdmin(true);
        setAdminEmail(loginEmail);
        setShowAdminLogin(false);
        setActiveTab("admin-dashboard"); // Navigate to database sheet
      } else {
        setLoginError(result.error || "Apenas o email corporativo de admin autorizado.");
      }
    } catch (err: any) {
      setLoginError("Erro de comunicação com o servidor: " + err.message);
    }
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    setAdminEmail("");
    setActiveTab("inicio");
  };

  const handleCopyCoupon = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCoupon(couponCode);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  // Breadcrumbs UI Trail Helper
  const renderBreadcrumbs = () => {
    const segments = [];

    // Always start with Home (clickable)
    segments.push(
      <button
        key="home"
        onClick={() => {
          setSelectedProduct(null);
          setSelectedTool(null);
          setSelectedApp(null);
          setSelectedPost(null);
          setIsDocPage(false);
          setIsPrivPage(false);
          setActiveTab("inicio");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="text-gray-400 hover:text-blue-400 font-semibold transition cursor-pointer"
      >
        Início
      </button>
    );

    if (isDocPage) {
      segments.push(<ChevronRight key="sep-doc" className="h-3 w-3 text-gray-600" />);
      segments.push(<span key="doc" className="text-gray-300">Documentação Técnica</span>);
    } else if (isPrivPage) {
      segments.push(<ChevronRight key="sep-priv" className="h-3 w-3 text-gray-600" />);
      segments.push(<span key="priv" className="text-gray-300">Política de Privacidade</span>);
    } else if (selectedProduct) {
      segments.push(<ChevronRight key="sep-prods" className="h-3 w-3 text-gray-600" />);
      segments.push(
        <button
          key="prods"
          onClick={() => {
            setSelectedProduct(null);
            setActiveTab("produtos");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-gray-400 hover:text-blue-400 font-semibold transition cursor-pointer"
        >
          Produtos
        </button>
      );
      segments.push(<ChevronRight key="sep-prod" className="h-3 w-3 text-gray-600" />);
      segments.push(<span key="prod" className="text-gray-350 font-bold max-w-[150px] truncate">{selectedProduct.nome}</span>);
    } else if (selectedTool) {
      segments.push(<ChevronRight key="sep-tools" className="h-3 w-3 text-gray-600" />);
      segments.push(
        <button
          key="tools"
          onClick={() => {
            setSelectedTool(null);
            setActiveTab("ferramentas");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-gray-400 hover:text-blue-400 font-semibold transition cursor-pointer"
        >
          Ferramentas
        </button>
      );
      segments.push(<ChevronRight key="sep-tool" className="h-3 w-3 text-gray-600" />);
      segments.push(<span key="tool" className="text-gray-350 font-bold max-w-[150px] truncate">{selectedTool.nome}</span>);
    } else if (selectedApp) {
      segments.push(<ChevronRight key="sep-apps" className="h-3 w-3 text-gray-600" />);
      segments.push(
        <button
          key="apps"
          onClick={() => {
            setSelectedApp(null);
            setActiveTab("apps");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-gray-400 hover:text-blue-400 font-semibold transition cursor-pointer"
        >
          Apps
        </button>
      );
      segments.push(<ChevronRight key="sep-app" className="h-3 w-3 text-gray-600" />);
      segments.push(<span key="app" className="text-gray-350 font-bold max-w-[150px] truncate">{selectedApp.nome}</span>);
    } else if (selectedPost && activeTab === "blog") {
      segments.push(<ChevronRight key="sep-blogs" className="h-3 w-3 text-gray-600" />);
      segments.push(
        <button
          key="blogs"
          onClick={() => {
            setSelectedPost(null);
            setActiveTab("blog");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-gray-400 hover:text-blue-400 font-semibold transition cursor-pointer"
        >
          Blog
        </button>
      );
      segments.push(<ChevronRight key="sep-blog" className="h-3 w-3 text-gray-600" />);
      segments.push(<span key="blog" className="text-gray-350 font-bold max-w-[150px] truncate">{selectedPost.titulo}</span>);
    } else if (activeTab !== "inicio") {
      const tabNames: Record<string, string> = {
        produtos: "Produtos",
        kagenda: "Kagenda",
        kflow: "Kflow AI",
        ferramentas: "Ferramentas",
        apps: "Aplicativos",
        chatkore: "ChatKore",
        promocoes: "Promoções",
        apis: "Explorer de APIs",
        status: "Uptime Status",
        blog: "Blog Kflow",
        sobre: "Sobre Nós",
        "admin-dashboard": "Administração do Banco",
      };
      const label = tabNames[activeTab] || activeTab;
      segments.push(<ChevronRight key="sep-tab" className="h-3 w-3 text-gray-600" />);
      segments.push(<span key="tab" className="text-gray-350 font-bold uppercase">{label}</span>);
    } else {
      return null;
    }

    return (
      <nav id="site-breadcrumbs" className="flex items-center gap-2 text-[10px] md:text-xs text-slate-500 font-mono mb-6 bg-slate-900/35 border border-gray-800/40 py-2 px-3.5 rounded-xl w-fit" aria-label="Breadcrumb">
        {segments}
      </nav>
    );
  };

  // Nav helper
  const renderNavButton = (tabId: string, label: string, icon: React.ReactNode) => {
    const isActive = activeTab === tabId && !selectedProduct && !selectedTool && !selectedApp && !selectedPost && !isDocPage && !isPrivPage;
    return (
      <button
        onClick={() => {
          setSelectedProduct(null);
          setSelectedTool(null);
          setSelectedApp(null);
          setSelectedPost(null);
          setIsDocPage(false);
          setIsPrivPage(false);
          setActiveTab(tabId);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={`flex items-center gap-1 px-1.5 py-1 text-[10px] uppercase tracking-wider font-semibold transition-all border-b-2 ${
          isActive 
            ? "text-blue-400 border-blue-500 font-bold" 
            : "text-gray-400 hover:text-blue-400 border-transparent"
        }`}
        id={`nav-btn-${tabId}`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-gray-200 font-sans selection:bg-blue-600 selection:text-white flex flex-col relative overflow-hidden">
      
      {/* Decorative Matrix Ambient Glow in the background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-600/10 via-emerald-500/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none ambient-glow"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none ambient-glow"></div>

      {/* SSE Push Notification Pop-up Banner Alert */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-4 right-4 md:left-auto md:right-6 md:w-[420px] bg-slate-900 border-2 border-indigo-500/30 text-white rounded-2xl p-5 shadow-2xl z-50 flex items-start gap-4 filter backdrop-blur-xl"
            id="sse-push-banner"
          >
            <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Bell className="h-5 w-5 animate-bounce" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Notificação Corporativa</span>
                <span className="text-[8px] font-mono text-slate-400">{activeNotification.data}</span>
              </div>
              <h4 className="text-sm font-display font-medium text-white mt-1">{activeNotification.titulo}</h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{activeNotification.corpo}</p>
              
              <div className="mt-3 flex justify-end">
                <button 
                  onClick={() => setActiveNotification(null)}
                  className="text-[10px] text-slate-400 hover:text-white border border-white/10 px-2.5 py-1 rounded-md bg-white/5 transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header NavBar */}
      <header className="sticky top-0 z-40 bg-[#0A0D14]/80 border-b border-gray-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <BrandsWrapper onClick={() => setActiveTab("inicio")}>
            <BrandingLogo size="md" />
          </BrandsWrapper>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {renderNavButton("inicio", "Início", <Home className="h-3.5 w-3.5" />)}
            {renderNavButton("produtos", "Produtos", <Layers className="h-3.5 w-3.5" />)}
            {renderNavButton("kagenda", "Kagenda", <Calendar className="h-3.5 w-3.5" />)}
            {renderNavButton("kflow", "Kflow", <Zap className="h-3.5 w-3.5 text-indigo-400" />)}
            {renderNavButton("ferramentas", "Ferramentas", <Wrench className="h-3.5 w-3.5" />)}
            {renderNavButton("apps", "Apps", <Smartphone className="h-3.5 w-3.5" />)}
            {renderNavButton("chatkore", "ChatKore", <MessageSquare className="h-3.5 w-3.5 animate-pulse" />)}
            {renderNavButton("promocoes", "Promoções", <Percent className="h-3.5 w-3.5" />)}
            {renderNavButton("apis", "APIs", <Cpu className="h-3.5 w-3.5" />)}
            {renderNavButton("status", "Status", <Activity className="h-3.5 w-3.5" />)}
            {renderNavButton("blog", "Blog", <FileText className="h-3.5 w-3.5" />)}
            {renderNavButton("sobre", "Sobre", <Info className="h-3.5 w-3.5" />)}
          </nav>

          <div className="flex items-center gap-3">
            {/* Intelligent Search trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#0F1420] border border-gray-800 hover:border-gray-700 hover:bg-[#151D2F] rounded-full text-xs text-gray-400 hover:text-white transition cursor-pointer"
              title="Pesquisa Inteligente (ou pressione /)"
              id="header-search-trigger"
            >
              <Search className="h-3.5 w-3.5 text-gray-450 shrink-0" />
              <span className="hidden sm:inline font-sans text-[10px] font-medium">Buscar...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 bg-slate-900 border border-gray-800 rounded font-mono text-[8px] text-gray-400 uppercase">
                /
              </kbd>
            </button>

            {isAdmin ? (
              <button
                onClick={() => setActiveTab("admin-dashboard")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition-all"
                id="btn-admin-shortcut"
              >
                <ShieldCheck className="h-3 w-3" />
                <span>Planilha Admin</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="lg:hidden p-2 text-slate-400 hover:text-white transition"
                title="Acesso Administrativo Oculto"
                id="btn-admin-secret-trigger"
              >
                <Lock className="h-4 w-4" />
              </button>
            )}

            {/* Quick Contact Button */}
            <a
              href="https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Vim%20pelo%20site%20korenexus.com.br%20e%20gostaria%20de%20solicitar%20um%20orçamento%20de%20sistema."
              target="_blank"
              referrerPolicy="no-referrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition-all shadow-lg shadow-blue-600/20"
              id="top-cta-contact"
            >
              Falar Comercial
            </a>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden bg-[#0A0D14]/90 border-t border-gray-800 py-2 px-1">
          <div className="flex items-center overflow-x-auto gap-1 px-3 pb-1 scrollbar-none">
            {renderNavButton("inicio", "Início", <Home className="h-3.5 w-3.5" />)}
            {renderNavButton("produtos", "Produtos", <Layers className="h-3.5 w-3.5" />)}
            {renderNavButton("kagenda", "Kagenda", <Calendar className="h-3.5 w-3.5" />)}
            {renderNavButton("kflow", "Kflow", <Zap className="h-3.5 w-3.5 text-indigo-400" />)}
            {renderNavButton("ferramentas", "Ferramentas", <Wrench className="h-3.5 w-3.5" />)}
            {renderNavButton("apps", "Apps", <Smartphone className="h-3.5 w-3.5" />)}
            {renderNavButton("chatkore", "ChatKore", <MessageSquare className="h-3.5 w-3.5" />)}
            {renderNavButton("promocoes", "Promoções", <Percent className="h-3.5 w-3.5" />)}
            {renderNavButton("apis", "APIs", <Cpu className="h-3.5 w-3.5" />)}
            {renderNavButton("status", "Status", <Activity className="h-3.5 w-3.5" />)}
            {renderNavButton("blog", "Blog", <FileText className="h-3.5 w-3.5" />)}
            {renderNavButton("sobre", "Sobre", <Info className="h-3.5 w-3.5" />)}
          </div>
        </div>
      </header>

      {/* Main Content Render area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full z-10">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="h-8 w-8 text-brand-purple animate-spin" />
            <span className="text-xs text-slate-400 font-mono">Estabelecendo canal com a planilha de dados...</span>
          </div>
        ) : (
          <>
            {renderBreadcrumbs()}
            <AnimatePresence mode="wait">
            
            {show404 && (
              <motion.div
                key="404-error-page"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="max-w-xl mx-auto text-center py-16 px-6 bg-slate-900 border border-gray-800 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden my-8"
              >
                {/* Decorative neon backlights */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full bg-rose-500/5 blur-[50px] pointer-events-none"></div>

                <div className="relative space-y-3">
                  <span className="inline-block text-[10px] font-mono font-bold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
                    ERRO DE ENDEREÇO (404)
                  </span>
                  <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white mt-1">
                    Recurso Não Encontrado
                  </h1>
                  <p className="text-xs md:text-sm text-gray-400 font-sans max-w-sm mx-auto leading-relaxed">
                    Desculpe o transtorno! O documento, sistema ou ferramenta que você tentou acessar não está mapeado no banco da KoreNexus ou foi realocado.
                  </p>
                </div>

                {/* Popular alternatives & search shortcuts */}
                <div className="p-4 bg-slate-950/60 border border-gray-850 rounded-2xl text-left space-y-3.5">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-gray-400 uppercase block">Alternativas sugeridas</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setShow404(false);
                        setActiveTab("produtos");
                        setSelectedProduct(null);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-left p-2.5 bg-[#0F1420] border border-gray-850 hover:border-gray-750 hover:bg-[#121826] rounded-xl text-xs text-white hover:text-blue-400 transition cursor-pointer"
                    >
                      <Layers className="h-3.5 w-3.5 text-blue-400 inline-block mr-1.5 align-middle" />
                      <span className="align-middle">Módulos ERP</span>
                    </button>
                    <button
                      onClick={() => {
                        setShow404(false);
                        setActiveTab("ferramentas");
                        setSelectedTool(null);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-left p-2.5 bg-[#0F1420] border border-gray-850 hover:border-gray-750 hover:bg-[#121826] rounded-xl text-xs text-white hover:text-emerald-400 transition cursor-pointer"
                    >
                      <Wrench className="h-3.5 w-3.5 text-emerald-400 inline-block mr-1.5 align-middle" />
                      <span className="align-middle">Ferramentas Sefaz</span>
                    </button>
                    <button
                      onClick={() => {
                        setShow404(false);
                        setActiveTab("blog");
                        setSelectedPost(null);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-left p-2.5 bg-[#0F1420] border border-gray-850 hover:border-gray-750 hover:bg-[#121826] rounded-xl text-xs text-white hover:text-indigo-400 transition cursor-pointer"
                    >
                      <FileText className="h-3.5 w-3.5 text-indigo-400 inline-block mr-1.5 align-middle" />
                      <span className="align-middle">Blog Tecnológico</span>
                    </button>
                    <button
                      onClick={() => {
                        setShow404(false);
                        setIsSearchOpen(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-left p-2.5 bg-[#0F1420] border border-indigo-500/20 hover:border-indigo-500/30 hover:bg-[#121826] rounded-xl text-xs text-white hover:text-indigo-300 transition cursor-pointer"
                    >
                      <Search className="h-3.5 w-3.5 text-purple-400 inline-block mr-1.5 align-middle" />
                      <span className="align-middle font-semibold">Busca Geral /</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => {
                      setShow404(false);
                      setActiveTab("inicio");
                      setSelectedProduct(null);
                      setSelectedTool(null);
                      setSelectedApp(null);
                      setSelectedPost(null);
                      setIsDocPage(false);
                      setIsPrivPage(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full tracking-wide transition shadow-lg shadow-blue-600/20 cursor-pointer"
                  >
                    Voltar para a Página Inicial
                  </button>
                </div>
              </motion.div>
            )}

            {isDocPage && (
              <motion.div
                key="documentacao"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <DocumentationPage 
                  produtos={db.produtos}
                  ferramentas={db.ferramentas}
                  apps={db.apps}
                  onBack={() => {
                    setIsDocPage(false);
                    setActiveTab("inicio");
                  }} 
                />
              </motion.div>
            )}

            {isPrivPage && (
              <motion.div
                key="privacidade"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <PrivacyPolicyPage onBack={() => {
                  setIsPrivPage(false);
                  setActiveTab("inicio");
                }} />
              </motion.div>
            )}

            {selectedProduct && (
              <motion.div
                key="product-detail"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <ProductDetailPage 
                  p={selectedProduct} 
                  onBack={() => {
                    setSelectedProduct(null);
                    setActiveTab("produtos");
                  }} 
                />
              </motion.div>
            )}

            {selectedTool && (
              <motion.div
                key="tool-detail"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <ToolDetailPage 
                  f={selectedTool} 
                  onBack={() => {
                    setSelectedTool(null);
                    setActiveTab("ferramentas");
                  }} 
                />
              </motion.div>
            )}

            {selectedApp && (
              <motion.div
                key="app-detail"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <AppDetailPage 
                  a={selectedApp} 
                  onBack={() => {
                    setSelectedApp(null);
                    setActiveTab("apps");
                  }} 
                />
              </motion.div>
            )}

            {selectedPost && activeTab === "blog" && (
              <motion.div
                key="post-detail"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <PostDetailPage 
                  post={selectedPost} 
                  onBack={() => {
                    setSelectedPost(null);
                    setActiveTab("blog");
                  }} 
                />
              </motion.div>
            )}

            {!isDocPage && !isPrivPage && !selectedProduct && !selectedTool && !selectedApp && (!selectedPost || activeTab !== "blog") && (
              <>
                {/* INÍCIO (Home) VIEW */}
                {activeTab === "inicio" && (
              <motion.div
                key="inicio"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-20 py-6"
              >
                {/* Hero section */}
                <div className="text-center max-w-4xl mx-auto space-y-6 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
                  
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-none w-fit">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Engenharia Digital Premium sob Medida
                  </div>

                  <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
                    Sistemas Robustos <br />
                    que <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">Escalam</span> o seu Negócio.
                  </h1>

                  <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
                    Focado em usabilidade corporativa extrema e alta fidelidade operacional. Automatizamos workflows de alta complexidade, integramos ERPs legados e criamos aplicativos customizados que multiplicam seu faturamento, eliminando mensalidades abusivas de prateleira.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                    <button
                      onClick={() => setActiveTab("chatkore")}
                      className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs tracking-wider uppercase rounded-full transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2 group transform hover:-translate-y-0.5"
                      id="hero-cta-ai"
                    >
                      <MessageSquare className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                      Pedir Orçamento ao ChatKore
                    </button>
                    
                    <a
                      href="https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Poderíamos%20agendar%20um%20briefing%20sobre%20um%20sistema%20da%20minha%20empresa?"
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="w-full sm:w-auto px-6 py-4 bg-[#111622] hover:bg-[#161c2b] text-white border border-slate-800 hover:border-slate-700 font-bold text-xs tracking-wider uppercase rounded-full transition-all flex items-center justify-center gap-1.5 transform hover:-translate-y-0.5"
                      id="hero-cta-whatsapp"
                    >
                      Agendar Briefing Humano
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* Aesthetic Logo Large Visual Center with Stats Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-[#111622]/40 p-8 rounded-3xl border border-slate-850 backdrop-blur-md">
                  
                  {/* Branding showcase */}
                  <div className="relative p-6 bg-[#0e1320] rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center justify-center min-h-[220px]">
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/15 rounded-md text-[8px] font-mono text-emerald-400 font-bold tracking-wider upper">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      CORE ENGINE
                    </div>
                    <BrandingLogo size="xl" showText={false} />
                    <div className="text-center mt-5">
                      <span className="text-xs font-mono tracking-widest text-slate-300 uppercase font-bold">KORENEXUS</span>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">Sistemas Corporativos de Alta Fidelidade</p>
                    </div>
                  </div>

                  {/* Core Value Statement */}
                  <div className="lg:col-span-2 space-y-4">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">A DIFERENÇA KORENEXUS</span>
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Sistemas que pertencem a sua empresa</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Ao contrário do mercado de SaaS tradicional que cobra taxas infinitas de licença por usuário, a KoreNexus projeta sistemas sob medida baseados em arquitetura server-less otimizada. O código e a infraestrutura são hospedados no seu próprio ambiente de nuvem de forma transparente, permitindo usuários ilimitados e total flexibilidade para crescer sem barreiras artificiais de custo.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-3 bg-[#111622] rounded-xl border border-slate-800">
                        <span className="text-[9px] font-mono text-slate-500 block uppercase">LATÊNCIA MÉDIA</span>
                        <p className="text-md font-extrabold text-indigo-400 tracking-tight mt-0.5">&lt; 120ms</p>
                      </div>
                      <div className="p-3 bg-[#111622] rounded-xl border border-slate-800">
                        <span className="text-[9px] font-mono text-slate-500 block uppercase">TAXA DE DISPONIBILIDADE</span>
                        <p className="text-md font-extrabold text-emerald-400 tracking-tight mt-0.5">99.99% SLA</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* INTERACTIVE COMPONENT: ROI & Budget Viability Simulator */}
                <div className="space-y-6">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">SIMULADOR OPERACIONAL</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Calcule a Viabilidade Técnica do seu Projeto</h2>
                    <p className="text-xs text-slate-400">Escolha o tipo de solução e dimensione o seu fluxo para prever o ganho e prazos estimados.</p>
                  </div>

                  <div className="bg-gradient-to-b from-[#111622] to-[#0A0D14] border border-slate-800 rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"></div>
                    
                    {/* Controls */}
                    <div className="lg:col-span-7 space-y-6">
                      {/* Step 1: Type selection */}
                      <div className="space-y-3">
                        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block">1. Escopo de Desenvolvimento principal</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { id: "erp", label: "ERP Corporativo / Painéis", icon: <Layers className="h-4 w-4" /> },
                            { id: "app", label: "Aplicativo Mobile Offline", icon: <Smartphone className="h-4 w-4" /> },
                            { id: "api", label: "APIs / Integração de Fluxos", icon: <Cpu className="h-4 w-4" /> }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => setSimSystemType(opt.id)}
                              className={`p-4 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between h-24 ${
                                simSystemType === opt.id 
                                  ? "bg-indigo-600/10 border-indigo-500 text-white shadow-lg" 
                                  : "bg-[#0c101a] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg w-fit ${simSystemType === opt.id ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-800/50 text-slate-500"}`}>
                                {opt.icon}
                              </div>
                              <span className="text-xs font-bold leading-tight mt-2">{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Step 2: Inefficiency context */}
                      <div className="space-y-3">
                        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block">2. Complexidade / Gargalo nos Processos Atuais</span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: "baixa", label: "Baixo", desc: "Processo manual simples", color: "hover:border-blue-500/30" },
                            { id: "media", label: "Médio", desc: "Planilhas confusas", color: "hover:border-indigo-500/30" },
                            { id: "critica", label: "Crítico", desc: "Erros de faturamento e perdas", color: "hover:border-rose-500/30" }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => setSimInefficiency(opt.id)}
                              className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                                simInefficiency === opt.id 
                                  ? "bg-gradient-to-b from-[#18132b] to-[#120e24] border-indigo-400 text-white" 
                                  : `bg-[#0c101a] border-slate-800 text-slate-400 ${opt.color}`
                              }`}
                            >
                              <span className="text-xs font-bold block">{opt.label}</span>
                              <span className="text-[9px] text-slate-500 mt-0.5 block truncate">{opt.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Step 3: Team size range */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">3. Número de Colaboradores Afetados</span>
                          <span className="px-2 py-0.5 bg-indigo-500/15 text-indigo-400 font-mono text-xs rounded-md font-bold">{simTeamSize} usuários</span>
                        </div>
                        <input 
                          type="range" 
                          min="3" 
                          max="150" 
                          value={simTeamSize} 
                          onChange={(e) => setSimTeamSize(Number(e.target.value))}
                          className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>3 Mínimo</span>
                          <span>75 Médio Enterprise</span>
                          <span>150+ Máximo</span>
                        </div>
                      </div>
                    </div>

                    {/* Results Display */}
                    <div className="lg:col-span-5 bg-[#0e1320] border border-slate-850 p-6 rounded-2xl space-y-6">
                      <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">PREVISÃO ESTIMADA DE RETORNO</h4>
                      
                      {/* Calculations logic based on state */}
                      {(() => {
                        let baseTimeWeeks = 4;
                        let softwareCostSavingMultiplier = 1200;
                        let productivityMultiplierPercent = 15;

                        if (simSystemType === "erp") {
                          baseTimeWeeks = 6;
                          softwareCostSavingMultiplier = 3800;
                          productivityMultiplierPercent = 35;
                        } else if (simSystemType === "app") {
                          baseTimeWeeks = 8;
                          softwareCostSavingMultiplier = 4500;
                          productivityMultiplierPercent = 40;
                        } else {
                          baseTimeWeeks = 4;
                          softwareCostSavingMultiplier = 1900;
                          productivityMultiplierPercent = 25;
                        }

                        if (simInefficiency === "media") {
                          baseTimeWeeks += 1;
                          productivityMultiplierPercent += 10;
                        } else if (simInefficiency === "critica") {
                          baseTimeWeeks += 2;
                          productivityMultiplierPercent += 25;
                        }

                        const yearlySavings = Math.round(softwareCostSavingMultiplier * simTeamSize * 1.25);
                        const hoursSavedMonthly = Math.round(simTeamSize * 22 * (productivityMultiplierPercent / 100));

                        return (
                          <div className="space-y-6">
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-500 uppercase font-mono">Prazo Estimado de Construção</span>
                              <div className="flex items-baseline gap-1.5 text-2xl font-extrabold text-white">
                                <span>{baseTimeWeeks} a {baseTimeWeeks + 2}</span>
                                <span className="text-xs font-normal text-slate-400">semanas úteis</span>
                              </div>
                            </div>

                            <div className="space-y-1 border-t border-slate-850 pt-4">
                              <span className="text-[10px] text-slate-500 uppercase font-mono">Economia Estimada por Ano</span>
                              <div className="flex items-baseline gap-1.5 text-3xl font-black text-emerald-400">
                                <span className="text-xs font-bold">R$</span>
                                <span>{yearlySavings.toLocaleString("pt-BR")}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 block">Sem mensalidade recorrente sobre usuários ou chamados.</span>
                            </div>

                            <div className="space-y-1 border-t border-slate-850 pt-4 pb-2">
                              <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Produtividade Gerada do Time</span>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-white">+{productivityMultiplierPercent}%</span>
                                <div className="h-2 bg-slate-800 rounded-full flex-1 overflow-hidden">
                                  <div 
                                    className="bg-indigo-500 h-full transition-all duration-500" 
                                    style={{ width: `${Math.min(productivityMultiplierPercent * 1.5, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-400 block mt-1">Estimativa de <strong>{hoursSavedMonthly} horas operacionais economizadas</strong> todo mês.</span>
                            </div>

                            <button 
                              onClick={() => {
                                const details = `Olá, vim do Simulador da Home. Selecionei: ${simSystemType === 'erp' ? 'ERP/Painéis' : simSystemType === 'app' ? 'App Mobile' : 'APIs/Integração'}, com ineficiência ${simInefficiency} e time de ${simTeamSize} pessoas. Gostaria de receber um briefing detalhado corporativo.`;
                                window.open(`https://api.whatsapp.com/send/?phone=5511989387263&text=${encodeURIComponent(details)}`, "_blank");
                              }}
                              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-750 hover:to-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                            >
                              <span>Apresentar Projeto ao Especialista</span>
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Animated Interactive Process Timeline */}
                <div className="space-y-8">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">METODOLOGIA AGILE</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">O Fluxo da Concepção ao Deploy</h2>
                    <p className="text-xs text-slate-400">Garantimos transparência absoluta e rapidez de entrega através de 4 etapas estritas.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { step: "01", title: "Briefing Extremo", desc: "Varremos seus gargalos e regras operacionais em uma reunião dinâmica de 1 hora.", icon: <Search className="h-5 w-5 text-indigo-400" /> },
                      { step: "02", title: "Arquitetura Visual", desc: "Criamos fluxogramas, telas de alta usabilidade e esquemas de dados transparentes.", icon: <Sliders className="h-5 w-5 text-blue-400" /> },
                      { step: "03", title: "Codificação Ágil", desc: "Entregas parciais contínuas em ambiente de homologação privado todas as semanas.", icon: <Cpu className="h-5 w-5 text-purple-400" /> },
                      { step: "04", title: "Deploys na Nuvem", desc: "Hospedamos na sua nuvem de escolha com auditoria, segurança e SLA de suporte.", icon: <ShieldCheck className="h-5 w-5 text-emerald-400" /> }
                    ].map((item, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setSimActiveStep(idx)}
                        className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                          simActiveStep === idx 
                            ? "bg-[#111622] border-indigo-500 shadow-xl" 
                            : "bg-[#0b0e17] border-slate-850 hover:border-slate-800 text-slate-400"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xl font-mono font-bold text-slate-600 group-hover:text-slate-500">{item.step}</span>
                            <div className={`p-2 rounded-lg ${simActiveStep === idx ? "bg-indigo-500/15" : "bg-slate-800/20"}`}>
                              {item.icon}
                            </div>
                          </div>
                          <h4 className={`text-sm font-bold font-sans mb-2 ${simActiveStep === idx ? "text-white" : "text-slate-300"}`}>{item.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans">{item.desc}</p>
                        </div>
                        {simActiveStep === idx && (
                          <div className="h-1 bg-indigo-500 rounded-full w-full mt-4 transform origin-left animate-slide"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid of Key Features */}
                <div className="space-y-6">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">NOSSAS FRENTES DE ATAQUE</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Especialidades Técnicas de Engenharia</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#111622] border border-slate-850 p-6 rounded-2xl hover:border-blue-500/50 transition-all cursor-default group flex flex-col justify-between">
                      <div>
                        <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                          <Layers className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-display font-bold text-white mb-2">ERPs e Sistemas Operacionais</h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">
                          Acompanhamos o andamento operacional de margens, estoque, faturamento complexo, ordens de serviços, emissão automática de notas (Sefaz) e relatórios bento integrados.
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#111622] border border-slate-850 p-6 rounded-2xl hover:border-emerald-500/50 transition-all cursor-default group flex flex-col justify-between">
                      <div>
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-display font-bold text-white mb-2">Apps Nativos e Desconectados</h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">
                          Especialistas em aplicativos com motores de sincronização híbrida. Ideais para rotas de entrega rurais, coletores de estoque sob condições extremas e forças de vendas externas.
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#111622] border border-slate-850 p-6 rounded-2xl hover:border-purple-500/50 transition-all cursor-default group flex flex-col justify-between">
                      <div>
                        <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                          <Cpu className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-display font-bold text-white mb-2">Integração de APIs e Microsserviços</h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">
                          Desenvolvemos barramentos de APIs seguros e rápidos. Unificamos faturadores fisicos, gateways inteligentes de pagamento, CRMs e automatizadores de chat.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Info details */}
                <div className="bg-[#111622] p-6 rounded-2xl border border-slate-850 flex flex-col md:flex-row items-center justify-around gap-6 text-center shadow-md">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 font-mono uppercase font-bold">Modelo de Atendimento</span>
                    <p className="text-sm font-medium text-white flex items-center justify-center gap-1.5 font-sans">
                      <Activity className="h-4 w-4 text-blue-500" />
                      Atendimento 100% Online
                    </p>
                    <span className="text-[10px] text-blue-400 block font-medium">Sem Sede Física • Todo o Brasil</span>
                  </div>

                  <div className="h-px w-10 md:h-10 md:w-px bg-slate-800"></div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 font-mono uppercase font-bold">Contato Rápido</span>
                    <p className="text-sm font-medium text-white flex items-center justify-center gap-1.5">
                      <Mail className="h-4 w-4 text-blue-400" />
                      contato@korenexus.com.br
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono">Retorno corporativo em até 2 horas</span>
                  </div>

                  <div className="h-px w-10 md:h-10 md:w-px bg-slate-800"></div>

                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 font-mono uppercase font-bold">Atendimento Comercial</span>
                    <p className="text-sm font-medium text-white flex items-center justify-center gap-1.5">
                      <Phone className="h-4 w-4 text-emerald-500" />
                      (11) 98938-7263
                    </p>
                    <a href="https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Vim%20pelo%20site%20korenexus.com.br" target="_blank" className="text-[10px] text-emerald-400 hover:underline block">Falar no WhatsApp Comercial</a>
                  </div>
                </div>

                {/* Advanced technical FAQ block dynamically integrated */}
                <FaqSection />
              </motion.div>
            )}

            {/* KAGENDA VIEW */}
            {activeTab === "kagenda" && (
              <motion.div
                key="kagenda"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 py-6"
              >
                <KagendaPage />
              </motion.div>
            )}

            {/* KFLOW VIEW */}
            {activeTab === "kflow" && (
              <motion.div
                key="kflow"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 py-6"
              >
                <KflowPage />
              </motion.div>
            )}

            {/* PRODUTOS VIEW */}
            {activeTab === "produtos" && (
              <motion.div
                key="produtos"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8 py-6"
                >
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">Prateleira de Sistemas Corporativos</h2>
                    <p className="text-xs text-gray-400 mt-1">Nossos principais produtos e softwares prontos para customização e implantação rápida na sua organização.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="products-list-grid">
                    {db.produtos.map((p) => (
                      <div 
                        key={p.id} 
                        className="bg-[#111622] border border-gray-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all flex flex-col justify-between"
                        id={`product-card-${p.id}`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 font-mono text-[10px] uppercase font-bold">
                              {p.categoria}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${p.status === 'Novo' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'}`}>
                              {p.status}
                            </span>
                          </div>
                          <button 
                            onClick={() => setSelectedProduct(p)}
                            className="text-left block group w-full"
                          >
                            <h3 className="text-lg font-display font-bold text-white group-hover:text-blue-400 transition-colors">
                              {p.nome}
                            </h3>
                          </button>
                          <p className="text-xs text-gray-400 leading-relaxed mt-2.5">{p.descricao}</p>
                        </div>

                        <div className="mt-6 border-t border-gray-800 pt-4 flex items-center justify-between">
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="text-xs text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                          >
                            Especificações Técnicas
                          </button>
                          <a 
                            href={`https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Gostaria%20de%20saber%20mais%20orçamentos%20sobre%20o%20sistema%20${p.nome}.`}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="flex items-center gap-1 text-xs text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-full transition-all shadow-md shadow-blue-600/10 font-bold"
                            id={`product-action-${p.id}`}
                          >
                            <span>Solicitar Demonstração</span>
                            <ChevronRight className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
            )}

            {/* FERRAMENTAS VIEW */}
            {activeTab === "ferramentas" && (
              <motion.div
                key="ferramentas"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8 py-6"
                >
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white font-sans">Ferramentas de Desenvolvimento e Infraestrutura</h2>
                    <p className="text-xs text-gray-400 mt-1">Pacotes utilitários, validadores inteligentes e pequenos motores independentes que integramos em sistemas legados.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="tools-list-grid">
                    {db.ferramentas.map((f) => (
                      <div 
                        key={f.id} 
                        className="bg-[#111622] border border-gray-800 p-5 rounded-2xl flex flex-col justify-between hover:border-emerald-500/50 transition-all cursor-default"
                        id={`tool-card-${f.id}`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="text-[9px] font-mono font-bold text-gray-500 uppercase">{f.tipo}</span>
                            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">{f.status}</span>
                          </div>
                          <button
                            onClick={() => setSelectedTool(f)}
                            className="text-left block group"
                          >
                            <h3 className="text-sm font-display font-bold text-white group-hover:text-emerald-400 transition-colors">
                              {f.nome}
                            </h3>
                          </button>
                          <p className="text-[11px] text-gray-400 leading-normal mt-2.5">{f.utilidade}</p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-gray-800 flex items-center justify-between">
                          <button
                            onClick={() => setSelectedTool(f)}
                            className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
                          >
                            Simular Validador
                          </button>
                          <a 
                            href="https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Gostaria%20de%20saber%20como%20posso%20integrar%20a%20ferramenta%20KoreValid/KoreCalc%20ou%20outras%20no%20meu%20software." 
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold transition flex items-center gap-1"
                            id={`tool-action-${f.id}`}
                          >
                            <span>Saber mais integração</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
            )}

            {/* APPS VIEW */}
            {activeTab === "apps" && (
              <motion.div
                key="apps"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8 py-6"
                >
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">Aplicativos Móveis Funcionais</h2>
                    <p className="text-xs text-gray-400 mt-1">Aplicações móveis híbridas focadas em agilidade de campo, coletores móveis e sincronização em tempo de rota.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="apps-list-grid">
                    {db.apps.map((appItem) => (
                      <div 
                        key={appItem.id} 
                        className="bg-[#111622] border border-gray-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-purple-500/50 transition-all cursor-default"
                        id={`app-card-${appItem.id}`}
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between gap-3 mb-4">
                            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md font-mono text-[9px] uppercase font-bold">
                              {appItem.plataforma}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono">{appItem.downloads} de installs</span>
                          </div>

                          <button
                            onClick={() => setSelectedApp(appItem)}
                            className="text-left block group"
                          >
                            <h3 className="text-md font-display font-bold text-white group-hover:text-purple-400 mb-2 transition-colors">
                              {appItem.nome}
                            </h3>
                          </button>
                          <p className="text-xs text-gray-400 leading-relaxed">{appItem.descricao}</p>
                          
                          <div className="mt-4 p-3 bg-[#0A0D14] rounded-lg text-[10px] font-mono border border-gray-800 text-indigo-300">
                            <strong>Foco do App:</strong> {appItem.detalhes}
                          </div>
                        </div>

                        <div className="p-4 bg-[#0A0D14]/50 border-t border-gray-800 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedApp(appItem)}
                            className="text-xs text-purple-400 hover:text-purple-300 font-bold underline cursor-pointer"
                          >
                            Ver Detalhes
                          </button>
                          <a 
                            href="https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Gostaria%20de%20solicitar%20uma%20versão%20de%20testes%20do%20aplicativo%20móvel%2520customizado."
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="py-2 px-4 bg-[#111622] border border-gray-800 hover:border-gray-700 text-white rounded-xl text-xs font-semibold transition animate-fade-in"
                            id={`app-action-demo-${appItem.id}`}
                          >
                            Pedir APK Demonstração
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
            )}

            {/* CHATKORE (AI assistant) VIEW */}
            {activeTab === "chatkore" && (
              <motion.div
                key="chatkore"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 py-6"
              >
                <div>
                  <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    ChatKore - Assistência de Engenharia de Software
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Nossa inteligência artificial está contextualizada com todos os nossos serviços, contatos, modelo de atendimento online e cupons ativos. Pergunte o que quiser!</p>
                </div>

                <ChatKore />
              </motion.div>
            )}

            {/* PROMOÇÕES VIEW */}
            {activeTab === "promocoes" && (
              <motion.div
                key="promocoes"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 py-6"
              >
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">Cupons Comerciais e Incentivos Ativos</h2>
                  <p className="text-xs text-gray-400 mt-1">Copie os códigos promocionais ativos na planilha comercial e envie ao finalizar seu briefing de projeto.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="promos-list-grid">
                  {db.promocoes.map((p) => (
                    <div 
                      key={p.id} 
                      className="bg-[#111622] p-6 rounded-2xl border-2 border-dashed border-gray-800 hover:border-blue-500/40 transition flex flex-col justify-between"
                      id={`promo-card-${p.id}`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="text-[9px] font-mono text-gray-500 font-bold uppercase">Validade: {p.validade}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {p.desconto}
                          </span>
                        </div>

                        <h3 className="text-md font-display font-bold text-white mb-2">{p.titulo}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed mb-4">{p.condicao}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="p-2.5 bg-[#0A0D14] rounded-xl border border-gray-800 flex items-center justify-between gap-2 font-mono text-xs text-slate-200">
                          <span>Cupom: <strong className="text-blue-400 uppercase font-bold">{p.cupom}</strong></span>
                          <button
                            onClick={() => handleCopyCoupon(p.cupom)}
                            className="p-1.5 hover:bg-gray-800 rounded text-slate-400 hover:text-white transition"
                            title="Copiar cupom para área de trabalho celular"
                            id={`btn-copy-promo-${p.id}`}
                          >
                            {copiedCoupon === p.cupom ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                        
                        <a 
                          href={`https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Gostaria%20de%20falar%20sobre%20o%20projeto%20com%20o%20cupom%20promocional%20${p.cupom}`}
                          target="_blank"
                          referrerPolicy="no-referrer"
                          className="block text-center w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full transition-all"
                          id={`promo-action-${p.id}`}
                        >
                          Usar Código no Combo WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* APIs VIEW */}
            {activeTab === "apis" && (
              <motion.div
                key="apis"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 py-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white font-sans">Hub de APIs e Conectores Inteligentes</h2>
                    <p className="text-xs text-gray-400 mt-1">Conectores de alta velocidade para faturamento em lote, monitoramento em tempo real e inteligência artificial proprietária.</p>
                  </div>

                  {/* Sub-tabs toggles */}
                  <div className="flex bg-[#111622] p-1 rounded-full border border-gray-800 self-start md:self-auto shrink-0">
                    {[
                      { id: "kflow", label: "🤖 Kflow AI API" },
                      { id: "public_apis", label: "📡 APIs Públicas" },
                      { id: "integration", label: "⚙️ Conectores ERP" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedApiTab(tab.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                          selectedApiTab === tab.id
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                            : "text-gray-400 hover:text-gray-205"
                        }`}
                        id={`api-subtab-${tab.id}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TAB 1: KFLOW AI API */}
                {selectedApiTab === "kflow" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: About & Docs */}
                      <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#111622] border border-gray-800 p-6 rounded-3xl">
                          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-bold uppercase rounded px-2.5 py-0.5">Proprietário</span>
                          <h3 className="text-lg font-display font-bold text-white mt-3 mb-2">Kflow AI Engine</h3>
                          <p className="text-xs text-gray-400 leading-relaxed font-sans">
                            Nossa API premium de inferência de linguagem e análise de fluxos corporativos. Construída sobre processamento acelerado dedicado para entregar respostas com latências baixíssimas, ideal para automação de ERP, robôs de chat e suporte técnico empresarial.
                          </p>

                          <div className="border-t border-gray-800 pt-4 mt-4 space-y-3">
                            <div>
                              <span className="text-[10px] text-gray-500 block uppercase font-mono tracking-wider">Protocolo Base</span>
                              <span className="text-xs font-mono text-gray-300">HTTPS / REST JSON</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-500 block uppercase font-mono tracking-wider">Modelo Ativo</span>
                              <span className="text-xs font-mono text-gray-300">kflow-neural-flash-v3</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-500 block uppercase font-mono tracking-wider">Latência Média</span>
                              <span className="text-xs font-mono text-emerald-400 font-bold">~ 180ms</span>
                            </div>
                          </div>
                        </div>

                        {/* Integration Quick Example Code */}
                        <div className="bg-[#111622] border border-gray-800 p-6 rounded-3xl space-y-3">
                          <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">Exemplo de Requisição</h4>
                          <div className="bg-[#0A0D14] p-4 rounded-xl border border-gray-800 overflow-x-auto">
                            <pre className="text-[10px] text-slate-300 font-mono leading-relaxed">
{`curl -X POST https://korenexus.com.br/api/v1/kflow \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer kn_kflow_xxxx" \\
  -d '{
    "prompt": "Resumir fluxo logístico de distribuição",
    "temperature": 0.3
  }'`}
                            </pre>
                          </div>
                        </div>
                      </div>

                      {/* Right: Embedded Interactive Console (Interactive KoreNexus Widget) */}
                      <div className="lg:col-span-8 bg-[#111622] border border-gray-800 p-4 rounded-3xl" id="kflow-interactive-sandbox">
                        <div className="flex items-center justify-between gap-4 mb-4 border-b border-gray-800 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <h3 className="text-sm font-display font-semibold text-white">Console de Teste Interativo (Kflow Terminal)</h3>
                          </div>
                          
                          <a 
                            href="https://5c69fadb-90e6-4849-89a3-0da45120d9e1.lovableproject.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 bg-[#0A0D14] border border-gray-800 px-3 py-1.5 rounded-full"
                          >
                            <span>Abrir em Nova Aba</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>

                        <p className="text-xs text-gray-400 mb-4 font-sans leading-relaxed">
                          Interaja com a aplicação Kflow original abaixo por meio do console integrado e experimente a velocidade em tempo real.
                        </p>

                        <div className="bg-black/40 rounded-2xl p-1 border border-gray-800 overflow-hidden shadow-inner">
                          <KoreNexusWidget />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: EXPLORER DE APIS PÚBLICAS (GITHUB PUBLIC-APIS) */}
                {selectedApiTab === "public_apis" && (
                  <div className="space-y-6">
                    <div className="bg-[#111622] border border-gray-800 p-6 rounded-3xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-display font-bold text-white mb-1">Explorer de APIs Públicas Globais</h3>
                          <p className="text-xs text-gray-400 leading-relaxed font-sans">
                            Catálogo interativo com as melhores APIs abertas da comunidade global (Gerdon Public APIs). Pesquise, filtre e execute requisições reais.
                          </p>
                        </div>
                      </div>

                      {/* Filters and Search Container */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 border-t border-gray-850 pt-5">
                        <div className="md:col-span-4 relative">
                          <input
                            type="text"
                            value={apiSearch}
                            onChange={(e) => setApiSearch(e.target.value)}
                            placeholder="Buscar por nome, tag ou categoria..."
                            className="w-full bg-[#0A0D14] border border-gray-800 px-4 py-2.5 text-xs rounded-full text-white outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                          />
                        </div>

                        <div className="md:col-span-8 flex flex-wrap gap-1.5 items-center justify-start md:justify-end">
                          {["Todos", "Animais", "Anime", "Antimalware", "Arte & Design", "Blockchain", "Livros", "Negócios", "Agenda", "Armazenamento", "Cripto", "Câmbio", "Validação", "Desenvolvimento", "Produtividade", "Humor", "Ambiente", "Finanças", "Geografia", "IA & ML", "Transporte", "Utilidades"].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedApiCategory(cat)}
                              className={`px-3 py-1 rounded-full text-[10px] font-semibold cursor-pointer transition-all ${
                                selectedApiCategory === cat
                                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/35"
                                  : "bg-slate-900/40 text-gray-400 border border-transparent hover:text-gray-250 hover:border-gray-800"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Main content grid of Publicapis list */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      
                      {/* Left: APIs List (grid/cols) */}
                      <div className="lg:col-span-7 col-span-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[550px] overflow-y-auto pr-1">
                          {PUBLIC_APIS_LIST.filter((api) => {
                            const query = apiSearch.toLowerCase();
                            const matchesSearch = api.name.toLowerCase().includes(query) || 
                                                  api.description.toLowerCase().includes(query) || 
                                                  api.category.toLowerCase().includes(query);
                            const matchesCategory = selectedApiCategory === "Todos" || api.category === selectedApiCategory;
                            return matchesSearch && matchesCategory;
                          }).map((api, idx) => (
                            <div 
                              key={idx}
                              onClick={async () => {
                                setActiveApiTest(api);
                                setTerminalLoading(true);
                                setTerminalOutput("");
                                try {
                                  const startTime = performance.now();
                                  const res = await fetch(api.sampleEndpoint);
                                  const duration = (performance.now() - startTime).toFixed(0);
                                  let dataText = "";
                                  const contentType = res.headers.get("content-type") || "";
                                  
                                  if (!res.ok) throw new Error(`Status ${res.status}`);
                                  
                                  if (contentType.includes("application/json")) {
                                    const dataJson = await res.json();
                                    dataText = JSON.stringify(dataJson, null, 2);
                                  } else {
                                    dataText = await res.text();
                                    if (dataText.length > 800) dataText = dataText.substring(0, 800) + "\n... [Truncado]";
                                  }
                                  
                                  setTerminalOutput(`// STATUS: ${res.status} OK\n// TEMPO DE RESPOSTA: ${duration}ms\n// ENDPOINT: ${api.sampleEndpoint}\n\n${dataText}`);
                                } catch (err: any) {
                                  setTerminalOutput(`// FALHA DE COMUNICAÇÃO DE DADOS\n// ENDPOINT: ${api.sampleEndpoint}\n// NOTA: Algumas APIs requerem permissões CORS diretas do navegador.\n// DETALHES: ${err.message || err}`);
                                } finally {
                                  setTerminalLoading(false);
                                }
                              }}
                              className={`p-4 bg-[#111622] border rounded-2xl cursor-pointer hover:border-blue-500/30 transition-all flex flex-col justify-between ${
                                activeApiTest?.name === api.name ? "border-blue-500 bg-[#141b2c]" : "border-gray-800"
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <span className="text-[9px] font-mono font-bold bg-[#0A0D14] px-2 py-0.5 rounded text-blue-400 capitalize">
                                    {api.category}
                                  </span>
                                  <span className="text-[8px] font-mono text-gray-500 uppercase">
                                    CORS: {api.cors}
                                  </span>
                                </div>
                                <h4 className="text-xs font-sans font-bold text-white mb-1">{api.name}</h4>
                                <p className="text-[10px] text-gray-400 leading-normal line-clamp-3">{api.description}</p>
                              </div>

                              <div className="mt-3 pt-2.5 border-t border-gray-850 flex items-center justify-between">
                                <span className="text-[8px] font-mono text-gray-500 leading-none truncate max-w-[150px]">
                                  {api.url}
                                </span>
                                <span className="text-[9px] text-blue-400 hover:underline font-bold font-sans">
                                  Live Test →
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Live Interactive Terminal Container */}
                      <div className="lg:col-span-5 col-span-1 bg-[#111622] border border-gray-800 p-5 rounded-3xl flex flex-col justify-between h-[550px]">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                            <div className="flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 rounded-full ${terminalLoading ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}></span>
                              <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">Terminal do Conector</h4>
                            </div>
                            <span className="text-[10px] font-mono text-gray-500">v1.3_sandboxed</span>
                          </div>

                          {activeApiTest ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-300 font-bold font-sans text-xs">{activeApiTest.name}</span>
                                <span className="text-[9px] font-mono text-gray-400">Auth: {activeApiTest.auth}</span>
                              </div>
                              <p className="text-[10px] text-gray-400 font-sans leading-normal bg-black/35 p-3 rounded-xl border border-gray-850">
                                <span className="text-indigo-400 font-mono font-bold uppercase text-[9px] block mb-1">Target Base URL</span>
                                <code className="font-mono text-[9px] select-all tracking-tight break-all">{activeApiTest.url}</code>
                              </p>
                            </div>
                          ) : (
                            <div className="text-center py-10 border border-dashed border-gray-850 rounded-2xl bg-[#0A0D14]/40">
                              <Cpu className="h-6 w-6 text-gray-650 mx-auto mb-2 animate-pulse" />
                              <p className="text-xs text-gray-450 font-sans">Selecione uma API pública à esquerda para inspecionar e injetar dados reais no sandbox.</p>
                            </div>
                          )}
                        </div>

                        {/* Visual Code Box representation */}
                        <div className="flex-1 my-4 bg-[#0A0D14] border border-gray-800 rounded-2xl overflow-hidden flex flex-col justify-between p-4 relative min-h-[220px]">
                          {terminalLoading ? (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2.5 z-10">
                              <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />
                              <span className="text-[10px] text-gray-400 font-mono">ENVIANDO REQUISIÇÃO RAW...</span>
                            </div>
                          ) : null}

                          <pre className="font-mono text-[9px] text-emerald-400 leading-relaxed overflow-y-auto flex-1 break-all select-all font-semibold whitespace-pre-wrap">
                            {terminalOutput || `// AGUARDANDO COMANDO operacional...\n// Escolha qualquer API no grid de conectores\n// para testar o retorno em tempo real.`}
                          </pre>
                        </div>

                        <div className="flex gap-2">
                          <button
                            disabled={!activeApiTest || terminalLoading}
                            onClick={async () => {
                              if (!activeApiTest) return;
                              setTerminalLoading(true);
                              setTerminalOutput("");
                              try {
                                const startTime = performance.now();
                                const res = await fetch(activeApiTest.sampleEndpoint);
                                const duration = (performance.now() - startTime).toFixed(0);
                                let dataText = "";
                                const contentType = res.headers.get("content-type") || "";
                                
                                if (!res.ok) throw new Error(`Status ${res.status}`);
                                
                                if (contentType.includes("application/json")) {
                                  const dataJson = await res.json();
                                  dataText = JSON.stringify(dataJson, null, 2);
                                } else {
                                  dataText = await res.text();
                                  if (dataText.length > 800) dataText = dataText.substring(0, 800) + "\n... [Truncado]";
                                }
                                
                                setTerminalOutput(`// STATUS: ${res.status} OK\n// TEMPO DE RESPOSTA: ${duration}ms\n// ENDPOINT: ${activeApiTest.sampleEndpoint}\n\n${dataText}`);
                              } catch (err: any) {
                                setTerminalOutput(`// EXCEÇÃO DA INTERFACE\n// ENDPOINT: ${activeApiTest?.sampleEndpoint}\n// DETALHES: ${err.message || err}\n// Nota: requisição direta efetuada.`);
                              } finally {
                                setTerminalLoading(false);
                              }
                            }}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-full text-[11px] font-bold transition shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <RefreshCw className={`h-3 w-3 ${terminalLoading ? "animate-spin" : ""}`} />
                            Executar Nova Chamada (GET)
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 3: Conectores ERP */}
                {selectedApiTab === "integration" && (
                  <div className="space-y-6">
                    <div className="bg-[#111622] border border-gray-800 p-6 rounded-2xl">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[9px] font-bold uppercase rounded">POST</span>
                        <code className="text-xs text-slate-300 font-mono">/api/v1/erp/invoice/create</code>
                      </div>
                      <p className="text-xs text-gray-400 mb-4 leading-normal">
                        Criação de notas fiscais de vendas comerciais integradas diretamente aos coletores de estoques remotos. Faz as consultas fiscais Sefaz automaticamente.
                      </p>
                      
                      <div className="bg-[#0A0D14] p-4 rounded-xl border border-gray-800 overflow-x-auto">
                        <pre className="text-[10px] text-slate-300 font-mono leading-relaxed">
   {`{
    "uuid": "invoice_kore_99872",
    "apiKey": "kn_prod_88291a100b",
    "notaFiscal": {
      "empresaCnpj": "44.938.872/0001-99",
      "clienteDoc": "111.222.333-44",
      "valorTotal": 14902.50,
      "itens": [
        { "id": "kn_prod_erp", "quantidade": 1, "preco": 14902.50 }
      ]
    }
  }`}
                        </pre>
                      </div>
                    </div>

                    <div className="bg-[#111622] border border-gray-800 p-6 rounded-2xl">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-[9px] font-bold uppercase rounded">GET</span>
                        <code className="text-xs text-slate-300 font-mono">/api/v1/delivery/tracking/status</code>
                      </div>
                      <p className="text-xs text-gray-400 mb-4 leading-normal">
                        Consulta a rota e geolocalização do operador de transportes, validando fotos de entrega por assinatura digital em tempo real.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STATUS VIEW */}
            {activeTab === "status" && (
              <motion.div
                key="status"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 py-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white font-sans">Monitor de Sistemas (Uptime Robot Live)</h2>
                    <p className="text-xs text-gray-400 mt-1">Status operacional em tempo real integrado via gateway oficial Uptime Robot.</p>
                  </div>
                  <button
                    onClick={fetchUptimeRobotStatus}
                    disabled={uptimeLoading}
                    className="self-start sm:self-auto py-2 px-4 bg-[#111622] hover:bg-[#1b2336] text-gray-300 text-xs font-semibold rounded-full border border-gray-800 transition flex items-center gap-2"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${uptimeLoading ? 'animate-spin text-blue-400' : ''}`} />
                    <span>{uptimeLoading ? 'Sincronizando...' : 'Sincronizar Monitor'}</span>
                  </button>
                </div>

                {uptimeError && (
                  <div className="text-[10px] text-amber-400 font-mono bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>Informativo: {uptimeError} (Usando barramento de status local de alta integridade).</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {uptimeLoading && uptimeMonitors.length === 0 ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-[#111622] border border-gray-800 p-5 rounded-2xl animate-pulse space-y-3">
                        <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                        <div className="h-5 bg-gray-800 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-800 rounded w-full"></div>
                      </div>
                    ))
                  ) : (
                    uptimeMonitors.map((m: any) => {
                      const isUp = m.status === 2;
                      const statusColor = isUp ? 'bg-emerald-500' : m.status === 8 || m.status === 9 ? 'bg-rose-500' : 'bg-gray-500';
                      const statusText = isUp ? '100% OPERACIONAL' : m.status === 8 || m.status === 9 ? 'INOPERANTE' : 'PAUSADO';
                      return (
                        <div key={m.id || m.friendly_name} className="bg-[#111622] border border-gray-800 p-5 rounded-2xl flex flex-col justify-between hover:border-gray-700 transition">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs text-gray-400 font-mono truncate max-w-[150px]" title={m.friendly_name}>
                                {m.friendly_name}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold font-mono ${isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                                {m.all_time_uptime_ratio ? `${m.all_time_uptime_ratio}% SLA` : '99.9% SLA'}
                              </span>
                            </div>
                            <h3 className="text-md font-display font-bold text-white mt-1 flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${statusColor} ${isUp ? 'animate-pulse' : ''}`}></span>
                              {statusText}
                            </h3>
                          </div>
                          <div className="mt-4">
                            <div className="flex justify-between text-[8px] text-gray-500 font-mono mb-1">
                              <span>SLA Geral</span>
                              <span>{m.all_time_uptime_ratio ? `${m.all_time_uptime_ratio}%` : '100%'}</span>
                            </div>
                            <div className="h-1 bg-gray-800 rounded-full w-full overflow-hidden">
                              <div className={`h-full ${isUp ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${m.all_time_uptime_ratio || 100}%` }}></div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Response times list mapping */}
                <div className="bg-[#111622] p-6 rounded-2xl border border-gray-800">
                  <h3 className="text-sm font-display font-bold text-white mb-4">Histórico Recente de Latência de Servidor (Últimas 24h)</h3>
                  <div className="flex items-end justify-between h-32 gap-1.5 pt-4 border-b border-gray-800">
                    {[12, 14, 15, 11, 10, 18, 25, 41, 12, 10, 11, 13, 15, 14, 16, 22, 12, 11, 15, 12, 14, 11, 10, 10].map((latency, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-blue-500/30 hover:bg-blue-500 transition-all rounded-t-sm"
                          style={{ height: `${latency * 2}px` }}
                          title={`Hora ${idx}:00 - ${latency}ms`}
                        ></div>
                        <span className="text-[7px] text-gray-500 font-mono mt-1.5 hidden md:block">{idx}h</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* BLOG VIEW */}
            {activeTab === "blog" && (
              <motion.div
                key="blog"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 py-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white font-sans">Blog Técnico & Hub de Notícias</h2>
                    <p className="text-xs text-gray-400 mt-1">Conectores inteligentes de IA corporativa integrados à canais mundiais de tecnologia da informação.</p>
                  </div>

                  {/* Sub-tabs toggles */}
                  <div className="flex bg-[#111622] p-1 rounded-full border border-gray-800 self-start md:self-auto shrink-0 shadow-sm">
                    {[
                      { id: "company", label: "✍️ Artigos Técnicos e IA" },
                      { id: "gnews", label: `📡 Notícias Globais (${newsArticles.length})` }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedBlogTab(tab.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                          selectedBlogTab === tab.id
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                            : "text-gray-400 hover:text-gray-200"
                        }`}
                        id={`blog-subtab-${tab.id}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedBlogTab === "company" ? (
                  <>
                    {/* AI BlogPost Generator Panel */}
                    {isAdmin && (
                      <div className="bg-[#111622] border border-gray-800 p-6 rounded-3xl mb-8" id="blog-ai-generator-panel">
                        <div className="flex items-center gap-2.5 mb-4">
                          <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
                          <div>
                            <h3 className="text-sm font-display font-semibold text-white">Redator Assistido por IA (Kflow Neural Engine)</h3>
                            <p className="text-[10px] text-gray-400">Gere artigos corporativos completos e estruturados em markdown simulando análises de alta engenharia KoreNexus.</p>
                          </div>
                        </div>

                        <form onSubmit={handleGenerateBlogAI} className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="text"
                            required
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                            disabled={generatingBlog}
                            placeholder="Digite o tema operacional (ex: 'Sistemas Logísticos offline-first em frotas de carga')"
                            className="flex-1 bg-[#0A0D14] border border-gray-800 px-4 py-2.5 text-xs rounded-full text-white outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                          />
                          <button
                            type="submit"
                            disabled={generatingBlog}
                            className="py-2.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full text-xs font-bold transition shrink-0 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                            id="btn-blog-generate-ai"
                          >
                            {generatingBlog ? (
                              <>
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                <span>Escrevendo Artigo...</span>
                              </>
                            ) : (
                              <>
                                <Cpu className="h-3.5 w-3.5" />
                                <span>Gerar Artigo de Sistemas</span>
                              </>
                            )}
                          </button>
                        </form>

                        {generationStatus && (
                          <div className="mt-3 text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-xl">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            {generationStatus}
                          </div>
                        )}

                        {generationError && (
                          <div className="mt-3 text-[10px] text-rose-400 font-mono bg-rose-500/5 border border-rose-500/10 p-2.5 rounded-xl">
                            ⚠️ Erro: {generationError}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="blog-posts-grid">
                      {db.blog.map((post) => (
                        <article 
                          key={post.id} 
                          className="bg-[#111622] border border-gray-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition flex flex-col justify-between"
                          id={`blog-card-${post.id}`}
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">{post.categoria}</span>
                              <span className="text-[9px] text-gray-500 font-mono">{post.data}</span>
                            </div>
                            <h3 className="text-lg font-display font-bold text-white mb-2 leading-snug">{post.titulo}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed truncate-2-lines">{post.resumo}</p>
                          </div>

                          <div className="p-6 pt-0 border-t border-gray-800 mt-4 flex items-center justify-between bg-slate-950/20">
                            <span className="text-[10px] text-gray-400 font-sans">Por {post.autor} • {post.leitura}</span>
                            <button
                              onClick={() => setSelectedPost(post)}
                              className="text-xs text-blue-400 font-bold hover:text-blue-300 transition-colors flex items-center gap-1"
                              id={`btn-read-blog-${post.id}`}
                            >
                              Ler Artigo
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    {newsLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="bg-[#111622] border border-gray-800 rounded-3xl h-64 animate-pulse"></div>
                        ))}
                      </div>
                    ) : newsError ? (
                      <div className="text-xs text-amber-400 font-mono text-center py-12 bg-[#111622] rounded-3xl border border-gray-800">
                        ⚠️ Houve uma instabilidade temporária no Gateway de Notícias de Tecnologia.
                      </div>
                    ) : newsArticles.length === 0 ? (
                      <div className="text-xs text-gray-400 text-center py-12 bg-[#111622] rounded-3xl border border-gray-800">
                        Nenhuma notícia disponível no momento.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {newsArticles.map((article: any, index: number) => (
                          <article 
                            key={index}
                            className="bg-[#111622] border border-gray-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition flex flex-col justify-between"
                          >
                            <div>
                              {article.image && (
                                <img 
                                  src={article.image} 
                                  alt={article.title} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-40 object-cover border-b border-gray-800/50" 
                                />
                              )}
                              <div className="p-6">
                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase truncate max-w-[120px]">
                                    {article.source?.name || "Global News"}
                                  </span>
                                  <span className="text-[8px] text-gray-500 font-mono">
                                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("pt-BR") : "Recente"}
                                  </span>
                                </div>
                                <h3 className="text-sm font-display font-bold text-white mb-2 leading-snug line-clamp-2">
                                  {article.title}
                                </h3>
                                <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-3">
                                  {article.description}
                                </p>
                              </div>
                            </div>

                            <div className="p-6 pt-0 border-t border-gray-800/80 mt-4 flex items-center justify-between bg-slate-950/20 gap-2">
                              <button
                                onClick={() => {
                                  setSelectedPost({
                                    id: `gnews-${index}`,
                                    titulo: article.title,
                                    resumo: article.description || "Sem resumo disponível do portal de notícias.",
                                    categoria: "Notícias Globais",
                                    data: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("pt-BR") : "Recente",
                                    autor: article.source?.name || "Global News",
                                    leitura: "3 min",
                                    conteudo: article.content || article.description || "Conteúdo completo indisponível na pré-visualização. Por favor, utilize o botão de visualizar fonte original acima para ler a notícia na íntegra.",
                                    url: article.url,
                                    image: article.image
                                  });
                                }}
                                className="text-xs text-blue-400 font-bold hover:text-blue-300 transition-colors flex items-center gap-1 border border-blue-500/20 px-3 py-1.5 rounded-full bg-blue-500/5 cursor-pointer"
                              >
                                <span>Ler Notícia</span>
                                <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                              
                              <a 
                                href={article.url} 
                                target="_blank" 
                                referrerPolicy="no-referrer"
                                className="text-xs text-slate-400 font-medium hover:text-slate-200 transition-colors flex items-center gap-1"
                              >
                                <span>Fonte</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Newsletter Box */}
                <div className="bg-[#111622] p-8 rounded-3xl border border-gray-800 text-center space-y-4 max-w-2xl mx-auto">
                  <h3 className="text-lg font-display font-semibold text-white">Inscreva-se na nossa Newsletter Técnica</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Sabe tudo de sistemas novos no seu e-mail semanalmente. Sem spams corporativos.
                  </p>
                  
                  {subscribedNewsletter ? (
                    <div className="text-xs text-emerald-400 font-semibold font-mono">
                      ✓ E-mail registrado com sucesso! Obrigado pela inscrição.
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="Insira seu e-mail de negócios"
                        className="flex-1 bg-[#0A0D14] border border-gray-800 px-4 py-2 text-xs rounded-full text-white outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          if (newsletterEmail.trim()) {
                            setSubscribedNewsletter(true);
                          }
                        }}
                        className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition shrink-0 cursor-pointer"
                        id="btn-subscribe-newsletter"
                      >
                        Inscrever
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "sobre" && (
              <motion.div
                key="sobre"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-16 py-6"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-850 pb-6">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block">QUEM SOMOS & MODELO DE OPERAÇÃO</span>
                    <h2 className="text-3xl font-display font-extrabold text-white mt-1">Eficiência sob Controle absoluto</h2>
                    <p className="text-xs text-slate-400 mt-1 font-sans">Rejeitamos modelos de licenciamento travados para entregar engenharia de software 100% adaptativa.</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs bg-[#111622] px-3.5 py-2 rounded-xl border border-slate-800">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-slate-300 font-mono font-bold">100% ONLINE PARA TODO O BRASIL</span>
                  </div>
                </div>

                {/* Grid layout showing Story and operational coordinates */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Copy Details with timeline vibe */}
                  <div className="lg:col-span-7 space-y-6 leading-relaxed font-sans">
                    <p className="text-sm text-slate-300">
                      Na <strong className="text-white font-bold">KoreNexus</strong>, acreditamos que sistemas corporativos não devem exigir que sua equipe mude as regras do próprio negócio para caber em um software pré-fabricado. Entregamos plataformas personalizadas baseadas em usabilidade real, máxima velocidade técnica e suporte local ininterrupto.
                    </p>

                    <div className="space-y-4 font-sans">
                      <div className="flex gap-3 p-4 bg-[#111622]/40 rounded-2xl border border-slate-850">
                        <Clock className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block font-bold text-xs font-display">SLA e Horário Operacional</strong>
                          <span className="text-xs text-slate-400">Segunda a Sábado — 08h às 18h (Horário de Brasília)</span> <br />
                          <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase mt-1 block">Atendimento imediato via central digital</span>
                        </div>
                      </div>

                      <div className="flex gap-3 p-4 bg-[#111622]/45 rounded-2xl border border-slate-850">
                        <Phone className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block font-bold text-xs font-display">WhatsApp de Contato Direto</strong>
                          <span className="text-xs text-slate-400 font-sans">Fone de suporte: +55 (11) 98938-7263</span> <br />
                          <a href="https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Gostaria%20de%20falar%20sobre%20um%20projeto%20com%20a%20KoreNexus." target="_blank" className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold text-[11px] hover:underline block mt-1">
                            Falar no WhatsApp Corporativo &rarr;
                          </a>
                        </div>
                      </div>

                      <div className="flex gap-3 p-4 bg-[#111622]/40 rounded-2xl border border-slate-850">
                        <Mail className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block font-bold text-xs font-display">Suporte e Comercial Oficial</strong>
                          <span className="text-xs text-slate-400 font-mono text-indigo-300">contato@korenexus.com.br</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10.5px] text-slate-500 leading-normal">
                      Nascemos com o propósito de máxima agilidade: atendemos 100% Online e de forma remota para todo o território nacional. Não mantemos sede ou escritórios físicos com o objetivo de reduzir custos extras operacionais, repassando essa real economia aos nossos parceiros de software sob medida.
                    </p>
                  </div>

                  {/* Right Column: Comparative Advantage Matrix (KoreNexus vs Market) - Stunning UI block */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[#111622] rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
                      <h3 className="text-xs font-display font-black text-white uppercase tracking-wider">A MATRIZ DE VANTAGENS</h3>
                      
                      <div className="space-y-3">
                        {/* Bullet 1 */}
                        <div className="p-3.5 bg-[#0a0d14] rounded-xl border border-slate-850 flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-white block">Propriedade Integral do Código</span>
                            <p className="text-[10px] text-slate-400 mt-0.5">Sua empresa detém a autoria intelectual e controle absoluto da nuvem de hospedagem.</p>
                          </div>
                        </div>

                        {/* Bullet 2 */}
                        <div className="p-3.5 bg-[#0a0d14] rounded-xl border border-slate-850 flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-white block">Licenciamento de Usuários Grátis</span>
                            <p className="text-[10px] text-slate-400 mt-0.5">Adicione quantos colaboradores, clientes ou fornecedores quiser sem custos por assento.</p>
                          </div>
                        </div>

                        {/* Bullet 3 */}
                        <div className="p-3.5 bg-[#0a0d14] rounded-xl border border-slate-850 flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-white block">Sincronia Offline Nativa</span>
                            <p className="text-[10px] text-slate-400 mt-0.5">Módulos móveis desenvolvidos para funcionar sem rede de telefonia e sincronizar de forma autoritativa.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* INTERACTIVE COMPONENT: Specialty Filters with visual detailed drawer */}
                <div className="space-y-8" id="sobre-servicos-container">
                  <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">ECOSISTEMA TÉCNICO</span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Especialidades de Prateleira & Serviços</h3>
                    <p className="text-xs text-slate-400">Explore nossa expertise dividida por grupos operacionais corporativos.</p>
                  </div>

                  {/* Filter chips */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      { id: "todos", label: "Todas as Áreas" },
                      { id: "sistemas", label: "Sistemas & Apps" },
                      { id: "infra", label: "APIs & Infraestrutura" },
                      { id: "gestao", label: "Gestão & Logística" }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setSobreSelectedFilter(tab.id)}
                        className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 ${
                          sobreSelectedFilter === tab.id 
                            ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/10"
                            : "bg-[#111622] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Interactive content list based on filter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { title: "Desenvolvimento de Sistemas", desc: "Plataformas web sob medida de alta usabilidade para otimização de workflow interna.", area: "sistemas", tech: "React / Vite / Tailwind / Node" },
                      { title: "Desenvolvimento de Apps", desc: "Aplicações móveis híbridas e nativas com barramento para funcionar offline com SQLite de alto desempenho.", area: "sistemas", tech: "React Native / SQLite / Native SDKs" },
                      { title: "Inteligência Artificial & LLMs", desc: "Integração local ou em nuvem com modelos avançados (Gemini, OpenAI) para automatizar triagens e tomadas de decisão.", area: "sistemas", tech: "Gemini SDK / Vector DBs / Node" },
                      { title: "Desenvolvimento de APIs", desc: "Microsserviços leves e rápidos para acoplamento de faturamento, SEFAZ e sistemas legados.", area: "infra", tech: "ESM / Node / Express / Drizzle ORM" },
                      { title: "Migração & Nuvem Híbrida", desc: "Hospedagem elástica, deploy automatizado de microsserviços e estruturação de arquiteturas seguras em nuvem.", area: "infra", tech: "Docker / Google Cloud / Cloud Run" },
                      { title: "Consultoria Estratégica", desc: "Modelagem profunda de soluções, arquitetura de sistemas e auditoria estrutural de TI.", area: "infra", tech: "System Topology / AWS / GCP" },
                      { title: "Auditoria de Sistemas Legados", desc: "Varredura profunda de códigos de sistemas antigos para redução de custos e re-arquitetura limpa.", area: "infra", tech: "System Audit / Code Analysis" },
                      { title: "Segurança de Dados", desc: "Segurança cibernética corporativa aplicada, controle de ameaças e conformidade absoluta.", area: "infra", tech: "OAuth 2.0 / Firebase Auth / SSL" },
                      { title: "Dashboards de BI e Analytics", desc: "Centralização de dados analíticos complexos vindos de múltiplas fontes em dashboards visuais analíticos de alta performance.", area: "gestao", tech: "D3.js / Recharts / Canvas" },
                      { title: "Soluções Logísticas", desc: "Rastreamento inteligente de frotas e coletores de dados com suporte offline nativo.", area: "gestao", tech: "Geofencing / Map SDKs / Barcode scanning" },
                      { title: "Soluções Administrativas", desc: "Sistemas ERP/CRM integrados de controle administrativo e gestão de faturamento.", area: "gestao", tech: "D3 / Recharts / Excel exporter" },
                      { title: "Soluções Operacionais", desc: "Automotores e motores de fluxos customizados para ganho real em velocidade operacional.", area: "gestao", tech: "WhatsApp Cloud API / Cron RPA" },
                      { title: "Soluções de Manutenção", desc: "Sustentação proativa técnica de softwares, mitigação de bugs e atualizações periódicas.", area: "sistemas", tech: "Continuous Updates / Support SLA" },
                      { title: "Terceirização (Staffing)", desc: "Alocação dedicada de engenheiros seniores focados na escala do seu desenvolvimento.", area: "gestao", tech: "Senior Staff Allocation" }
                    ]
                      .filter(servico => sobreSelectedFilter === "todos" || servico.area === sobreSelectedFilter)
                      .map((servico, index) => (
                        <div 
                          key={index} 
                          className="bg-gradient-to-b from-[#111622] to-[#0A0D14] border border-slate-850 p-6 rounded-2xl flex flex-col justify-between hover:border-blue-500/35 transition-all group duration-300 shadow-md transform hover:-translate-y-0.5"
                          id={`servico-card-${index}`}
                        >
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-md uppercase tracking-wider">{servico.area}</span>
                              <span className="text-[8px] font-mono text-indigo-400 font-semibold">{servico.tech}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white font-sans group-hover:text-blue-400 transition-colors uppercase tracking-wider">{servico.title}</h4>
                            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed font-sans">{servico.desc}</p>
                          </div>
                          
                          <div className="mt-6 pt-3 border-t border-slate-900 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 font-mono">Pronto para briefing</span>
                            <a 
                              href={`https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Gostaria%20de%20solicitar%20uma%20demonstração/orçamento%20especificamente%20sobre%20${encodeURIComponent(servico.title)}`}
                              target="_blank"
                              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 group/link"
                            >
                              <span>Contratar</span>
                              <ChevronRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                            </a>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Corporate Conversion CTA Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                  <div 
                    className="bg-gradient-to-br from-[#111622] to-[#12192a] border border-slate-850 p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 shadow-md"
                    id="cta-ideia-projeto"
                  >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-all"></div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-blue-400 tracking-wider uppercase bg-blue-500/10 px-2 py-0.5 rounded-full">ENGENHARIA SOB MEDIDA</span>
                      <h4 className="text-md font-display font-bold text-white mt-2 mb-2">💡 Possui um Conceito ou Ideia de Negócio?</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                        Possui uma visão ou conceito claro para sua nova aplicação ou sistema corporativo? Colaboramos diretamente com sua diretoria e equipe para arquitecar, programar e colocar sua ideia em prática com agilidade, estabilidade e solidez absoluta na nuvem.
                      </p>
                    </div>
                    <div className="mt-6 pt-2">
                      <a 
                        href="https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Possuo%20uma%20ideia%20para%20um%20aplicativo/sistema%20e%20gostaria%20de%20colocar%20em%20prática."
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-bold tracking-wide transition-colors group-hover:translate-x-1 duration-350"
                      >
                        <span>Fale Conosco e Coloque em Prática</span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  <div 
                    className="bg-gradient-to-br from-[#111622] to-[#12192a] border border-slate-850 p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300 shadow-md"
                    id="cta-publicacao-playstore"
                  >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-600/5 rounded-full blur-3xl group-hover:bg-emerald-600/10 transition-all"></div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-emerald-400 tracking-wider uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full">HOMOLOGAÇÃO DIGITAL</span>
                      <h4 className="text-md font-display font-bold text-white mt-2 mb-2">📲 Já Possui um Projeto Desenvolvido?</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                        Sua empresa ou startup já dispõe de um sistema concluído ou MVP construído e necessita publicá-lo de forma segura e profissional na Google Play Store? Cuidamos do preparo, conformidade de políticas e publicação técnica assistida para você.
                      </p>
                    </div>
                    <div className="mt-6 pt-2">
                      <a 
                        href="https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Já%20possuo%20um%20projeto%20desenvolvido%20e%20gostaria%20de%20ajuda%20com%20suporte%20para%20colocar%20na%20PlayStore."
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-bold tracking-wide transition-colors group-hover:translate-x-1 duration-350"
                      >
                        <span>Nos Contacte para Publicação</span>
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ADMIN DASHBOARD (SPREADSHEET EDITOR) VIEW */}
            {activeTab === "admin-dashboard" && (
              <motion.div
                key="admin-dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 py-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                      <Lock className="h-6 w-6 text-blue-400" />
                      Painel Corporativo Administrativo
                    </h2>
                  </div>

                  <button
                    onClick={handleLogoutAdmin}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition"
                    title="Desconectar do painel comercial"
                    id="btn-admin-logout"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sair do Dashboard</span>
                  </button>
                </div>

                <AdminSpreadsheet 
                  data={db} 
                  onUpdateData={(newData) => setDb(newData)}
                  onRefresh={fetchSpreadsheetData}
                  adminEmail={adminEmail}
                />
              </motion.div>
            )}
          </>
        )}

          </AnimatePresence>
          </>
        )}

      </main>

      {/* Blog Details Modal Popup */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A0D14]/95 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#111622] border border-gray-800 max-w-lg w-full rounded-3xl p-6 space-y-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              id="blog-reading-modal"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase bg-blue-500/15 px-2 py-0.5 rounded border border-blue-500/25">
                  {selectedPost.categoria}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">{selectedPost.data}</span>
              </div>
              
              <h2 className="text-lg font-display font-bold text-white">{selectedPost.titulo}</h2>
              <p className="text-xs text-gray-400 font-mono">Artigo escrito por {selectedPost.autor} • {selectedPost.leitura} para leitura</p>
              
              <div className="h-px bg-gray-800 my-1"></div>
              
              <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedPost.conteudo ? (
                  <div className="text-xs text-slate-300 space-y-4 leading-relaxed font-sans pre-wrap">
                    {selectedPost.conteudo}
                  </div>
                ) : (
                  <p className="text-xs text-slate-300 leading-relaxed font-sans pre-wrap">
                    {selectedPost.resumo} <br /><br />
                    Esta é a versão de rascunho completo do artigo persistido na planilha de negócios de forma autônoma. Para acessar revisões completas e arquivos Figma, verifique o canal do slack comercial ou fale conosco pelo e-mail contato@korenexus.com.br.
                  </p>
                )}
              </div>

              <div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="w-full text-center py-2.5 bg-[#0A0D14] border border-gray-800 hover:bg-gray-800 text-white rounded-full text-xs transition font-bold cursor-pointer"
                  id="btn-close-blog-modal"
                >
                  Voltar para Postagens
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0A0D14]/95 backdrop-blur-lg flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowAdminLogin(false);
              setLoginError("");
            }}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#111622] border border-gray-800 max-w-sm w-full rounded-3xl p-6 space-y-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              id="admin-login-modal"
            >
              <div className="text-center">
                <div className="h-10 w-10 mx-auto rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3 block">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-display font-bold text-white">Acesso Oculto Operacional</h3>
                <p className="text-[10px] text-gray-400 mt-1">Insira seu e-mail administrativo autenticado no painel corporativo.</p>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/15 text-rose-400 text-xs text-center leading-normal">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleAdminVerify} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-gray-400 font-mono">E-mail Corporativo</label>
                  <input
                    type="email"
                    required
                    placeholder="exemplo@korenexus.com.br"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="bg-[#0A0D14] text-white rounded-full border border-gray-800 px-4 py-2.5 text-xs text-center focus:ring-1 focus:ring-blue-500 outline-none font-mono w-full"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminLogin(false);
                      setLoginError("");
                    }}
                    className="flex-1 py-2.5 bg-[#0A0D14] border border-gray-800 text-slate-300 rounded-full text-xs transition font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs transition font-bold cursor-pointer"
                    id="btn-submit-login"
                  >
                    Verificar Acesso
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[#080B11] border-t border-gray-950 py-16 mt-20 z-20 font-sans relative">
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Editorial Branding and Contacts */}
          <div className="space-y-4">
            <BrandingLogo size="sm" />
            <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-xs">
              Sistemas corporativos sob medida, motores de automação inteligentes e consultoria especializada de arquitetura de alta escala.
            </p>
            
            <div className="space-y-2 pt-3">
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                <a href="mailto:contato@korenexus.com.br" className="hover:text-white transition">contato@korenexus.com.br</a>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <a href="https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Vim%20pelo%20site%20korenexus.com.br" target="_blank" className="hover:text-white transition">+55 (11) 98938-7263</a>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-400 font-mono">
                <MapPin className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>São Paulo - SP, Brasil</span>
              </div>
            </div>
          </div>

          {/* Column 2: HTML Sitemap - Navegação do Usuário */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold border-b border-gray-850 pb-2">
              Sitemap HTML - Navegação
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              {[
                { label: "Início", id: "inicio" },
                { label: "Produtos ERP", id: "produtos" },
                { label: "Agenda Comercial", id: "kagenda" },
                { label: "Console Kflow", id: "kflow" },
                { label: "Ferramentas Sefaz", id: "ferramentas" },
                { label: "Aplicativos Móveis", id: "apps" },
                { label: "Chatbot IA ChatKore", id: "chatkore" },
                { label: "Promoções & Cupons", id: "promocoes" },
                { label: "Integrações & APIs", id: "apis" },
                { label: "Uptime do Servidor", id: "status" },
                { label: "Blog de Engenharia", id: "blog" },
                { label: "Sobre a KoreNexus", id: "sobre" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      setSelectedTool(null);
                      setSelectedApp(null);
                      setSelectedPost(null);
                      setIsDocPage(false);
                      setIsPrivPage(false);
                      setActiveTab(link.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-blue-400 transition cursor-pointer text-left block w-full hover:translate-x-1 duration-200"
                  >
                    • &nbsp; {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: HTML Sitemap - Catálogo Técnico Integrado */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold border-b border-gray-850 pb-2">
              Índice de Soluções
            </h4>
            
            <div className="space-y-4">
              {/* Products list */}
              <div>
                <span className="text-[9px] font-mono font-bold text-gray-500 uppercase block mb-1.5 font-sans">Sistemas Corporativos</span>
                <ul className="space-y-1.5 text-xs text-gray-450">
                  {db.produtos && db.produtos.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setSelectedTool(null);
                          setSelectedApp(null);
                          setSelectedPost(null);
                          setIsDocPage(false);
                          setIsPrivPage(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="hover:text-blue-300 font-mono text-[11px] hover:underline"
                      >
                        {p.nome} ERP
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools and Apps list */}
              <div>
                <span className="text-[9px] font-mono font-bold text-gray-500 uppercase block mb-1.5 font-sans font-sans">Utilitários e Aplicativos</span>
                <ul className="grid grid-cols-2 gap-1 text-xs text-gray-450">
                  {db.ferramentas && db.ferramentas.map((f) => (
                    <li key={f.id}>
                      <button
                        onClick={() => {
                          setSelectedTool(f);
                          setSelectedProduct(null);
                          setSelectedApp(null);
                          setSelectedPost(null);
                          setIsDocPage(false);
                          setIsPrivPage(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="hover:text-emerald-300 font-mono text-[10px] hover:underline block truncate max-w-[120px]"
                      >
                        {f.nome}
                      </button>
                    </li>
                  ))}
                  {db.apps && db.apps.map((a) => (
                    <li key={a.id}>
                      <button
                        onClick={() => {
                          setSelectedApp(a);
                          setSelectedProduct(null);
                          setSelectedTool(null);
                          setSelectedPost(null);
                          setIsDocPage(false);
                          setIsPrivPage(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="hover:text-purple-300 font-mono text-[10px] hover:underline block truncate max-w-[120px]"
                      >
                        {a.nome}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Column 4: Links Legais, Sociais e Segurança */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold border-b border-gray-850 pb-2">
              Suporte & Governança
            </h4>
            
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setSelectedTool(null);
                    setSelectedApp(null);
                    setSelectedPost(null);
                    setIsPrivPage(false);
                    setIsDocPage(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-indigo-400 font-semibold cursor-pointer text-left block w-full hover:underline"
                  id="footer-doc-link"
                >
                  Documentação de APIs
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setSelectedTool(null);
                    setSelectedApp(null);
                    setSelectedPost(null);
                    setIsDocPage(false);
                    setIsPrivPage(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-indigo-400 font-semibold cursor-pointer text-left block w-full hover:underline"
                  id="footer-priv-link"
                >
                  Política de Privacidade
                </button>
              </li>
              <li>
                <a 
                  href="https://share.google/kSzwdCtSQWLOxcPLZ" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-indigo-400 font-semibold text-left block w-full hover:underline"
                >
                  Canal de Atendimento Google
                </a>
              </li>
              <li>
                <a 
                  href="https://maps.app.goo.gl/9GUtRqBqWA7xZkYZ8?g_st=ac" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-indigo-400 font-semibold text-left block w-full hover:underline"
                >
                  Localização Google Maps
                </a>
              </li>
              <li className="pt-3">
                <button
                  onClick={() => {
                    setLoginEmail("");
                    setShowAdminLogin(true);
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-gray-850 rounded-xl text-[10px] text-gray-400 hover:text-white transition flex items-center justify-center gap-1.5 font-mono w-full cursor-pointer"
                  title="Acesso Seguro Administrativo SSO KN"
                  id="footer-admin-link"
                >
                  <Lock className="h-3 w-3 text-blue-400" />
                  <span>Acesso SSO KN</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copywrite bar */}
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-900/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-[10px] text-gray-500 font-mono">
            © 2026 KoreNexus Soluções S.A. CNPJ sob medida. Todos os direitos reservados.
          </p>
          <div className="text-[10px] text-gray-500 font-mono flex items-center gap-3">
            <span>Servidor Estável (HTTPS)</span>
            <span>•</span>
            <a href="/robots.txt" target="_blank" className="hover:text-white transition underline">Robots.txt</a>
            <span>•</span>
            <a href="/sitemap.xml" target="_blank" className="hover:text-white transition underline">Sitemap.xml</a>
          </div>
        </div>
      </footer>

      {/* Global Command/Search Palette Overlay */}
      <SearchPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        database={db}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setSelectedTool(null);
          setSelectedApp(null);
          setSelectedPost(null);
          setIsDocPage(false);
          setIsPrivPage(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onSelectTool={(f) => {
          setSelectedTool(f);
          setSelectedProduct(null);
          setSelectedApp(null);
          setSelectedPost(null);
          setIsDocPage(false);
          setIsPrivPage(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onSelectApp={(a) => {
          setSelectedApp(a);
          setSelectedProduct(null);
          setSelectedTool(null);
          setSelectedPost(null);
          setIsDocPage(false);
          setIsPrivPage(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onSelectPost={(p) => {
          setSelectedPost(p);
          setSelectedProduct(null);
          setSelectedTool(null);
          setSelectedApp(null);
          setIsDocPage(false);
          setIsPrivPage(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedProduct(null);
          setSelectedTool(null);
          setSelectedApp(null);
          setSelectedPost(null);
          setIsDocPage(false);
          setIsPrivPage(false);
        }}
      />

      {/* Dynamic Cookie Consent Banner (LGPD Compliant) */}
      <CookieBanner />

      {/* Free Architectural Consultation Lead Magnet Modal */}
      <LeadMagnetModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />

      {/* Back to Top Floating Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 md:right-8 p-3 bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500/20 rounded-full shadow-2xl transition cursor-pointer z-40 group"
            title="Voltar ao início (Pressione T)"
            id="back-to-top-button"
          >
            <ArrowUp className="h-4.5 w-4.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Dynamic Floating WhatsApp Assistant & Lead Generator */}
      <div className="fixed bottom-6 left-6 z-40 max-w-xs font-sans">
        <div className="relative group">
          {/* Main WhatsApp pulsing button */}
          <a
            href="https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Vim%20pelo%20site%20korenexus.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 bg-[#07D05E] hover:bg-[#05B04E] text-white font-semibold rounded-full shadow-2xl transition cursor-pointer"
            id="floating-whatsapp-assistant"
          >
            {/* Pulsing indicator */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <Phone className="h-4 w-4 fill-current shrink-0" />
            <span className="text-[11px] tracking-wide">Falar Conosco</span>
          </a>

          {/* Prompt banner popping up or showing on hover */}
          <div className="absolute bottom-14 left-0 w-64 p-4 bg-[#0A0D14] border border-gray-800 rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
            <div className="space-y-2.5">
              <span className="text-[9px] font-mono text-emerald-400 font-bold block uppercase tracking-wider">⚡ Conversa Técnica Imediata</span>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Fale diretamente com engenheiros seniores da KoreNexus para tirar dúvidas de ERPs ou faturamento.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono pt-1">
                <a
                  href="https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Vim%20pelo%20site%20korenexus.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-2 bg-[#0F1420] border border-gray-800 hover:border-gray-700 text-center text-gray-300 hover:text-white rounded-lg transition"
                >
                  WhatsApp Direct
                </a>
                <button
                  onClick={() => setIsLeadModalOpen(true)}
                  className="px-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-center text-white font-bold rounded-lg transition cursor-pointer"
                >
                  Consultoria Grátis
                </button>
              </div>
            </div>
            {/* Miniature caret */}
            <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-[#0A0D14] border-r border-b border-gray-800 rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom simple wrapper to render logo correctly as link or button
interface BrandsWrapperProps {
  children: React.ReactNode;
  onClick: () => void;
}
function BrandsWrapper({ children, onClick }: BrandsWrapperProps) {
  return (
    <div onClick={onClick} className="cursor-pointer hover:opacity-90 transition select-none" id="branding-logo-wrapper">
      {children}
    </div>
  );
}
