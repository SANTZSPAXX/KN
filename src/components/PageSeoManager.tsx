import { useEffect } from "react";

interface PageSeoManagerProps {
  activeTab: string;
  ferramentasSubTab?: "fiscais" | "sandbox" | "fifty" | "gqcode";
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
  ferramentasSubTab,
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
    else if (activeTab === "ferramentas" && ferramentasSubTab) path = `ferramentas/${ferramentasSubTab}`;
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

    if (activeTab === "ferramentas") {
      if (selectedTool) {
        title = `${selectedTool.nome} | Ferramenta Gratuita KoreNexus`;
        desc = `Use nossa ferramenta online ${selectedTool.nome} para validar, testar XML, auditar dados de Sefaz e otimizar processos computacionais corporativos.`;
        h1 = `Ferramenta de Diagnóstico: ${selectedTool.nome}`;
        h2List = [
          "Instruções Passo a Passo de Execução Rápida",
          "Segurança de Dados sob Proteção SSL e Criptografia",
          "Funcionalidades Integradas do Barramento KoreNexus"
        ];
      } else {
        const subTab = ferramentasSubTab || "fiscais";
        if (subTab === "fiscais") {
          title = "Formatadores & Validadores Fiscais Sefaz | KoreNexus";
          desc = "Validador gratuito de notas fiscais Sefaz, checagem de XML e cálculos financeiros operacionais em segundos. Otimize seus fluxos de faturamento com KoreNexus.";
          h1 = "Ferramentas de Desenvolvimento e Infraestrutura Fiscal";
          h2List = [
            "Validadores de Arquivos XML de Alta Performance",
            "Calculadora de Margas Financeiras KoreCalc",
            "Automação e Transmissão Síncrona Registrada"
          ];
        } else if (subTab === "sandbox") {
          title = "Simuladores Sandbox & Playgrounds de Integração | KoreNexus";
          desc = "Playground de desenvolvimento para desenvolvedores: simulação de chaves NFe, decodificador de tokens JWT, testador de expressões regulares e payloads fiscais.";
          h1 = "Ambiente de Testes e Sandbox Independente";
          h2List = [
            "Decodificador de JWT em Tempo de Execução",
            "Testador de Expressões Regulares RegEx",
            "Playground de APIs e Retornos Síncronos"
          ];
        } else if (subTab === "fifty") {
          title = "50 Super Ferramentas de Produtividade, SEO & Documentos | KoreNexus";
          desc = "Acesse gratuitamente mais de 50 micro-ferramentas funcionais de alta performance: gerador de currículos, encurtador de links, analisador de SEO e utilitários.";
          h1 = "⚡ 50 Super Ferramentas de Alta Performance";
          h2List = [
            "Gerador de Currículo e Contratos de Serviço",
            "Encurtador de Link Inteligente e Monitorado",
            "Ferramenta Avançada de Auditoria de Conteúdo e SEO"
          ];
        } else if (subTab === "gqcode") {
          title = "Gerador de QR Code & Pix Estático/Dinâmico | KoreNexus";
          desc = "Gere códigos QR de alta densidade e códigos Pix em conformidade com as diretrizes do Banco Central do Brasil para automação de pagamentos industriais.";
          h1 = "📷 Gerador de QR Code & Pix para Automação";
          h2List = [
            "Geração de Códigos Estáticos de Acesso Instantâneo",
            "Códigos Pix Dinâmicos com Payload do Banco Central",
            "Sincronização Direta de Check-outs de Faturamento"
          ];
        }
      }
    } else if (activeTab === "chatbots") {
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
    const isFerramentas = activeTab === "ferramentas" || selectedTool;
    
    if (isFerramentas) {
      let appName = "";
      let appDesc = "";
      let appVersion = "1.0.0";
      let appReq = "Acesso à Internet, Navegador moderno compatível com padrões ES6+.";
      let appCategory = "UtilityApplication";
      
      if (selectedTool) {
        appName = selectedTool.nome;
        appDesc = selectedTool.utilidade || seoInfo.desc;
        const verNum = selectedTool.id ? selectedTool.id.replace(/\D/g, '') : '1';
        appVersion = `1.${verNum || '0'}.0`;
        appCategory = selectedTool.tipo === "Fintech" ? "BusinessApplication" : selectedTool.tipo === "DevOps" ? "DeveloperApplication" : "UtilityApplication";
        appReq = "Navegador moderno com suporte a JavaScript do lado do cliente (ES6+) e conexão de dados segura.";
      } else {
        const subTab = ferramentasSubTab || "fiscais";
        if (subTab === "fiscais") {
          appName = "KoreValid / KoreCalc - Formatadores & Fiscais Sefaz";
          appDesc = "Suite de utilitários e validadores automáticos para notas fiscais XML (Sefaz), geradores de chave de acesso de faturamento e conversores operacionais síncronos integrados.";
          appVersion = "3.2.0";
          appCategory = "BusinessApplication";
          appReq = "Navegador moderno Chrome/Firefox/Edge com suporte a JavaScript e conexão de rede segura HTTPS.";
        } else if (subTab === "sandbox") {
          appName = "Kflow Sandbox - Simuladores de API & Integrações";
          appDesc = "Parque de testes e simuladores interativos para decodificação de Tokens JWT, validação de expressões regulares (RegEx), playground de payloads de faturamento e simulação de integridades.";
          appVersion = "1.8.5";
          appCategory = "DeveloperApplication";
          appReq = "Navegador Web com suporte a ES6+, suporte a Session Storage ou Cookies para retenção de sessão.";
        } else if (subTab === "fifty") {
          appName = "UtilityHub - 50 Super Ferramentas de Produtividade";
          appDesc = "Hub completo contendo 50 micro-ferramentas funcionais de alta performance para otimização de SEO de conteúdo, geradores de currículos e contratos rápidos, conversores e utilitários cotidianos.";
          appVersion = "2.1.0";
          appCategory = "UtilityApplication";
          appReq = "Acesso à Internet e navegador Web moderno compatível com HTML5 e CSS3.";
        } else if (subTab === "gqcode") {
          appName = "KoreQR - Gerador de QR Code & Pix";
          appDesc = "Gerador integrado de códigos QR otimizados de alta densidade e códigos Pix em conformidade estrita com as especificações técnicas de faturamento do Banco Central (BC).";
          appVersion = "1.5.0";
          appCategory = "BusinessApplication";
          appReq = "Dispositivo com câmera ou scanner de QR Code para leitura física, além de navegador web compatível com renderização de elementos SVG.";
        }
      }
      
      return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": appName,
        "description": appDesc,
        "url": friendlyUrl,
        "operatingSystem": "All",
        "applicationCategory": appCategory,
        "softwareVersion": appVersion,
        "softwareRequirements": appReq,
        "requirements": appReq,
        "inLanguage": "pt-BR",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "BRL"
        },
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
        }
      };
    }

    const isGnews = selectedPost?.id?.startsWith("gnews-");
    const pubDate = isGnews && selectedPost.publishedAt ? selectedPost.publishedAt : "2026-06-22T08:00:00-03:00";

    return {
      "@context": "https://schema.org",
      "@type": selectedPost ? "BlogPosting" : selectedProduct ? "Product" : "WebPage",
      "name": seoInfo.title,
      "description": seoInfo.desc,
      "url": friendlyUrl,
      "inLanguage": "pt-BR",
      "datePublished": pubDate,
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

    // Dynamic Helper to build and update metatags including OpenGraph
    const updateMetaTag = (attrName: "name" | "property", attrValue: string, contentValue: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attrName, attrValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", contentValue);
    };

    // OpenGraph Integration
    updateMetaTag("property", "og:title", seoInfo.title);
    updateMetaTag("property", "og:description", seoInfo.desc);
    
    const ogImage = selectedPost?.image || selectedPost?.imagem || "/src/assets/images/tech_banner_3d_1781541496009.jpg";
    updateMetaTag("property", "og:image", ogImage);
    updateMetaTag("property", "og:url", friendlyUrl);
    updateMetaTag("property", "og:type", selectedPost ? "article" : "website");

    // Dynamic Original Publication Date injection for GNews and general blog posts
    const isGnewsPost = selectedPost?.id?.startsWith("gnews-");
    if (selectedPost) {
      const gnewsPubDate = isGnewsPost && selectedPost.publishedAt ? selectedPost.publishedAt : "2026-06-22T08:00:00-03:00";
      updateMetaTag("property", "article:published_time", gnewsPubDate);
    } else {
      const existingDateMeta = document.querySelector('meta[property="article:published_time"]');
      if (existingDateMeta) {
        existingDateMeta.remove();
      }
    }

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
  }, [activeTab, ferramentasSubTab, selectedProduct, selectedTool, selectedApp, selectedPost, seoInfo.title, seoInfo.desc, friendlyUrl, jsonLdString]);

  // Completely off-screen background execution
  return null;
}
