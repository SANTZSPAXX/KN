import { useEffect } from "react";

interface PageSeoManagerProps {
  activeTab: string;
  selectedProduct?: any;
  selectedTool?: any;
  selectedApp?: any;
  selectedPost?: any;
  isDocPage?: boolean;
  isPrivPage?: boolean;
  onNavigate?: (tabName: string) => void;
}

export default function PageSeoManager({
  activeTab,
  selectedProduct,
  selectedTool,
  selectedApp,
  selectedPost,
  isDocPage,
  isPrivPage,
  onNavigate
}: PageSeoManagerProps) {

  // Create friendly static URLs inside Brazil target domain
  const getFriendlySlug = () => {
    let base = "https://korenexus.com.br";
    if (activeTab === "inicio") return `${base}/`;
    if (isPrivPage) return `${base}/politica-de-privacidade`;
    if (isDocPage) return `${base}/documentacao-apis`;
    
    let path = activeTab;
    if (selectedProduct) path = `produtos/${selectedProduct.nome?.toLowerCase().replace(/\s+/g, "-")}`;
    else if (selectedTool) path = `ferramentas/${selectedTool.nome?.toLowerCase().replace(/\s+/g, "-")}`;
    else if (selectedApp) path = `aplicativos/${selectedApp.nome?.toLowerCase().replace(/\s+/g, "-")}`;
    else if (selectedPost) path = `blog/${selectedPost.titulo?.toLowerCase().replace(/\s+/g, "-")}`;
    
    return `${base}/${path}`;
  };

  const friendlyUrl = getFriendlySlug();

  // Dynamically resolve optimized Titles and Descriptions based on current page
  const resolvedSeoData = () => {
    let title = "KoreNexus Jundiaí | Sistemas Corporativos ERP, SaaS, WMS e Portaria";
    let desc = "Fábrica de tecnologia sob medida para automatizar sua infraoperação. Criamos portais SaaS, WMS Logística, ERP customizado, Portaria Inteligente e Segurança de Dados em Jundiaí.";
    let h1 = "Fábrica de Sistemas Corporativos, SaaS, WMS e Portaria";
    let h2List = [
      "Sistemas SaaS, ERP Integrado e Automações Mecânicas",
      "WMS Inteligente, Portarias com OCR e Controles Biofaciais",
      "Selo de Alta Segurança e Proteção de Dados LGPD"
    ];

    if (activeTab === "chatbots") {
      title = "Fábrica de Chatbots WhatsApp e Agentes de IA | KoreNexus";
      desc = "Automatize conversas com WhatsApp Web, assistentes de inteligência artificial de alta conversão, e fluxos de atendimento integrados no seu banco de dados local.";
      h1 = "Sistemas Avançados de Bots Inteligentes de Conversas";
      h2List = [
        "1. Monitor de Gatilhos e Respostas Cognitivas",
        "2. Banco de Dados Offline e Redução de Requisições IA",
        "3. Gestão e Relatórios Consolidados com Selo KoreNexus Security"
      ];
    } else if (activeTab === "portaria") {
      title = "Portaria Inteligente, Reconhecimento Facial & Controle de Pátio | KoreNexus";
      desc = "Sistema de portaria com OCR de placa, biometria facial, cadastro de frotas e monitoramento veicular em tempo real síncrono com seu faturamento fiscal.";
      h1 = "Automação Completa de Pátios de Carga e Acesso Bio-Facial";
      h2List = [
        "Segurança de Dados Físicos sob a LGPD Federal",
        "Controle de Chaves de Frotas de Carretas",
        "Integração do OCR de Placas com Envio de Eventos Sefaz"
      ];
    } else if (activeTab === "logistica") {
      title = "WMS Inteligente, Emissão de NF-e e Controle de Estoque | KoreNexus";
      desc = "Gere notas fiscais eletrônicas em lote, rastreie movimentações de armazém por QR Code e mantenha a conformidade fiscal do seu estoque industrial.";
      h1 = "WMS Síncrono e Auditor Fiscal Integrado para Sua Empresa";
      h2List = [
        "Monitoramento Estatístico Prontidão de Ressuprimento (SLA)",
        "Geração de Notas Fiscais Eletrônicas em Menos de 2 Segundos",
        "Previsibilidade de Logística Local em Jundiaí"
      ];
    } else if (activeTab === "diagnostico") {
      title = "Auditoria de ERP e Diagnóstico de Vazamento Financeiro | KoreNexus";
      desc = "Analise em menos de 3 minutos os gargalos e desperdícios de faturamento ocultos nos fluxos de logística e atendimento de ERPs lentos legados.";
      h1 = "Avaliação Clínica de Gargalos Operacionais e Margens";
      h2List = [
        "Mapeamento de Incoerências e Duplicidade Fiscais",
        "Roteiro de Automação Estruturada Gratuita",
        "Otimização de Retorno sobre Investimento de Softwares"
      ];
    } else if (activeTab === "sobre") {
      title = "Fábrica de Software e Engenharia de Tecnologia local | KoreNexus";
      desc = "Nossa meta é decolar o faturamento de empresas em Jundiaí por meio de aplicativos rápidos, integridade mecânica de bancos de dados e suporte 24/7 síncrono.";
      h1 = "Engenharia de Software de Alto Impacto e Integridade Local";
      h2List = [
        "Arquitetura Baseada em Tolerância a Falhas Computacionais",
        "Nossa Promessa de Resposta Física Local em Menos de 4 Horas",
        "Quem Apoia e Desenvolve Soluções Técnicas de Ponta"
      ];
    } else if (activeTab === "cursos") {
      title = "Cursos de Programação, Metodologia de ERP & Automação Sefaz | KoreNexus";
      desc = "Ganhe excelência em desenvolvimento corporativo, integração síncrona de APIs e emissão de lote fiscal no ecossistema técnico KoreNexus em Jundiaí.";
      h1 = "Capacitação Prática em Microsserviços e Processamento Fiscal";
      h2List = [
        "Treinamento de Barramento de APIs em Jundiaí",
        "Formações Executivas de Altura E-E-A-T do Google",
        "Certificação Oficial KoreNexus de Projetos Rápidos"
      ];
    } else if (selectedPost) {
      title = `${selectedPost.titulo} | Blog Kflow KoreNexus`;
      desc = `${selectedPost.resumo || "Aprenda sobre inovações industriais, robótica automatizada e as melhores tendências de IA para tracionar sua empresa paulista."}`;
      h1 = selectedPost.titulo;
      h2List = [
        "Descomplicando Problemas Fiscais Legados",
        "Metodologia para Aceleração Orgânica Comercial em Jundiaí",
        "Conclusão e Próximos Passos de Produtividade"
      ];
    } else if (selectedProduct) {
      title = `${selectedProduct.nome} | Sistemas Prontos de ERP KoreNexus`;
      desc = `Implante o módulo ${selectedProduct.nome} hoje mesmo para unificar estoque, ordens de serviços e faturamento seguro com suporte local em Várzea e Jundiaí.`;
      h1 = `Sistema Customizado de ${selectedProduct.nome}`;
      h2List = [
        "Benefícios da Integração Direta com ERP KoreNexus",
        "Compatibilidade Completa com Mobile e Desktop",
        "Faturamento Sob Medida e Ativação Rápida"
      ];
    } else if (selectedTool) {
      title = `${selectedTool.nome} | Ferramenta Gratuita KoreNexus`;
      desc = `Use nossa ferramenta online ${selectedTool.nome} para validar, testar XML, auditar dados de Sefaz e otimizar processos computacionais corporativos.`;
      h1 = `Ferramenta de Diagnóstico: ${selectedTool.nome}`;
      h2List = [
        "Instruções Passo a Passo de Execução Rápida",
        "Segurança de Dados sob Proteção SSL e Criptografia",
        "Funcionalidades Integradas do Barramento KoreNexus"
      ];
    } else if (selectedApp) {
      title = `Desenvolvimento do App ${selectedApp.nome} em Jundiaí | KoreNexus`;
      desc = `Criamos e publicamos o aplicativo ${selectedApp.nome} em lojas iOS e Android. Desempenho nativo com sincronia local offline e de alta retenção.`;
      h1 = `Construção de Aplicativos Mobile: ${selectedApp.nome}`;
      h2List = [
        "Usabilidade Avançada com Design Próprio Touch Target",
        "Armazenamento de Dados de Celular com SQLite e Cloud Sync",
        "Como Solicitar o Esboço do Seu App Gratuito"
      ];
    }

    return { title, desc, h1, h2List };
  };

  const seoInfo = resolvedSeoData();

  // JSON-LD dynamic construction for Rich Snippets google audit
  const getJsonLdSchema = () => {
    return {
      "@context": "https://schema.org",
      "@type": selectedPost ? "BlogPosting" : selectedProduct ? "Product" : "WebPage",
      "name": seoInfo.title,
      "description": seoInfo.desc,
      "url": friendlyUrl,
      "inLanguage": "pt-BR",
      "datePublished": "2026-06-22T08:00:00-03:00",
      "dateModified": new Date().toISOString().split("T")[0] + "T17:00:00-03:00",
      "author": {
        "@type": "Organization",
        "name": "KoreNexus Brasil",
        "url": "https://korenexus.com.br"
      },
      "publisher": {
        "@type": "Organization",
        "name": "KoreNexus Tecnologia",
        "logo": {
          "@type": "ImageObject",
          "url": "https://korenexus.com.br/assets/logo.svg"
        }
      },
      ...((selectedProduct || activeTab === "produtos") && {
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "BRL",
          "offerCount": "1",
          "price": "0",
          "priceValidUntil": "2027-12-31",
          "url": friendlyUrl
        }
      })
    };
  };

  const jsonLdString = JSON.stringify(getJsonLdSchema(), null, 2);

  // Dynamic Browser Tab Simulation Title & document header apply
  useEffect(() => {
    // Dynamic update browser title and meta description tag
    document.title = seoInfo.title;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", seoInfo.desc);

    // Apply viewport metadata if missing (SEO requirement)
    let metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      metaViewport = document.createElement("meta");
      metaViewport.setAttribute("name", "viewport");
      metaViewport.setAttribute("content", "width=device-width, initial-scale=1.0");
      document.head.appendChild(metaViewport);
    }

    // Apply dynamic Canonical Tag Link (SEO requirement)
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", friendlyUrl);

    // Dynamic injection of structured JSON-LD data inside Document Head for perfect crawler indexation
    let scriptTag = document.getElementById("korenexus-seo-jsonld") as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "korenexus-seo-jsonld";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = jsonLdString;

    // Ensure language declared (lang="pt-BR") on HTML elements
    document.documentElement.lang = "pt-BR";
  }, [activeTab, selectedProduct, selectedTool, selectedApp, selectedPost, seoInfo.title, seoInfo.desc, friendlyUrl, jsonLdString]);

  // Completely off-screen background execution
  return null;
}
