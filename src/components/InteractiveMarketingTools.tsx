import React, { useState, useEffect, useRef } from "react";
import { 
  CreditCard, 
  Link2, 
  FileSignature, 
  TrendingUp, 
  Search, 
  QrCode, 
  Percent, 
  ShieldAlert, 
  FileText, 
  Tv, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  DollarSign,
  Briefcase,
  Layers,
  Globe,
  Settings,
  AlertCircle
} from "lucide-react";

type ToolId = 
  | "business-card" 
  | "utm-shortener" 
  | "contract-gen" 
  | "compound-interest" 
  | "seo-analyzer" 
  | "custom-qr" 
  | "pricing-calculator" 
  | "privacy-terms" 
  | "readability-meter" 
  | "device-mockup";

interface MarketingToolMeta {
  id: ToolId;
  name: string;
  badge: string;
  category: "Negócios" | "Marketing" | "SEO" | "Finanças" | "Design";
  description: string;
  icon: React.ReactNode;
}

export default function InteractiveMarketingTools() {
  const [activeTool, setActiveTool] = useState<ToolId>("business-card");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, elementId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(elementId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // -------------------------------------------------------------
  // Tool 1: Business Card Generator States & Logic
  // -------------------------------------------------------------
  const [cardName, setCardName] = useState("Dra. Beatriz Mendes");
  const [cardRole, setCardRole] = useState("Head de Expansão Comercial");
  const [cardCompany, setCardCompany] = useState("KoreNexus Tech");
  const [cardEmail, setCardEmail] = useState("beatriz.mendes@korenexus.com.br");
  const [cardPhone, setCardPhone] = useState("+55 (11) 98765-4321");
  const [cardTheme, setCardTheme] = useState<"classic" | "cyberpunk" | "emerald" | "gold">("emerald");
  const [cardRotate, setCardRotate] = useState(false);

  // -------------------------------------------------------------
  // Tool 2: UTM Campaign Tracker States & Logic
  // -------------------------------------------------------------
  const [utmUrl, setUtmUrl] = useState("https://korenexus.com.br/planos");
  const [utmSource, setUtmSource] = useState("news");
  const [utmMedium, setUtmMedium] = useState("email");
  const [utmCampaign, setUtmCampaign] = useState("lancamento-kflow");
  const [utmTerm, setUtmTerm] = useState("ia-automacao");
  const [utmContent, setUtmContent] = useState("botao-cta-central");
  const [utmGeneratedUrl, setUtmGeneratedUrl] = useState("");
  const [utmSlug, setUtmSlug] = useState("kflow-email");
  const [utmHistory, setUtmHistory] = useState<Array<{ id: string; original: string; short: string; clicks: number }>>([
    { id: "1", original: "https://korenexus.com.br/planos?utm_source=news&utm_medium=email", short: "kore.link/kflow-email", clicks: 314 },
    { id: "2", original: "https://korenexus.com.br/chatkore?utm_source=instagram&utm_medium=stories", short: "kore.link/chat-ig", clicks: 189 }
  ]);

  useEffect(() => {
    try {
      const urlObj = new URL(utmUrl.startsWith("http") ? utmUrl : `https://${utmUrl}`);
      urlObj.searchParams.set("utm_source", utmSource);
      urlObj.searchParams.set("utm_medium", utmMedium);
      urlObj.searchParams.set("utm_campaign", utmCampaign);
      if (utmTerm) urlObj.searchParams.set("utm_term", utmTerm);
      if (utmContent) urlObj.searchParams.set("utm_content", utmContent);
      setUtmGeneratedUrl(urlObj.toString());
    } catch (e) {
      setUtmGeneratedUrl("");
    }
  }, [utmUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent]);

  const handleAddShortLink = () => {
    if (!utmGeneratedUrl) return;
    const newLink = {
      id: Date.now().toString(),
      original: utmGeneratedUrl,
      short: `kore.link/${utmSlug || "cli" + Math.floor(Math.random() * 1000)}`,
      clicks: 0
    };
    setUtmHistory([newLink, ...utmHistory]);
    setUtmSlug("");
  };

  const simulateClick = (id: string) => {
    setUtmHistory(utmHistory.map(item => item.id === id ? { ...item, clicks: item.clicks + 1 } : item));
  };

  // -------------------------------------------------------------
  // Tool 3: Service Contract Generator States & Logic
  // -------------------------------------------------------------
  const [contractContractor, setContractContractor] = useState("ALFA COMERCIAL LTDA");
  const [contractContractorDoc, setContractContractorDoc] = useState("12.345.678/0001-90");
  const [contractContractee, setContractContractee] = useState("KORENEXUS SISTEMAS LTDA");
  const [contractContracteeDoc, setContractContracteeDoc] = useState("55.119.893/0001-26");
  const [contractServiceName, setContractServiceName] = useState("Implementação de Fluxos de IA KoreNexus Kflow");
  const [contractValue, setContractValue] = useState("18500");
  const [contractInstallments, setContractInstallments] = useState("3");
  const [contractDurationMonths, setContractDurationMonths] = useState("6");
  const [signatureTyped, setSignatureTyped] = useState("Beatriz Mendes - CEO");

  // -------------------------------------------------------------
  // Tool 4: Compound Interest & Savings Simulator States & Logic
  // -------------------------------------------------------------
  const [simulationCapital, setSimulationCapital] = useState("5000");
  const [simulationAporte, setSimulationAporte] = useState("500");
  const [simulationTaxa, setSimulationTaxa] = useState("11.5"); // anual %
  const [simulationPeriodo, setSimulationPeriodo] = useState("5"); // anos
  const [simulationResults, setSimulationResults] = useState<{
    totalInvestido: number;
    totalAcumulado: number;
    jurosGanhos: number;
    mensalidadeList: Array<{ ano: number; valorInvestido: number; valorTotal: number }>;
  }>({ totalInvestido: 0, totalAcumulado: 0, jurosGanhos: 0, mensalidadeList: [] });

  useEffect(() => {
    const p = parseFloat(simulationCapital) || 0;
    const pm = parseFloat(simulationAporte) || 0;
    const taxaAnual = parseFloat(simulationTaxa) || 0;
    const anos = parseFloat(simulationPeriodo) || 0;

    const rMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;
    const meses = anos * 12;

    let totalTotal = p;
    let totalInvestidoLocal = p;
    const anoLogs: Array<{ ano: number; valorInvestido: number; valorTotal: number }> = [];

    // Include initial values
    anoLogs.push({ ano: 0, valorInvestido: Math.round(p), valorTotal: Math.round(p) });

    for (let m = 1; m <= meses; m++) {
      totalTotal = totalTotal * (1 + rMensal) + pm;
      totalInvestidoLocal += pm;
      
      if (m % 12 === 0) {
        anoLogs.push({
          ano: m / 12,
          valorInvestido: Math.round(totalInvestidoLocal),
          valorTotal: Math.round(totalTotal)
        });
      }
    }

    setSimulationResults({
      totalInvestido: Math.round(totalInvestidoLocal),
      totalAcumulado: Math.round(totalTotal),
      jurosGanhos: Math.max(0, Math.round(totalTotal - totalInvestidoLocal)),
      mensalidadeList: anoLogs
    });

  }, [simulationCapital, simulationAporte, simulationTaxa, simulationPeriodo]);

  // -------------------------------------------------------------
  // Tool 5: SEO & Google Snippet Analyzer States & Logic
  // -------------------------------------------------------------
  const [seoTitle, setSeoTitle] = useState("KoreNexus AI - Automação Inteligente de Processos");
  const [seoDescription, setSeoDescription] = useState("Descubra os robôs da KoreNexus. Alavanque o faturamento de sua empresa conectando APIs generativas seguras de última geração, integradas ao seu ERP corporativo hoje.");
  const [seoKeyword, setSeoKeyword] = useState("Automação Inteligente");
  const [seoSlug, setSeoSlug] = useState("automacao-inteligente-ia");

  // Dynamic scores & advices
  const titleCount = seoTitle.length;
  const descCount = seoDescription.length;
  const titleIdealStatus = titleCount >= 45 && titleCount <= 60;
  const descIdealStatus = descCount >= 120 && descCount <= 160;

  // Simple keyword match density tracker
  const combinedText = (seoTitle + " " + seoDescription).toLowerCase();
  const keywordCount = combinedText.split(seoKeyword.toLowerCase()).length - 1;
  const seoScore = Math.min(100, 
    (titleIdealStatus ? 35 : 15) + 
    (descIdealStatus ? 35 : 15) + 
    (keywordCount >= 1 ? 20 : 0) + 
    (seoSlug.length > 5 ? 10 : 0)
  );

  // -------------------------------------------------------------
  // Tool 6: Custom QR Creator with Branding States & Logic
  // -------------------------------------------------------------
  const [qrText, setQrText] = useState("https://korenexus.com.br/gadgets");
  const [qrForeground, setQrForeground] = useState("#3b82f6");
  const [qrBackground, setQrBackground] = useState("#0a0d14");
  const [qrRounded, setQrRounded] = useState(8);
  const [qrLogo, setQrLogo] = useState<"none" | "nexus" | "email" | "whatsapp">("nexus");

  // -------------------------------------------------------------
  // Tool 7: Pricing & Markup Calculator States & Logic
  // -------------------------------------------------------------
  const [costBase, setCostBase] = useState("3500");
  const [taxRate, setTaxRate] = useState("15"); // % de impostos
  const [fixedOverhead, setFixedOverhead] = useState("10"); // % taxa geral custos fixos
  const [desiredMargin, setDesiredMargin] = useState("30"); // % lucro líquido

  const calcPricing = () => {
    const cost = parseFloat(costBase) || 0;
    const taxes = parseFloat(taxRate) || 0;
    const overhead = parseFloat(fixedOverhead) || 0;
    const margin = parseFloat(desiredMargin) || 0;

    // Fórmula: Preço = Custo / (1 - (Impostos + Custos Fixos + Lucro) / 100)
    const divider = (100 - (taxes + overhead + margin)) / 100;
    if (divider <= 0) {
      return { price: 0, markup: 0, breakEven: 0, netProfitBrl: 0 };
    }

    const price = cost / divider;
    const markup = price / (cost || 1);
    const netProfitBrl = price * (margin / 100);
    const breakEven = cost / ((100 - (taxes + overhead)) / 100);

    return {
      price: Math.round(price * 100) / 100,
      markup: Math.round(markup * 100) / 100,
      breakEven: Math.round(breakEven * 100) / 100,
      netProfitBrl: Math.round(netProfitBrl * 100) / 100
    };
  };

  const pricingResults = calcPricing();

  // -------------------------------------------------------------
  // Tool 8: LGPD Terms and Privacy Generator States & Logic
  // -------------------------------------------------------------
  const [privacyBrand, setPrivacyBrand] = useState("KoreNexus Automação");
  const [privacyEmail, setPrivacyEmail] = useState("suporte@korenexus.com.br");
  const [privacyContact, setPrivacyContact] = useState("contato@korenexus.com.br");
  const [collectCookies, setCollectCookies] = useState(true);
  const [collectAnalytics, setCollectAnalytics] = useState(true);
  const [collectNewsletter, setCollectNewsletter] = useState(false);
  const [termsFormat, setTermsFormat] = useState<"privacy" | "terms">("privacy");

  const generateLegalese = () => {
    if (termsFormat === "privacy") {
      return `POLÍTICA DE PRIVACIDADE E PROTEÇÃO DE DADOS (LGPD) - ${privacyBrand.toUpperCase()}

Última atualização: 13 de Junho de 2026.

Esta Política de Privacidade visa regulamentar, de forma simples e transparente, quais dados pessoais serão coletados pela ${privacyBrand}, as finalidades do tratamento e os direitos assegurados a você enquanto titular dos dados, em conformidade estrita com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/18).

1. QUAIS DADOS COLETAMOS
Coletamos informações cadastrais fornecidas livremente ao preencher nossos formulários de contato, como nome, e-mail corporativo e telefone.
${collectCookies ? "- COOKIES: Ativados. Utilizamos rastreadores leves para registrar e analisar sua sessão de navegação de forma anônima." : "- COOKIES: Desativados. Não realizamos coletas automáticas de dados de comportamento por cookies."}
${collectAnalytics ? "- GOOGLE ANALYTICS: Ativado. Para capturar métricas de engajamento técnico do usuário, ajudando a elevar nossos Core Web Vitals." : "- GOOGLE ANALYTICS: Desativado."}
${collectNewsletter ? "- NEWSLETTER: Ativado. Enviamos conteúdos informativos sobre ERPs, IA e automações semanalmente no e-mail fornecido." : "- NEWSLETTER: Desativado."}

2. FINALIDADE DO PROCESSAMENTO DOS DADOS
Tratamos seus dados exclusivamente para:
- Atender suas solicitações comerciais e dúvidas operacionais;
- Viabilizar o encaminhamento de orçamentos de novos sistemas ou módulos;
- Garantir a integridade financeira e de acesso aos nossos barramentos de APIs.

3. DIREITOS DO TITULAR (ART. 18 DA LGPD)
Você possui o direito de exigir a qualquer tempo a correção de dados incompletos, a eliminação de dados desnecessários ou a revogação de consentimentos concedidos anteriormente, bastando enviar um e-mail de requerimento oficial para: ${privacyEmail}.

4. CONTATO DO CONTROLADOR (ENCARREGADO DE DADOS)
Para esclarecer qualquer dúvida sobre como tratamos seus dados pessoais, fale conosco pelo canal unificado: ${privacyContact}.`;
    } else {
      return `TERMOS E CONDIÇÕES DE USO DOS SERVIÇOS WEB - ${privacyBrand.toUpperCase()}

Bem-vindo ao nosso ecossistema de dados. Ao navegar nestas páginas, você concorda em vincular-se integralmente aos seguintes Termos Gerais de Uso.

1. PROPRIEDADE INTELECTUAL
Todo o design visual, ferramentas interativas, algoritmos simuladores e conteúdos disponibilizados neste ambiente são de propriedade intelectual exclusiva da ${privacyBrand} e protegidos pelas leis de direitos autorais internacionais. É estritamente vedada a engenharia reversa de nossos robôs analíticos.

2. SEGURANÇA E RESPONSABILIDADES
Todas as ferramentas interativas oferecidas neste ambiente são fornecidas "como estão", para auxílio consultivo e educacional. O usuário assume integral responsabilidade civil pela aplicação física de contratos ou precificações sugeridas pelos simuladores no faturamento de suas micro e macroempresas.

3. IDADE MÍNIMA
Para solicitar conexões integrativas de API no nosso sandbox avançado, você declara ter idade superior a 18 anos ou ser representante legal ativo de pessoa jurídica operante no território nacional.

Contatos e Suporte Jurídico: ${privacyEmail}`;
    }
  };

  // -------------------------------------------------------------
  // Tool 9: Readability Index & Word Counter States & Logic
  // -------------------------------------------------------------
  const [readabilityText, setReadabilityText] = useState("Seja bem-vindo à KoreNexus. Aqui nós construímos soluções integradas de inteligência artificial de alta disponibilidade para acelerar profundamente o faturamento operacional de sua empresa. Nossos robôs autônomos de automação industrial se comunicam diretamente com seu banco de dados em tempo real sem a necessidade de intervenção humana manual cansativa. Solicite já um diagnóstico grátis hoje.");
  
  const calcReadability = () => {
    const text = readabilityText.trim();
    if (!text) return { words: 0, chars: 0, sentences: 0, readingTime: 0, score: 100, grade: "Fácil" };

    const words = text.split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    // Count sentences by splitting dot, question, exclamation
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;

    // Simple Portuguese syllables approximation (vowels matches)
    const vowels = text.match(/[aeiouáéíóúâêôãõü]/gi)?.length || 1;
    const syllables = Math.round(vowels * 0.95); // Factor approximation for Portuguese

    const avgSentenceLength = words / sentences;
    const avgSyllablesPerWord = syllables / words;

    // Flesch Reading Ease approximation adaptado para português brasileiro
    // Fórmula clássica adaptada: 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)
    let score = Math.round(206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord));
    score = Math.max(0, Math.min(100, score));

    let easeGrade = "Muito Fácil (Anos Iniciais)";
    let easeColor = "text-emerald-400";
    if (score < 30) {
      easeGrade = "Altamente Acadêmico / Complexo (Nível Superior)";
      easeColor = "text-rose-400";
    } else if (score < 50) {
      easeGrade = "Difícil (Ensino Médio / Superior Técnico)";
      easeColor = "text-orange-400";
    } else if (score < 70) {
      easeGrade = "Dificuldade Média (Ensino Fundamental Completo)";
      easeColor = "text-yellow-400";
    } else if (score < 90) {
      easeGrade = "Fácil (Popular / Revistas & Jornais)";
      easeColor = "text-emerald-400";
    }

    const readingTime = Math.max(1, Math.round(words / 200)); // Average 200 words per minute

    return {
      words,
      chars,
      sentences,
      readingTime,
      score,
      grade: easeGrade,
      color: easeColor
    };
  };

  const readabilityResults = calcReadability();

  // -------------------------------------------------------------
  // Tool 10: Device Mockup States & Logic
  // -------------------------------------------------------------
  const [mockupTitle, setMockupTitle] = useState("Minha Plataforma de Faturamento");
  const [mockupUrl, setMockupUrl] = useState("https://korenexus-sheets.com/dashboard");
  const [mockupLayout, setMockupLayout] = useState<"macbook" | "iphone" | "glass">("macbook");
  const [mockupColor, setMockupColor] = useState("indigo");

  const MARKETING_TOOLS: MarketingToolMeta[] = [
    {
      id: "business-card",
      name: "Gerador de Cartão Comercial",
      badge: "Vcard",
      category: "Negócios",
      description: "Gere cartões corporativos digitais interativos com QR Code, seletor de paletas e visual 3D.",
      icon: <CreditCard className="h-4 w-4" />
    },
    {
      id: "utm-shortener",
      name: "Encurtador & Construtor UTM",
      badge: "UTM",
      category: "Marketing",
      description: "Construa links de campanhas parametrizados e simule cliques para auditoria orgânica.",
      icon: <Link2 className="h-4 w-4" />
    },
    {
      id: "contract-gen",
      name: "Gerador de Contrato Digital",
      badge: "PDF",
      category: "Negócios",
      description: "Crie contratos profissionais de prestação de serviços com assinaturas legíveis estilizadas.",
      icon: <FileSignature className="h-4 w-4" />
    },
    {
      id: "compound-interest",
      name: "Simulador de Juros Compostos",
      badge: "GRÁFICO",
      category: "Finanças",
      description: "Compare aportes mensais, calcule evolução patrimonial e projete retornos em tabelas.",
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      id: "seo-analyzer",
      name: "Auditor SEO & Google Snippet",
      badge: "SEO",
      category: "SEO",
      description: "Analise densidade de keywords e visualize o resultado Google Mobile/Desktop exato.",
      icon: <Search className="h-4 w-4" />
    },
    {
      id: "custom-qr",
      name: "Branded QR Code Creator",
      badge: "DESIGN",
      category: "Design",
      description: "Crie Códigos QR personalizados com logotipo KoreNexus corporativo e cores de alta definição.",
      icon: <QrCode className="h-4 w-4" />
    },
    {
      id: "pricing-calculator",
      name: "Calculadora de Preço de Venda",
      badge: "ERP",
      category: "Finanças",
      description: "Calcule preço de venda, markups estruturais e margens de contribuição líquidas ideais.",
      icon: <Percent className="h-4 w-4" />
    },
    {
      id: "privacy-terms",
      name: "Fábrica de Políticas e LGPD",
      badge: "LEGAL",
      category: "Negócios",
      description: "Gere contratos de privacidade e termos de uso adequados à LGPD de forma instantânea.",
      icon: <ShieldAlert className="h-4 w-4" />
    },
    {
      id: "readability-meter",
      name: "Métrica de Legibilidade Copy",
      badge: "CONTENT",
      category: "Marketing",
      description: "Calcule a formulação Flesch-Kincaid de redação para maximizar envolvimento no blog.",
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: "device-mockup",
      name: "Mockup de Dispositivos SaaS",
      badge: "MOCKUP",
      category: "Design",
      description: "Gere visões cromadas de Macbook, Iphone ou Glassmorphism para anúncios e landing pages.",
      icon: <Tv className="h-4 w-4" />
    }
  ];

  return (
    <div id="marketing-tools-container" className="space-y-6">
      {/* Title section describing SEO tools users will loves */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-900">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-mono bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/25 font-bold tracking-widest">
              UTILITÁRIOS CORPORATIVOS E SEO DE ALTO FLUXO
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
          </div>
          <h2 className="text-3xl font-display font-light text-white tracking-tight">
            KoreNexus Premium <strong className="font-semibold text-emerald-400">Empresarial Suite</strong>
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl mt-1">
            Ferramentas dinâmicas de altíssima relevância que o algoritmo do Google ama: elevam o engajamento orgânico do site através de simulações interativas de alta utilidade e transparência.
          </p>
        </div>
      </div>

      {/* Grid: Left rail, Right display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Rail */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold block mb-3 px-1">
            Selecione uma Ferramenta ({MARKETING_TOOLS.length})
          </span>
          <div className="space-y-1.5">
            {MARKETING_TOOLS.map((tool) => {
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 relative group ${
                    isActive
                      ? "bg-[#0c1220]/75 border-emerald-500/30 text-white shadow-xl shadow-emerald-500/5 translate-x-1"
                      : "bg-[#06080E]/60 border-gray-900/40 text-gray-400 hover:text-white hover:bg-slate-900/20 hover:border-slate-850"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r bg-emerald-400"></div>
                  )}
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 transition-colors duration-200 ${
                    isActive 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-slate-950/60 text-slate-500 group-hover:bg-slate-900 group-hover:text-slate-300"
                  }`}>
                    {tool.icon}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold font-sans text-gray-200 group-hover:text-white transition-colors">
                        {tool.name}
                      </span>
                      <span className="text-[8px] font-mono font-bold px-1 py-0.2 rounded bg-slate-800 text-slate-400 uppercase">
                        {tool.badge}
                      </span>
                    </div>
                    <p className="text-[10px] leading-relaxed text-slate-400">
                      {tool.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Sandbox Display */}
        <div className="lg:col-span-8 bg-[#06080E]/70 border border-gray-900/60 rounded-2xl p-5 md:p-6 shadow-2xl relative min-h-[550px]" id="marketing-sandbox">
          
          {/* Tool 1: Business Card */}
          {activeTool === "business-card" && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
                <CreditCard className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white font-mono">Gerador Holográfico de Cartão Corporativo Vcard</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Inputs */}
                <div className="space-y-3 font-sans">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">Nome Oficial</label>
                    <input 
                      type="text" 
                      value={cardName} 
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">Cargo / Função</label>
                    <input 
                      type="text" 
                      value={cardRole} 
                      onChange={(e) => setCardRole(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-gray-400">Telefone</label>
                      <input 
                        type="text" 
                        value={cardPhone} 
                        onChange={(e) => setCardPhone(e.target.value)}
                        className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-gray-400">Email Corporativo</label>
                      <input 
                        type="text" 
                        value={cardEmail} 
                        onChange={(e) => setCardEmail(e.target.value)}
                        className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-gray-400 block mb-1.5">Escolher Tema Visual</span>
                    <div className="flex gap-1.5">
                      {["classic", "cyberpunk", "emerald", "gold"].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setCardTheme(theme as any)}
                          className={`flex-1 py-1 px-2 text-[10px] rounded-lg border font-bold capitalize transition cursor-pointer ${
                            cardTheme === theme
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-400/30"
                              : "bg-[#0A0D14] text-gray-500 border-gray-900 hover:text-white"
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setCardRotate(!cardRotate)}
                    className="w-full py-2 bg-[#0C111D] border border-gray-800 rounded-full text-xs font-semibold cursor-pointer text-slate-300 hover:text-white transition"
                  >
                    Girar Cartão (Ver Verso / Qr Code)
                  </button>
                </div>

                {/* Simulated Business Card Mockup with nice Perspective styles */}
                <div className="flex flex-col items-center justify-center p-3">
                  <div 
                    className={`w-full max-w-[290px] h-[170px] relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 cursor-pointer ${
                      cardRotate ? "rotate-y-180" : ""
                    } ${
                      cardTheme === "emerald" ? "bg-gradient-to-br from-[#0c1f19] to-[#010a08] border border-emerald-500/20" :
                      cardTheme === "classic" ? "bg-gradient-to-br from-slate-900 to-[#0A0D14] border border-gray-800" :
                      cardTheme === "cyberpunk" ? "bg-gradient-to-br from-[#120a2e] to-[#06030F] border border-fuchsia-500/20" :
                      "bg-gradient-to-br from-[#241d0c] to-[#0a0802] border border-yellow-500/20"
                    }`}
                    style={{ perspective: "1000px" }}
                  >
                    {!cardRotate ? (
                      /* Face do Cartão */
                      <div className="p-4 h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-mono tracking-widest uppercase ${
                            cardTheme === "cyberpunk" ? "text-fuchsia-400" :
                            cardTheme === "emerald" ? "text-emerald-400" :
                            cardTheme === "gold" ? "text-yellow-400" :
                            "text-sky-400"
                          }`}>{cardCompany}</span>
                          <span className="text-[10px] opacity-45 font-mono">🏢</span>
                        </div>
                        <div className="space-y-1 my-auto">
                          <h4 className="text-sm font-semibold tracking-tight text-white">{cardName}</h4>
                          <p className="text-[9px] text-gray-400 leading-none">{cardRole}</p>
                        </div>
                        <div className="space-y-1 text-[8px] font-mono text-gray-400">
                          <div className="flex items-center gap-1">
                            <span className="opacity-60 font-mono">📱</span> <span>{cardPhone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="opacity-60 font-mono">✉️</span> <span>{cardEmail}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Verso com QR Code */
                      <div className="p-4 h-full flex flex-col items-center justify-center rotate-y-180 text-center space-y-1.5">
                        <div className="p-2.5 bg-white rounded-lg inline-block">
                          {/* Svg QR code mockup */}
                          <svg className="w-16 h-16 text-black" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M0 0h6v6H0V0zm1 1v4h4V1H1zm1 1h2v2H2V2zM0 8h6v6H0V8zm1 1v4h4V9H1zm1 1h2v2H2v-2zM8 0h6v6H8V0zm1 1v4h4V1H9zm1 1h2v2h-2V2zm-2 6h2v2H8V8zm4 0h2v2h-2V8zm-2 2h2v2h-2v-2zm-2 2h2v2H8v-2zm4 0h2v2h-2v-2zm-4 4h2v2H8v-2zm2 2h2v2h-2v-2zm-2 2h2v2H8v-2zm4 0h2v2h-2v-2zm4-16h6v6h-6V0zm1 1v4h4V1H17zm1 1h2v2h-2V2zM16 8h2v2h-2V8zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 2h2v2h-2v-2zm2 2h2v2h-2v-2z" />
                          </svg>
                        </div>
                        <span className="text-[8px] text-gray-500 font-mono uppercase tracking-wider">Aponte a Câmera para o Vcard</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-2 text-center font-mono italic">Toque para simular perspectiva realista</span>
                </div>
              </div>
            </div>
          )}

          {/* Tool 2: UTM Shortener */}
          {activeTool === "utm-shortener" && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
                <Link2 className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white font-mono">Encurtador de Links de Campanha & UTM Manager</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">Url Base original</label>
                    <input 
                      type="text" 
                      value={utmUrl} 
                      onChange={(e) => setUtmUrl(e.target.value)}
                      placeholder="Ex: https://korenexus.com.br/planos"
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">UTM Source (Origem - ex: google, linkedin)</label>
                    <input 
                      type="text" 
                      value={utmSource} 
                      onChange={(e) => setUtmSource(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">UTM Medium (Meio - ex: email, cpc)</label>
                    <input 
                      type="text" 
                      value={utmMedium} 
                      onChange={(e) => setUtmMedium(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">UTM Campaign (Nome)</label>
                    <input 
                      type="text" 
                      value={utmCampaign} 
                      onChange={(e) => setUtmCampaign(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">Sugestão de Slug Encurtado</label>
                    <input 
                      type="text" 
                      value={utmSlug} 
                      onChange={(e) => setUtmSlug(e.target.value)}
                      placeholder="kflow-promo"
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-[#0A0D14] border border-gray-900 p-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-gray-500 font-bold">Link UTM Completo Gerado:</span>
                    <button 
                      onClick={() => handleCopy(utmGeneratedUrl, "utm-full")}
                      className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-mono cursor-pointer"
                    >
                      {copiedId === "utm-full" ? "[Copiado!]" : "[Copiar Link UTM]"}
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-blue-400 truncate select-all">{utmGeneratedUrl}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleAddShortLink}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition cursor-pointer"
                  >
                    Encurtar & Sincronizar Link no Histórico
                  </button>
                </div>

                {/* Simulated Clicks History list */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-mono text-gray-500 font-bold block">Seus links cadastrados (Ativos locais)</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto">
                    {utmHistory.map((item) => (
                      <div key={item.id} className="bg-[#0c1220]/50 border border-gray-900/60 p-2.5 rounded-xl flex items-center justify-between">
                        <div className="space-y-0.5 max-w-[210px]">
                          <p className="text-xs font-semibold text-white truncate">{item.short}</p>
                          <p className="text-[9px] text-gray-500 truncate">{item.original}</p>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-1.5 py-0.5 rounded">
                            {item.clicks} Clicks
                          </span>
                          <button
                            onClick={() => simulateClick(item.id)}
                            className="p-1 px-2 border border-gray-800 rounded text-[9px] hover:text-white transition uppercase font-mono cursor-pointer"
                            title="Simular tráfego orgânico"
                          >
                            Simular
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tool 3: Legal Contract Generator */}
          {activeTool === "contract-gen" && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
                <FileSignature className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white font-mono">Gerador Automático de Contrato de Prestação de Serviços</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Inputs Left */}
                <div className="lg:col-span-5 space-y-3 font-sans">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">Contratante (Suas credenciais/Empresa)</label>
                    <input 
                      type="text" 
                      value={contractContractor} 
                      onChange={(e) => setContractContractor(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">CNPJ Contratante</label>
                    <input 
                      type="text" 
                      value={contractContractorDoc} 
                      onChange={(e) => setContractContractorDoc(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">Prestador (Contratado)</label>
                    <input 
                      type="text" 
                      value={contractContractee} 
                      onChange={(e) => setContractContractee(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">Serviço Pretendido</label>
                    <input 
                      type="text" 
                      value={contractServiceName} 
                      onChange={(e) => setContractServiceName(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-gray-400">Valor Total (R$)</label>
                      <input 
                        type="text" 
                        value={contractValue} 
                        onChange={(e) => setContractValue(e.target.value)}
                        className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-gray-400">Parcelas</label>
                      <input 
                        type="text" 
                        value={contractInstallments} 
                        onChange={(e) => setContractInstallments(e.target.value)}
                        className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">Linha de Assinatura Eletrônica</label>
                    <input 
                      type="text" 
                      value={signatureTyped} 
                      onChange={(e) => setSignatureTyped(e.target.value)}
                      placeholder="Dra. Beatriz Mendes"
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Dynamic Preview Right */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div className="bg-[#FAF9F6] text-slate-900 rounded-xl p-4 font-serif text-[9.5px] leading-relaxed select-all max-h-[300px] overflow-y-auto shadow-inner border border-gray-250">
                    <h4 className="text-center font-bold uppercase mb-2 text-xs tracking-tight">INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS</h4>
                    <p className="indent-4 mb-2">
                      Pelo presente termo comercial, de um lado, doravante denominado simplesmente CONTRATANTE: 
                      <strong> {contractContractor}</strong>, inscrito no CNPJ sob o nº <strong>{contractContractorDoc}</strong>.
                    </p>
                    <p className="indent-4 mb-2">
                      De outro lado, denominado doravante CONTRATADO: 
                      <strong> {contractContractee}</strong>, inscrito sob o nº <strong>{contractContracteeDoc}</strong>.
                    </p>
                    <p className="indent-4 mb-2">
                      Resolvem firmar o presente pacto comercial regido sob as seguintes disposições:
                    </p>
                    <p className="mb-1"><strong>CLÁUSULA PRIMEIRA - OBJETO</strong></p>
                    <p className="indent-2 mb-2">
                      O objeto do presente termo reside na execução de: <em>{contractServiceName}</em>, a ser finalizado num prazo operacional estimado de {contractDurationMonths} meses.
                    </p>
                    <p className="mb-1"><strong>CLÁUSULA SEGUNDA - VALOR & FORMA DE PAGAMENTO</strong></p>
                    <p className="indent-2 mb-2">
                      Pelo implemento do serviço estipulado, o CONTRATANTE pagará ao CONTRATADO a quantia total unificada de R$ <strong>{parseFloat(contractValue).toLocaleString("pt-BR") || "18.500"}</strong>, distribuídos em pacto síncrono de <strong>{contractInstallments}</strong> parcelas mensais iguais.
                    </p>
                    <p className="text-center font-semibold mt-4 mb-1">E, por estarem de comum acordo firmado:</p>
                    <div className="flex justify-between items-center mt-4 border-t border-gray-300 pt-3">
                      <div className="text-center w-1/2">
                        <span className="border-b border-gray-400 pb-0.5 block italic text-[9px] font-sans">{signatureTyped}</span>
                        <span className="text-[7.5px] font-sans text-gray-500 uppercase">Assinatura do Prestador</span>
                      </div>
                      <div className="text-center w-1/3">
                        <span className="border-b border-gray-400 pb-0.5 block text-[9px] font-sans">__/__/2026</span>
                        <span className="text-[7.5px] font-sans text-gray-500 uppercase">Data do Termo</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleCopy(generateLegalese(), "contract")}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{copiedId === "contract" ? "Copiado!" : "Copiar Contrato em Markdown"}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 border border-gray-800 hover:bg-gray-900 rounded-full text-xs font-semibold text-slate-300 cursor-pointer"
                    >
                      Imprimir Termo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tool 4: Compound Interest Simulator */}
          {activeTool === "compound-interest" && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white font-mono">Simulador de Juros Compostos e Aportes Patrimoniais</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Inputs Left */}
                <div className="lg:col-span-4 space-y-3 font-sans">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">Capital Inicial (R$)</label>
                    <input 
                      type="number" 
                      value={simulationCapital} 
                      onChange={(e) => setSimulationCapital(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">Aporte Mensal Constante (R$)</label>
                    <input 
                      type="number" 
                      value={simulationAporte} 
                      onChange={(e) => setSimulationAporte(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-gray-400">Taxa Anual (%)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={simulationTaxa} 
                        onChange={(e) => setSimulationTaxa(e.target.value)}
                        className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-gray-400">Período (Anos)</label>
                      <input 
                        type="number" 
                        value={simulationPeriodo} 
                        onChange={(e) => setSimulationPeriodo(e.target.value)}
                        className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Outputs and SVG Custom chart representation Right */}
                <div className="lg:col-span-8 space-y-4 font-sans">
                  {/* Results summary indicators */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#0A0D14] border border-gray-900 p-2.5 rounded-xl text-center">
                      <span className="text-[8px] uppercase font-mono text-gray-500">Total Investido</span>
                      <p className="text-xs font-semibold text-white mt-1">R$ {simulationResults.totalInvestido.toLocaleString("pt-BR")}</p>
                    </div>
                    <div className="bg-[#0A0D14] border border-[#A8FF53]/10 p-2.5 rounded-xl text-center">
                      <span className="text-[8px] uppercase font-mono text-gray-500">Juros de Retorno</span>
                      <p className="text-xs font-semibold text-emerald-400 mt-1">R$ {simulationResults.jurosGanhos.toLocaleString("pt-BR")}</p>
                    </div>
                    <div className="bg-[#0A0D14] border border-emerald-500/15 p-2.5 rounded-xl text-center">
                      <span className="text-[8px] uppercase font-mono text-gray-500">Total Acumulado</span>
                      <p className="text-xs font-bold text-white mt-1">R$ {simulationResults.totalAcumulado.toLocaleString("pt-BR")}</p>
                    </div>
                  </div>

                  {/* SVG Render representing visual graph evolution bars */}
                  <div className="bg-[#0A0D14] border border-gray-900/60 p-3 rounded-xl">
                    <span className="text-[9px] uppercase font-mono text-gray-500 font-semibold block mb-2">Evolução Patrimonial por Ano (Gráfico de Projeção)</span>
                    <div className="h-[120px] flex items-end justify-between px-4 pb-2 pt-4 relative border-b border-gray-800">
                      {simulationResults.mensalidadeList.map((item, idx) => {
                        const maxVal = Math.max(...simulationResults.mensalidadeList.map(i => i.valorTotal)) || 1;
                        const barPctTotal = (item.valorTotal / maxVal) * 100;
                        const barPctInvestido = (item.valorInvestido / maxVal) * 100;

                        return (
                          <div key={idx} className="flex flex-col items-center flex-1 group relative">
                            {/* Hover info tooltip */}
                            <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-[8.5px] border border-gray-800 p-1.5 rounded-lg z-20 pointer-events-none shadow-2xl">
                              <p className="font-bold text-white">Ano {item.ano}</p>
                              <p className="text-gray-400">Total: R$ {item.valorTotal.toLocaleString("pt-BR")}</p>
                              <p className="text-slate-500">Próprio: R$ {item.valorInvestido.toLocaleString("pt-BR")}</p>
                            </div>

                            {/* Stacked Bars representing compound interest */}
                            <div className="w-5 sm:w-8 relative rounded-t overflow-hidden flex flex-col justify-end" style={{ height: "80px" }}>
                              {/* Interst part (top part) */}
                              <div className="w-full bg-emerald-500" style={{ height: `${barPctTotal}%` }}></div>
                              {/* Invested part (down part) */}
                              <div className="w-full bg-slate-700 absolute bottom-0" style={{ height: `${barPctInvestido}%` }}></div>
                            </div>
                            <span className="text-[9px] text-gray-550 font-mono mt-1">A{item.ano}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-4 text-[9px] font-mono justify-center mt-2.5">
                      <div className="flex items-center gap-1"><span className="w-2 h-2 bg-slate-700 rounded-full"></span> <span className="text-gray-400">Total Aportado</span></div>
                      <div className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> <span className="text-gray-400">Juros Acumulados</span></div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* Tool 5: SEO and Google Search Result Simulator */}
          {activeTool === "seo-analyzer" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
                <Search className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white font-mono">Auditor SEO das Páginas & Simulador de Rich Snippet</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Inputs Left */}
                <div className="lg:col-span-5 space-y-3 font-sans text-xs">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] uppercase font-mono text-gray-400">Meta Title do Google</label>
                      <span className={`text-[9px] font-mono ${titleIdealStatus ? "text-emerald-400" : "text-yellow-400"}`}>
                        {titleCount}/60 chars
                      </span>
                    </div>
                    <input 
                      type="text" 
                      value={seoTitle} 
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 focus:ring-1 focus:outline-none font-sans"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] uppercase font-mono text-gray-400">Meta Description do Google</label>
                      <span className={`text-[9px] font-mono ${descIdealStatus ? "text-emerald-400" : "text-yellow-400"}`}>
                        {descCount}/160 chars
                      </span>
                    </div>
                    <textarea 
                      value={seoDescription} 
                      onChange={(e) => setSeoDescription(e.target.value)}
                      className="w-full h-16 bg-[#0A0D14] text-white border border-gray-900 rounded-xl p-2 focus:ring-1 focus:outline-none resize-none font-sans"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-gray-400">Palavra-Chave foco</label>
                      <input 
                        type="text" 
                        value={seoKeyword} 
                        onChange={(e) => setSeoKeyword(e.target.value)}
                        className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 focus:ring-1 focus:outline-none font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-gray-400">Url Slug do Artigo</label>
                      <input 
                        type="text" 
                        value={seoSlug} 
                        onChange={(e) => setSeoSlug(e.target.value)}
                        className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 focus:ring-1 focus:outline-none font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Dynamic Preview Right inside a visual Google Search result block */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Google snippet preview box */}
                  <div className="bg-[#171717] border border-gray-800 p-4 rounded-xl space-y-1.5 font-sans shadow-xl">
                    <span className="text-[8px] uppercase font-mono text-gray-400 block mb-2">Simulação de Snippet Real no Google Search (Desktop)</span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-gray-300">korenexus.com.br</span>
                        <span className="text-[10px] text-gray-500 font-mono">› {seoSlug || "post"}</span>
                      </div>
                      <a href="#" className="text-blue-450 text-blue-450 text-[#8ab4f8] hover:underline text-[14px] font-sans font-medium line-clamp-1 block leading-tight">
                        {seoTitle || "Insira um título..."}
                      </a>
                      <p className="text-[11.5px] text-[#bdc1c6] leading-relaxed line-clamp-2">
                        {seoDescription || "Insira uma descrição concisa para simular a visualização de faturamento orgânico do seu site."}
                      </p>
                    </div>
                  </div>

                  {/* Score indicators */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#0A0D14] border border-gray-900 p-3 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[8px] uppercase font-mono text-gray-500 block">Health Score SEO</span>
                        <span className="text-sm font-bold text-white font-mono">{seoScore} / 100</span>
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full ${seoScore >= 80 ? "bg-emerald-400 animate-pulse" : "bg-yellow-400"}`}></div>
                    </div>
                    <div className="bg-[#0A0D14] border border-gray-900 p-3 rounded-xl">
                      <span className="text-[8px] uppercase font-mono text-gray-500 block">Densidade de Keyword</span>
                      <span className="text-sm font-bold text-white font-mono mt-0.5 block">{keywordCount} ocorrências</span>
                    </div>
                  </div>

                  {/* Advice checklist */}
                  <div className="bg-[#0A0D14] border border-gray-900 p-3 rounded-xl space-y-2">
                    <span className="text-[9px] uppercase font-mono text-gray-500 font-bold block">Recomendações técnicas do Analisador:</span>
                    <ul className="text-[10px] space-y-1.5 font-sans">
                      <li className="flex items-center gap-1.5">
                        <span className="text-xs">{titleIdealStatus ? "✅" : "⚠️"}</span>
                        <span className={titleIdealStatus ? "text-gray-300" : "text-yellow-400"}>
                          Título Meta ideal possui entre 45 e 60 caracteres. (Atual: {titleCount})
                        </span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-xs">{descIdealStatus ? "✅" : "⚠️"}</span>
                        <span className={descIdealStatus ? "text-gray-300" : "text-yellow-400"}>
                          Meta Description ideal para atrair Cliques possui entre 120 e 160 caracteres. (Atual: {descCount})
                        </span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="text-xs">{keywordCount >= 1 ? "✅" : "❌"}</span>
                        <span className={keywordCount >= 1 ? "text-gray-300" : "text-rose-400"}>
                          Presença da palavra focal nos metadados para ranquear palavras orgânicas.
                        </span>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* Tool 6: Custom QR Creator */}
          {activeTool === "custom-qr" && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
                <QrCode className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white font-mono">Gerador Avançado de QR Code com Logotipo</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-sans">
                {/* Inputs Left */}
                <div className="space-y-3 font-sans">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">Texto ou Link do QR Code</label>
                    <input 
                      type="text" 
                      value={qrText} 
                      onChange={(e) => setQrText(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-gray-400 font-bold block mb-1">Cor do Código</label>
                      <input 
                        type="color" 
                        value={qrForeground} 
                        onChange={(e) => setQrForeground(e.target.value)}
                        className="w-full h-8 bg-transparent cursor-pointer rounded-xl border border-gray-900 bg-[#0A0D14]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-mono text-gray-400 font-bold block mb-1">Cor de Fundo</label>
                      <input 
                        type="color" 
                        value={qrBackground} 
                        onChange={(e) => setQrBackground(e.target.value)}
                        className="w-full h-8 bg-transparent cursor-pointer rounded-xl border border-gray-900 bg-[#0A0D14]"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-mono text-gray-400 block mb-1">Escolher Ícone/Logomarca Central</span>
                    <div className="flex gap-1">
                      {["none", "nexus", "email", "whatsapp"].map((logoSet) => (
                        <button
                          key={logoSet}
                          onClick={() => setQrLogo(logoSet as any)}
                          className={`flex-1 py-1.5 px-2 text-[10px] rounded-lg border font-bold capitalize transition cursor-pointer ${
                            qrLogo === logoSet
                              ? "bg-blue-500/10 text-blue-400 border-blue-400/30"
                              : "bg-[#0A0D14] text-gray-500 border-gray-900 hover:text-white"
                          }`}
                        >
                          {logoSet}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Display QR dynamically Right */}
                <div className="flex flex-col items-center justify-center p-4 bg-[#0A0D14] border border-gray-900 rounded-2xl relative">
                  <div 
                    className="p-5 rounded-2xl relative"
                    style={{ backgroundColor: qrBackground }}
                  >
                    {/* SVG generated dynamic representation */}
                    <svg className="w-40 h-40" viewBox="0 0 100 100" fill={qrForeground}>
                      <path d="M0 0h28v28H0V0zm4 4v20h20V4H4zm14 14h2v2h-2v-2zM0 72h28v28H0V72zm4 4v20h20V76H4zm68-72h28v28H72V0zm4 4v20h20V4H76zm8 72h4v4h-4v-4zm-4-4h4v4h-4v-4zm8 12h8v4h-8v-4zm0-8h4v4h-4v-4zm8 4h4v4h-4v-4zm-12 16h8v4h-8v-4zm16 0h4v4h-4v-4zm-8-28h4v4h-4v-4zm12 4h4v4h-4v-4zm-16-12h4v4h-4V16zm8 8h4v4h-4v-4zm0-12h8v4h-8v-4zm12-4h4v4h-4V0z" />
                      
                      {/* Interactive Logo Emblem */}
                      {qrLogo !== "none" && (
                        <rect x="38" y="38" width="24" height="24" rx="4" fill={qrBackground} stroke={qrForeground} strokeWidth="1.5" />
                      )}
                      {qrLogo === "nexus" && (
                        <path d="M43 45h14v10H43z" fill={qrForeground} opacity="0.85" />
                      )}
                      {qrLogo === "email" && (
                        <path d="M45 46h10v8H45z" fill={qrForeground} />
                      )}
                      {qrLogo === "whatsapp" && (
                        <circle cx="50" cy="50" r="6" fill={qrForeground} />
                      )}
                    </svg>
                  </div>
                  <button
                    onClick={() => handleCopy(qrText, "qr-copied")}
                    className="mt-3 py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[10px] font-bold cursor-pointer"
                  >
                    {copiedId === "qr-copied" ? "Copiado!" : "Exportar Link de Destino"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tool 7: Pricing & Markup Calculator */}
          {activeTool === "pricing-calculator" && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
                <Percent className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white font-mono">Calculadora de Precificação de Produtos/Serviços</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans text-xs">
                {/* Inputs Left */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">Custo Base de Aquisição/Desenvolvimento (R$)</label>
                    <input 
                      type="number" 
                      value={costBase} 
                      onChange={(e) => setCostBase(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-mono text-gray-400">Impostos (%)</label>
                      <input 
                        type="number" 
                        value={taxRate} 
                        onChange={(e) => setTaxRate(e.target.value)}
                        className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 focus:ring-1 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-mono text-gray-400">Custos Fixo (%)</label>
                      <input 
                        type="number" 
                        value={fixedOverhead} 
                        onChange={(e) => setFixedOverhead(e.target.value)}
                        className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 focus:ring-1 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-mono text-gray-400">Margem Luq (%)</label>
                      <input 
                        type="number" 
                        value={desiredMargin} 
                        onChange={(e) => setDesiredMargin(e.target.value)}
                        className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 focus:ring-1 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Outputs Right */}
                <div className="space-y-4">
                  <div className="bg-[#0A0D14] border border-gray-900 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                      <span className="text-[10px] uppercase font-mono text-gray-500">Preço de Venda Sugerido</span>
                      <strong className="text-sm font-mono text-emerald-400">
                        R$ {pricingResults.price > 0 ? pricingResults.price.toLocaleString("pt-BR") : "Métricas Inválidas"}
                      </strong>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <span className="text-[8px] uppercase font-mono text-gray-500">Novo Markup</span>
                        <p className="text-xs font-semibold text-white mt-0.5">{pricingResults.markup}x</p>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase font-mono text-gray-500">Ponto de Equilíbrio</span>
                        <p className="text-xs font-semibold text-white mt-0.5">R$ {pricingResults.breakEven.toLocaleString("pt-BR")}</p>
                      </div>
                      <div>
                        <span className="text-[8px] uppercase font-mono text-gray-500">Lucro Real Líquido</span>
                        <p className="text-xs font-semibold text-emerald-400 mt-0.5">R$ {pricingResults.netProfitBrl.toLocaleString("pt-BR")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0A0D14]/30 border border-gray-900/60 p-2.5 rounded-xl text-[10px] text-gray-400 flex items-center gap-2">
                    <Info className="h-4.5 w-4.5 text-blue-400 shrink-0" />
                    <p>A fórmula base de cálculo de Markup assegura que todos os custos incidentais de impostos e custo operacional fixo de sua empresa sejam compensados proporcionalmente.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tool 8: Privacy LGPD Terms Generator */}
          {activeTool === "privacy-terms" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
                <ShieldAlert className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white font-mono">Gerador de Políticas de Privacidade & Termos LGPD</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 font-sans text-xs">
                {/* Inputs Left */}
                <div className="md:col-span-5 space-y-3 font-sans">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">Nome Fantasia da Marca</label>
                    <input 
                      type="text" 
                      value={privacyBrand} 
                      onChange={(e) => setPrivacyBrand(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">E-mail Comercial (Exercer Direitos)</label>
                    <input 
                      type="text" 
                      value={privacyEmail} 
                      onChange={(e) => setPrivacyEmail(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2 border-t border-gray-900 pt-2">
                    <span className="text-[10px] uppercase font-mono text-gray-500 font-bold block">Qualificar Coletores de Dados</span>
                    <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                      <input 
                        type="checkbox" 
                        checked={collectCookies} 
                        onChange={(e) => setCollectCookies(e.target.checked)}
                        className="rounded accent-emerald-500" 
                      />
                      <span>Coleta Dados e Cookies de Navegação</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                      <input 
                        type="checkbox" 
                        checked={collectAnalytics} 
                        onChange={(e) => setCollectAnalytics(e.target.checked)}
                        className="rounded accent-emerald-500" 
                      />
                      <span>Usa Mapeamentos de Google Analytics</span>
                    </label>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-gray-400 block mb-1">Qual Documento Gerar?</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTermsFormat("privacy")}
                        className={`flex-1 py-1.5 px-3 rounded-lg border font-bold text-[10px] font-sans cursor-pointer capitalize transition ${
                          termsFormat === "privacy"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-400/30"
                            : "bg-[#0A0D14] text-gray-500 border-gray-900 hover:text-white"
                        }`}
                      >
                        Políticas Privacidade
                      </button>
                      <button
                        onClick={() => setTermsFormat("terms")}
                        className={`flex-1 py-1.5 px-3 rounded-lg border font-bold text-[10px] font-sans cursor-pointer capitalize transition ${
                          termsFormat === "terms"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-400/30"
                            : "bg-[#0A0D14] text-gray-500 border-gray-900 hover:text-white"
                        }`}
                      >
                        Termos de Uso
                      </button>
                    </div>
                  </div>
                </div>

                {/* Text Display Right */}
                <div className="md:col-span-7 flex flex-col justify-between">
                  <textarea 
                    readOnly
                    value={generateLegalese()}
                    className="w-full h-[220px] bg-[#0A0D14]/80 text-[#8892b0] border border-gray-900 rounded-xl p-3 text-[10px] font-mono focus:outline-none resize-none select-all"
                  ></textarea>
                  <button
                    onClick={() => handleCopy(generateLegalese(), "lgpd-term")}
                    className="mt-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedId === "lgpd-term" ? "Copiado!" : "Copiar Texto Legamente Complacente"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tool 9: Readability Index */}
          {activeTool === "readability-meter" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
                <FileText className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white font-mono">Mapeador Flesch-Kincaid de Legibilidade de Texto</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 font-sans text-xs">
                {/* Input Left */}
                <div className="md:col-span-7 space-y-2">
                  <span className="text-[10px] uppercase font-mono text-gray-400 block">Texto da Cópia de Vendas / Landing Page</span>
                  <textarea 
                    value={readabilityText} 
                    onChange={(e) => setReadabilityText(e.target.value)}
                    className="w-full h-[220px] bg-[#0A0D14] text-white border border-gray-900 rounded-xl p-3 text-xs focus:ring-1 focus:outline-none resize-none font-sans leading-relaxed"
                  ></textarea>
                </div>

                {/* Results indicators Right */}
                <div className="md:col-span-5 space-y-4">
                  <div className="bg-[#0A0D14] border border-gray-900 p-4 rounded-xl space-y-3">
                    <div>
                      <span className="text-[8px] uppercase font-mono text-gray-500 block mb-1">Índice Flesch de Legibilidade</span>
                      <strong className={`text-xl font-mono ${readabilityResults.color}`}>
                        {readabilityResults.score} / 100
                      </strong>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase font-mono text-gray-500 block">Classificação de Compreensão</span>
                      <span className="text-xs font-bold text-gray-200 block mt-0.5">{readabilityResults.grade}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-[#0A0D14] border border-gray-900 p-2 rounded-xl">
                      <span className="text-[8px] uppercase font-mono text-gray-500">Palavras</span>
                      <p className="font-semibold text-white mt-0.5">{readabilityResults.words}</p>
                    </div>
                    <div className="bg-[#0A0D14] border border-gray-900 p-2 rounded-xl">
                      <span className="text-[8px] uppercase font-mono text-gray-500">Sentenças</span>
                      <p className="font-semibold text-white mt-0.5">{readabilityResults.sentences}</p>
                    </div>
                    <div className="bg-[#0A0D14] border border-gray-900 p-2 rounded-xl">
                      <span className="text-[8px] uppercase font-mono text-gray-500">Tempo de Leitura</span>
                      <p className="font-semibold text-emerald-400 mt-0.5">~{readabilityResults.readingTime} min</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tool 10: SaaS Mockup Generator */}
          {activeTool === "device-mockup" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 border-b border-gray-900 pb-3">
                <Tv className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white font-mono">Gerador Dinâmico de Mockups de Macbook e Iphone</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 font-sans text-xs">
                {/* Inputs Left */}
                <div className="md:col-span-5 space-y-3 font-sans">
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">Título Interno do Dashboard</label>
                    <input 
                      type="text" 
                      value={mockupTitle} 
                      onChange={(e) => setMockupTitle(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-mono text-gray-400">Url fictícia da Barra de Endereço</label>
                    <input 
                      type="text" 
                      value={mockupUrl} 
                      onChange={(e) => setMockupUrl(e.target.value)}
                      className="w-full bg-[#0A0D14] text-white border border-gray-900 rounded-xl px-2.5 py-1.5 focus:ring-1 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-gray-400 block mb-1">Qual Dispositivo Rerenderizar?</span>
                    <div className="flex gap-1.5">
                      {["macbook", "iphone", "glass"].map((deviceSet) => (
                        <button
                          key={deviceSet}
                          onClick={() => setMockupLayout(deviceSet as any)}
                          className={`flex-1 py-1.5 px-3 rounded-lg border font-bold text-[10px] font-sans cursor-pointer capitalize transition ${
                            mockupLayout === deviceSet
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-400/30"
                              : "bg-[#0A0D14] text-gray-500 border-gray-900 hover:text-white"
                          }`}
                        >
                          {deviceSet}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Display Mockup Frame Right */}
                <div className="md:col-span-7 flex flex-col items-center justify-center bg-[#070b12] border border-gray-900 p-6 rounded-2xl relative min-h-[250px] overflow-hidden">
                  
                  {mockupLayout === "macbook" && (
                    <div className="w-full max-w-[270px] space-y-0.5">
                      {/* Browser Chrome Bar */}
                      <div className="bg-[#1e293b] rounded-t-lg p-1.5 flex items-center justify-between border-b border-gray-800">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        </div>
                        <span className="text-[7.5px] text-gray-400 font-mono font-medium truncate w-1/2 text-center bg-slate-900 px-2 py-0.5 rounded">
                          {mockupUrl}
                        </span>
                        <div className="w-3"></div>
                      </div>
                      {/* Device body view */}
                      <div className="bg-[#121824] rounded-b-lg border border-gray-800 h-[120px] p-3 flex flex-col justify-between shadow-2xl relative">
                        <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
                        <span className="text-[7px] font-mono text-emerald-400 uppercase tracking-widest font-bold">KoreNexus ERP App</span>
                        <h5 className="text-[10px] font-semibold text-white tracking-tight mt-1">{mockupTitle}</h5>
                        
                        {/* Fake micro widgets/graphs inside simulated mockup */}
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div className="h-6 bg-[#0a0d14] rounded-lg border border-gray-900 flex flex-col items-center justify-center"><span className="text-[5.5px] opacity-45 uppercase font-mono">Vendas</span> <span className="text-[6.5px] font-bold text-white leading-none">R$ 54K</span></div>
                          <div className="h-6 bg-[#0a0d14] rounded-lg border border-gray-900 flex flex-col items-center justify-center"><span className="text-[5.5px] opacity-45 uppercase font-mono">Status</span> <span className="text-[6.5px] font-bold text-emerald-400 leading-none">ATIVO</span></div>
                          <div className="h-6 bg-[#0a0d14] rounded-lg border border-gray-900 flex flex-col items-center justify-center"><span className="text-[5.5px] opacity-45 uppercase font-mono">Core</span> <span className="text-[6.5px] font-bold text-blue-400 leading-none">1ms</span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {mockupLayout === "iphone" && (
                    <div className="w-[110px] h-[210px] bg-[#0A0D14] rounded-[24px] border-[5.5px] border-slate-700 shadow-2xl p-2 flex flex-col justify-between relative text-center">
                      {/* Dynamic Island bar */}
                      <div className="w-1/2 h-2.5 bg-black rounded-full mx-auto mb-1.5 flex items-center justify-center"><span className="w-1 h-1 rounded-full bg-slate-900"></span></div>
                      <span className="text-[6.5px] font-mono text-emerald-400 uppercase tracking-widest font-bold">KoreNexus</span>
                      
                      <div className="space-y-1 my-auto">
                        <h5 className="text-[8.5px] font-semibold text-white tracking-tight">{mockupTitle}</h5>
                        <p className="text-[6px] text-gray-400">Aplicação executando em ambiente sandbox de alta performance.</p>
                      </div>

                      <div className="bg-slate-900 rounded-lg p-1.5 border border-slate-800 flex justify-between items-center text-[5.5px] font-mono">
                        <span className="text-gray-400">Total</span>
                        <strong className="text-emerald-400">R$ 4.290,00</strong>
                      </div>
                    </div>
                  )}

                  {mockupLayout === "glass" && (
                    <div className="w-full max-w-[260px] bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl text-left space-y-2 relative">
                      <span className="text-[9px] uppercase font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold tracking-widest">Glass UI layout</span>
                      <h5 className="text-xs font-semibold text-white font-sans mt-2">{mockupTitle}</h5>
                      <p className="text-[10px] text-[#8892b0] leading-relaxed">Visão translúcida responsiva de altíssimo valor de marketing, otimizada para capturar leads corporativos no topo das pesquisas Google.</p>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
