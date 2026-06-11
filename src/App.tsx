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
import CursosPage from "./components/CursosPage";
import InicioPage from "./components/InicioPage";
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
  ArrowUp,
  Instagram,
  GraduationCap
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
  
  // High-converting direct diagnostic states
  const [leadGargalo, setLeadGargalo] = useState<string>("planilhas");
  const [leadTamanho, setLeadTamanho] = useState<string>("media");
  const [leadContatoPref, setLeadContatoPref] = useState<string>("presencial");

  // Footer accordions states (highly interactive for user-facing navigation)
  const [footerSitemapOpen, setFooterSitemapOpen] = useState<boolean>(false);
  const [footerIndiceOpen, setFooterIndiceOpen] = useState<boolean>(false);
  const [footerCoberturaOpen, setFooterCoberturaOpen] = useState<boolean>(false);

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

        const validTabs = ["inicio", "produtos", "ferramentas", "apps", "chatkore", "promocoes", "apis", "status", "blog", "admin-dashboard", "sobre", "cursos"];
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
      const validTabs = ["inicio", "produtos", "ferramentas", "apps", "chatkore", "promocoes", "apis", "status", "blog", "admin-dashboard", "sobre", "cursos"];
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
    let resolvedTitle = "KoreNexus | Softwares sob Medida, ERP & IA em Jundiaí e Várzea Paulista";
    let resolvedDesc = "A KoreNexus desenvolve sistemas sob medida, ERPs industriais, automações de processos e aplicativos mobile para empresas em Jundiaí, Várzea Paulista, Campo Limpo Paulista, Itupeva e região SP.";
    let jsonLd: any = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://korenexus.com.br/#website",
          "url": "https://korenexus.com.br",
          "name": "KoreNexus",
          "description": "Desenvolvimento de softwares corporativos, ERPs industriais e aplicativos nativos em Jundiaí, Várzea Paulista e SP.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://korenexus.com.br/?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "LocalBusiness",
          "@id": "https://korenexus.com.br/#localbusiness",
          "name": "KoreNexus Soluções S.A.",
          "image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80",
          "url": "https://korenexus.com.br",
          "telephone": "+5511989387263",
          "priceRange": "$$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Av. Nove de Julho",
            "addressLocality": "Jundiaí",
            "addressRegion": "SP",
            "postalCode": "13208-001",
            "addressCountry": "BR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-23.1857",
            "longitude": "-46.8892"
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
            "opens": "08:00",
            "closes": "18:00"
          },
          "sameAs": [
            "https://www.instagram.com/ohanny.mio?igsh=MTltdTZ0NmUzMTRqMQ==",
            "https://play.google.com/store/apps/dev?id=6542761157221666576&pli=1",
            "https://github.com/SANTZSPAXX"
          ]
        },
        {
          "@type": "FAQPage",
          "@id": "https://korenexus.com.br/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "O que é o Kflow AI e como ele se integra ao meu sistema atual?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "O Kflow AI é o motor de inteligência artificial neural desenvolvido sob medida pela KoreNexus. Ele opera como um middleware seguro que conecta seus ERPs, sistemas de cobrança e canais de relacionamento (como WhatsApp, e-mail e CRMs), automatizando triagens complexas de faturamento e geração de documentos de maneira imediata."
              }
            },
            {
              "@type": "Question",
              "name": "Os softwares desenvolvidos pela KoreNexus contam com segurança e conformidade LGPD?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sim, absolutamente. Toda nossa infraestrutura nativa em contêineres e bancos de dados isolados implementa criptografia ponta a ponta (SSL/TLS 1.3), Content Security Policy rígido, tokens JWT e em-tempo-real logs de auditorias imutáveis de tráfego que estão em estrito alinhamento com a Legislação Geral de Proteção de Dados (LGPD)."
              }
            },
            {
              "@type": "Question",
              "name": "A KoreNexus desenvolve integrações diretas com a Sefaz para emissão de Notas Fiscais?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sim, somos especialistas em automação fiscal sênior. Criamos robôs (RPA) e integradores síncronos de APIs para envio de XMLs, validações complexas, cartas de correção e download automático de notas emitidas contra o CNPJ integrado diretamente na Receita Federal."
              }
            },
            {
              "@type": "Question",
              "name": "Posso gerenciar o banco de dados de produtos e aplicativos do site?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sim, fornecemos uma interface administrativa completa (protegida por controle de acesso por e-mail no rodapé em Painel de Controle de Planilhas) para que você conecte suas planilhas integradas ou visualize os dados gerados em tempo real de forma amigável."
              }
            },
            {
              "@type": "Question",
              "name": "Quanto tempo leva o desenvolvimento de um ERP completo sob medida?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "O cronograma varia conforme o tamanho da sua operação e o número de microsserviços integrados. Normalmente, um protótipo conceitual funcional é entregue em até 15 dias úteis, e o sistema principal de alta usabilidade fica disponível em produção em até 45 dias úteis."
              }
            }
          ]
        }
      ]
    };

    if (selectedProduct) {
      resolvedTitle = `${selectedProduct.nome} | Sistema ERP sob Medida em Jundiaí e Várzea Paulista`;
      resolvedDesc = `${selectedProduct.descricao || "Descubra os detalhes técnicos de nosso sistema sob medida estruturado para indústrias e cooperativas em Jundiaí, Várzea Paulista e SP."} Categoria: ${selectedProduct.categoria}.`;
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
      resolvedTitle = `${selectedTool.nome} | Ferramenta e Validador Digital KoreNexus`;
      resolvedDesc = `Conheça a ferramenta ${selectedTool.nome} para otimização de fluxos Sefaz, DevOps e integrações para empresas em Jundiaí, Várzea Paulista e todo o interior de São Paulo.`;
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": selectedTool.nome,
        "operatingSystem": "All",
        "applicationCategory": "BusinessApplication",
        "browserRequirements": "Requires JavaScript. Requires HTML5."
      };
    } else if (selectedApp) {
      resolvedTitle = `${selectedApp.nome} | Criação de App Mobile em Jundiaí e Várzea Paulista`;
      resolvedDesc = `Aplicativo Mobile ${selectedApp.nome} desenvolvido sob medida pela KoreNexus para ${selectedApp.plataforma}. Detalhes de alta usabilidade: ${selectedApp.descricao}.`;
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "MobileApplication",
        "name": selectedApp.nome,
        "operatingSystem": selectedApp.plataforma,
        "applicationCategory": "BusinessApplication"
      };
    } else if (selectedPost && activeTab === "blog") {
      resolvedTitle = `${selectedPost.titulo} | Blog Técnico KoreNexus`;
      resolvedDesc = selectedPost.resumo || "Artigo analítico sobre engenharia de software estrutural, de sistemas industriais e inteligência de negócios em Jundiaí.";
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
      resolvedTitle = "Documentação de Sistemas e Integração de APIs | KoreNexus";
      resolvedDesc = "Acesse especificações de software, tutoriais de segurança cibernética e recursos de acoplamento de microsserviços rápidos criados pela KoreNexus em Jundiaí, SP.";
    } else if (isPrivPage) {
      resolvedTitle = "Diretrizes de Privacidade e RGPD/LGPD | KoreNexus";
      resolvedDesc = "Nossa política estrita de controle, criptografia SSL e governança de dados integrados na nuvem em conformidade com as leis vigentes no Brasil.";
    } else {
      // Base tab titles with local SEO elements targeting Jundiaí & Várzea Paulista
      const tabTitleMap: Record<string, string> = {
        inicio: "KoreNexus | Softwares sob Medida, ERP & IA em Jundiaí e Várzea Paulista",
        produtos: "Sistemas ERP sob Medida e Gestão Industrial em Jundiaí e Várzea | KoreNexus",
        kagenda: "Agendamento Online Corporativo | Jundiaí, Várzea e Campo Limpo | Kagenda",
        kflow: "Kflow AI | Robôs de Automação e RPA em Jundiaí e Região SP",
        ferramentas: "Ferramentas Sefaz, Validadores e DevOps sob Medida | KoreNexus",
        apps: "Criação de Apps iOS e Android em Jundiaí e Várzea Paulista | KoreNexus",
        chatkore: "ChatKore | Atendimento Automatizado com IA em Jundiaí e Região",
        promocoes: "Descontos de Cupom para Desenvolvimento de Sistemas e TI Jundiaí | KoreNexus",
        apis: "Catálogo de APIs e Integração de Sistemas Rápidos | KoreNexus",
        status: "Monitoramento de Estabilidade e SLA de Sistemas | KoreNexus",
        blog: "Blog Kflow | Inovações, Robótica Industrial e Tecnologia em Jundiaí",
        sobre: "Fábrica de Software e Consultoria de TI em Jundiaí e Várzea | KoreNexus",
        cursos: "Cursos de Programação, ERP e Tecnologia em Jundiaí e Várzea | KoreNexus",
      };

      const tabDescMap: Record<string, string> = {
        inicio: "A KoreNexus desenvolve soluções digitais, ERPs industriais e aplicativos móveis sob medida para empresas de Jundiaí, Várzea Paulista, Campo Limpo Paulista, Itupeva e região. Otimize processos com suporte local de excelência.",
        produtos: "Prateleira completa de sistemas ERP e soluções operacionais personalizadas para indústrias, comércios e prestadores de serviços de Jundiaí, Várzea Paulista, Campo Limpo Paulista e todo o estado de SP.",
        kagenda: "Sistema de agendamento online corporativo de alta escalabilidade. Conecte clientes com sua equipe de forma fácil em Jundiaí, Várzea Paulista, Itupeva e região paulista.",
        kflow: "Criação de robôs virtuais auto-gerenciáveis (RPA) para integrar sistemas legados ou gerar conhecimento automático para empresas na região metropolitana de Jundiaí.",
        ferramentas: "Validadores e motores fiscais rápidos integrados. DevOps, consultas e utilitários sob medida criados pela KoreNexus.",
        apps: "Fábrica de aplicativos móveis nativos e híbridos de alta confiabilidade em Jundiaí, Várzea Paulista, Campo Limpo Paulista, Cabreúva, Louveira, Itupeva e SP.",
        chatkore: "Assistente de vendas automatizado e integrado. Conecte o ChatKore ao seu sistema em Jundiaí, Várzea e simplifique o atendimento ao cliente.",
        promocoes: "Aproveite cupons de desconto exclusivos para contratação e desenvolvimento de sistemas sob medida e consultorias corporativas.",
        apis: "Consulte nosso catálogo público de microsserviços rápidos e APIs integradas de alta performance para faturamento, CEP, CNPJ e validações.",
        status: "Verifique o status operacional de toda a estrutura de sistemas corporativos hospedados pela KoreNexus. Transparência de uptime 24/7.",
        blog: "Artigos científicos, análises de mercado sobre desenvolvimento de software, automações industriais e inteligência artificial aplicadas ao crescimento de negócios em Jundiaí, Várzea Paulista, Campo Limpo Paulista e região.",
        sobre: "Conheça a engenharia por trás da KoreNexus. Somos seu parceiro local confiável em Jundiaí, Várzea Paulista e região metropolitana para o desenvolvimento de softwares rápidos, integridade técnica e alta usabilidade.",
        cursos: "Formações completas e treinamentos práticos de ERP, APIs e automações Sefaz. Certificações profissionais sob a metodologia corporativa KoreNexus em Jundiaí, SP.",
      };

      if (activeTab && tabTitleMap[activeTab]) {
        resolvedTitle = tabTitleMap[activeTab];
      }
      if (activeTab && tabDescMap[activeTab]) {
        resolvedDesc = tabDescMap[activeTab];
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
    const safePath = window.location.pathname === "/" ? "" : window.location.pathname;
    canonicalLink.setAttribute("href", "https://korenexus.com.br" + safePath);

    // Hreflang Tags (Acessibilidade e SEO Multilingue)
    let hreflangPt = document.querySelector('link[hreflang="pt-br"]');
    if (!hreflangPt) {
      hreflangPt = document.createElement("link");
      hreflangPt.setAttribute("rel", "alternate");
      hreflangPt.setAttribute("hreflang", "pt-br");
      document.head.appendChild(hreflangPt);
    }
    hreflangPt.setAttribute("href", "https://korenexus.com.br" + safePath);

    let hreflangDefault = document.querySelector('link[hreflang="x-default"]');
    if (!hreflangDefault) {
      hreflangDefault = document.createElement("link");
      hreflangDefault.setAttribute("rel", "alternate");
      hreflangDefault.setAttribute("hreflang", "x-default");
      document.head.appendChild(hreflangDefault);
    }
    hreflangDefault.setAttribute("href", "https://korenexus.com.br" + safePath);

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
  const [selectedApiTab, setSelectedApiTab] = useState<string>("public_apis");

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
            {renderNavButton("cursos", "Cursos", <GraduationCap className="h-3.5 w-3.5" />)}
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
            {renderNavButton("cursos", "Cursos", <GraduationCap className="h-3.5 w-3.5" />)}
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
                  <InicioPage activeTab={activeTab} setActiveTab={setActiveTab} />
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

            {activeTab === "cursos" && (
              <motion.div
                key="cursos"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 py-6"
              >
                <CursosPage />
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

          {activeTab !== "inicio" && activeTab !== "cursos" && activeTab !== "admin-dashboard" && !isDocPage && !isPrivPage && !selectedProduct && !selectedTool && !selectedApp && (!selectedPost || activeTab !== "blog") && (
            <div className="mt-12">
              <FaqSection pageId={activeTab} />
            </div>
          )}
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
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
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
              <li>
                <a 
                  href="https://play.google.com/store/apps/dev?id=6542761157221666576&pli=1" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-400 font-semibold text-left flex items-center gap-1.5 w-full hover:underline"
                >
                  <Smartphone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>KoreNexus na Google Play</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.instagram.com/ohanny.mio?igsh=MTltdTZ0NmUzMTRqMQ==" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-pink-400 font-semibold text-left flex items-center gap-1.5 w-full hover:underline"
                >
                  <Instagram className="h-3.5 w-3.5 text-pink-400 shrink-0" />
                  <span>Siga no Instagram (@ohanny.mio)</span>
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

        {/* INTERACTIVE COMPONENT: Human-Visible Footer Accordions (Sitemap, Soluções, Cobertura) */}
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-900/60 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold mb-1">
                Explore a Infraestrutura KoreNexus
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans max-w-2xl">
                Navegação expandida estruturada tanto para clientes quanto para auditorias técnicas de rastreamento. Clique nos títulos abaixo para expandir.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-505 bg-indigo-550 bg-indigo-500 animate-pulse"></span>
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">Acesso Regional síncrono</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* Accordion 1: Sitemap HTML */}
            <div className="bg-[#080b12] border border-gray-900 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:border-indigo-950">
              <button
                onClick={() => setFooterSitemapOpen(!footerSitemapOpen)}
                className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer select-none font-sans group focus:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg transition-colors ${footerSitemapOpen ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-950/60 text-slate-500"}`}>
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-200 block group-hover:text-white transition-colors">Sitemap HTML - Navegação</span>
                    <span className="text-[9px] text-slate-500 font-mono block">Atalhos dinâmicos do portal</span>
                  </div>
                </div>
                <div className={`text-slate-400 p-1 rounded-md transition-transform duration-300 ${footerSitemapOpen ? "rotate-90 text-indigo-400" : ""}`}>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {footerSitemapOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 pb-5 pt-2 text-xs text-gray-400 leading-relaxed font-sans border-t border-gray-950 bg-slate-950/20">
                      <nav className="grid grid-cols-2 gap-2 text-[10.5px]">
                        {[
                          { n: "Início", link: "/" },
                          { n: "Produtos ERP", link: "#" },
                          { n: "Agenda Comercial", link: "#" },
                          { n: "Console Kflow", link: "#" },
                          { n: "Ferramentas Sefaz", link: "#" },
                          { n: "Aplicativos Móveis", link: "#" },
                          { n: "Chatbot IA ChatKore", link: "#" },
                          { n: "Promoções & Cupons", link: "#" },
                          { n: "Integrações & APIs", link: "#" },
                          { n: "Blog de Engenharia", link: "#" },
                          { n: "Sobre a KoreNexus", link: "#" }
                        ].map((m, idx) => (
                          <a
                            key={idx}
                            href={m.link}
                            onClick={(e) => {
                              // If it matches a view setting, we can handle it
                              if (m.n === "Produtos ERP") { setSelectedProduct(null); setSelectedTool(null); setSelectedApp(null); setSelectedPost(null); setIsDocPage(false); setIsPrivPage(false); setActiveTab("produtos"); window.scrollTo({ top: 0, behavior: "smooth" }); e.preventDefault(); }
                              else if (m.n === "Agenda Comercial") { setSelectedProduct(null); setSelectedTool(null); setSelectedApp(null); setSelectedPost(null); setIsDocPage(false); setIsPrivPage(false); setActiveTab("agenda"); window.scrollTo({ top: 0, behavior: "smooth" }); e.preventDefault(); }
                              else if (m.n === "Console Kflow") { setSelectedProduct(null); setSelectedTool(null); setSelectedApp(null); setSelectedPost(null); setIsDocPage(false); setIsPrivPage(false); setActiveTab("console"); window.scrollTo({ top: 0, behavior: "smooth" }); e.preventDefault(); }
                              else if (m.n === "Ferramentas Sefaz") { setSelectedProduct(null); setSelectedTool(null); setSelectedApp(null); setSelectedPost(null); setIsDocPage(false); setIsPrivPage(false); setActiveTab("ferramentas"); window.scrollTo({ top: 0, behavior: "smooth" }); e.preventDefault(); }
                              else if (m.n === "Aplicativos Móveis") { setSelectedProduct(null); setSelectedTool(null); setSelectedApp(null); setSelectedPost(null); setIsDocPage(false); setIsPrivPage(false); setActiveTab("apps"); window.scrollTo({ top: 0, behavior: "smooth" }); e.preventDefault(); }
                              else if (m.n === "Chatbot IA ChatKore") { setSelectedProduct(null); setSelectedTool(null); setSelectedApp(null); setSelectedPost(null); setIsDocPage(false); setIsPrivPage(false); setActiveTab("chatkore"); window.scrollTo({ top: 0, behavior: "smooth" }); e.preventDefault(); }
                              else if (m.n === "Promoções & Cupons") { setSelectedProduct(null); setSelectedTool(null); setSelectedApp(null); setSelectedPost(null); setIsDocPage(false); setIsPrivPage(false); setActiveTab("promocoes"); window.scrollTo({ top: 0, behavior: "smooth" }); e.preventDefault(); }
                              else if (m.n === "Blog de Engenharia") { setSelectedProduct(null); setSelectedTool(null); setSelectedApp(null); setSelectedPost(null); setIsDocPage(false); setIsPrivPage(false); setActiveTab("blog"); window.scrollTo({ top: 0, behavior: "smooth" }); e.preventDefault(); }
                              else if (m.n === "Sobre a KoreNexus") { setSelectedProduct(null); setSelectedTool(null); setSelectedApp(null); setSelectedPost(null); setIsDocPage(false); setIsPrivPage(false); setActiveTab("sobre"); window.scrollTo({ top: 0, behavior: "smooth" }); e.preventDefault(); }
                              else if (m.n === "Início") { setSelectedProduct(null); setSelectedTool(null); setSelectedApp(null); setSelectedPost(null); setIsDocPage(false); setIsPrivPage(false); setActiveTab("inicio"); window.scrollTo({ top: 0, behavior: "smooth" }); e.preventDefault(); }
                            }}
                            className="p-1 px-2 rounded hover:bg-indigo-500/10 text-slate-400 hover:text-white transition duration-150 flex items-center gap-1.5 border border-transparent hover:border-indigo-950/50"
                          >
                            <span className="text-indigo-450 text-indigo-400 text-[10px]">●</span>
                            <span>{m.n}</span>
                          </a>
                        ))}
                      </nav>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2: Índice de Soluções */}
            <div className="bg-[#080b12] border border-gray-900 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:border-emerald-950">
              <button
                onClick={() => setFooterIndiceOpen(!footerIndiceOpen)}
                className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer select-none font-sans group focus:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg transition-colors ${footerIndiceOpen ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-950/60 text-slate-500"}`}>
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-200 block group-hover:text-white transition-colors">Índice de Soluções</span>
                    <span className="text-[9px] text-slate-500 font-mono block">Módulos ERP e Microsserviços</span>
                  </div>
                </div>
                <div className={`text-slate-400 p-1 rounded-md transition-transform duration-300 ${footerIndiceOpen ? "rotate-90 text-emerald-400" : ""}`}>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {footerIndiceOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 pb-5 pt-2 text-xs text-gray-400 leading-relaxed font-sans border-t border-gray-950 bg-slate-950/20 space-y-3">
                      <div>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-1.5">Sistemas Pivotais:</span>
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <div className="p-1 px-2 bg-slate-950/45 rounded border border-gray-900 text-slate-300"><strong className="text-slate-200">KoreERP:</strong> Recursos Sênior</div>
                          <div className="p-1 px-2 bg-slate-950/45 rounded border border-gray-900 text-slate-300"><strong className="text-slate-200">KoreCRM:</strong> Funil e Lead</div>
                          <div className="p-1 px-2 bg-slate-950/45 rounded border border-gray-900 text-slate-300"><strong className="text-slate-200">KoreFlow:</strong> RPA Sefaz</div>
                          <div className="p-1 px-2 bg-slate-950/45 rounded border border-gray-900 text-slate-300"><strong className="text-slate-200">KoreAnalytics:</strong> BI Dinâmico</div>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1.5">Módulos Nativos:</span>
                        <div className="grid grid-cols-3 gap-1 text-[9px] font-mono">
                          {["KoreValid", "KoreCalc", "KoreDeploy", "KoreToken", "KoreCollector", "KoreSales"].map(m => (
                            <span key={m} className="p-1 bg-slate-950/30 rounded border border-gray-950 text-slate-400 text-center">{m}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 3: Cobertura de Consultoria */}
            <div className="bg-[#080b12] border border-gray-900 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:border-blue-950">
              <button
                onClick={() => setFooterCoberturaOpen(!footerCoberturaOpen)}
                className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer select-none font-sans group focus:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg transition-colors ${footerCoberturaOpen ? "bg-blue-500/10 text-blue-400" : "bg-slate-950/60 text-slate-500"}`}>
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-200 block group-hover:text-white transition-colors">Cobertura Regional SP</span>
                    <span className="text-[9px] text-slate-500 font-mono block">Cidades e Atendimento In-Loco</span>
                  </div>
                </div>
                <div className={`text-slate-400 p-1 rounded-md transition-transform duration-300 ${footerCoberturaOpen ? "rotate-90 text-blue-400" : ""}`}>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {footerCoberturaOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 pb-5 pt-2 text-xs text-gray-400 leading-relaxed font-sans border-t border-gray-950 bg-slate-950/20 space-y-2">
                      {[
                        { c: "Jundiaí - SP", d: "Sistemas corporativos, ERP inteligível e automação comercial no Distrito Industrial." },
                        { c: "Várzea Paulista", d: "Fábrica de software, soluções integradoras Sefaz e auditoria fiscal de processos." },
                        { c: "Campo Limpo Paulista", d: "Mobile híbrido iOS/Android com sincronização de banco de dados SQLite." },
                        { c: "Itupeva & Cabreúva", d: "Modernização e transição de planilhas locais para cloud PostgreSQL." },
                        { c: "Louveira & Vinhedo", d: "APIs e robôs de conferência em tempo real de notas emitidas." }
                      ].map((item, idx) => (
                        <div key={idx} className="p-1.5 bg-slate-950/45 rounded border border-gray-900/60">
                          <strong className="text-[10px] text-slate-200 block">{item.c}</strong>
                          <p className="text-[9.5px] text-slate-550 text-slate-400 leading-tight font-sans mt-0.5">{item.d}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/*
          HIDDEN SEARCH ENGINE OPTIMIZATION DIRECTORY (Visually Invisible for normal users, fully indexed by Googlebot / Bingbot)
          Estreita sintonia de links internos para garantir o Rank Top 1 do site da KoreNexus no Google.
        */}
        <div 
          id="korenexus-seo-crawler-vault"
          aria-hidden="false" 
          style={{ 
            position: 'absolute', 
            width: '1px', 
            height: '1px', 
            padding: '0', 
            margin: '-1px', 
            overflow: 'hidden', 
            clip: 'rect(0, 0, 0, 0)', 
            whiteSpace: 'nowrap', 
            border: '0' 
          }}
        >
          {/* Sitemap HTML - Navegação */}
          <nav>
            <h3>Sitemap HTML - Navegação KoreNexus</h3>
            <ul>
              <li><a href="https://korenexus.com.br/">Início</a></li>
              <li><a href="https://korenexus.com.br/produtos">Produtos ERP</a></li>
              <li><a href="https://korenexus.com.br/ferramentas">Agenda Comercial</a></li>
              <li><a href="https://korenexus.com.br/apps">Console Kflow</a></li>
              <li><a href="https://korenexus.com.br/ferramentas">Ferramentas Sefaz</a></li>
              <li><a href="https://korenexus.com.br/apps">Aplicativos Móveis</a></li>
              <li><a href="https://korenexus.com.br/chatkore">Chatbot IA ChatKore</a></li>
              <li><a href="https://korenexus.com.br/promocoes">Promoções & Cupons</a></li>
              <li><a href="https://korenexus.com.br/apis">Integrações & APIs</a></li>
              <li><a href="https://korenexus.com.br/status">Uptime do Servidor</a></li>
              <li><a href="https://korenexus.com.br/blog">Blog de Engenharia</a></li>
              <li><a href="https://korenexus.com.br/sobre">Sobre a KoreNexus</a></li>
            </ul>
          </nav>

          {/* Índice de Soluções */}
          <section>
            <h2>Índice de Soluções Digitais KoreNexus</h2>
            
            <div>
              <h3>Sistemas Corporativos</h3>
              <ul>
                <li><strong>KoreERP ERP</strong> - Gestão de recursos empresariais integrada em tempo real.</li>
                <li><strong>KoreCRM ERP</strong> - Monitoramento ativo de funil de vendas e faturamento automatizado.</li>
                <li><strong>KoreFlow ERP</strong> - Motor neural e fluxo de robôs integradores RPA.</li>
                <li><strong>KoreAnalytics ERP</strong> - Inteligência analítica de negócios e relatórios síncronos.</li>
              </ul>
            </div>

            <div>
              <h3>Utilitários e Aplicativos</h3>
              <ul>
                <li><strong>KoreValid</strong> - Validador estrutural e integridade fiscal Sefaz sênior.</li>
                <li><strong>KoreCalc</strong> - Motor inteligente de cálculo de tributos fiscais.</li>
                <li><strong>KoreDeploy</strong> - Microsserviço de automação de faturamento integrado.</li>
                <li><strong>KoreToken</strong> - Criptografia ponta a ponta e governança SSL.</li>
                <li><strong>KoreCollector</strong> - Coletor offline de estoque híbrido com banco sqlite.</li>
                <li><strong>KoreSales</strong> - Força de vendas móvel para otimização faturamento.</li>
                <li><strong>KoreDelivery</strong> - Sincronização automatizada e roteirizador regional de entregas.</li>
              </ul>
            </div>
          </section>

          {/* Suporte & Governança de Cobertura Regional */}
          <section>
            <h2>Cobertura de Consultoria e Fábrica de Software em São Paulo (SP)</h2>
            <article>
              <h3>Jundiaí - SP</h3>
              <p>Sistemas corporativos, ERP de manufatura, integração com esteiras industriais e automação comercial para o vetor oeste.</p>
            </article>
            <article>
              <h3>Várzea Paulista - SP</h3>
              <p>Fábrica de software local, soluções fiscais Sefaz, acompanhamento operacional presencial e segurança de conexões corporativas.</p>
            </article>
            <article>
              <h3>Campo Limpo Paulista</h3>
              <p>Aplicativos comerciais híbridos iOS & Android, sincronização em banco de dados SQLite nativo e roteirizadores eficientes.</p>
            </article>
            <article>
              <h3>Itupeva & Cabreúva</h3>
              <p>Modernização de soluções legadas, migração de planilhas para a nuvem sob medida para centros de distribuição logística.</p>
            </article>
            <article>
              <h3>Louveira, Cajamar & Vinhedo</h3>
              <p>Implantação de APIs integradas (Gemini AI, OpenAI) para auditoria automatizada de notas e rotas de conferência em tempo real.</p>
            </article>
          </section>

          {/* Tags de Rankeamento */}
          <footer>
            <h2>Tags de Rankeamento do Google e Bing</h2>
            <ul>
              <li>#Softwares Jundiaí</li>
              <li>#Sistemas sob Medida Várzea Paulista</li>
              <li>#ERP Jundiaí</li>
              <li>#Desenvolvedora Várzea</li>
              <li>#Criação de Apps Jundiaí</li>
              <li>#Consultoria TI Campo Limpo Paulista</li>
              <li>#Programador Jundiaí</li>
              <li>#Empresa de TI Louveira</li>
              <li>#Fatura Sefaz SP</li>
              <li>#Automação Industrial Jundiaí</li>
              <li>#Suporte Tecnológico Várzea Paulista</li>
            </ul>
          </footer>
        </div>

        {/* Copywrite bar */}
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-900/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-[10px] text-gray-500 font-mono">
            © 2026 KoreNexus Soluções S.A. CNPJ sob medida. Todos os direitos reservados.
          </p>
          <div className="text-[10px] text-gray-500 font-mono flex items-center gap-3">
            <span>Servidor Estável (HTTPS)</span>
            <span>•</span>
            <a 
              href={`${typeof window !== "undefined" ? window.location.origin : ""}/robots.txt`} 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-white transition underline"
            >
              Robots.txt
            </a>
            <span>•</span>
            <a 
              href={`${typeof window !== "undefined" ? window.location.origin : ""}/sitemap.xml`} 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-white transition underline"
            >
              Sitemap.xml
            </a>
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
