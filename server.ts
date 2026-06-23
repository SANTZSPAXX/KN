import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { exec } from "child_process";

dotenv.config();

import config from "./src/config";
import { syncSheetsToLocal, exportLocalToSheets } from "./serverSheetsSync";

// Environment variables take precedence over config files for security & host flexibility
const getGeminiApiKey = () => process.env.GEMINI_API_KEY || config.GEMINI_API_KEY || "";
const getGnewsApiKey = () => process.env.GNEWS_API_KEY || config.GNEWS_API_KEY || "";
const getUptimeRobotApiKey = () => process.env.UPTIME_ROBOT_API_KEY || config.UPTIME_ROBOT_API_KEY || "";

const DB_PATH = path.isAbsolute(config.DB_PATH) ? config.DB_PATH : path.join(process.cwd(), config.DB_PATH);
const KFLOW_CACHE_FILE = path.isAbsolute(config.KFLOW_CACHE_FILE) ? config.KFLOW_CACHE_FILE : path.join(process.cwd(), config.KFLOW_CACHE_FILE);
const CACHE_FILE = path.isAbsolute(config.CHAT_CACHE_FILE) ? config.CHAT_CACHE_FILE : path.join(process.cwd(), config.CHAT_CACHE_FILE);

const app = express();
const PORT = 3000;

// Force HTTPS and Redirect WWW to non-WWW for SEO and domain security unification
app.use((req, res, next) => {
  const host = req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  
  let targetHost = host || "";
  let shouldRedirect = false;
  let targetProtocol = protocol;

  // 1. Force HTTPS in production (when proxied and protocol is http)
  if (protocol === "http" && process.env.NODE_ENV === "production") {
    targetProtocol = "https";
    shouldRedirect = true;
  }

  // 2. Redirect WWW to non-WWW
  if (targetHost && /^www\./i.test(targetHost)) {
    targetHost = targetHost.replace(/^www\./i, "");
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    return res.redirect(301, `${targetProtocol}://${targetHost}${req.originalUrl}`);
  }
  next();
});

// --- Advanced HTTP Security Headers & CORS Middleware ---
app.use((req, res, next) => {
  // CORS Configuration
  const allowedOrigins = [
    "https://korenexus.com.br",
    "http://localhost:3000",
    "https://ais-dev-rjpcq6gnsizsgq2pnpjltv-746194214364.us-east1.run.app",
    "https://ais-pre-rjpcq6gnsizsgq2pnpjltv-746194214364.us-east1.run.app"
  ];
  if (process.env.APP_URL) {
    allowedOrigins.push(process.env.APP_URL);
  }
  const origin = req.headers.origin;
  if (origin) {
    const isLocalhost = origin.startsWith("http://localhost:") || origin === "http://localhost" || origin.startsWith("http://127.0.0.1:");
    const isSecure = origin.startsWith("https://");
    if (isLocalhost || isSecure) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      res.setHeader("Access-Control-Allow-Origin", "https://korenexus.com.br");
    }
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Security Headers
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' data: https:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' data: https://fonts.gstatic.com; " +
    "img-src 'self' data: https: REFERRER; " +
    "frame-src 'self' https:; " +
    "connect-src 'self' https: wss: http://localhost:3000"
  );

  // Preflight Handle
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

// --- In-Memory Rate Limiting to Mitigate DoS / Brute-Force ---
const apiHitsStore: Record<string, { timestamp: number; count: number }> = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_HITS_PER_WINDOW = 120; // 120 requests max per minute per IP

app.use("/api/", (req, res, next) => {
  const ip = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "anonymous").split(",")[0].trim();
  const now = Date.now();
  
  if (!apiHitsStore[ip]) {
    apiHitsStore[ip] = { timestamp: now, count: 1 };
  } else {
    const record = apiHitsStore[ip];
    if (now - record.timestamp < RATE_LIMIT_WINDOW) {
      record.count += 1;
      if (record.count > MAX_HITS_PER_WINDOW) {
        res.setHeader("Retry-After", "30");
        return res.status(429).json({
          error: "Limite de requisições excedido",
          message: "Muitas requisições originárias deste IP. Por favor, aguarde de 30 a 60 segundos antes de tentar novamente.",
          status: 429
        });
      }
    } else {
      // Reset rate limit window
      record.timestamp = now;
      record.count = 1;
    }
  }
  next();
});

// Middleware
app.use(express.json());

// Initialize AI using lazy load to permit key changes on-the-fly and prevent startup crashes
let aiInstance: GoogleGenAI | null = null;
let lastAiKey: string | null = null;
function getAiClient(): GoogleGenAI {
  const currentKey = getGeminiApiKey();
  
  if (!aiInstance || lastAiKey !== currentKey) {
    aiInstance = new GoogleGenAI({
      apiKey: currentKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    lastAiKey = currentKey;
  }
  return aiInstance;
}

// Helper to get current Brasília (America/Sao_Paulo) formatted Date and Time
function getBrasiliaTimeStr(): string {
  const now = new Date();
  const optionsDate = {
    day: "2-digit" as const,
    month: "2-digit" as const,
    year: "numeric" as const,
    timeZone: "America/Sao_Paulo"
  };
  const optionsTime = {
    hour: "2-digit" as const,
    minute: "2-digit" as const,
    hour12: false,
    timeZone: "America/Sao_Paulo"
  };
  return now.toLocaleDateString("pt-BR", optionsDate) + " às " + now.toLocaleTimeString("pt-BR", optionsTime);
}

// Helper to extract clean Google Spreadsheet ID from potential relative links or full URL
function extractSpreadsheetId(input: string | any): string {
  if (!input || typeof input !== "string") return "";
  const trimmed = input.trim();
  const match = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

// Kflow prompt-response persistent cache
let kflowCache: Record<string, string> = {};

// Ensure directory exists at initialization time
try {
  const dir = path.dirname(KFLOW_CACHE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (fs.existsSync(KFLOW_CACHE_FILE)) {
    kflowCache = JSON.parse(fs.readFileSync(KFLOW_CACHE_FILE, "utf-8"));
  }
} catch (err) {
  console.error("[Kflow Prompt Cache Init] Erro ao carregar cache:", err);
}

function saveKflowCache() {
  try {
    fs.writeFileSync(KFLOW_CACHE_FILE, JSON.stringify(kflowCache, null, 2), "utf-8");
  } catch (err) {
    console.error("[Kflow Prompt Cache Save] Erro:", err);
  }
}

// Token-limited Kflow & Groq format integration helpers
async function generateWithKflow(prompt: string, systemInstruction: string = ""): Promise<string> {
  const cacheKey = (systemInstruction + "|" + prompt).trim().toLowerCase();
  if (kflowCache[cacheKey]) {
    console.log(`[Kflow Prompt Cache Hit] Resposta do prompt obtida instantaneamente para economizar tokens.`);
    return kflowCache[cacheKey];
  }

  const modelsToTry = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768"
  ];

  const urlsToTry = [
    "https://api.knexus.qzz.io/v1/chat/completions",
    "https://api.knexus.qzz.io/openai/v1/chat/completions",
    "https://api.knexus.qzz.io/functions/v1/gateway-de-fluxo-k/openai/v1/chat/completions",
    "https://oynkfxgwcbynvkhvnctx.supabase.co/functions/v1/gateway-de-fluxo-k/openai/v1/chat/completions"
  ];

  let lastError = "";

  for (const baseUrl of urlsToTry) {
    for (const modelName of modelsToTry) {
      try {
        console.log(`[Kflow API] Requisitando inferência: ${baseUrl} com modelo: ${modelName}`);
        const response = await fetch(baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer Kn_xbqn683LFPAoMotu7J8VjzQ92meL6rg"
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
              { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1000 // Limita estritamente o consumo de tokens conforme exigido
          })
        });

        if (response.ok) {
          const payload = await response.json();
          const content = payload.choices?.[0]?.message?.content || "";
          if (content) {
            console.log(`[Kflow API] Sucesso na resposta técnica usando o modelo: ${modelName} via ${baseUrl}`);
            // Save to cache
            kflowCache[cacheKey] = content;
            saveKflowCache();
            return content;
          }
        } else {
          const textErr = await response.text().catch(() => "");
          console.warn(`[Kflow API] Erro no modelo ${modelName} via ${baseUrl}: STATUS ${response.status}. Detalhes: ${textErr}`);
          lastError = `${response.status} - ${textErr}`;
        }
      } catch (err: any) {
        console.error(`[Kflow API] Erro físico de conexão no modelo ${modelName} via ${baseUrl}:`, err.message);
        lastError = err.message;
      }
    }
  }

  // Backup fallback to built-in Gemini 3.5 Flash connection for reliability
  console.log("[Kflow API Fallback] Executando redundância local com Gemini 3.5 Flash...");
  try {
    const response = await getAiClient().models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1000 // Mantém limite rígido de segurança
      }
    });
    const resText = response.text || "";
    if (resText) {
      kflowCache[cacheKey] = resText;
      saveKflowCache();
    }
    return resText;
  } catch (gemErr: any) {
    console.error("[Kflow API Fallback] Redundância Gemini também falhou:", gemErr.message);
    throw new Error(`Kflow API e Gemini falharam. Último erro Kflow: ${lastError}. Erro Gemini: ${gemErr.message}`);
  }
}

async function generateChatWithKflow(messages: { role: string; content: string }[], systemInstruction: string): Promise<string> {
  const modelsToTry = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768"
  ];

  const urlsToTry = [
    "https://api.knexus.qzz.io/v1/chat/completions",
    "https://api.knexus.qzz.io/openai/v1/chat/completions",
    "https://api.knexus.qzz.io/functions/v1/gateway-de-fluxo-k/openai/v1/chat/completions",
    "https://oynkfxgwcbynvkhvnctx.supabase.co/functions/v1/gateway-de-fluxo-k/openai/v1/chat/completions"
  ];

  let lastError = "";

  const mappedMessages = messages.map(msg => ({
    role: msg.role === "user" ? "user" : "assistant",
    content: msg.content
  }));

  for (const baseUrl of urlsToTry) {
    for (const modelName of modelsToTry) {
      try {
        console.log(`[Kflow Chat] Chat completion usando modelo ${modelName} via ${baseUrl}`);
        const response = await fetch(baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer Kn_xbqn683LFPAoMotu7J8VjzQ92meL6rg"
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: "system", content: systemInstruction },
              ...mappedMessages
            ],
            temperature: 0.7,
            max_tokens: 600 // Limite de tokens para respostas rápidas de conversação
          })
        });

        if (response.ok) {
          const payload = await response.json();
          const content = payload.choices?.[0]?.message?.content || "";
          if (content) {
            console.log(`[Kflow Chat] Conversa com sucesso usando modelo: ${modelName} via ${baseUrl}`);
            return content;
          }
        } else {
          const textErr = await response.text().catch(() => "");
          console.warn(`[Kflow Chat] Feedback de Erro ${modelName} via ${baseUrl}: ${response.status} - ${textErr}`);
          lastError = `${response.status} - ${textErr}`;
        }
      } catch (err: any) {
        console.error(`[Kflow Chat] Conexão falhou para chat com ${modelName} via ${baseUrl}:`, err.message);
        lastError = err.message;
      }
    }
  }

  // Backup fallback to Gemini for chat
  console.log("[Kflow Chat Fallback] Desviando chat para Gemini 3.5 Flash de contingência...");
  try {
    const contents = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));
    const response = await getAiClient().models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 600
      }
    });
    return response.text || "";
  } catch (gemErr: any) {
    console.error("[Kflow Chat Fallback] Falha catastrófica no fallback Gemini:", gemErr.message);
    return "Desculpe, tive um contratempo temporário ao processar sua pergunta. Por favor contacte nossa equipe comercial direta por WhatsApp.";
  }
}

// Initial Seeding data for the customized spreadsheet tabs
const INITIAL_SPREADSHEETS = {
  produtos: [
    { id: "p1", nome: "KoreERP", descricao: "ERP completo sob medida para indústrias, distribuidoras e redes de varejo.", categoria: "Sistemas ERP", preco: "Sob Consulta", status: "Ativo" },
    { id: "p2", nome: "KoreCRM", descricao: "Gestão inteligente de funil de vendas integrado com automação de WhatsApp.", categoria: "Sistemas CRM", preco: "Sob Consulta", status: "Ativo" },
    { id: "p3", nome: "KoreFlow", descricao: "Motor de BPMN e automação de fluxos operacionais internos de empresas.", categoria: "Automação", preco: "Sob Consulta", status: "Novo" },
    { id: "p4", nome: "KoreAnalytics", descricao: "Painéis de business intelligence em tempo real para tomada de decisões.", categoria: "Dados & BI", preco: "Sob Consulta", status: "Beta" }
  ],
  ferramentas: [
    { id: "f1", nome: "KoreValid", tipo: "Validador API", utilidade: "Validador automático de notas fiscais (Sefaz) e CNPJ em lotes.", link: "#", status: "Estável" },
    { id: "f2", nome: "KoreCalc", tipo: "Fintech", utilidade: "Calculadora de margens financeiras operacionais complexas para e-commerce.", link: "#", status: "Estável" },
    { id: "f3", nome: "KoreDeploy", tipo: "DevOps", utilidade: "Esteira de automatização de deploy multi-cloud com Kubernetes.", link: "#", status: "Beta" },
    { id: "f4", nome: "KoreToken", tipo: "Segurança", utilidade: "Gerador de chaves de autenticação de fator duplo (MFA) em microsserviços.", link: "#", status: "Estável" },
    { id: "f5", nome: "KoreSefazParser", tipo: "Validador API", utilidade: "Parser e decodificador de chaves de acesso Sefaz (44 dígitos) para NF-e/NFC-e.", link: "#", status: "Estável" },
    { id: "f6", nome: "KoreXMLInjetor", tipo: "Fiscais", utilidade: "Injetor automático de tags tributárias federais e estaduais em XMLs fiscais legados.", link: "#", status: "Novo" },
    { id: "f7", nome: "KoreDBDiff", tipo: "DevOps", utilidade: "Comparador de esquemas de banco de dados SQL e gerador automático de migrações estruturadas.", link: "#", status: "Beta" },
    { id: "f8", nome: "KoreSanitize", tipo: "Segurança", utilidade: "Motor de sanitização dinâmica de dados contra injeções SQL e XSS em requisições de APIs públicas.", link: "#", status: "Estável" },
    { id: "f9", nome: "KoreQR Core", tipo: "Fintech", utilidade: "Gerador e estilizados de QR Codes inteligentes e chaves Pix síncronas.", link: "/gqcode", status: "Novo" }
  ],
  apps: [
    { id: "a1", nome: "KoreCollector", plataforma: "Android / iOS", descricao: "Rápido coletor de dados para inventários de estoques inteligentes.", downloads: "25k+", detalhes: "Leitor de código de barras portátil offline." },
    { id: "a2", nome: "KoreSales", plataforma: "Android / iOS", descricao: "Aplicativo mobile para força de vendas para emitir pedidos em rota de viagem.", downloads: "15k+", detalhes: "Sincronização híbrida automática e suporte offline." },
    { id: "a3", nome: "KoreDelivery", plataforma: "Android / iOS", descricao: "Rastreamento em tempo real de frotas e confirmação de entrega.", downloads: "8k+", detalhes: "Assinatura digital e anexo de fotos no local da entrega." }
  ],
  promocoes: [
    { id: "pr1", titulo: "Design de UI Grátis", desconto: "100% OFF", validade: "15-08-2026", cupom: "KOREDESIGN", condicao: "Na contratação de qualquer sistema sob medida completo." },
    { id: "pr2", titulo: "Setup de Legado Desconto", desconto: "15% de Desconto", validade: "30-10-2026", cupom: "MIGRAKORE", condicao: "Para migração e reengenharia de sistemas legados antigos." },
    { id: "pr3", titulo: "Consultoria Gratuita", desconto: "Grátis", validade: "Sempre Ativo", cupom: "QUEROKORE", condicao: "Reunião de 1 hora de arquitetura de software de sistemas." }
  ],
  blog: [
    { id: "b1", titulo: "O Futuro do Software sob Medida", resumo: "Por que investir em sistemas personalizados é mais lucrativo do que assinar softwares engessados de prateleira.", categoria: "Mercado", data: "08/06/2026 às 15:30", autor: "Yugny Ohany Miotelo", leitura: "5 min" },
    { id: "b2", titulo: "Erros Comuns na Integração de ERPs", resumo: "Veja como evitar falhas graves ao conectar lojas virtuais, CRMs e faturadores no seu ERP corporativo.", categoria: "Sistemas", data: "05/06/2026 às 12:00", autor: "Yugny Ohany Miotelo", leitura: "8 min" },
    { id: "b3", titulo: "UX em Aplicativos Corporativos", resumo: "Como um bom design de interface para colaboradores eleva o faturamento e reduz o tempo de treinamento.", categoria: "Design", data: "01/06/2026 às 10:15", autor: "Yugny Ohany Miotelo", leitura: "4 min" }
  ],
  notificacoes: [
    { id: "n1", titulo: "🚀 Lançamento KoreNexus", corpo: "Bem-vindos ao novo site KoreNexus! Layout minimalista, de alta performance e integrado.", data: "08/06/2026 às 18:00", enviadoPor: "admin@korenexus.com.br" }
  ]
};

// Seed database file if it does not exist
function initDatabase() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_SPREADSHEETS, null, 2), "utf8");
    console.log("Spreadsheet database seeded successfully at:", DB_PATH);
  } else {
    // Force existing database to sign all posts under Yugny Ohany Miotelo to ensure strict consistency and append missing tools
    try {
      const content = fs.readFileSync(DB_PATH, "utf8");
      const dbObj = JSON.parse(content);
      let changed = false;

      if (dbObj) {
        if (Array.isArray(dbObj.blog)) {
          dbObj.blog = dbObj.blog.map((post: any) => {
            if (post.autor !== "Yugny Ohany Miotelo") {
              post.autor = "Yugny Ohany Miotelo";
              changed = true;
            }
            if (post.data && !post.data.includes(" às ")) {
              const defaultHours = [" às 15:30", " às 12:00", " às 10:15"];
              const rHour = defaultHours[Math.floor(Math.random() * defaultHours.length)];
              post.data = post.data + rHour;
              changed = true;
            }
            return post;
          });
        }

        if (!Array.isArray(dbObj.ferramentas)) {
          dbObj.ferramentas = [];
          changed = true;
        }

        // Add any missing default tool
        INITIAL_SPREADSHEETS.ferramentas.forEach((tool: any) => {
          if (!dbObj.ferramentas.some((f: any) => f.id === tool.id)) {
            dbObj.ferramentas.push(tool);
            changed = true;
          }
        });

        if (changed) {
          fs.writeFileSync(DB_PATH, JSON.stringify(dbObj, null, 2), "utf8");
          console.log("[Seeder] Base de dados existente migrada, assinaturas e utilitários sincronizados.");
        }
      }
    } catch(e: any) {
      console.warn("Falha ao analisar banco de dados existente no seeder:", e.message);
    }
  }
}
initDatabase();

// Helper to read database
function readDatabase() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, "utf8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error reading db", error);
  }
  return INITIAL_SPREADSHEETS;
}

// Helper to generate slug for sitemaps matching client-side logic
const slugifyForSitemap = (text: string) => {
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

// Dynamic sitemap builder that combines static routes with live DB products, tools, apps, and blog posts
function buildSitemapXml(dbData: any): string {
  const domain = "https://korenexus.com.br";
  const nowStr = new Date().toISOString().split("T")[0];

  const staticRoutes = [
    "",
    "/inicio",
    "/produtos",
    "/ferramentas",
    "/apps",
    "/chatkore",
    "/promocoes",
    "/apis",
    "/status",
    "/blog",
    "/sobre",
    "/documentacao",
    "/privacidade",
    "/cursos",
    "/gadgets",
    "/playground",
    "/sheets",
    "/gqcode",
    "/diagnostico",
    "/korecad"
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  staticRoutes.forEach(route => {
    xml += `
  <url>
    <loc>${domain}${route}</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route === "" || route === "/inicio" ? "1.0" : "0.8"}</priority>
  </url>`;
  });

  if (dbData) {
    if (Array.isArray(dbData.produtos)) {
      dbData.produtos.forEach((prod: any) => {
        if (prod.nome) {
          xml += `
  <url>
    <loc>${domain}/produtos/${slugifyForSitemap(prod.nome)}</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        }
      });
    }

    if (Array.isArray(dbData.ferramentas)) {
      dbData.ferramentas.forEach((tool: any) => {
        if (tool.nome) {
          xml += `
  <url>
    <loc>${domain}/ferramentas/${slugifyForSitemap(tool.nome)}</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        }
      });
    }

    if (Array.isArray(dbData.apps)) {
      dbData.apps.forEach((appItem: any) => {
        if (appItem.nome) {
          xml += `
  <url>
    <loc>${domain}/apps/${slugifyForSitemap(appItem.nome)}</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        }
      });
    }

    if (Array.isArray(dbData.blog)) {
      dbData.blog.forEach((post: any) => {
        if (post.titulo) {
          xml += `
  <url>
    <loc>${domain}/blog/${slugifyForSitemap(post.titulo)}</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
        }
      });
    }
  }

  xml += `
</urlset>`;
  return xml;
}

// Helper to write sitemap files on-the-fly when databases or articles change
function updatePhysicalSitemaps(dbData: any) {
  try {
    const xml = buildSitemapXml(dbData);

    // Save synchronously to prevent process locks
    fs.writeFileSync(path.join(process.cwd(), "sitemap.xml"), xml, "utf8");
    
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml, "utf8");

    const distDir = path.join(process.cwd(), "dist");
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, "sitemap.xml"), xml, "utf8");
    }
    
    console.log(`[Sitemap Automático] Sitemap físico e rotas dinâmicas atualizados em tempo real.`);
  } catch (err: any) {
    console.error("[Sitemap Automático Erro] Falha ao sintonizar sitemaps:", err.message);
  }
}

// Helper to write database with automatic rotating version backups
function writeDatabase(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
    
    // Automatically rebuild static/dynamic sitemaps on modifications
    updatePhysicalSitemaps(data);
    
    // Automatic backup routine
    try {
      const backupDir = path.join(process.cwd(), "data", "backups");
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupPath = path.join(backupDir, `spreadsheet_backup_${timestamp}.json`);
      fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), "utf8");
      console.log(`[Backup Automático] Cópia de segurança criada com sucesso em: ${backupPath}`);
      
      // Retain only the last 5 backups for storage economy but solid coverage
      const backupFiles = fs.readdirSync(backupDir)
        .filter(f => f.startsWith("spreadsheet_backup_") && f.endsWith(".json"))
        .map(f => ({ name: f, time: fs.statSync(path.join(backupDir, f)).mtime.getTime() }))
        .sort((a, b) => a.time - b.time);
        
      if (backupFiles.length > 5) {
        const excess = backupFiles.slice(0, backupFiles.length - 5);
        excess.forEach(f => {
          fs.unlinkSync(path.join(backupDir, f.name));
          console.log(`[Backup Rotativo] Removido backup obsoleto antigo: ${f.name}`);
        });
      }
    } catch(err: any) {
      console.error("Falha ao gerar rotina automática de backup:", err.message);
    }
    
    return true;
  } catch (error) {
    console.error("Error writing db", error);
    return false;
  }
}

// Server-Sent Events (SSE) clients
let sseClients: express.Response[] = [];

// API ENDPOINTS

// 1. Get raw spreadsheet data (all tabs/abas)
app.get("/api/spreadsheet-data", (req, res) => {
  const data = readDatabase();
  res.json(data);
});

// 2. Update specific tab/aba in the spreadsheet
app.post("/api/spreadsheet-update", (req, res) => {
  const { tabName, rows } = req.body;
  if (!tabName || !Array.isArray(rows)) {
    return res.status(400).json({ error: "Parâmetros inválidos" });
  }

  const currentDb = readDatabase();
  if (!(tabName in currentDb)) {
    return res.status(404).json({ error: "Aba não encontrada" });
  }

  currentDb[tabName] = rows;
  const success = writeDatabase(currentDb);

  if (success) {
    res.json({ message: `Aba '${tabName}' atualizada com sucesso!`, success: true });
  } else {
    res.status(500).json({ error: "Erro ao salvar banco de dados corporativo" });
  }
});

// 3. Simple administrative auth check (hidden Admin access trigger)
app.post("/api/auth/verify-admin", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ isAdmin: false, error: "E-mail é obrigatório." });
  }

  const emailLower = email.toLowerCase();
  
  if (emailLower === "contato@korenexus.com.br") {
    if (password === "Noah1512a.") {
      return res.json({ isAdmin: true, role: "SuperAdmin" });
    } else {
      return res.status(403).json({ isAdmin: false, error: "Senha incorreta para este administrador." });
    }
  }

  if (emailLower === "admin@korenexus.com.br" || emailLower.endsWith("@korenexus.com.br")) {
    return res.json({ isAdmin: true, role: "SuperAdmin" });
  }
  res.status(403).json({ isAdmin: false, error: "Acesso negado. Apenas admin autorizado." });
});

// 3.1 Get full keys and secrets config for administrators
app.post("/api/admin/config/get", (req, res) => {
  const { email } = req.body;
  if (!email || !(email.toLowerCase() === "contato@korenexus.com.br" || email.toLowerCase().endsWith("@korenexus.com.br"))) {
    return res.status(403).json({ success: false, error: "Acesso administrativo negado." });
  }

  const CONFIG_PATH = path.join(process.cwd(), "data", "config.json");
  try {
    let currentConfig = {};
    if (fs.existsSync(CONFIG_PATH)) {
      currentConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    }
    res.json({ success: true, config: currentConfig });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Erro ao carregar do banco de dados de chaves: " + err.message });
  }
});

// 3.2 Update and save keys and secrets directly inside config.json and update process.env dynamically
app.post("/api/admin/config/save", (req, res) => {
  const { email, newConfig } = req.body;
  if (!email || !(email.toLowerCase() === "contato@korenexus.com.br" || email.toLowerCase().endsWith("@korenexus.com.br"))) {
    return res.status(403).json({ success: false, error: "Acesso administrativo negado." });
  }

  const CONFIG_PATH = path.join(process.cwd(), "data", "config.json");
  try {
    let currentConfig = {};
    if (fs.existsSync(CONFIG_PATH)) {
      currentConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    }

    const merged = { ...currentConfig, ...newConfig };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(merged, null, 2), "utf-8");

    // Dynamic hot reload of secrets in memory process variables
    for (const key in newConfig) {
      process.env[key] = newConfig[key];
    }

    console.log(`[Configurações] Segredos e chaves atualizados e recarregados síncronos em tempo de execução por admin: ${email}`);
    res.json({ success: true, message: "Parâmetros e chaves operativas salvas e recarregadas em tempo de execução com sucesso!" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Erro ao gravar configuração no banco de dados de chaves: " + err.message });
  }
});

// 3.3 Export total spreadsheet content data + keys config format backup to completely restore/migrate
app.post("/api/admin/config/export-all", (req, res) => {
  const { email } = req.body;
  if (!email || !(email.toLowerCase() === "contato@korenexus.com.br" || email.toLowerCase().endsWith("@korenexus.com.br"))) {
    return res.status(403).json({ success: false, error: "Acesso administrativo negado." });
  }

  try {
    const CONFIG_PATH = path.join(process.cwd(), "data", "config.json");
    const DB_PATH = path.join(process.cwd(), "data", "spreadsheet.json");

    let keysData = {};
    let sheetsData = {};

    if (fs.existsSync(CONFIG_PATH)) {
      keysData = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    }
    if (fs.existsSync(DB_PATH)) {
      sheetsData = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    }

    const exportBundle = {
      exportedAt: new Date().toISOString(),
      exportedBy: email,
      environment: {
        APP_URL: process.env.APP_URL || "",
        NODE_ENV: process.env.NODE_ENV || "production"
      },
      keysAndSecrets: keysData,
      sheetsDatabase: sheetsData
    };

    res.json({
      success: true,
      bundle: exportBundle,
      filename: `korenexus_backup_full_${Date.now()}.json`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Erro ao estruturar base de exportação unificada: " + err.message });
  }
});

// 3.4 Restores total database tables and configs from an uploaded backup bundle
app.post("/api/admin/config/restore-all", (req, res) => {
  const { email, bundle } = req.body;
  if (!email || !(email.toLowerCase() === "contato@korenexus.com.br" || email.toLowerCase().endsWith("@korenexus.com.br"))) {
    return res.status(403).json({ success: false, error: "Acesso administrativo negado." });
  }

  if (!bundle || !bundle.sheetsDatabase) {
    return res.status(400).json({ success: false, error: "Arquivo de backup inválido ou ausente." });
  }

  try {
    const CONFIG_PATH = path.join(process.cwd(), "data", "config.json");
    // Ensure directory paths exist
    const configDir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Restore database
    const successWrite = writeDatabase(bundle.sheetsDatabase);
    if (!successWrite) {
      return res.status(500).json({ success: false, error: "Falha interna ao gravar o banco de dados." });
    }

    // Restore config keys if existing
    if (bundle.keysAndSecrets && Object.keys(bundle.keysAndSecrets).length > 0) {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(bundle.keysAndSecrets, null, 2), "utf-8");
      for (const key in bundle.keysAndSecrets) {
        process.env[key] = bundle.keysAndSecrets[key];
      }
    }

    console.log(`[Backup Restored] Banco de dados e configurações restaurados com sucesso em tempo de execução por admin: ${email}`);
    res.json({
      success: true,
      message: "Sucesso absoluto! Todas as tabelas da planilha e chaves operacionais foram totalmente restauradas."
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Falha ao restaurar banco de dados: " + err.message });
  }
});

// Synchronize Google Sheets containing database worksheets to local DB_PATH
app.post("/api/admin/sheets/sync", async (req, res) => {
  const { email, accessToken, spreadsheetId } = req.body;
  if (!email || !(email.toLowerCase() === "contato@korenexus.com.br" || email.toLowerCase().endsWith("@korenexus.com.br"))) {
    return res.status(403).json({ success: false, error: "Acesso administrativo negado." });
  }

  if (!accessToken) {
    return res.status(400).json({ success: false, error: "Token de acesso Google OAuth2 é obrigatório." });
  }

  const rawId = spreadsheetId || process.env.GOOGLE_SPREADSHEET_ID;
  const finalSpreadsheetId = extractSpreadsheetId(rawId);
  if (!finalSpreadsheetId) {
    return res.status(400).json({ success: false, error: "ID da planilha Google Sheets não fornecido e não configurado." });
  }

  console.log(`[Google Sheets Sync] Sincronização iniciada por ${email} para planilha: ${finalSpreadsheetId}`);
  const result = await syncSheetsToLocal(accessToken, finalSpreadsheetId, DB_PATH, (newData) => {
    writeDatabase(newData);
  });

  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

// Export local database to Google Sheets to seed configuration worksheets
app.post("/api/admin/sheets/export", async (req, res) => {
  const { email, accessToken, spreadsheetId } = req.body;
  if (!email || !(email.toLowerCase() === "contato@korenexus.com.br" || email.toLowerCase().endsWith("@korenexus.com.br"))) {
    return res.status(403).json({ success: false, error: "Acesso administrative negado." });
  }

  if (!accessToken) {
    return res.status(400).json({ success: false, error: "Token de acesso Google OAuth2 é obrigatório." });
  }

  const rawId = spreadsheetId || process.env.GOOGLE_SPREADSHEET_ID;
  const finalSpreadsheetId = extractSpreadsheetId(rawId);
  if (!finalSpreadsheetId) {
    return res.status(400).json({ success: false, error: "ID da planilha Google Sheets não fornecido e não configurado." });
  }

  console.log(`[Google Sheets Export] Exportação iniciada por ${email} para planilha: ${finalSpreadsheetId}`);
  const result = await exportLocalToSheets(accessToken, finalSpreadsheetId, DB_PATH);

  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

// Endpoint to run the secure auto-deploy script and push changes directly to GitHub
app.post("/api/admin/deploy", (req, res) => {
  const { email } = req.body;

  // Enforce security
  if (!email || !(email.toLowerCase() === "admin@korenexus.com.br" || email.toLowerCase().endsWith("@korenexus.com.br"))) {
    return res.status(403).json({ success: false, error: "Acesso negado. Identidade administrativa inválida para deploys." });
  }

  console.log(`[Deploy Executável] Iniciado remotamente por: ${email}`);

  // Execute script directly using bash to avoid executable/CRLF interpreter issues in nested containers
  exec("bash ./deploy.sh", (err, stdout, stderr) => {
    if (err) {
      console.error("[Deploy Remoto Erro]:", err);
      return res.status(500).json({
        success: false,
        error: "Falha na execução do build e envio ao GitHub",
        details: err.message,
        stdout: stdout,
        stderr: stderr
      });
    }

    console.log("[Deploy Remoto Sucesso]:", stdout);
    res.json({
      success: true,
      message: "Build e Deploy executados com absoluto sucesso no GitHub!",
      stdout: stdout
    });
  });
});

// 4. Live Notifications System via Server-Sent Events (SSE)
app.get("/api/notifications/subscribe", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Add client
  sseClients.push(res);
  console.log(`Client subscribed to Notifications. Total clients: ${sseClients.length}`);

  // Send initial ping/welcome
  res.write("data: " + JSON.stringify({ type: "welcome", message: "Conectado ao canal de notificações KoreNexus." }) + "\n\n");

  req.on("close", () => {
    sseClients = sseClients.filter(client => client !== res);
    console.log(`Client unsubscribed. Total clients: ${sseClients.length}`);
  });
});

// 5. Send notification to all clients, and write to spreadsheet
app.post("/api/notifications/publish", (req, res) => {
  const { titulo, corpo, enviadoPor } = req.body;
  if (!titulo || !corpo) {
    return res.status(400).json({ error: "Título e corpo são obrigatórios" });
  }

  const currentDb = readDatabase();
  const id = "n" + (currentDb.notificacoes.length + 1);
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR") + " às " + now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const newNotification = {
    id,
    titulo,
    corpo,
    data: dateStr,
    enviadoPor: enviadoPor || "admin@korenexus.com.br"
  };

  currentDb.notificacoes.unshift(newNotification); // Add to start
  writeDatabase(currentDb);

  // Broadcast to all connected SSE clients
  const payload = JSON.stringify({ type: "notification", data: newNotification });
  sseClients.forEach(client => {
    client.write("data: " + payload + "\n\n");
  });

  res.json({ success: true, notification: newNotification });
});

// 5.5 KFLOW Reverse Proxy and GNews/Blog Custom Endpoints
app.get("/api/uptime-status", async (req, res) => {
  try {
    const response = await fetch("https://api.uptimerobot.com/v2/getMonitors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: getUptimeRobotApiKey(),
        format: "json",
        response_times: 1,
        all_time_uptime_ratio: 1,
      })
    });
    if (!response.ok) {
      throw new Error(`Uptime Robot retornou status: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (data.stat === "fail") {
      throw new Error(data.error?.message || "UptimeRobot API falhou");
    }
    res.json(data);
  } catch (error: any) {
    console.error("[UptimeRobot] Usando dados fictícios integrados de fallback:", error.message);
    res.json({
      stat: "ok",
      monitors: [
        { id: 1, friendly_name: "KoreERP Matrix (Produção)", status: 2, all_time_uptime_ratio: "99.98" },
        { id: 2, friendly_name: "KoreCRM WhatsApp Gateway (Ativo)", status: 2, all_time_uptime_ratio: "100.00" },
        { id: 3, friendly_name: "KoreCollector API (Logística)", status: 2, all_time_uptime_ratio: "99.95" },
        { id: 4, friendly_name: "WhatsApp Cloud Webhooks", status: 2, all_time_uptime_ratio: "100.00" }
      ]
    });
  }
});

app.get("/api/kflow-proxy", async (req, res) => {
  try {
    const response = await fetch("https://5c69fadb-90e6-4849-89a3-0da45120d9e1.lovableproject.com/embed");
    const html = await response.text();
    // Inject <base> tag to force absolute assets resolution from the source URL
    const updatedHtml = html.replace("<head>", `<head><base href="https://5c69fadb-90e6-4849-89a3-0da45120d9e1.lovableproject.com/">`);
    res.setHeader("Content-Type", "text/html");
    res.send(updatedHtml);
  } catch (error: any) {
    res.status(500).send("Erro ao carregar o Kflow no proxy reverso: " + error.message);
  }
});

app.get("/api/news24h", async (req, res) => {
  try {
    const apikey = getGnewsApiKey();
    const response = await fetch(`https://gnews.io/api/v4/top-headlines?category=technology&lang=pt&apikey=${apikey}`);
    if (!response.ok) {
      throw new Error("Erro na resposta da GNews API: " + response.statusText);
    }
    const data = await response.json();
    const articles = (data.articles || []).map((art: any) => ({
      ...art,
      author: "Yugny Ohany Miotelo",
      source: { name: "Yugny Ohany Miotelo" },
      publishedAt: art.publishedAt || new Date().toISOString()
    }));
    res.json({ articles });
  } catch (error: any) {
    console.error("Erro no proxy GNews:", error);
    // Safe mock fallback signed by Yugny
    const now = new Date();
    res.json({
      articles: [
        {
          title: "Kflow AI estabelece novo padrão em APIs Corporativas",
          description: "O ecossistema KoreNexus lança oficialmente o Kflow, entregando latência ultra baixa em inferência de dados empresariais.",
          url: "https://5c69fadb-90e6-4849-89a3-0da45120d9e1.lovableproject.com/embed",
          image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
          source: { name: "Yugny Ohany Miotelo" },
          author: "Yugny Ohany Miotelo",
          publishedAt: now.toISOString()
        },
        {
          title: "A Ascensão do Desenvolvimento Corporativo Híbrido",
          description: "Pesquisa aponta que 82% das médias empresas escolheram adotar sistemas web sob medida em substituição à planos engessados SaaS.",
          url: "https://korenexus.com.br",
          image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
          source: { name: "Yugny Ohany Miotelo" },
          author: "Yugny Ohany Miotelo",
          publishedAt: now.toISOString()
        }
      ]
    });
  }
});

// JSON-cleaning utility to handle mixed Markdown and code-block outputs from LLMs and Groq APIs
function cleanAndParseJson(rawText: string): any {
  let cleanText = rawText.trim();
  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```(json)?/, "").replace(/```$/, "").trim();
  }
  try {
    return JSON.parse(cleanText);
  } catch (err) {
    const startIndex = cleanText.indexOf("{");
    const endIndex = cleanText.lastIndexOf("}");
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      try {
        const potentialJson = cleanText.substring(startIndex, endIndex + 1);
        return JSON.parse(potentialJson);
      } catch (innerErr) {
        // continue
      }
    }
    // Simple regex fallback extraction
    const titleMatch = rawText.match(/"titulo"\s*:\s*"([^"]+)"/) || [null, "Título Tecnológico"];
    const summaryMatch = rawText.match(/"resumo"\s*:\s*"([^"]+)"/) || [null, "Breve resumo do andamento operacional com sistemas sob medida"];
    const categoryMatch = rawText.match(/"categoria"\s*:\s*"([^"]+)"/) || [null, "Sistemas"];
    const readMatch = rawText.match(/"leitura"\s*:\s*"([^"]+)"/) || [null, "5 min"];
    return {
      titulo: titleMatch[1],
      resumo: summaryMatch[1],
      categoria: categoryMatch[1],
      conteudo: rawText,
      leitura: readMatch[1]
    };
  }
}

app.post("/api/generate-blog-ai", async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "O tema do post é obrigatório." });
  }

  const prompt = `Crie um artigo de blog corporativo, técnico e inovador sobre o tema de tecnologia da informação ou software: "${topic}".
O artigo deve focar em eficiência de negócios, design arquitetural de software, ou redução de custos operacionais com engenharia customizada.
Você DEVE obrigatoriamente responder APENAS E EXCLUSIVAMENTE com um objeto JSON válido (sem blocos de código markdown o texto explicativo externo) com a seguinte exata estrutura em português:
{
  "titulo": "Título de alto impacto comercial",
  "resumo": "Resumo profissional de até 3 linhas que gere curiosidade no leitor",
  "categoria": "Sistemas",
  "conteudo": "Texto completo do artigo esteticamente formatado com títulos, subtítulos e parágrafos detalhados em Markdown.",
  "leitura": "5 min"
}`;

  try {
    const rawResult = await generateWithKflow(prompt, "Você é um especialista em redação técnica de sistemas corporativos da KoreNexus.");
    const parsedContent = cleanAndParseJson(rawResult);

    const dbData = readDatabase();
    const newId = "b" + Date.now();
    const dateStr = getBrasiliaTimeStr();

    const newPost = {
      id: newId,
      titulo: parsedContent.titulo || `Inovação Integrada: ${topic}`,
      resumo: parsedContent.resumo || "Impacto técnico gerado no ecossistema de dados.",
      categoria: parsedContent.categoria || "Sistemas",
      data: dateStr,
      autor: "Yugny Ohany Miotelo",
      leitura: parsedContent.leitura || "4 - 5 min",
      conteudo: parsedContent.conteudo || rawResult
    };

    dbData.blog.unshift(newPost);
    writeDatabase(dbData);

    res.json({ success: true, post: newPost });
  } catch (error: any) {
    console.error("[API Generate AI Error]:", error);
    res.status(500).json({ error: "Falha de processamento de IA ou Banco de dados: " + error.message });
  }
});

// RPA autonomous content generation task
async function autoGenerateRpaPost() {
  console.log("[RPA Cron Scheduler] Iniciando geração autônoma de posts técnicos...");
  const topics = [
    "Sistemas Logísticos offline-first em frotas de carga pesada nacional",
    "Segurança corporativa na integridade de dados na sincronização com ERPs legados",
    "Otimização algorítmica de rotas integrados à gateways inteligentes de geolocalização",
    "Automatização inteligente de faturamentos de alta complexidade em microsserviços",
    "Como inteligências artificiais conversacionais multiplicam engajamento em CRMs ativos",
    "Arquiteturas de fluxo unificados de dados baseados em webhooks de altíssima latência"
  ];
  const topic = topics[Math.floor(Math.random() * topics.length)];

  const prompt = `Crie uma notícia de blog técnica corporativa extremadamente inovadora sobre o tema de TI: "${topic}".
O artigo deve focar em eficiência, design arquitetural, ou redução de custos operacionais com engenharia customizada no ecossistema KoreNexus.
Sempre retorne APENAS um objeto JSON válido (sem tags markdown de código nem texto inicial) com a seguinte exata estrutura em português:
{
  "titulo": "Título técnico relevante e polido",
  "resumo": "Resumo analítico profissional de até 2 linhas",
  "categoria": "Sistemas",
  "conteudo": "Artigo completo formatado esteticamente com títulos, subtítulos e parágrafos detalhados em Markdown.",
  "leitura": "5 min"
}`;

  try {
    const rawResult = await generateWithKflow(prompt, "Você é um especialista em conteúdo técnico da KoreNexus.");
    const parsedContent = cleanAndParseJson(rawResult);
    const dbData = readDatabase();

    // Check if duplicate title
    if (dbData.blog.some((p: any) => p.titulo === parsedContent.titulo)) {
      console.log("[RPA] Artigo duplicado detectado, ignorando inserção.");
      return;
    }

    const newId = "b" + Date.now();
    const dateStr = getBrasiliaTimeStr();

    const newPost = {
      id: newId,
      titulo: parsedContent.titulo || `Processamento de Alta Disponibilidade: ${topic}`,
      resumo: parsedContent.resumo || "Impacto técnico gerado no ecossistema de dados.",
      categoria: parsedContent.categoria || "Sistemas",
      data: dateStr,
      autor: "Yugny Ohany Miotelo",
      leitura: parsedContent.leitura || "5 min",
      conteudo: parsedContent.conteudo || rawResult
    };

    dbData.blog.unshift(newPost);
    writeDatabase(dbData);
    console.log(`[RPA Cron Success] Novo artigo gerado automaticamente por: ${newPost.autor} em ${newPost.data}. Título: "${newPost.titulo}"`);
  } catch (err: any) {
    console.error("[RPA Cron Error] Falha ao executar tarefa de geração:", err.message);
  }
}

// Set up 1-hour Cron scheduler interval for AI-generated posts (1 * 60 * 60 * 1000 = 3,600,000 ms)
const ONE_HOUR_MS = 1 * 60 * 60 * 1000;
setInterval(() => {
  autoGenerateRpaPost().catch((err) => console.error("[RPA Cron Interval Error]:", err));
}, ONE_HOUR_MS);

// Run RPA once immediately 3 seconds after boot to seed a beautiful live article
setTimeout(() => {
  autoGenerateRpaPost().catch((err) => console.error("[RPA Startup Boot Error]:", err));
}, 3000);

// Global ChatKore response caching to conserve tokens
let chatCache: Record<string, string> = {};

// Ensure data folder exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (fs.existsSync(CACHE_FILE)) {
  try {
    chatCache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
  } catch (err) {
    console.error("[ChatKore Cache Load] Erro ao carregar cache de chatbot:", err);
  }
}

function saveChatCache() {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(chatCache, null, 2), "utf-8");
  } catch (err) {
    console.error("[ChatKore Cache Save] Erro ao salvar cache de chatbot:", err);
  }
}

// 6. Interactive ChatKore assistant powered by Gemini 3.5 Flash
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "Formato de mensagens inválido" });
  }

  // Extract the latest user query to check cache
  const userMessages = messages.filter((m: any) => m.role === "user");
  const queryText = userMessages[userMessages.length - 1]?.content?.trim()?.toLowerCase() || "";

  if (queryText && chatCache[queryText]) {
    console.log(`[ChatKore Cache Hit] Reenviando resposta cacheada para salvar tokens: "${queryText.substring(0, 45)}..."`);
    return res.json({ reply: chatCache[queryText] });
  }

  // Set system prompt containing core business data of KoreNexus
  const systemInstruction = `Você é a Inteligência Artificial corporativa "ChatKore" da KoreNexus Inteligência Digital e Sistemas sob medida (korenexus.com.br).
Seu objetivo é ser extremamente profissional, tecnológico, de pegada minimalista, focado e amigável.
Trate os clientes em português do Brasil de maneira elegante.

Aqui estão seus dados reais e institucionais que você DEVE obrigatoriamente fornecer quando o usuário perguntar:
- Atendimento: Atendimento 100% Online e Remoto para todo o Brasil. Não temos sede física para garantir máxima agilidade e redução de custos operacionais das soluções estruturadas.
- Horário de Atendimento: Segunda a Sábado das 08h às 18h.
- Serviços: Desenvolvimento de Sistemas Corporativos Web e Desktop sob medida, ERPs customizados, CRMs, Automação de fluxos de processos, e Aplicativos (Apps) Móveis de altíssima performance para iOS e Android.
- E-mail institucional de contato: contato@korenexus.com.br
- Telefone / WhatsApp direto para falar com projetos/comercial: (11) 98938-7263
- Link direto de WhatsApp de Atendimento: https://api.whatsapp.com/send/?phone=5511989387263&text=Olá!%20Gostaria%20de%20falar%20sobre%20um%20projeto%20com%20a%20KoreNexus.

Valores institucionais:
- Sistemas focados em usabilidade corporativa e alto desempenho.
- Modelagem de negócios profunda antes do desenvolvimento de códigos.
- Soluções 100% integradas às necessidades reais dos usuários sem planos de mensalidades engessados.

Responda de forma concisa, esteticamente limpa, use Markdown para formatar os tópicos e destaque os botões e os canais de contato mais convenientes como o WhatsApp institucional fornecido. Se perguntarem sobre ferramentas ou promoções, indique que elas estão disponíveis no menu correspondente do site!`;

  try {
    const history = messages.slice(-8); // We only take the last 8 messages to keep response fast and under context limit
    const replyText = await generateChatWithKflow(history, systemInstruction);
    
    // Cache the reply for this query
    if (queryText && replyText) {
      chatCache[queryText] = replyText;
      saveChatCache();
    }

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error("ChatKore API server error:", error);
    res.status(500).json({ error: "Erro de comunicação com a IA ChatKore. Detalhes: " + error.message });
  }
});

// 6.5 Action Plan Chat and Sender
app.post("/api/plan-action", async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "Formato de mensagens inválido" });
  }

  const systemInstruction = `Você é um Engenheiro de Software Sênior e Consultor de Negócios da KoreNexus.
Seu objetivo é analisar as ideias, dores ou problemas de negócios enviados pelo cliente e formular um PLANO DE AÇÃO completo, profissional, tecnológico e sob medida.

O plano deve responder detalhadamente e em formato Markdown limpo e amigável:
1. **Resumo da Solução**: Uma breve descrição do sistema sugerido para o negócio dele (ex: ERP personalizado, RPA, Web App, App sincronizado, etc).
2. **Gargalos Corrigidos**: Que desperdícios de tempo, dinheiro ou processos serão estancados com a solução proposta.
3. **Fases de Implementação (Roadmap)**: Divida a implementação em 3 fases curtas e pragmáticas (Planejamento/Modelagem, Desenvolvimento/Homologação, Deploy/Escopo de Produção).
4. **Estimativa de Prazos & SLAs**: Indique os prazos recomendados para entrega e tempo de suporte garantido de proximidade para Jundiaí e região.
5. **Tecnologias de Ponta**: Sugira bancos de dados modernos (ex: PostgreSQL), ambiente em nuvem isolado sem taxas de licença recorrentes, e interfaces corporativas com alta fidelidade visual.

Seja focado, sério, motivador e profissional. Forneça o plano com tópicos numerados ou listas claras que fiquem muito elegantes quando lidas e fáceis de exportar para PDF.`;

  try {
    const history = messages.slice(-6);
    const replyText = await generateChatWithKflow(history, systemInstruction);
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Plan Action API server error:", error);
    res.status(500).json({ error: "Erro ao gerar Plano de Ação: " + error.message });
  }
});

let sentPlans: any[] = [];
const SENT_PLANS_FILE = path.join(process.cwd(), "data", "sent_plans.json");

// Load stored plans if file exists
try {
  if (fs.existsSync(SENT_PLANS_FILE)) {
    sentPlans = JSON.parse(fs.readFileSync(SENT_PLANS_FILE, "utf-8"));
  }
} catch (err) {
  console.error("Erro ao carregar sent_plans.json:", err);
}

app.post("/api/send-plan", (req, res) => {
  const { clientIdea, planText, name, email, phone } = req.body;
  
  const newLead = {
    id: "lead_" + Date.now(),
    name: name || "Cliente KoreNexus",
    email: email || "contato@korenexus.com.br",
    phone: phone || "Sem telefone",
    clientIdea: clientIdea || "Ideia geral de negócio",
    planText: planText,
    sentAt: new Date().toISOString()
  };

  sentPlans.unshift(newLead);
  
  try {
    if (!fs.existsSync(path.join(process.cwd(), "data"))) {
      fs.mkdirSync(path.join(process.cwd(), "data"), { recursive: true });
    }
    fs.writeFileSync(SENT_PLANS_FILE, JSON.stringify(sentPlans, null, 2), "utf-8");
  } catch (err) {
    console.error("Erro ao salvar sent_plans.json:", err);
  }

  console.log(`[Lead Recebido] Plano de Ação enviado com sucesso para contato@korenexus.com.br!`, newLead);
  res.json({ success: true, message: "Os dados foram enviados para análise técnica da equipe KoreNexus (contato@korenexus.com.br) com sucesso!" });
});

// RPA Schedule to update blog posts from GNews API every 5 hours and save to DB
async function rpaUpdateNewsAndBlog() {
  console.log("[RPA Cron] Iniciando verificação programada de notícias (frequência: a cada 5 horas) de alta integridade...");
  try {
    const apikey = getGnewsApiKey();
    const response = await fetch(`https://gnews.io/api/v4/top-headlines?category=technology&lang=pt&apikey=${apikey}`);
    if (!response.ok) {
      throw new Error(`GNews retornou status: ${response.status}`);
    }
    const data = await response.json();
    const articles = data.articles || [];
    if (articles.length === 0) {
      console.log("[RPA Cron] Nenhum artigo novo retornado do portal de notícias.");
      return;
    }

    const dbData = readDatabase();
    if (!dbData.blog) {
      dbData.blog = [];
    }

    let updated = false;

    // Take up to 2 distinct recent articles to transform into full articles
    for (const article of articles.slice(0, 2)) {
      // Check if we already have this post
      const isDuplicate = dbData.blog.some((p: any) => 
        (p.titulo || "").toLowerCase().trim() === (article.title || "").toLowerCase().trim() ||
        (p.resumo || "").includes((article.title || "").substring(0, 25))
      );
      if (isDuplicate) {
        continue;
      }

      console.log(`[RPA Cron] Integrando nova matéria tecnológica: "${article.title}"`);
      
      const promptText = `Crie um artigo de blog corporativo, técnico e inovador sobre o tema: "${article.title}". Descrição prévia: "${article.description}".
O artigo deve focar em eficiência de negócios, arquitetura técnica de software, integrações ou dados sob medida corporativos.
Você DEVE obrigatoriamente responder APENAS E EXCLUSIVAMENTE com um objeto JSON válido (sem blocos de código markdown ou texto extra) com a seguinte exata estrutura em português:
{
  "titulo": "Título de altíssimo impacto empresarial",
  "resumo": "Resumo profissional de até 3 linhas que gere valor imediato",
  "categoria": "Sistemas",
  "conteudo": "Markdown completo do artigo com subtítulos, análises de microsserviços, modelagem de fluxos e lições práticas.",
  "leitura": "5 min"
}`;

      let parsedContent: any = null;

      try {
        const rawContent = await generateWithKflow(promptText, "Você é o redator sênior de engenharia de software da KoreNexus.");
        parsedContent = cleanAndParseJson(rawContent);
      } catch (err: any) {
        console.error("[RPA Cron GNews Error] Falha no gerador assistido por IA:", err.message);
      }

      // If we managed to parsed or get content, construct beautifully and insert
      if (parsedContent && parsedContent.titulo) {
        const dateStr = getBrasiliaTimeStr();

        const newPost = {
          id: "b_rpa_" + Date.now() + "_" + Math.floor(Math.random() * 100),
          titulo: parsedContent.titulo,
          resumo: parsedContent.resumo || article.description || "Uma nova oportunidade de mercado sob análise de sistemas da KoreNexus.",
          categoria: parsedContent.categoria || "Inovação",
          data: dateStr,
          autor: "Yugny Ohany Miotelo",
          leitura: parsedContent.leitura || "5 min",
          conteudo: parsedContent.conteudo || "Texto completo sincronizado de notícias globais de alta integridade."
        };

        dbData.blog.unshift(newPost);
        updated = true;
        console.log(`[RPA Cron] Novo artigo inserido por RPA e assinado por Yugny: "${newPost.titulo}"`);
      }
    }

    if (updated) {
      writeDatabase(dbData);
      console.log("[RPA Cron] Banco de dados de artigos atualizado com absoluto sucesso.");
      
      // Let's also broadcast an SSE notification to all connected clients that a new post arrived!
      sseClients.forEach((client) => {
        try {
          client.write("data: " + JSON.stringify({ 
            type: "database_update", 
            message: "⚠️ Nova publicação assinada por Yugny Ohany Miotelo adicionada ao blog!",
            tabName: "blog"
          }) + "\n\n");
        } catch (sseErr) {
          // ignore closed clients
        }
      });
    }
  } catch (error: any) {
    console.error("[RPA Cron] Falha na execução da rotina de 5 horas:", error.message);
  }
}

// Robots.txt dynamic endpoint
app.get("/robots.txt", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(`User-agent: *
Allow: /
Sitemap: https://korenexus.com.br/sitemap.xml
`);
});

// Dynamic XML Sitemap for advanced crawling
app.get("/sitemap.xml", (req, res) => {
  const dbData = readDatabase();
  const domain = "https://korenexus.com.br";
  const nowStr = new Date().toISOString().split("T")[0];

  const staticRoutes = [
    "",
    "/inicio",
    "/produtos",
    "/ferramentas",
    "/apps",
    "/chatkore",
    "/promocoes",
    "/apis",
    "/status",
    "/blog",
    "/sobre",
    "/documentacao",
    "/privacidade"
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Static routes
  staticRoutes.forEach(route => {
    xml += `
  <url>
    <loc>${domain}${route}</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route === "" || route === "/inicio" ? "1.0" : "0.8"}</priority>
  </url>`;
  });

  // Dynamic products
  if (Array.isArray(dbData.produtos)) {
    dbData.produtos.forEach((prod: any) => {
      xml += `
  <url>
    <loc>${domain}/produtos/${slugifyForSitemap(prod.nome)}</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
  }

  // Dynamic tools
  if (Array.isArray(dbData.ferramentas)) {
    dbData.ferramentas.forEach((tool: any) => {
      xml += `
  <url>
    <loc>${domain}/ferramentas/${slugifyForSitemap(tool.nome)}</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
  }

  // Dynamic apps
  if (Array.isArray(dbData.apps)) {
    dbData.apps.forEach((appItem: any) => {
      xml += `
  <url>
    <loc>${domain}/apps/${slugifyForSitemap(appItem.nome)}</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
  }

  // Dynamic blog posts
  if (Array.isArray(dbData.blog)) {
    dbData.blog.forEach((post: any) => {
      xml += `
  <url>
    <loc>${domain}/blog/${slugifyForSitemap(post.titulo)}</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    });
  }

  xml += `
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.send(xml);
});

// Helper to parse Brasilia time strings saved in database to JS Dates for RSS
function parseBrasiliaDate(dateStr: string): Date {
  try {
    if (!dateStr) return new Date();
    // Expected format: "15/06/2026 às 11:20" or plain dates "15/06/2026"
    const cleaned = dateStr.replace(" às ", " ").trim();
    const [datePart, timePart] = cleaned.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      let hour = 12;
      let minute = 0;
      if (timePart) {
        const [h, m] = timePart.split(":").map(Number);
        if (!isNaN(h)) hour = h;
        if (!isNaN(m)) minute = m;
      }
      const date = new Date(year, month - 1, day, hour, minute);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  } catch (error) {
    console.error("Error parsing date: ", dateStr, error);
  }
  return new Date();
}

// Helper to escape XML special characters
function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

// Dynamic Sitemap XML Endpoint that always returns the freshest links for SEO engines
app.get("/sitemap.xml", (req, res) => {
  try {
    const dbData = readDatabase();
    const xml = buildSitemapXml(dbData);
    res.setHeader("Content-Type", "application/xml");
    res.send(xml);
  } catch (error: any) {
    console.error("[Dynamic Sitemap Endpoint Error]:", error);
    res.status(500).send("Erro ao gerar o sitemap dinâmico.");
  }
});

// Dynamic RSS Feed Endpoint (supporting multiple paths like /rss.xml and /feed.xml)
app.get(["/rss.xml", "/feed.xml"], (req, res) => {
  try {
    const dbData = readDatabase();
    const domain = "https://korenexus.com.br";
    const nowStr = new Date().toUTCString();

    let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>KoreNexus | RSS Feed</title>
  <link>${domain}</link>
  <description>Soluções de Inteligência Artificial, ERPs corporativos industriais sob medida e conexões com alta performance. Acompanhe nosso feed oficial.</description>
  <language>pt-br</language>
  <copyright>Copyright 2026 KoreNexus. Todos os direitos reservados.</copyright>
  <lastBuildDate>${nowStr}</lastBuildDate>
  <atom:link href="${domain}/rss.xml" rel="self" type="application/rss+xml" />
`;

    if (Array.isArray(dbData.blog)) {
      // Sort blog posts by publishing date descending to put latest feeds at the top
      const sortedBlog = [...dbData.blog].sort((a: any, b: any) => {
        const dateA = parseBrasiliaDate(a.data);
        const dateB = parseBrasiliaDate(b.data);
        return dateB.getTime() - dateA.getTime();
      });

      sortedBlog.forEach((post: any) => {
        const postLink = `${domain}/blog/${slugifyForSitemap(post.titulo)}`;
        const pubDate = parseBrasiliaDate(post.data).toUTCString();
        const category = post.categoria || "Sistemas";
        const excerpt = post.resumo || "Artigo de tecnologia e inovação KoreNexus.";
        
        xml += `
  <item>
    <title>${escapeXml(post.titulo)}</title>
    <link>${postLink}</link>
    <guid isPermaLink="true">${postLink}</guid>
    <pubDate>${pubDate}</pubDate>
    <category>${escapeXml(category)}</category>
    <description>${escapeXml(excerpt)}</description>
    <author>contato@korenexus.com.br (Yugny Ohany Miotelo)</author>
  </item>`;
      });
    }

    xml += `
</channel>
</rss>`;

    res.setHeader("Content-Type", "application/xml");
    res.send(xml);
  } catch (error: any) {
    console.error("[RSS Feed Generation Error]:", error);
    res.status(500).send("Erro ao gerar o feed RSS.");
  }
});

// 1 Hour GNews Schedule setup (1 * 60 * 60 * 1000 = 3600000 ms)
const TIME_INTERVAL = 1 * 60 * 60 * 1000;
setInterval(rpaUpdateNewsAndBlog, TIME_INTERVAL);

// Fire background update after 3 seconds of server starting up
setTimeout(() => {
  rpaUpdateNewsAndBlog();
}, 3000);

// Vite middleware or production static files setup
async function setupViteOrStatic() {
  if (config.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static assets with generous Cache-Control headers
    app.use(express.static(distPath, {
      maxAge: "1d", // Cache general static files for 1 day
      setHeaders: (res, filePath) => {
        // If it's a static built asset/hash (JS, CSS, fonts, SVG) let it live longer (1 year)
        if (filePath.match(/\.(js|css|woff2?|svg|webp|avif|png|jpe?g)$/)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else if (filePath.endsWith(".html")) {
          // Keep HTML file references fresh to avoid stale bundle loads
          res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        }
      }
    }));

    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static build routing active.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KoreNexus Server running on port ${PORT}`);
  });
}

setupViteOrStatic();
