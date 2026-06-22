export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  preco: string;
  status: string;
}

export interface Ferramenta {
  id: string;
  nome: string;
  tipo: string;
  utilidade: string;
  link: string;
  status: string;
}

export interface AppModel {
  id: string;
  nome: string;
  plataforma: string;
  descricao: string;
  downloads: string;
  detalhes: string;
  link: string;
}

export interface Promocao {
  id: string;
  titulo: string;
  desconto: string;
  validade: string;
  cupom: string;
  condicao: string;
}

export interface BlogPost {
  id: string;
  titulo: string;
  resumo: string;
  categoria: string;
  data: string;
  autor: string;
  leitura: string;
  conteudo: string;
}

export interface Notificacao {
  id: string;
  titulo: string;
  conteudo: string;
  data: string;
  lida?: boolean;
}

export interface SpreadsheetData {
  produtos: Produto[];
  ferramentas: Ferramenta[];
  apps: AppModel[];
  promocoes: Promocao[];
  blog: BlogPost[];
  notificacoes: Notificacao[];
}

export const SPREADSHEET_DEFAULT_DATA: SpreadsheetData = {
  produtos: [
    {
      id: "p1",
      nome: "KoreERP",
      descricao: "ERP completo sob medida para indústrias, distribuidoras e redes de varejo.",
      categoria: "Sistemas ERP",
      preco: "Sob Consulta",
      status: "Ativo"
    },
    {
      id: "p2",
      nome: "KoreCRM",
      descricao: "Gestão inteligente de funil de vendas integrado com automação de WhatsApp.",
      categoria: "Sistemas CRM",
      preco: "Sob Consulta",
      status: "Ativo"
    },
    {
      id: "p3",
      nome: "KoreFlow",
      descricao: "Motor de BPMN e automação de fluxos operacionais internos de empresas.",
      categoria: "Automação",
      preco: "Sob Consulta",
      status: "Novo"
    },
    {
      id: "p4",
      nome: "KoreAnalytics",
      descricao: "Painéis de business intelligence em tempo real para tomada de decisões.",
      categoria: "Dados & BI",
      preco: "Sob Consulta",
      status: "Beta"
    }
  ],
  ferramentas: [
    {
      id: "f1",
      nome: "KoreValid",
      tipo: "Validador API",
      utilidade: "Validador automático de notas fiscais (Sefaz) e CNPJ em lotes.",
      link: "#",
      status: "Estável"
    },
    {
      id: "f2",
      nome: "KoreCalc",
      tipo: "Fintech",
      utilidade: "Calculadora de margens financeiras operacionais complexas para e-commerce.",
      link: "#",
      status: "Estável"
    },
    {
      id: "f3",
      nome: "KoreDeploy",
      tipo: "DevOps",
      utilidade: "Esteira de automatização de deploy multi-cloud com Kubernetes.",
      link: "#",
      status: "Beta"
    },
    {
      id: "f4",
      nome: "KoreToken",
      tipo: "Segurança",
      utilidade: "Gerador de chaves de autenticação de fator duplo (MFA) em microsserviços.",
      link: "#",
      status: "Estável"
    },
    {
      id: "f5",
      nome: "KoreSefazParser",
      tipo: "Validador API",
      utilidade: "Parser e decodificador de chaves de acesso Sefaz (44 dígitos) para NF-e/NFC-e.",
      link: "#",
      status: "Estável"
    },
    {
      id: "f6",
      nome: "KoreXMLInjetor",
      tipo: "Fiscais",
      utilidade: "Injetor automático de tags tributárias federais e estaduais em XMLs fiscais legados.",
      link: "#",
      status: "Novo"
    },
    {
      id: "f7",
      nome: "KoreDBDiff",
      tipo: "DevOps",
      utilidade: "Comparador de esquemas de banco de dados SQL e gerador automático de migrações estruturadas.",
      link: "#",
      status: "Beta"
    },
    {
      id: "f8",
      nome: "KoreSanitize",
      tipo: "Segurança",
      utilidade: "Motor de sanitização dinâmica de dados contra injeções SQL e XSS em requisições de APIs públicas.",
      link: "#",
      status: "Estável"
    },
    {
      id: "f9",
      nome: "KoreQR Core",
      tipo: "Fintech",
      utilidade: "Gerador e estilizados de QR Codes inteligentes e chaves Pix síncronas.",
      link: "/gqcode",
      status: "Novo"
    }
  ],
  apps: [
    {
      id: "a1",
      nome: "KoreCollector",
      plataforma: "Android / iOS",
      descricao: "Rápido coletor de dados para inventários de estoques inteligentes.",
      downloads: "25k+",
      detalhes: "Leitor de código de barras portátil offline.",
      link: ""
    },
    {
      id: "a2",
      nome: "KoreSales",
      plataforma: "Android / iOS",
      descricao: "Aplicativo mobile para força de vendas para emitir pedidos em rota de viagem.",
      downloads: "15k+",
      detalhes: "Sincronização híbrida automática e suporte offline.",
      link: ""
    },
    {
      id: "a3",
      nome: "KoreDelivery",
      plataforma: "Android / iOS",
      descricao: "Rastreamento em tempo real de frotas e confirmação de entrega.",
      downloads: "8k+",
      detalhes: "Assinatura digital e anexo de fotos no local da entrega.",
      link: ""
    }
  ],
  promocoes: [
    {
      id: "pr1",
      titulo: "Design de UI Grátis",
      desconto: "100% OFF",
      validade: "15-08-2026",
      cupom: "KOREDESIGN",
      condicao: "Na contratação de qualquer sistema sob medida completo."
    },
    {
      id: "pr2",
      titulo: "Setup de Legado Desconto",
      desconto: "15% de Desconto",
      validade: "30-10-2026",
      cupom: "MIGRAKORE",
      condicao: "Para migração e reengenharia de sistemas legados antigos."
    },
    {
      id: "pr3",
      titulo: "Consultoria Gratuita",
      desconto: "Grátis",
      validade: "Sempre Ativo",
      cupom: "QUEROKORE",
      condicao: "Reunião de 1 hora de arquitetura de software de sistemas."
    }
  ],
  blog: [
    {
      id: "b1781649523925",
      titulo: "Otimização de Arquiteturas de Fluxo Unificado de Dados com Webhooks de Alta Latência",
      resumo: "Aprimore a eficiência e reduza custos operacionais com soluções personalizadas de TI. Descubra como arquiteturas inovadoras baseadas em webhooks podem transformar seu ecossistema de dados.",
      categoria: "Sistemas",
      data: "16/06/2026 às 19:38",
      autor: "Yugny Ohany Miotelo",
      leitura: "5 min",
      conteudo: "# Introdução às Arquiteturas de Fluxo Unificado de Dados\nAs organizações modernas enfrentam desafios significativos na gestão de dados, especialmente quando se trata de integrar diferentes fontes e sistemas. Uma abordagem inovadora para superar esses desafios é a implementação de arquiteturas de fluxo unificado de dados baseadas em webhooks de alta latência.\n## Benefícios da Abordagem\nA utilização de webhooks permite uma comunicação eficiente e em tempo real entre diferentes sistemas, reduzindo a latência e melhorando a experiência do usuário. Além disso, essa abordagem promove a escalabilidade, flexibilidade e redução de custos operacionais."
    },
    {
      id: "b_rpa_1781649522069_74",
      titulo: "iOS 27: Revolução nas Comunicações Empresariais com Mensagens Otimizadas",
      resumo: "A Apple resolve os principais problemas da app Mensagens no iOS 27, melhorando a eficiência de negócios. Isso inclui otimizações de desempenho e integrações avançadas. As empresas podem agora contar com uma experiência de comunicação mais fluída e segura.",
      categoria: "Sistemas",
      data: "16/06/2026 às 19:38",
      autor: "Yugny Ohany Miotelo",
      leitura: "5 min",
      conteudo: "# Introdução ao iOS 27 e às Mensagens \n A Apple concentrou-se na otimização do iOS 27, trazendo melhorias de desempenho para diversas ferramentas nativas, incluindo as Mensagens. Essa atualização visa resolver três dos problemas mais irritantes enfrentados pelos usuários na app Mensagens. \n ## Problema 1: Desempenho Lento \n Um dos principais problemas era o desempenho lento da app, especialmente em dispositivos mais antigos."
    },
    {
      id: "b_rpa_1781649522069_30",
      titulo: "Análise de Dados em Tempo Real: Entendendo a Disputa Eleitoral em São Paulo",
      resumo: "A KoreNexus apresenta uma análise inovadora sobre a disputa eleitoral em São Paulo, utilizando tecnologias de Big Data e Inteligência Artificial. Flávio Bolsonaro lidera no primeiro turno, mas está em empate técnico com Lula no segundo. Entenda como a eficiência de negócios e arquitetura técnica de software podem influenciar a tomada de decisões.",
      categoria: "Sistemas",
      data: "16/06/2026 às 19:38",
      autor: "Yugny Ohany Miotelo",
      leitura: "5 min",
      conteudo: "# Introdução\nA disputa eleitoral em São Paulo é um exemplo de como a análise de dados em tempo real pode influenciar a tomada de decisões. Com a ajuda da tecnologia de Big Data e Inteligência Artificial, é possível entender melhor as tendências e preferências dos eleitores.\n## Arquitetura Técnica de Software\nA KoreNexus utilizou uma arquitetura de microsserviços para coletar e processar os dados em tempo real."
    }
  ],
  notificacoes: []
};
