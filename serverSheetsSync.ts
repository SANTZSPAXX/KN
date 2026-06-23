import { google } from "googleapis";
import fs from "fs";

export interface SyncResult {
  success: boolean;
  message: string;
  details?: Record<string, number>;
}

function normalizeName(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function matchTabName(sheetTitle: string): string | null {
  const normTitle = normalizeName(sheetTitle);
  if (normTitle === "produtos" || normTitle === "produto" || normTitle.includes("produtos") || normTitle === "products" || normTitle === "product") return "produtos";
  if (normTitle === "ferramentas" || normTitle === "ferramenta" || normTitle.includes("ferramenta") || normTitle === "tools" || normTitle === "tool" || normTitle === "utilitarios" || normTitle === "utilitario") return "ferramentas";
  if (normTitle === "apps" || normTitle === "app" || normTitle === "aplicativos" || normTitle === "aplicativo" || normTitle.includes("app")) return "apps";
  if (normTitle === "promocoes" || normTitle === "promocao" || normTitle === "promocoes" || normTitle === "ofertas" || normTitle === "oferta" || normTitle === "promotions" || normTitle === "promotion") return "promocoes";
  if (normTitle === "blog" || normTitle === "posts" || normTitle === "post" || normTitle === "artigos" || normTitle === "artigo" || normTitle === "noticias" || normTitle === "noticia") return "blog";
  if (normTitle === "notificacoes" || normTitle === "notificacao" || normTitle === "push" || normTitle.includes("notificaca") || normTitle.includes("notificaco")) return "notificacoes";
  return null;
}

// Define matching database schemas and their friendly display headers and defaults
const EXPECTED_SCHEMAS: Record<string, { headers: string[]; defaults: any[] }> = {
  produtos: {
    headers: ["id", "nome", "descricao", "categoria", "preco", "status"],
    defaults: [
      { id: "p1", nome: "KoreERP", descricao: "ERP completo sob medida para indústrias, distribuidoras e redes de varejo.", categoria: "Sistemas ERP", preco: "Sob Consulta", status: "Ativo" },
      { id: "p2", nome: "KoreCRM", descricao: "Gestão inteligente de funil de vendas integrado com automação de WhatsApp.", categoria: "Sistemas CRM", preco: "Sob Consulta", status: "Ativo" },
      { id: "p3", nome: "KoreFlow", descricao: "Motor de BPMN e automação de fluxos operacionais internos de empresas.", categoria: "Automação", preco: "Sob Consulta", status: "Novo" },
      { id: "p4", nome: "KoreAnalytics", descricao: "Painéis de business intelligence em tempo real para tomada de decisões.", categoria: "Dados & BI", preco: "Sob Consulta", status: "Beta" }
    ]
  },
  ferramentas: {
    headers: ["id", "nome", "tipo", "utilidade", "link", "status"],
    defaults: [
      { id: "f1", nome: "KoreValid", tipo: "Validador API", utilidade: "Validador automático de notas fiscais (Sefaz) e CNPJ em lotes.", link: "#", status: "Estável" },
      { id: "f2", nome: "KoreCalc", tipo: "Fintech", utilidade: "Calculadora de margens financeiras operacionais complexas para e-commerce.", link: "#", status: "Estável" },
      { id: "f3", nome: "KoreDeploy", tipo: "DevOps", utilidade: "Esteira de automatização de deploy multi-cloud com Kubernetes.", link: "#", status: "Beta" },
      { id: "f4", nome: "KoreToken", tipo: "Segurança", utilidade: "Gerador de chaves de autenticação de fator duplo (MFA) em microsserviços.", link: "#", status: "Estável" },
      { id: "f5", nome: "KoreSefazParser", tipo: "Validador API", utilidade: "Parser e decodificador de chaves de acesso Sefaz (44 dígitos) para NF-e/NFC-e.", link: "#", status: "Estável" }
    ]
  },
  apps: {
    headers: ["id", "nome", "plataforma", "descricao", "downloads", "detalhes"],
    defaults: [
      { id: "a1", nome: "KoreCollector", plataforma: "Android / iOS", descricao: "Rápido coletor de dados para inventários de estoques inteligentes.", downloads: "25k+", detalhes: "Leitor de código de barras portátil offline." },
      { id: "a2", nome: "KoreSales", plataforma: "Android / iOS", descricao: "Aplicativo mobile para força de vendas para emitir pedidos em rota de viagem.", downloads: "15k+", detalhes: "Sincronização híbrida automática e suporte offline." },
      { id: "a3", nome: "KoreDelivery", plataforma: "Android / iOS", descricao: "Rastreamento em tempo real de frotas e confirmação de entrega.", downloads: "8k+", detalhes: "Assinatura digital e anexo de fotos no local da entrega." }
    ]
  },
  promocoes: {
    headers: ["id", "titulo", "desconto", "validade", "cupom", "condicao"],
    defaults: [
      { id: "pr1", titulo: "Design de UI Grátis", desconto: "100% OFF", validade: "15-08-2026", cupom: "KOREDESIGN", condicao: "Na contratação de qualquer sistema sob medida completo." },
      { id: "pr2", titulo: "Setup de Legado Desconto", desconto: "15% de Desconto", validade: "30-10-2026", cupom: "MIGRAKORE", condicao: "Para migração e reengenharia de sistemas legados antigos." },
      { id: "pr3", titulo: "Consultoria Gratuita", desconto: "Grátis", validade: "Sempre Ativo", cupom: "QUEROKORE", condicao: "Reunião de 1 hora de arquitetura de software de sistemas." }
    ]
  },
  blog: {
    headers: ["id", "titulo", "resumo", "categoria", "data", "autor", "leitura", "conteudo"],
    defaults: [
      { id: "b1", titulo: "O Futuro do Software sob Medida", resumo: "Por que investir em sistemas personalizados é mais lucrativo do que assinar softwares engessados de prateleira.", categoria: "Mercado", data: "08/06/2026 às 15:30", autor: "Yugny Ohany Miotelo", leitura: "5 min", conteudo: "O software corporativo moderno exige interfaces limpas, legibilidade total e adaptação robusta às regras de negócio locais." },
      { id: "b2", titulo: "Erros Comuns na Integração de ERPs", resumo: "Veja como evitar falhas graves ao conectar lojas virtuais, CRMs e faturadores no seu ERP corporativo.", categoria: "Sistemas", data: "05/06/2026 às 12:00", autor: "Yugny Ohany Miotelo", leitura: "8 min", conteudo: "Erros de timeout, problemas com conversão de tipos de XML e concorrência são desafios mitigados por conectores dedicados." }
    ]
  },
  notificacoes: {
    headers: ["id", "titulo", "corpo", "data", "enviadoPor"],
    defaults: [
      { id: "n1", titulo: "🚀 Lançamento KoreNexus", corpo: "Bem-vindos ao novo site KoreNexus! Layout minimalista, de alta performance e integrado.", data: "08/06/2026 às 18:00", enviadoPor: "admin@korenexus.com.br" }
    ]
  }
};

/**
 * Syncs Google Sheets data (Sheets -> local DB_PATH)
 * Assumes sheet tab names correspond to keys of local database (produtos, ferramentas, apps, promocoes, blog, notificacoes)
 * Automatically creates any missing tabs or missing columns back to the Google Sheet spreadsheet to assist the user.
 */
export async function syncSheetsToLocal(
  accessToken: string,
  spreadsheetId: string,
  dbPath: string,
  onSaveDb: (data: any) => void
): Promise<SyncResult> {
  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: "v4", auth });

    // 1. Fetch spreadsheet metadata to see active tabs
    const metadataResponse = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    let activeSheets = metadataResponse.data.sheets || [];

    const localData: Record<string, any> = {};

    // Load existing local database first to preserve any tab we didn't sync
    if (fs.existsSync(dbPath)) {
      try {
        const fileContent = fs.readFileSync(dbPath, "utf-8");
        const parsed = JSON.parse(fileContent);
        Object.assign(localData, parsed);
      } catch (err) {
        console.error("Erro lendo banco de dados antes da sincronização:", err);
      }
    }

    // 2. Identify missing sheets/tabs and auto-create them
    const expectedKeys = Object.keys(EXPECTED_SCHEMAS);
    const missingKeys: string[] = [];

    for (const key of expectedKeys) {
      const exists = activeSheets.some((sheet) => {
        const title = sheet.properties?.title || "";
        return matchTabName(title) === key;
      });
      if (!exists) {
        missingKeys.push(key);
      }
    }

    if (missingKeys.length > 0) {
      console.log("[Google Sheets Async] Criando abas ausentes na Planilha Google:", missingKeys);
      const addSheetRequests = missingKeys.map((key) => ({
        addSheet: {
          properties: {
            title: key,
          },
        },
      }));

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: addSheetRequests,
        },
      });

      // Retrieve refreshed sheets metadata
      const refreshedMetadata = await sheets.spreadsheets.get({
        spreadsheetId,
      });
      activeSheets = refreshedMetadata.data.sheets || [];
    }

    const reportDetails: Record<string, number> = {};
    let syncedAny = false;

    // 3. Process each sheet tab
    for (const sheetObj of activeSheets) {
      const sheetTitle = sheetObj.properties?.title;
      if (!sheetTitle) continue;

      const targetDbKey = matchTabName(sheetTitle);
      if (!targetDbKey) {
        console.log(`[Google Sheets Async] Aba '${sheetTitle}' não corresponde a nenhuma entidade do sistema. Ignorando.`);
        continue;
      }

      // Fetch row values for this sheet
      let res;
      try {
        res = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${sheetTitle}!A1:Z1000`,
        });
      } catch (getErr) {
        console.warn(`[Google Sheets Async] Falha ao coletar dados para ${sheetTitle}. Forçando re-inicialização.`);
      }

      const rows = res?.data?.values;
      let shouldReinitialize = false;
      let headerRowIndex = -1;
      let headers: string[] = [];
      let lowerHeaders: string[] = [];
      let idColIndex = -1;

      if (!rows || rows.length === 0) {
        shouldReinitialize = true;
      } else {
        // Find the header row (scan up to first 10 rows for ID column)
        for (let rIdx = 0; rIdx < Math.min(rows.length, 10); rIdx++) {
          if (!rows[rIdx] || rows[rIdx].length === 0) continue;
          const potentialHeaders = rows[rIdx].map((h) => String(h || "").trim());
          const potentialLower = potentialHeaders.map((h) => h.toLowerCase());
          
          const colIndex = potentialLower.findIndex(
            (h) => h === "id" || h === "código" || h === "codigo" || h === "key" || h === "identificador" || h === "#"
          );
          
          if (colIndex !== -1) {
            headerRowIndex = rIdx;
            headers = potentialHeaders;
            lowerHeaders = potentialLower;
            idColIndex = colIndex;
            break;
          }
        }

        if (headerRowIndex === -1) {
          shouldReinitialize = true;
        }
      }

      const schema = EXPECTED_SCHEMAS[targetDbKey];

      // Reinitialize if sheet is completely empty or missing required ID columns
      if (shouldReinitialize) {
        console.log(`[Google Sheets Async] Inicializando estrutura completa da aba '${sheetTitle}'...`);
        const defaultHeaders = schema.headers;
        const sourceItems = (localData[targetDbKey] && localData[targetDbKey].length > 0)
          ? localData[targetDbKey]
          : schema.defaults;

        const writeRows: string[][] = [defaultHeaders];
        sourceItems.forEach((item: any) => {
          const row = defaultHeaders.map((header) => {
            const val = item[header];
            return val === undefined || val === null ? "" : String(val);
          });
          writeRows.push(row);
        });

        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetTitle}!A1`,
          valueInputOption: "RAW",
          requestBody: {
            values: writeRows,
          },
        });

        localData[targetDbKey] = sourceItems;
        reportDetails[targetDbKey] = sourceItems.length;
        syncedAny = true;
        continue;
      }

      // Check if any expected columns are missing and append them to headers (Dynamic column creation!)
      const missingColumns = schema.headers.filter((h) => !lowerHeaders.includes(h.toLowerCase()));
      if (missingColumns.length > 0) {
        console.log(`[Google Sheets Async] Colunas ausentes detectadas em '${sheetTitle}'. Adicionando colunas:`, missingColumns);
        const updatedHeaders = [...headers, ...missingColumns];
        const rowNumber = headerRowIndex + 1;

        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetTitle}!A${rowNumber}`,
          valueInputOption: "RAW",
          requestBody: {
            values: [updatedHeaders],
          },
        });

        // Update local variables for row parsing
        headers = updatedHeaders;
        lowerHeaders = updatedHeaders.map((h) => h.toLowerCase());
      }

      // Parse spreadsheet records
      const parsedItems: any[] = [];
      for (let i = headerRowIndex + 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        const item: Record<string, any> = {};
        let hasAnyValue = false;

        headers.forEach((header, colIndex) => {
          if (!header) return;
          const val = row[colIndex] !== undefined ? String(row[colIndex]).trim() : "";
          if (val) hasAnyValue = true;
          
          if (colIndex === idColIndex) {
            item["id"] = val;
          } else {
            item[header.toLowerCase()] = val;
          }
        });

        if (hasAnyValue && item.id) {
          parsedItems.push(item);
        }
      }

      // Sync items to local structure
      if (parsedItems.length > 0) {
        localData[targetDbKey] = parsedItems;
        reportDetails[targetDbKey] = parsedItems.length;
        syncedAny = true;
      } else {
        // Safe fallback fill when spreadsheet has a header row but no content rows
        const sourceItems = (localData[targetDbKey] && localData[targetDbKey].length > 0)
          ? localData[targetDbKey]
          : schema.defaults;

        const writeRows: string[][] = [];
        sourceItems.forEach((item: any) => {
          const row = headers.map((header) => {
            const val = item[header.toLowerCase()] || item[header];
            return val === undefined || val === null ? "" : String(val);
          });
          writeRows.push(row);
        });

        if (writeRows.length > 0) {
          const startRow = headerRowIndex + 2;
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetTitle}!A${startRow}`,
            valueInputOption: "RAW",
            requestBody: {
              values: writeRows,
            },
          });
        }

        localData[targetDbKey] = sourceItems;
        reportDetails[targetDbKey] = sourceItems.length;
        syncedAny = true;
      }
    }

    if (!syncedAny) {
      return {
        success: false,
        message: "Nenhuma aba compatível foi sincronizada. Verifique os nomes das abas.",
      };
    }

    // Save database
    onSaveDb(localData);

    return {
      success: true,
      message: "Planilha do Google Sheets sincronizada com sucesso e abas/colunas ausentes criadas/adicionadas!",
      details: reportDetails,
    };
  } catch (err: any) {
    console.error("[Google Sheets Sync error]:", err);
    return {
      success: false,
      message: "Falha técnica na sincronização: " + (err.response?.data?.error?.message || err.message),
    };
  }
}

/**
 * Exports current local DB data to Google Sheets (Local DB -> Google Sheets)
 * Automatically structures headers and adds sheets if missing.
 */
export async function exportLocalToSheets(
  accessToken: string,
  spreadsheetId: string,
  dbPath: string
): Promise<SyncResult> {
  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const sheets = google.sheets({ version: "v4", auth });

    if (!fs.existsSync(dbPath)) {
      return {
        success: false,
        message: "O banco de dados local não existe para exportar.",
      };
    }

    const localData = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    const keys = ["produtos", "ferramentas", "apps", "promocoes", "blog", "notificacoes"];
    const reportDetails: Record<string, number> = {};

    for (const tabName of keys) {
      const items = localData[tabName];
      if (!Array.isArray(items) || items.length === 0) continue;

      // Extract all unique headers across all items to ensure consistent schema
      const headersSet = new Set<string>();
      headersSet.add("id"); // Ensure id is first
      items.forEach((item) => {
        Object.keys(item).forEach((k) => headersSet.add(k));
      });
      const headers = Array.from(headersSet);

      // Build rows
      const rows = [headers];
      items.forEach((item) => {
        const row = headers.map((header) => {
          const val = item[header];
          return val === undefined || val === null ? "" : String(val);
        });
        rows.push(row);
      });

      // Clear existing values or write directly
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${tabName}!A1`,
          valueInputOption: "RAW",
          requestBody: {
            values: rows,
          },
        });
        reportDetails[tabName] = items.length;
      } catch (updateErr: any) {
        // If sheet tabName doesn't exist, try adding the sheet tab as worksheets
        if (updateErr.message?.includes("Unable to parse range")) {
          try {
            await sheets.spreadsheets.batchUpdate({
              spreadsheetId,
              requestBody: {
                requests: [
                  {
                    addSheet: {
                      properties: {
                        title: tabName,
                      },
                    },
                  },
                ],
              },
            });

            // Retry update after creating the sheet
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: `${tabName}!A1`,
              valueInputOption: "RAW",
              requestBody: {
                values: rows,
              },
            });
            reportDetails[tabName] = items.length;
          } catch (createErr: any) {
            console.error(`Erro ao criar a aba ${tabName}:`, createErr.message);
          }
        } else {
          console.error(`Erro ao atualizar aba ${tabName}:`, updateErr.message);
        }
      }
    }

    return {
      success: true,
      message: "Banco de dados local exportado com sucesso para a planilha do Google Sheets!",
      details: reportDetails,
    };
  } catch (err: any) {
    console.error("[Google Sheets Export error]:", err);
    return {
      success: false,
      message: "Falha técnica na exportação: " + (err.response?.data?.error?.message || err.message),
    };
  }
}
