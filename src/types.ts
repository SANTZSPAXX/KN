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
  link?: string;
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
  conteudo?: string;
  url?: string;
  image?: string;
}

export interface Notificacao {
  id: string;
  titulo: string;
  corpo: string;
  data: string;
  enviadoPor: string;
}

export interface SpreadsheetData {
  produtos: Produto[];
  ferramentas: Ferramenta[];
  apps: AppModel[];
  promocoes: Promocao[];
  blog: BlogPost[];
  notificacoes: Notificacao[];
}

export type TabKey = keyof SpreadsheetData;

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
