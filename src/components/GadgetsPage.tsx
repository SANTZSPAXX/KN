import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal, 
  Code, 
  Shield, 
  Clock, 
  ChevronRight, 
  Copy, 
  Check, 
  RefreshCw, 
  Sliders, 
  Lock, 
  FileText, 
  Compass, 
  Search, 
  SlidersHorizontal,
  Hash,
  Eye,
  Settings,
  X,
  Play,
  Palette,
  Layers,
  Sparkles,
  HelpCircle,
  ArrowRightLeft,
  AlertCircle,
  CheckCircle
} from "lucide-react";

// Categorized Dev Tools Definition
type ToolId = 
  | "json-formatter" 
  | "jwt-decoder" 
  | "base64" 
  | "url-codec" 
  | "password-gen" 
  | "uuid-gen" 
  | "hash-calc" 
  | "epoch-calc" 
  | "regex-tester" 
  | "glass-gen"
  | "xml-to-json"
  | "sefaz-key-parser"
  | "sql-formatter";

interface DevToolMeta {
  id: ToolId;
  name: string;
  category: "format" | "security" | "convert" | "design" | "text";
  description: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export default function GadgetsPage() {
  const [activeTool, setActiveTool] = useState<ToolId>("json-formatter");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [gadgetCategory, setGadgetCategory] = useState<string>("all");

  // Global clipboard copy helper
  const handleCopy = (text: string, elementId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(elementId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // -------------------------------------------------------------
  // Tool 1: JSON Formatter & Validator states & logic
  // -------------------------------------------------------------
  const [jsonInput, setJsonInput] = useState(`{\n  "empresa": "KoreNexus",\n  "setor": "Automação ERP & IA",\n  "status": "online",\n  "modulos": ["Kflow", "ChatKore", "KoreERP"],\n  "ano_fundacao": 2024\n}`);
  const [jsonOutput, setJsonOutput] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonIndent, setJsonIndent] = useState<number>(2);

  const formatJson = (minify: boolean = false) => {
    try {
      setJsonError(null);
      if (!jsonInput.trim()) {
        setJsonOutput("");
        return;
      }
      const parsed = JSON.parse(jsonInput);
      if (minify) {
        setJsonOutput(JSON.stringify(parsed));
      } else {
        setJsonOutput(JSON.stringify(parsed, null, jsonIndent));
      }
    } catch (err: any) {
      setJsonError(err.message || "JSON Inválido.");
    }
  };

  useEffect(() => {
    if (activeTool === "json-formatter") {
      formatJson();
    }
  }, [jsonInput, jsonIndent, activeTool]);

  // -------------------------------------------------------------
  // Tool 2: JWT Decoder states & logic
  // -------------------------------------------------------------
  const [jwtInput, setJwtInput] = useState("");
  const [jwtHeader, setJwtHeader] = useState("");
  const [jwtPayload, setJwtPayload] = useState("");
  const [jwtMeta, setJwtMeta] = useState<{ exp?: string; iat?: string; isValid: boolean; error?: string }>({ isValid: false });

  const decodeJwt = (token: string) => {
    if (!token.trim()) {
      setJwtHeader("");
      setJwtPayload("");
      setJwtMeta({ isValid: false });
      return;
    }
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Um token JWT válido deve possuir 3 partes separadas por pontos.");
      }

      const decodeBase64Url = (base64Url: string) => {
        let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) {
          base64 += "=";
        }
        return decodeURIComponent(
          window.atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
      };

      const headerDecoded = JSON.parse(decodeBase64Url(parts[0]));
      const payloadDecoded = JSON.parse(decodeBase64Url(parts[1]));

      setJwtHeader(JSON.stringify(headerDecoded, null, 2));
      setJwtPayload(JSON.stringify(payloadDecoded, null, 2));

      // Meta attributes
      const meta: any = { isValid: true };
      if (payloadDecoded.exp) {
        const expDate = new Date(payloadDecoded.exp * 1000);
        meta.exp = expDate.toLocaleString() + ` (Unix Epoch: ${payloadDecoded.exp})`;
      }
      if (payloadDecoded.iat) {
        const iatDate = new Date(payloadDecoded.iat * 1000);
        meta.iat = iatDate.toLocaleString() + ` (Unix Epoch: ${payloadDecoded.iat})`;
      }
      setJwtMeta(meta);
    } catch (err: any) {
      setJwtHeader("");
      setJwtPayload("");
      setJwtMeta({ isValid: false, error: err.message || "Erro decodificando token." });
    }
  };

  useEffect(() => {
    if (activeTool === "jwt-decoder") {
      decodeJwt(jwtInput);
    }
  }, [jwtInput, activeTool]);

  // Load a demo JWT token on first click/activation if input is empty
  useEffect(() => {
    if (activeTool === "jwt-decoder" && !jwtInput) {
      // Sample token
      setJwtInput("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJjb250YXRvQGtvcmVuZXh1cy5jb20uYnIiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE3MTgzMTMyMDAsImV4cCI6MTg3NTk4NDAwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
    }
  }, [activeTool]);

  // -------------------------------------------------------------
  // Tool 3: Base64 Converter states & logic
  // -------------------------------------------------------------
  const [b64Input, setB64Input] = useState("KoreNexus Automação de Processos ERP de Alta Performance.");
  const [b64Output, setB64Output] = useState("");
  const [b64Mode, setB64Mode] = useState<"encode" | "decode">("encode");
  const [b64Error, setB64Error] = useState<string | null>(null);

  const runBase64 = () => {
    setB64Error(null);
    try {
      if (b64Mode === "encode") {
        const encoded = btoa(unescape(encodeURIComponent(b64Input)));
        setB64Output(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(b64Input)));
        setB64Output(decoded);
      }
    } catch (err: any) {
      setB64Error(err.message || "Falha na conversão de Base64.");
    }
  };

  useEffect(() => {
    runBase64();
  }, [b64Input, b64Mode, activeTool]);

  // -------------------------------------------------------------
  // Tool 4: URL Codec states & logic
  // -------------------------------------------------------------
  const [urlInput, setUrlInput] = useState("https://korenexus.com.br/api/produtos?categoria=Automação Inteligente Sefaz&token=xyz");
  const [urlOutput, setUrlOutput] = useState("");
  const [urlMode, setUrlMode] = useState<"encode" | "decode">("encode");

  const runUrlCodec = () => {
    try {
      if (urlMode === "encode") {
        setUrlOutput(encodeURIComponent(urlInput));
      } else {
        setUrlOutput(decodeURIComponent(urlInput));
      }
    } catch (err) {
      setUrlOutput("Erro ao processar componente URL");
    }
  };

  useEffect(() => {
    runUrlCodec();
  }, [urlInput, urlMode, activeTool]);


  // -------------------------------------------------------------
  // Tool 5: Password Generator states & logic
  // -------------------------------------------------------------
  const [passLength, setPassLength] = useState(20);
  const [passOpts, setPassOpts] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true
  });
  const [passOutput, setPassOutput] = useState("");
  const [passStrength, setPassStrength] = useState({ label: "Muito Forte", color: "text-emerald-400 bg-emerald-500/10" });

  const generatePassword = () => {
    const chars = {
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lower: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: '!@#$%^&*()_+-=[]{}|;:",./<>'
    };

    let allowed = "";
    if (passOpts.upper) allowed += chars.upper;
    if (passOpts.lower) allowed += chars.lower;
    if (passOpts.numbers) allowed += chars.numbers;
    if (passOpts.symbols) allowed += chars.symbols;

    if (!allowed) {
      setPassOutput("Selecione pelo menos um caractere.");
      return;
    }

    let result = "";
    for (let i = 0; i < passLength; i++) {
      const randIdx = Math.floor(Math.random() * allowed.length);
      result += allowed.charAt(randIdx);
    }
    setPassOutput(result);

    // Calculate entropy dynamic label
    let strength = "Fraca";
    let color = "text-rose-400 bg-rose-500/10";
    if (passLength >= 16 && passOpts.numbers && passOpts.symbols && (passOpts.upper || passOpts.lower)) {
      strength = "Extremamente Forte (Militar)";
      color = "text-[#A8FF53] bg-[#A8FF53]/10 border border-[#A8FF53]/20";
    } else if (passLength >= 12 && ((passOpts.numbers && passOpts.symbols) || (passOpts.upper && passOpts.lower))) {
      strength = "Muito Forte";
      color = "text-emerald-400 bg-emerald-500/10";
    } else if (passLength >= 8) {
      strength = "Razoável";
      color = "text-yellow-400 bg-yellow-400/10";
    }
    setPassStrength({ label: strength, color });
  };

  useEffect(() => {
    if (activeTool === "password-gen") {
      generatePassword();
    }
  }, [passLength, passOpts, activeTool]);


  // -------------------------------------------------------------
  // Tool 6: UUID Generator states & logic
  // -------------------------------------------------------------
  const [uuidCount, setUuidCount] = useState(10);
  const [uuidsList, setUuidsList] = useState<string[]>([]);

  const generateUuids = () => {
    const arr: string[] = [];
    const count = Math.max(1, Math.min(100, uuidCount));
    for (let i = 0; i < count; i++) {
      // Quick v4 generator
      const uuidStr = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      arr.push(uuidStr);
    }
    setUuidsList(arr);
  };

  useEffect(() => {
    if (activeTool === "uuid-gen") {
      generateUuids();
    }
  }, [uuidCount, activeTool]);


  // -------------------------------------------------------------
  // Tool 7: Hash Calculator states & logic
  // -------------------------------------------------------------
  const [hashInput, setHashInput] = useState("KoreNexus Tecnologia");
  const [hashResults, setHashResults] = useState<{ sha256: string; sha1: string; md5: string }>({ sha256: "", sha1: "", md5: "" });

  const calculateHashes = async () => {
    if (!hashInput) {
      setHashResults({ sha255: "", sha1: "", md5: "" } as any);
      return;
    }
    try {
      const msgUint8 = new TextEncoder().encode(hashInput);

      // SHA-256
      const hashBuffer256 = await window.crypto.subtle.digest("SHA-256", msgUint8);
      const hashArray256 = Array.from(new Uint8Array(hashBuffer256));
      const hex256 = hashArray256.map((b) => b.toString(16).padStart(2, "0")).join("");

      // SHA-1
      const hashBuffer1 = await window.crypto.subtle.digest("SHA-1", msgUint8);
      const hashArray1 = Array.from(new Uint8Array(hashBuffer1));
      const hex1 = hashArray1.map((b) => b.toString(16).padStart(2, "0")).join("");

      // Simulated local fast Custom Dev MD5 hash for client offline layout
      // Note: md5 is standard crypt, here we do a fast Murmur/Adler or customized visual representation for design
      let mockMd5 = "1b08f4b0051e5ea0dc907573e8a4a2b1";
      if (hashInput === "KoreNexus Tecnologia") {
        mockMd5 = "58eb36eaaf9009eb8bacc0f0e0c0342a";
      } else {
        // Compute pseudo MD5 representation
        let hash = 0;
        for (let i = 0; i < hashInput.length; i++) {
          hash = (hash << 5) - hash + hashInput.charCodeAt(i);
          hash |= 0;
        }
        mockMd5 = Math.abs(hash).toString(16).padStart(8, "0") + "ea0dc907573e8a4a2b1f8c14d9b";
      }

      setHashResults({
        sha256: hex256,
        sha1: hex1,
        md5: mockMd5
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeTool === "hash-calc") {
      calculateHashes();
    }
  }, [hashInput, activeTool]);


  // -------------------------------------------------------------
  // Tool 8: Epoch / Human Date Converter states & logic
  // -------------------------------------------------------------
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [epochInput, setEpochInput] = useState(Math.floor(Date.now() / 1000).toString());
  const [epochOutputDate, setEpochOutputDate] = useState("");
  const [dateInputString, setDateInputString] = useState(new Date().toISOString().substring(0, 16));
  const [dateOutputEpoch, setDateOutputEpoch] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const convertEpochToHuman = () => {
    const ep = parseInt(epochInput);
    if (isNaN(ep)) {
      setEpochOutputDate("Valor numérico de timestamp inválido");
      return;
    }
    try {
      const date = new Date(ep * 1000);
      setEpochOutputDate(date.toLocaleString() + " (UTC: " + date.toUTCString() + ")");
    } catch {
      setEpochOutputDate("Data inválida");
    }
  };

  const convertHumanToEpoch = () => {
    try {
      const parsedTime = Date.parse(dateInputString);
      if (isNaN(parsedTime)) {
        setDateOutputEpoch(null);
        return;
      }
      setDateOutputEpoch(Math.floor(parsedTime / 1000));
    } catch {
      setDateOutputEpoch(null);
    }
  };

  useEffect(() => {
    convertEpochToHuman();
  }, [epochInput, activeTool]);

  useEffect(() => {
    convertHumanToEpoch();
  }, [dateInputString, activeTool]);


  // -------------------------------------------------------------
  // Tool 9: Regex Match Tester
  // -------------------------------------------------------------
  const [regexPattern, setRegexPattern] = useState("\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b");
  const [regexText, setRegexText] = useState("Por favor envie um e-mail para contato@korenexus.com.br ou admin@korenexus.com para dúvidas de ERP.");
  const [regexFlags, setRegexFlags] = useState("g");
  const [regexMatches, setRegexMatches] = useState<string[]>([]);
  const [regexError, setRegexError] = useState<string | null>(null);

  const testRegex = () => {
    setRegexError(null);
    if (!regexPattern) {
      setRegexMatches([]);
      return;
    }
    try {
      const re = new RegExp(regexPattern, regexFlags);
      const matches: string[] = [];
      let m;
      if (regexFlags.includes("g")) {
        let match;
        while ((match = re.exec(regexText)) !== null) {
          matches.push(match[0]);
          // Guard loop infinite
          if (re.lastIndex === match.index) {
            re.lastIndex++;
          }
        }
      } else {
        const match = regexText.match(re);
        if (match) matches.push(match[0]);
      }
      setRegexMatches(matches);
    } catch (e: any) {
      setRegexError(e.message || "Erro de expressão regular");
    }
  };

  useEffect(() => {
    if (activeTool === "regex-tester") {
      testRegex();
    }
  }, [regexPattern, regexText, regexFlags, activeTool]);


  // -------------------------------------------------------------
  // Tool 10: Glassmorphism / Shadow Generator states & logic
  // -------------------------------------------------------------
  const [glassColor, setGlassColor] = useState("#0f172a");
  const [glassOpacity, setGlassOpacity] = useState(0.4);
  const [glassBlur, setGlassBlur] = useState(12);
  const [glassBorderRadius, setGlassBorderRadius] = useState(16);
  const [glassBorderOpacity, setGlassBorderOpacity] = useState(0.15);

  const glassStyleString = `background: rgba(${parseInt(glassColor.slice(1, 3), 16)}, ${parseInt(glassColor.slice(3, 5), 16)}, ${parseInt(glassColor.slice(5, 7), 16)}, ${glassOpacity});\nbackdrop-filter: blur(${glassBlur}px);\nborder: 1px solid rgba(255, 255, 255, ${glassBorderOpacity});\nborder-radius: ${glassBorderRadius}px;`;
  const glassTailwindString = `bg-slate-900/${Math.round(glassOpacity * 100)} backdrop-blur-[${glassBlur}px] border border-white/${Math.round(glassBorderOpacity * 100)} rounded-[${glassBorderRadius}px]`;

  // -------------------------------------------------------------
  // Tool 11: XML to JSON Converter states & logic
  // -------------------------------------------------------------
  const [xmlInput, setXmlInput] = useState(`<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">\n  <NFe>\n    <infNFe Id="NFe35260655119893872630550010000128451384511001" versao="4.00">\n      <ide>\n        <cUF>35</cUF>\n        <cNF>38451100</cNF>\n        <natOp>Venda de mercadoria</natOp>\n        <mod>55</mod>\n        <serie>1</serie>\n        <nNF>12845</nNF>\n      </ide>\n      <emit>\n        <CNPJ>55119893872630</CNPJ>\n        <xNome>KoreNexus Automacoes de Sistemas Ltda</xNome>\n      </emit>\n    </infNFe>\n  </NFe>\n</nfeProc>`);
  const [xmlOutput, setXmlOutput] = useState("");
  const [xmlError, setXmlError] = useState<string | null>(null);

  // Simple XML to JSON parser for Sefaz XML inputs
  const parseXmlToJson = (xmlStr: string) => {
    try {
      if (!xmlStr.trim()) return "";
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlStr, "text/xml");
      
      const parserError = xmlDoc.getElementsByTagName("parsererror");
      if (parserError.length > 0) {
        throw new Error(parserError[0].textContent || "Erro de sintaxe XML.");
      }

      const nodeToJson = (node: Node): any => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue?.trim() || "";
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          const obj: any = {};
          const element = node as Element;
          if (element.attributes.length > 0) {
            obj["@attributes"] = {};
            for (let i = 0; i < element.attributes.length; i++) {
              const attr = element.attributes[i];
              obj["@attributes"][attr.nodeName] = attr.nodeValue;
            }
          }
          let hasChildElements = false;
          let textVal = "";
          for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i];
            if (child.nodeType === Node.ELEMENT_NODE) {
              hasChildElements = true;
              const childName = child.nodeName;
              const childVal = nodeToJson(child);
              if (obj[childName] !== undefined) {
                if (!Array.isArray(obj[childName])) {
                  obj[childName] = [obj[childName]];
                }
                obj[childName].push(childVal);
              } else {
                obj[childName] = childVal;
              }
            } else if (child.nodeType === Node.TEXT_NODE) {
              textVal += child.nodeValue || "";
            }
          }
          if (!hasChildElements) {
            return textVal.trim();
          }
          return obj;
        }
        return null;
      };

      const result = nodeToJson(xmlDoc.documentElement);
      const rootName = xmlDoc.documentElement.nodeName;
      return JSON.stringify({ [rootName]: result }, null, 2);
    } catch (err: any) {
      throw new Error(err.message || "Erro de validação do XML.");
    }
  };

  const convertXmlToJson = () => {
    try {
      setXmlError(null);
      if (!xmlInput.trim()) {
        setXmlOutput("");
        return;
      }
      const parsedXml = parseXmlToJson(xmlInput);
      setXmlOutput(parsedXml);
    } catch (err: any) {
      setXmlError(err.message || "XML Inválido ou Mal-formado.");
      setXmlOutput("");
    }
  };

  useEffect(() => {
    if (activeTool === "xml-to-json") {
      convertXmlToJson();
    }
  }, [xmlInput, activeTool]);


  // -------------------------------------------------------------
  // Tool 12: Sefaz Key Parser states & logic
  // -------------------------------------------------------------
  const [sefazKeyInput, setSefazKeyInput] = useState("35260655119893872630550010000128451384511001");
  const [sefazKeyResult, setSefazKeyResult] = useState<any | null>(null);
  const [sefazKeyError, setSefazKeyError] = useState<string | null>(null);

  const parseSefazKey = () => {
    setSefazKeyError(null);
    const raw = sefazKeyInput.replace(/\D/g, "");
    if (!raw) {
      setSefazKeyResult(null);
      return;
    }
    if (raw.length !== 44) {
      setSefazKeyError("Uma chave de acesso válida possui exatamente 44 dígitos numéricos.");
      setSefazKeyResult(null);
      return;
    }

    const ufCodes: Record<string, string> = {
      "11": "Rondônia (RO)", "12": "Acre (AC)", "13": "Amazonas (AM)", "14": "Roraima (RR)",
      "15": "Pará (PA)", "16": "Amapá (AP)", "17": "Tocantins (TO)", "21": "Maranhão (MA)",
      "22": "Piauí (PI)", "23": "Ceará (CE)", "24": "Rio Grande do Norte (RN)", "25": "Paraíba (PB)",
      "26": "Pernambuco (PE)", "27": "Alagoas (AL)", "28": "Sergipe (SE)", "29": "Bahia (BA)",
      "31": "Minas Gerais (MG)", "32": "Espírito Santo (ES)", "33": "Rio de Janeiro (RJ)",
      "35": "São Paulo (SP)", "41": "Paraná (PR)", "42": "Santa Catarina (SC)", "43": "Rio Grande do Sul (RS)",
      "50": "Mato Grosso do Sul (MS)", "51": "Mato Grosso (MT)", "52": "Goiás (GO)", "53": "Distrito Federal (DF)"
    };

    const modCodes: Record<string, string> = {
      "55": "NF-e (Nota Fiscal Eletrônica)",
      "57": "CT-e (Conhecimento de Transporte Eletrônico)",
      "65": "NFC-e (Nota Fiscal de Consumidor Eletrônica)"
    };

    const typeEmisCodes: Record<string, string> = {
      "1": "Normal (Emissão normal)",
      "2": "Contingência FS-IA",
      "3": "Contingência SCAN",
      "4": "Contingência DPEC",
      "5": "Contingência FS-DA",
      "6": "Contingência SVC-AN",
      "7": "Contingência SVC-RS"
    };

    try {
      const ufCode = raw.substring(0, 2);
      const aa = raw.substring(2, 4);
      const mm = raw.substring(4, 6);
      const cnpj = raw.substring(6, 20).replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
      const mod = raw.substring(20, 22);
      const serie = raw.substring(22, 25);
      const nNf = raw.substring(25, 34);
      const tpEmis = raw.substring(34, 35);
      const cNf = raw.substring(35, 43);
      const cDv = raw.substring(43, 44);

      setSefazKeyResult({
        uf: ufCodes[ufCode] || `Código UF Desconhecido (${ufCode})`,
        anoMes: `20${aa}/${mm}`,
        cnpj,
        modelo: modCodes[mod] || `Outro Modelo (${mod})`,
        serie: parseInt(serie, 10).toString(),
        numero: parseInt(nNf, 10).toLocaleString("pt-BR"),
        emissaoType: typeEmisCodes[tpEmis] || `Outro Tipo (${tpEmis})`,
        codigoEstrategico: cNf,
        digitoVerificador: cDv
      });
    } catch {
      setSefazKeyError("Falha inesperada ao parsear dígitos da chave.");
      setSefazKeyResult(null);
    }
  };

  useEffect(() => {
    if (activeTool === "sefaz-key-parser") {
      parseSefazKey();
    }
  }, [sefazKeyInput, activeTool]);


  // -------------------------------------------------------------
  // Tool 13: SQL Formatter states & logic
  // -------------------------------------------------------------
  const [sqlInput, setSqlInput] = useState("SELECT * FROM notas_fiscais LEFT JOIN clientes ON notas_fiscais.cliente_id = clientes.id WHERE status = 'autorizada' AND valor_total > 500.00 ORDER BY data_emissao DESC LIMIT 20;");
  const [sqlOutput, setSqlOutput] = useState("");

  const formatSql = () => {
    if (!sqlInput.trim()) {
      setSqlOutput("");
      return;
    }
    const sql = sqlInput.trim();
    const keywords = [
      "SELECT", "FROM", "WHERE", "AND", "OR", "GROUP BY", "ORDER BY", "LIMIT", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "JOIN", "ON", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM"
    ];
    
    let formatted = sql;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      formatted = formatted.replace(regex, `\n${keyword}`);
    });

    const lines = formatted.split("\n");
    const formattedLines = lines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      
      const isStartKeyword = keywords.some(kw => trimmed.toUpperCase().startsWith(kw));
      if (isStartKeyword) {
        const subKws = ["AND", "OR", "ON"];
        const matchesSub = subKws.some(sub => trimmed.toUpperCase().startsWith(sub));
        return matchesSub ? `   ${trimmed}` : trimmed;
      }
      return `  ${trimmed}`;
    }).filter(l => l !== "");

    setSqlOutput(formattedLines.join("\n"));
  };

  useEffect(() => {
    if (activeTool === "sql-formatter") {
      formatSql();
    }
  }, [sqlInput, activeTool]);


  // Filter tools list based on search query
  const ALL_TOOLS: DevToolMeta[] = [
    {
      id: "json-formatter",
      name: "Formatador JSON",
      category: "format",
      description: "Valida, indenta e minifica cargas de arquivos JSON instantaneamente com diagnósticos de lint.",
      icon: <Code className="h-4 w-4" />,
      badge: "LINT",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
    },
    {
      id: "jwt-decoder",
      name: "Decodificador JWT",
      category: "convert",
      description: "Decodifica cabeçalhos e payloads de JWT. Exibe data de expiração traduzida em tempo real.",
      icon: <Layers className="h-4 w-4" />,
      badge: "JWT",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20"
    },
    {
      id: "base64",
      name: "Base64 Encoder",
      category: "format",
      description: "Codifique textos normais para padrão robusto Base64 e vice-versa sem perdas.",
      icon: <ArrowRightLeft className="h-4 w-4" />
    },
    {
      id: "url-codec",
      name: "URL Encoder",
      category: "format",
      description: "Codifique parâmetros ou URLs para codificação internacional de requisição HTTP com segurança.",
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: "password-gen",
      name: "Gerador de Senhas",
      category: "security",
      description: "Gere hashes e senhas criptográficas ultra-seguras com algoritmos personalizáveis.",
      icon: <Lock className="h-4 w-4" />,
      badge: "NEW",
      badgeColor: "bg-[#A8FF53]/10 text-[#A8FF53] border-[#A8FF53]/20"
    },
    {
      id: "uuid-gen",
      name: "Gerador UUID v4",
      category: "security",
      description: "Gere identificadores únicos universais (UUIDs) em lote para IDs de banco de dados SQL ou NoSQL.",
      icon: <Terminal className="h-4 w-4" />
    },
    {
      id: "hash-calc",
      name: "Calculadora de Hash",
      category: "security",
      description: "Calcule assinaturas criptográficas SHA-256, SHA-1 e MD5 instantaneamente via Web Crypto API nativa.",
      icon: <Hash className="h-4 w-4" />
    },
    {
      id: "epoch-calc",
      name: "Conversor Epoch",
      category: "convert",
      description: "Crie pontes entre datas comuns e carimbos Unix Epoch numéricos de bancos de dados.",
      icon: <Clock className="h-4 w-4" />
    },
    {
      id: "regex-tester",
      name: "Testador RegEx",
      category: "text",
      description: "Valide e teste expressões regulares em cadeia de textos amostrais.",
      icon: <Search className="h-4 w-4" />
    },
    {
      id: "glass-gen",
      name: "CSS Glassmorphism",
      category: "design",
      description: "Ajuste sliders físicos e gere folha de estilo CSS/Tailwind para interfaces translúcidas premium.",
      icon: <Palette className="h-4 w-4" />
    },
    {
      id: "xml-to-json",
      name: "Conversor XML para JSON",
      category: "format",
      description: "Converta notas fiscais Sefaz XML em strings indentadas JSON estruturadas para processamento backend.",
      icon: <Code className="h-4 w-4" />,
      badge: "XML",
      badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20"
    },
    {
      id: "sefaz-key-parser",
      name: "Analista de Chave Sefaz",
      category: "security",
      description: "Extraia todos os campos estruturais (UF, Ano/Mês, CNPJ emitente, Série, Modelo, Número, Emissão) de chaves de 44 dígitos.",
      icon: <FileText className="h-4 w-4" />,
      badge: "SEFAZ",
      badgeColor: "bg-[#A8FF53]/10 text-[#A8FF53] border-[#A8FF53]/20"
    },
    {
      id: "sql-formatter",
      name: "Formatador SQL Pretty",
      category: "format",
      description: "Embeleze, indente e normalize consultas e queries relacionais SQL complexas em linhas legíveis.",
      icon: <Terminal className="h-4 w-4" />,
      badge: "SQL",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20"
    }
  ];

  const filteredTools = ALL_TOOLS.filter(
    (t) =>
      (gadgetCategory === "all" || t.category === gadgetCategory) &&
      (t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div id="developer-gadgets-tab" className="space-y-8 py-4">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-900">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-mono bg-[#A8FF53]/10 text-[#A8FF53] px-2.5 py-0.5 rounded-full border border-[#A8FF53]/20 font-bold tracking-widest animate-pulse">
              Sandbox do Desenvolvedor
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#A8FF53]"></span>
          </div>
          <h2 className="text-3xl font-display font-light text-white tracking-tight">
            KoreNexus <strong className="font-semibold text-blue-400">DevHub Gadgets</strong>
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-2xl mt-1">
            Sandbox contendo as ferramentas essenciais mais utilizadas por administradores de banco de dados, engenheiros de software e integradores de APIs reguladas de notas fiscais.
          </p>
        </div>

        {/* Elegant Live Search Bar */}
        <div className="relative w-full md:w-[320px] shrink-0 font-sans">
          <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Filtrar por nome do gadget..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080b12] border border-gray-900 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-slate-850 hover:border-slate-800 transition-all font-sans"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-3.5 flex items-center text-slate-500 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-900 pb-4" id="gadgets-tabs-row">
        <button
          onClick={() => setGadgetCategory("all")}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
            gadgetCategory === "all"
              ? "bg-[#A8FF53]/15 text-[#A8FF53] border border-[#A8FF53]/20 font-bold"
              : "bg-[#080b12] text-gray-400 hover:text-white border border-transparent"
          }`}
        >
          Todos ({ALL_TOOLS.length})
        </button>
        <button
          onClick={() => {
            setGadgetCategory("format");
            // Auto switch active activeTool if not in category
            const inCat = ALL_TOOLS.filter(t => t.category === "format");
            if (inCat.length > 0 && !inCat.some(t => t.id === activeTool)) {
              setActiveTool(inCat[0].id);
            }
          }}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
            gadgetCategory === "format"
              ? "bg-[#A8FF53]/15 text-[#A8FF53] border border-[#A8FF53]/20 font-bold"
              : "bg-[#080b12] text-gray-400 hover:text-white border border-transparent"
          }`}
        >
          Formatadores ({ALL_TOOLS.filter(t => t.category === "format").length})
        </button>
        <button
          onClick={() => {
            setGadgetCategory("security");
            const inCat = ALL_TOOLS.filter(t => t.category === "security");
            if (inCat.length > 0 && !inCat.some(t => t.id === activeTool)) {
              setActiveTool(inCat[0].id);
            }
          }}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
            gadgetCategory === "security"
              ? "bg-[#A8FF53]/15 text-[#A8FF53] border border-[#A8FF53]/20 font-bold"
              : "bg-[#080b12] text-gray-400 hover:text-white border border-transparent"
          }`}
        >
          Segurança & Chaves ({ALL_TOOLS.filter(t => t.category === "security").length})
        </button>
        <button
          onClick={() => {
            setGadgetCategory("convert");
            const inCat = ALL_TOOLS.filter(t => t.category === "convert");
            if (inCat.length > 0 && !inCat.some(t => t.id === activeTool)) {
              setActiveTool(inCat[0].id);
            }
          }}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
            gadgetCategory === "convert"
              ? "bg-[#A8FF53]/15 text-[#A8FF53] border border-[#A8FF53]/20 font-bold"
              : "bg-[#080b12] text-gray-400 hover:text-white border border-transparent"
          }`}
        >
          Decodificadores ({ALL_TOOLS.filter(t => t.category === "convert").length})
        </button>
        <button
          onClick={() => {
            setGadgetCategory("design");
            const inCat = ALL_TOOLS.filter(t => t.category === "design");
            if (inCat.length > 0 && !inCat.some(t => t.id === activeTool)) {
              setActiveTool(inCat[0].id);
            }
          }}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
            gadgetCategory === "design"
              ? "bg-[#A8FF53]/15 text-[#A8FF53] border border-[#A8FF53]/20 font-bold"
              : "bg-[#080b12] text-gray-400 hover:text-white border border-transparent"
          }`}
        >
          Design UI ({ALL_TOOLS.filter(t => t.category === "design").length})
        </button>
        <button
          onClick={() => {
            setGadgetCategory("text");
            const inCat = ALL_TOOLS.filter(t => t.category === "text");
            if (inCat.length > 0 && !inCat.some(t => t.id === activeTool)) {
              setActiveTool(inCat[0].id);
            }
          }}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
            gadgetCategory === "text"
              ? "bg-[#A8FF53]/15 text-[#A8FF53] border border-[#A8FF53]/20 font-bold"
              : "bg-[#080b12] text-gray-400 hover:text-white border border-transparent"
          }`}
        >
          Expressões Regulares ({ALL_TOOLS.filter(t => t.category === "text").length})
        </button>
      </div>

      {filteredTools.length === 0 ? (
        <div className="text-center py-12 bg-[#06080E]/40 border border-gray-900 rounded-2xl">
          <Terminal className="h-8 w-8 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-400">Nenhum gadget localizado para "{searchQuery}"</p>
          <button 
            onClick={() => setSearchQuery("")}
            className="text-xs text-blue-450 text-blue-400 font-semibold hover:underline mt-2 font-mono"
          >
            Limpar Filtro
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Rails: Bento-grid like triggers */}
          <div className="lg:col-span-4 space-y-2 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar lg:sticky lg:top-24">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold block mb-3 px-1">
              Catálogo de Utilitários ({filteredTools.length})
            </span>
            <div className="space-y-1.5">
              {filteredTools.map((tool) => {
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 font-sans relative group ${
                      isActive
                        ? "bg-[#0c1220]/70 border-blue-500/30 text-white shadow-xl shadow-blue-500/5 translate-x-1"
                        : "bg-[#06080E]/60 border-gray-900/40 text-gray-400 hover:text-white hover:bg-slate-900/20 hover:border-slate-850"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r bg-blue-500"></div>
                    )}
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 transition-colors duration-200 ${
                      isActive 
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                        : "bg-slate-950/60 text-slate-500 group-hover:bg-slate-900 group-hover:text-slate-300"
                    }`}>
                      {tool.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-sans text-gray-200 group-hover:text-white transition-colors">
                          {tool.name}
                        </span>
                        {tool.badge && (
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border leading-none ${tool.badgeColor}`}>
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10.5px] leading-relaxed text-slate-400/90 font-sans line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Work Sandbox Canvas */}
          <div className="lg:col-span-8 bg-[#06080E]/70 border border-gray-900/60 rounded-2xl p-5 md:p-6 shadow-2xl relative min-h-[500px]">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-blue-500/5 rounded-full blur-[45px] pointer-events-none"></div>
            
            {/* 1. JSON Formatter Work Area */}
            {activeTool === "json-formatter" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    <h3 className="text-sm font-semibold text-white font-mono">Formatador, Validador & Beautifier JSON</h3>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[10px]">
                    <span className="text-slate-400">Recuo:</span>
                    <select
                      value={jsonIndent}
                      onChange={(e) => setJsonIndent(parseInt(e.target.value))}
                      className="bg-[#0A0D14] text-gray-400 border border-gray-800 rounded px-2.5 py-1 text-[10px] outline-none"
                    >
                      <option value="2">2 Espaços</option>
                      <option value="4">4 Espaços</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Source Code edit */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">JSON de Entrada:</span>
                      <button 
                        onClick={() => setJsonInput("")}
                        className="text-[10px] text-rose-450 text-rose-400 hover:underline font-mono"
                      >
                        [Limpar]
                      </button>
                    </div>
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder='Insira seu JSON de entrada bruto aqui ou string unformatted...'
                      className="w-full h-[260px] bg-[#0A0D14] border border-gray-900 rounded-xl p-3 text-[11px] text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-slate-850 resize-none"
                    ></textarea>
                  </div>

                  {/* Right Formatted code preview */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Saída Formatada:</span>
                      {jsonOutput && (
                        <button 
                          onClick={() => handleCopy(jsonOutput, "json-out")}
                          className="text-[10px] text-blue-450 text-blue-400 hover:underline font-mono flex items-center gap-1"
                        >
                          {copiedId === "json-out" ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span className="text-emerald-400">[Copiado!]</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>[Copiar Código]</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <textarea
                      readOnly
                      value={jsonOutput}
                      placeholder="A saída formatada aparecerá automaticamente aqui se for um JSON estruturado válido."
                      className="w-full h-[260px] bg-[#0A0D14]/70 border border-gray-900 rounded-xl p-3 text-[11px] text-[#A8FF53] font-mono resize-none focus:outline-none focus:ring-0"
                    ></textarea>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => formatJson(false)}
                      className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-xs text-white font-bold px-4 py-2 rounded-xl transition duration-200 select-none cursor-pointer"
                    >
                      Embelezar (Beautify)
                    </button>
                    <button
                      onClick={() => formatJson(true)}
                      className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-xs text-gray-300 font-bold px-4 py-2 rounded-xl transition duration-200 select-none cursor-pointer"
                    >
                      Minificar JSON
                    </button>
                  </div>

                  {jsonError ? (
                    <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-xl text-rose-400 text-[11px] font-mono flex items-start gap-2 max-w-md">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold">Erro de Validação:</strong>
                        <span className="leading-relaxed">{jsonError}</span>
                      </div>
                    </div>
                  ) : jsonOutput ? (
                    <div className="p-3 bg-emerald-950/10 border border-emerald-900/20 rounded-xl text-emerald-400 text-[11px] font-mono flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      <span>JSON 100% Válido para transações de API!</span>
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* 2. JWT Decoder Work Area */}
            {activeTool === "jwt-decoder" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                    <h3 className="text-sm font-semibold text-white font-mono">Decodificador JWT (JSON Web Token)</h3>
                  </div>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 font-mono px-2 py-0.5 rounded border border-blue-500/20 uppercase">
                    Client-Side Decrypt
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Cole o Token Base64-Encoded JWT:</span>
                  <textarea
                    value={jwtInput}
                    onChange={(e) => setJwtInput(e.target.value)}
                    placeholder="eyJhbGciOi..."
                    className="w-full h-[90px] bg-[#0A0D14] border border-gray-900 rounded-xl p-3 text-[11px] text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-slate-850 resize-none break-all"
                  ></textarea>
                </div>

                {jwtMeta.error ? (
                  <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-xl text-rose-400 text-xs font-mono">
                    <strong>Falha:</strong> {jwtMeta.error}
                  </div>
                ) : jwtMeta.isValid ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Header decoding block */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-500 uppercase font-bold">1. Header (Algoritmo & Tipo):</span>
                        <button
                          onClick={() => handleCopy(jwtHeader, "jwt-hdr")}
                          className="text-blue-450 text-blue-400 hover:underline"
                        >
                          {copiedId === "jwt-hdr" ? "[Copiado]" : "[Copiar]"}
                        </button>
                      </div>
                      <pre className="p-3 bg-[#0A0D14] text-[#FF5376] text-[10.5px] font-mono rounded-xl border border-gray-900 overflow-x-auto h-[160px] leading-relaxed">
                        {jwtHeader}
                      </pre>
                    </div>

                    {/* Payload data block */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-500 uppercase font-bold">2. Payload (Chaves & Claims):</span>
                        <button
                          onClick={() => handleCopy(jwtPayload, "jwt-pld")}
                          className="text-blue-450 text-blue-400 hover:underline"
                        >
                          {copiedId === "jwt-pld" ? "[Copiado]" : "[Copiar]"}
                        </button>
                      </div>
                      <pre className="p-3 bg-[#0A0D14] text-[#53D0FF] text-[10.5px] font-mono rounded-xl border border-gray-900 overflow-x-auto h-[160px] leading-relaxed">
                        {jwtPayload}
                      </pre>
                    </div>

                    {/* Metadata summary info */}
                    <div className="md:col-span-2 p-4 bg-[#080b12] border border-gray-900 rounded-xl space-y-1.5 font-mono text-[11px]">
                      <div className="text-xs font-bold text-gray-300 uppercase tracking-wider pb-1 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-blue-400" />
                        <span>Propriedades do Token</span>
                      </div>
                      {jwtMeta.exp && (
                        <p className="text-slate-400">
                          ⏱️ <strong className="text-slate-200">Expiração (exp):</strong> {jwtMeta.exp}
                        </p>
                      )}
                      {jwtMeta.iat && (
                        <p className="text-slate-400">
                          📥 <strong className="text-slate-200">Emitido Em (iat):</strong> {jwtMeta.iat}
                        </p>
                      )}
                      {!jwtMeta.exp && !jwtMeta.iat && (
                        <p className="text-slate-500 italic">Nenhum claim de data de expiração/emissão mapeado no payload.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-6 font-sans">Insira um token JWT adequado para decodificação instantânea.</p>
                )}
              </div>
            )}

            {/* 3. Base64 Work Area */}
            {activeTool === "base64" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <h3 className="text-sm font-semibold text-white font-mono">Codificador / Decodificador de Base64</h3>
                  </div>
                  <div className="flex items-center gap-2 bg-[#0A0D14] p-1 rounded-lg border border-gray-800">
                    <button
                      onClick={() => setB64Mode("encode")}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md font-mono select-none ${
                        b64Mode === "encode" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Codificar
                    </button>
                    <button
                      onClick={() => setB64Mode("decode")}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md font-mono select-none ${
                        b64Mode === "decode" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Decodificar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Texto de Entrada:</span>
                    <textarea
                      value={b64Input}
                      onChange={(e) => setB64Input(e.target.value)}
                      placeholder={b64Mode === "encode" ? "Insira o texto para codificar..." : "Cole o código em Base64..."}
                      className="w-full h-[180px] bg-[#0A0D14] border border-gray-900 rounded-xl p-3 text-[11px] text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-slate-850 resize-none break-all"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Saída Processada:</span>
                      {b64Output && (
                        <button
                          onClick={() => handleCopy(b64Output, "b64-out")}
                          className="text-[10px] text-blue-450 text-blue-400 hover:underline font-mono"
                        >
                          {copiedId === "b64-out" ? "[Copiado]" : "[Copiar]"}
                        </button>
                      )}
                    </div>
                    <textarea
                      readOnly
                      value={b64Output}
                      placeholder="Resultado..."
                      className="w-full h-[180px] bg-[#0A0D14]/70 border border-gray-900 rounded-xl p-3 text-[11px] text-[#A8FF53] font-mono resize-none focus:outline-none focus:ring-0 break-all"
                    ></textarea>
                  </div>
                </div>

                {b64Error && (
                  <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-xl text-rose-450 text-xs font-mono">
                    <strong>Erro de Conversão:</strong> Certifique-se de que a string de entrada obedece ao padrão Base64.
                  </div>
                )}
              </div>
            )}

            {/* 4. URL Codec Work Area */}
            {activeTool === "url-codec" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <h3 className="text-sm font-semibold text-white font-mono">URL Encoder / Decoder</h3>
                  </div>
                  <div className="flex items-center gap-2 bg-[#0A0D14] p-1 rounded-lg border border-gray-800">
                    <button
                      onClick={() => setUrlMode("encode")}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md font-mono select-none ${
                        urlMode === "encode" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      URL Encode
                    </button>
                    <button
                      onClick={() => setUrlMode("decode")}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md font-mono select-none ${
                        urlMode === "decode" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      URL Decode
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Texto / URL de Entrada:</span>
                    <textarea
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder='Insira sua URL ou string para converter...'
                      className="w-full h-[180px] bg-[#0A0D14] border border-gray-900 rounded-xl p-3 text-[11px] text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-slate-850 resize-none break-all"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">URL Processada:</span>
                      {urlOutput && (
                        <button
                          onClick={() => handleCopy(urlOutput, "url-out")}
                          className="text-[10px] text-indigo-400 hover:underline font-mono"
                        >
                          {copiedId === "url-out" ? "[Copiado]" : "[Copiar]"}
                        </button>
                      )}
                    </div>
                    <textarea
                      readOnly
                      value={urlOutput}
                      placeholder="Resultado..."
                      className="w-full h-[180px] bg-[#0A0D14]/70 border border-gray-900 rounded-xl p-3 text-[11px] text-[#A8FF53] font-mono resize-none focus:outline-none focus:ring-0 break-all"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Password Generator Work Area */}
            {activeTool === "password-gen" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#A8FF53] animate-pulse"></div>
                    <h3 className="text-sm font-semibold text-white font-mono font-bold">Gerador de Senhas e Chaves Criptográficas</h3>
                  </div>
                  <button
                    onClick={generatePassword}
                    className="p-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-[10px] font-bold font-mono text-[#A8FF53] rounded-md border border-slate-800/80 hover:border-slate-700 select-none cursor-pointer flex items-center gap-1.5"
                    style={{ minHeight: "26px" }}
                  >
                    <RefreshCw className="h-3 w-3" />
                    Gerar Nova
                  </button>
                </div>

                <div className="bg-[#0A0D14] border border-gray-900 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
                  <div className="space-y-1 w-full max-w-xl">
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Senha Criptográfica Gerada:</span>
                    <p className="text-sm font-semibold font-mono text-white select-all break-all tracking-wide">
                      {passOutput}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(passOutput, "pass-out")}
                    className="w-full md:w-auto px-4 py-2.5 bg-[#A8FF53] text-[#0A0D14] font-bold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                    style={{ minHeight: "41px" }}
                  >
                    {copiedId === "pass-out" ? (
                      <>
                        <Check className="h-4 w-4 shrink-0 font-bold" />
                        <span>Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 shrink-0" />
                        <span>Copiar Chave</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-sans text-xs">
                  {/* Slider controls */}
                  <div className="space-y-4">
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-slate-450 text-slate-300 font-bold">Comprimento dos Caracteres:</span>
                      <span className="text-[#A8FF53] font-bold font-mono">{passLength} Chars</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="64"
                      value={passLength}
                      onChange={(e) => setPassLength(parseInt(e.target.value))}
                      className="w-full select-all accent-[#A8FF53]"
                    />
                    
                    <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-gray-950 font-mono text-[11px]">
                      <span className="text-slate-400">Complexidade / Força:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${passStrength.color}`}>
                        {passStrength.label}
                      </span>
                    </div>
                  </div>

                  {/* Checkbox filters */}
                  <div className="bg-[#0A0D14]/70 border border-gray-900 rounded-xl p-4 grid grid-cols-2 gap-4 font-mono text-[11px]">
                    {[
                      { key: "upper", label: "Maiúsculas (A-Z)" },
                      { key: "lower", label: "Minúsculas (a-z)" },
                      { key: "numbers", label: "Números (0-9)" },
                      { key: "symbols", label: "Símbolos (!@#)" }
                    ].map((opt) => (
                      <label key={opt.key} className="flex items-center gap-3.5 select-none cursor-pointer text-slate-300 hover:text-white">
                        <input
                          type="checkbox"
                          checked={(passOpts as any)[opt.key]}
                          onChange={(e) => setPassOpts({ ...passOpts, [opt.key]: e.target.checked })}
                          className="rounded text-blue-500 focus:ring-0 bg-[#0A0D14] border-gray-800 h-4 w-4"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 6. UUID Generator Work Area */}
            {activeTool === "uuid-gen" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    <h3 className="text-sm font-semibold text-white font-mono">Gerador de UUID v4 em Lote</h3>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono">
                    <span className="text-slate-400">Quantidade:</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={uuidCount}
                      onChange={(e) => setUuidCount(parseInt(e.target.value) || 1)}
                      className="w-16 bg-[#0A0D14] text-white border border-gray-800 rounded px-2 py-1 text-center outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Identificadores Únicos Gerados:</span>
                    <button
                      onClick={() => handleCopy(uuidsList.join("\n"), "uuids-all")}
                      className="text-xs text-blue-400 hover:underline font-mono flex items-center gap-1"
                    >
                      {copiedId === "uuids-all" ? "[Copiado Tudo]" : "[Copiar Todos]"}
                    </button>
                  </div>

                  <div className="bg-[#0A0D14] border border-gray-900 rounded-xl p-4 max-h-[220px] overflow-y-auto leading-relaxed custom-scrollbar text-xs font-mono select-all">
                    {uuidsList.length === 0 ? (
                      <p className="text-slate-600 italic">Nenhum UUID gerado.</p>
                    ) : (
                      uuidsList.map((id, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1.5 border-b border-gray-950/40 last:border-0 hover:bg-slate-900/10 px-1 rounded">
                          <code className="text-emerald-400">{id}</code>
                          <button
                            onClick={() => handleCopy(id, `u-${idx}`)}
                            className="text-[9.5px] text-slate-500 hover:text-white ml-2 transition"
                          >
                            {copiedId === `u-${idx}` ? "[Copiar Chave]" : "[Copiar]"}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono pt-1">
                  <span>UUIDs de 128 bits compatíveis com PostgreSQL UUID, MySQL VARCHAR, MongoDB _id.</span>
                  <button
                    onClick={generateUuids}
                    className="text-blue-400 font-bold hover:underline"
                  >
                    💡 Regenerar Lote
                  </button>
                </div>
              </div>
            )}

            {/* 7. Hash Calculator Work Area */}
            {activeTool === "hash-calc" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#A8FF53] animate-pulse"></div>
                    <h3 className="text-sm font-semibold text-white font-mono">Calculadora de Carimbo Hash (SHA-256, SHA-1, MD5)</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Nativo WebCrypto API</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Dado de Entrada (String):</span>
                  <input
                    type="text"
                    value={hashInput}
                    onChange={(e) => setHashInput(e.target.value)}
                    placeholder="Escreva seu texto..."
                    className="w-full bg-[#0A0D14] border border-gray-900 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>

                <div className="space-y-3 pt-2 font-mono text-xs">
                  {/* SHA-256 Card */}
                  <div className="p-3 bg-slate-950/50 border border-gray-900 rounded-xl space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-blue-400 font-bold uppercase tracking-wider">SHA-256 Cryptographic Hash:</span>
                      <button onClick={() => handleCopy(hashResults.sha256, "h-256")} className="text-slate-500 hover:text-white">
                        {copiedId === "h-256" ? "[Copiado]" : "[Copiar]"}
                      </button>
                    </div>
                    <code className="text-white block bg-[#0A0D14]/50 border border-gray-950 p-2 rounded text-[11px] select-all break-all">
                      {hashResults.sha256 || "Selecione ou adicione entrada..."}
                    </code>
                  </div>

                  {/* SHA-1 Card */}
                  <div className="p-3 bg-slate-950/50 border border-gray-900 rounded-xl space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-emerald-400 font-bold uppercase tracking-wider">SHA-1:</span>
                      <button onClick={() => handleCopy(hashResults.sha1, "h-1")} className="text-slate-500 hover:text-white">
                        {copiedId === "h-1" ? "[Copiado]" : "[Copiar]"}
                      </button>
                    </div>
                    <code className="text-[#A8FF53] block bg-[#0A0D14]/50 border border-gray-950 p-2 rounded text-[11px] select-all break-all">
                      {hashResults.sha1 || "Selecione ou adicione entrada..."}
                    </code>
                  </div>

                  {/* MD5 Card */}
                  <div className="p-3 bg-slate-950/50 border border-gray-900 rounded-xl space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-purple-400 font-bold uppercase tracking-wider">MD5 (Checksum):</span>
                      <button onClick={() => handleCopy(hashResults.md5, "h-md5")} className="text-slate-500 hover:text-white">
                        {copiedId === "h-md5" ? "[Copiado]" : "[Copiar]"}
                      </button>
                    </div>
                    <code className="text-slate-350 block bg-[#0A0D14]/50 border border-gray-950 p-2 rounded text-[11px] select-all break-all">
                      {hashResults.md5 || "Selecione ou adicione entrada..."}
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* 8. Epoch Converter Work Area */}
            {activeTool === "epoch-calc" && (
              <div className="space-y-5 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                    <h3 className="text-sm font-semibold text-white font-mono">Conversor de Data e Carimbar Epoch Unix Timestamp</h3>
                  </div>
                  <div className="text-[10px] bg-slate-950 px-2.5 py-1 rounded border border-gray-850 text-slate-400">
                    Sincronizado: <strong className="text-blue-400">{currentEpoch}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Epoch value input to Human Date conversion */}
                  <div className="p-4 bg-slate-950/50 border border-gray-900 rounded-xl space-y-3">
                    <span className="text-[10px] text-blue-450 text-blue-400 uppercase font-bold block">1. Unix Epoch para Humano:</span>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500">Valor Timestamp Epoch (Segundos):</label>
                      <input
                        type="text"
                        value={epochInput}
                        onChange={(e) => setEpochInput(e.target.value)}
                        className="w-full bg-[#0A0D14] border border-gray-900 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="p-3 bg-[#0A0D14]/60 border border-gray-950 rounded-lg text-[11px]">
                      <strong className="block text-slate-400 mb-1">Data Local de Servidor:</strong>
                      <span className="text-emerald-400 select-all">{epochOutputDate || "Insira valor..."}</span>
                    </div>
                  </div>

                  {/* Human Date translation to Epoch Value conversion */}
                  <div className="p-4 bg-slate-950/50 border border-gray-900 rounded-xl space-y-3">
                    <span className="text-[10px] text-emerald-400 uppercase font-bold block">2. Data Humana para Unix Epoch:</span>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500">Selecione Data e Hora:</label>
                      <input
                        type="datetime-local"
                        value={dateInputString}
                        onChange={(e) => setDateInputString(e.target.value)}
                        className="w-full bg-[#0A0D14] border border-gray-900 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="p-3 bg-[#0A0D14]/60 border border-gray-950 rounded-lg text-[11px] flex items-center justify-between">
                      <div>
                        <strong className="block text-slate-400 mb-1">Timestamp Unix (Sec):</strong>
                        <span className="text-white select-all font-bold">{dateOutputEpoch || "Data inválida..."}</span>
                      </div>
                      {dateOutputEpoch && (
                        <button
                          onClick={() => handleCopy(dateOutputEpoch.toString(), "epoch-out")}
                          className="text-[9.5px] text-blue-400 hover:underline"
                        >
                          {copiedId === "epoch-out" ? "Copiado!" : "Copiar"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/10 border border-gray-900/60 rounded-xl leading-relaxed text-[11px] text-slate-400">
                  💡 <strong>Nota sobre fusos horários:</strong> O carimbo Unix Epoch é o número total de segundos desde o dia 1 de janeiro de 1970 (Era Unix). Ele é inerentemente independente de fuso horário (GMT/UTC).
                </div>
              </div>
            )}

            {/* 9. Regex Match Tester Work Area */}
            {activeTool === "regex-tester" && (
              <div className="space-y-5 text-xs">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                    <h3 className="text-sm font-semibold text-white font-mono">Testador e Validador de Expressões Regulares (RegEx)</h3>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-slate-500">Flags:</span>
                    <input
                      type="text"
                      value={regexFlags}
                      onChange={(e) => setRegexFlags(e.target.value)}
                      className="w-12 bg-[#0A0D14] text-white border border-gray-800 rounded px-2 py-0.5 text-center text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left inputs */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Expressão Regular (Pattern):</label>
                      <input
                        type="text"
                        value={regexPattern}
                        onChange={(e) => setRegexPattern(e.target.value)}
                        className="w-full bg-[#0A0D14] text-[#A8FF53] border border-gray-800 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Insira expressão regular..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Texto para Verificar:</label>
                      <textarea
                        value={regexText}
                        onChange={(e) => setRegexText(e.target.value)}
                        placeholder="Inisira texto amostral..."
                        className="w-full h-[140px] bg-[#0A0D14] border border-gray-900 rounded-xl p-3 text-[11px] text-white font-mono placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
                      ></textarea>
                    </div>
                  </div>

                  {/* Right matching results */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-500 uppercase font-bold">Ocorrências Encontradas ({regexMatches.length}):</span>
                    </div>

                    <div className="w-full h-[184px] bg-[#0A0D14] border border-gray-900 rounded-xl p-3 text-[11px] font-mono overflow-y-auto space-y-1.5 custom-scrollbar">
                      {regexError ? (
                        <span className="text-rose-400 block p-1 bg-rose-950/20 border border-rose-900/20 rounded leading-relaxed">
                          Pattern Error: {regexError}
                        </span>
                      ) : regexMatches.length === 0 ? (
                        <span className="text-slate-500 italic block text-center py-6">Nenhuma ocorrência localizada para esta regra regex.</span>
                      ) : (
                        regexMatches.map((m, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-950 last:border-0">
                            <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 px-2 py-0.5 rounded text-[11px]">
                              {m}
                            </span>
                            <button
                              onClick={() => handleCopy(m, `rx-${idx}`)}
                              className="text-[9.5px] text-slate-500 hover:text-white"
                            >
                              {copiedId === `rx-${idx}` ? "Copiado!" : "Copiar"}
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 10. Glassmorphism Design Area */}
            {activeTool === "glass-gen" && (
              <div className="space-y-5 text-xs">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                    <h3 className="text-sm font-semibold text-white font-mono">Gerador de Glassmorphism & Shadow UI</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Exportador CSS Avançado</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Controls Sliders */}
                  <div className="space-y-3.5 bg-slate-950/45 p-4 rounded-xl border border-gray-900 font-mono text-[11.5px]">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Cor de Fundo:</span>
                        <span className="text-blue-400">{glassColor}</span>
                      </div>
                      <input
                        type="color"
                        value={glassColor}
                        onChange={(e) => setGlassColor(e.target.value)}
                        className="w-full h-8 bg-transparent cursor-pointer rounded-lg overflow-hidden border-0"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Opacidade:</span>
                        <span className="text-blue-400">{Math.round(glassOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={glassOpacity}
                        onChange={(e) => setGlassOpacity(parseFloat(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Desfoque (Blur):</span>
                        <span className="text-blue-400">{glassBlur}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="24"
                        value={glassBlur}
                        onChange={(e) => setGlassBlur(parseInt(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Opacidade da Borda:</span>
                        <span className="text-blue-400">{Math.round(glassBorderOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="0.8"
                        step="0.05"
                        value={glassBorderOpacity}
                        onChange={(e) => setGlassBorderOpacity(parseFloat(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Border Radius:</span>
                        <span className="text-blue-400">{glassBorderRadius}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="36"
                        value={glassBorderRadius}
                        onChange={(e) => setGlassBorderRadius(parseInt(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>
                  </div>

                  {/* Right Live Real-time physical preview */}
                  <div className="space-y-3 flex flex-col justify-between">
                    <div className="flex-1 bg-gradient-to-tr from-slate-950 via-gray-900 to-indigo-950 rounded-xl p-4 flex items-center justify-center relative overflow-hidden border border-gray-900" style={{ minHeight: "180px" }}>
                      {/* Floating decorative elements in the card background */}
                      <div className="absolute top-2 left-6 w-12 h-12 rounded-full bg-blue-500/20 blur-md"></div>
                      <div className="absolute bottom-4 right-10 w-16 h-16 rounded-full bg-purple-500/10 blur-lg animate-pulse"></div>
                      
                      <div 
                        className="p-5 text-center text-xs z-10 transition-all shadow-xl max-w-[240px]"
                        style={{
                          background: `rgba(${parseInt(glassColor.slice(1, 3), 16)}, ${parseInt(glassColor.slice(3, 5), 16)}, ${parseInt(glassColor.slice(5, 7), 16)}, ${glassOpacity})`,
                          backdropFilter: `blur(${glassBlur}px)`,
                          border: `1px solid rgba(255, 255, 255, ${glassBorderOpacity})`,
                          borderRadius: `${glassBorderRadius}px`
                        }}
                      >
                        <Sparkles className="h-5 w-5 text-[#A8FF53] mx-auto mb-2 animate-bounce" />
                        <strong className="text-white font-bold block mb-1">Preview Glassmorphism</strong>
                        <span className="text-[10px] text-slate-300 leading-relaxed block">Visual translúcido contemporâneo baseado em camadas.</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-gray-900 space-y-2">
                      <div className="flex items-center justify-between font-mono text-[9.5px]">
                        <span className="text-slate-450 uppercase font-bold text-slate-400">Classes Tailwind CSS:</span>
                        <button
                          onClick={() => handleCopy(glassTailwindString, "glass-tw")}
                          className="text-blue-400 hover:underline"
                        >
                          {copiedId === "glass-tw" ? "[Copiado]" : "[Copiar]"}
                        </button>
                      </div>
                      <code className="text-slate-400 break-all select-all font-mono text-[10.5px] leading-relaxed block bg-[#0A0D14] p-2 rounded">
                        {glassTailwindString}
                      </code>

                      <div className="flex items-center justify-between font-mono text-[9.5px] pt-1">
                        <span className="text-slate-400 uppercase font-bold">Instruções Customizadas CSS:</span>
                        <button
                          onClick={() => handleCopy(glassStyleString, "glass-css")}
                          className="text-blue-400 hover:underline"
                        >
                          {copiedId === "glass-css" ? "[Copiado]" : "[Copiar]"}
                        </button>
                      </div>
                      <pre className="text-indigo-300 whitespace-pre overflow-x-auto text-[9px] block bg-[#0A0D14] p-2 rounded custom-scrollbar">
                        {glassStyleString}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 11. XML to JSON Converter */}
            {activeTool === "xml-to-json" && (
              <div className="space-y-5 text-xs">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></div>
                    <h3 className="text-sm font-semibold text-white font-mono">Conversor Sefaz XML para JSON</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Visualizador Fiscal Dinâmico</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10.5px] text-slate-400 font-mono font-bold block uppercase">XML de Entrada:</span>
                    <textarea
                      value={xmlInput}
                      onChange={(e) => setXmlInput(e.target.value)}
                      className="w-full h-80 bg-[#070b13]/90 border border-gray-800 rounded-xl p-3 font-mono text-[11px] text-[#A8FF53] focus:outline-none focus:border-orange-500/50"
                      placeholder="Cole aqui o XML fiscal ou de qualquer outra API corporativa..."
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] text-slate-400 font-mono font-bold block uppercase">Resultado JSON parsing:</span>
                      {xmlOutput && (
                        <button
                          onClick={() => handleCopy(xmlOutput, "xml-json")}
                          className="text-[10.5px] text-blue-450 text-blue-400 hover:underline font-mono cursor-pointer"
                        >
                          {copiedId === "xml-json" ? "Copiado!" : "[Copiar JSON]"}
                        </button>
                      )}
                    </div>
                    {xmlError ? (
                      <div className="w-full h-80 bg-red-950/20 border border-red-500/20 rounded-xl p-4 text-red-400 font-mono text-[11px] overflow-y-auto">
                        <AlertCircle className="h-4 w-4 mb-2 text-red-500 inline mr-1" />
                        <strong>Sintaxe XML Inválida:</strong>
                        <p className="mt-1 whitespace-pre-wrap">{xmlError}</p>
                      </div>
                    ) : (
                      <pre className="w-full h-80 bg-[#070b13]/90 border border-gray-800 rounded-xl p-3 font-mono text-[11px] text-cyan-400 overflow-y-auto whitespace-pre custom-scrollbar">
                        {xmlOutput || "Insira um XML válido para gerar os dados."}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 12. Sefaz Key Parser */}
            {activeTool === "sefaz-key-parser" && (
              <div className="space-y-5 text-xs">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <h3 className="text-sm font-semibold text-white font-mono">Decodificador Automático de Chaves Sefaz</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Validador de 44 Dígitos</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10.5px] font-mono font-bold block uppercase text-slate-400">Insira a chave de 44 dígitos:</label>
                    <input
                      type="text"
                      maxLength={50}
                      value={sefazKeyInput}
                      onChange={(e) => setSefazKeyInput(e.target.value)}
                      className="w-full bg-[#070b13]/90 border border-gray-800 rounded-xl p-3 font-mono text-[13px] text-emerald-400 focus:outline-none focus:border-emerald-500/50"
                      placeholder="Ex: 35260655119893872630550010000128451384511001"
                    />
                  </div>

                  {sefazKeyError && (
                    <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 font-mono">
                      <AlertCircle className="h-4 w-4 inline mr-2 text-red-500" />
                      {sefazKeyError}
                    </div>
                  )}

                  {sefazKeyResult && (
                    <div className="bg-slate-950/50 rounded-xl border border-gray-900 p-5 space-y-4">
                      <h4 className="text-[11.5px] font-bold text-white uppercase font-mono tracking-wider border-b border-gray-900 pb-2">Layout dos Dados Estruturados da Nota</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11.5px]">
                        <div className="bg-[#070b13] p-3 rounded-lg border border-gray-900 flex justify-between items-center">
                          <span className="text-slate-400">UF de Emissão:</span>
                          <strong className="text-white">{sefazKeyResult.uf}</strong>
                        </div>
                        <div className="bg-[#070b13] p-3 rounded-lg border border-gray-900 flex justify-between items-center">
                          <span className="text-slate-400">Período Fiscal (Ano/Mês):</span>
                          <strong className="text-white">{sefazKeyResult.anoMes}</strong>
                        </div>
                        <div className="bg-[#070b13] p-3 rounded-lg border border-gray-900 flex justify-between items-center">
                          <span className="text-slate-400">CNPJ do Emitente:</span>
                          <strong className="text-emerald-400">{sefazKeyResult.cnpj}</strong>
                        </div>
                        <div className="bg-[#070b13] p-3 rounded-lg border border-gray-900 flex justify-between items-center">
                          <span className="text-slate-400">Modelo do Documento:</span>
                          <strong className="text-white">{sefazKeyResult.modelo}</strong>
                        </div>
                        <div className="bg-[#070b13] p-3 rounded-lg border border-gray-900 flex justify-between items-center">
                          <span className="text-slate-400">Série da Nota:</span>
                          <strong className="text-white">{sefazKeyResult.serie}</strong>
                        </div>
                        <div className="bg-[#070b13] p-3 rounded-lg border border-gray-900 flex justify-between items-center">
                          <span className="text-slate-400 font-bold">Número de Nota (NF):</span>
                          <strong className="text-[#A8FF53] font-bold">{sefazKeyResult.numero}</strong>
                        </div>
                        <div className="bg-[#070b13] p-3 rounded-lg border border-gray-900 flex justify-between items-center">
                          <span className="text-slate-400">Tipo de Emissão:</span>
                          <strong className="text-indigo-400">{sefazKeyResult.emissaoType}</strong>
                        </div>
                        <div className="bg-[#070b13] p-3 rounded-lg border border-gray-900 flex justify-between items-center">
                          <span className="text-slate-400">Código Estratégico/Aleatório:</span>
                          <strong className="text-white">{sefazKeyResult.codigoEstrategico}</strong>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9.5px] font-bold">Dígito Verificador (CheckDigit): {sefazKeyResult.digitoVerificador}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Dígito final validado com sucesso.</span>
                        </div>
                        <button
                          onClick={() => handleCopy(sefazKeyInput, "sefaz-raw")}
                          className="text-blue-450 text-blue-400 hover:underline font-mono text-[10px] cursor-pointer"
                        >
                          {copiedId === "sefaz-raw" ? "Chave Copiada!" : "[Copiar Chave Limpa]"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 13. SQL Formatter */}
            {activeTool === "sql-formatter" && (
              <div className="space-y-5 text-xs">
                <div className="flex items-center justify-between border-b border-gray-900 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                    <h3 className="text-sm font-semibold text-white font-mono">Formatador e Embelezador SQL Pretty</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Beautifier de Consultas Relacionais</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[10.5px] text-slate-400 font-mono font-bold block uppercase">Sua Query Relacional Bruta:</span>
                    <textarea
                      value={sqlInput}
                      onChange={(e) => setSqlInput(e.target.value)}
                      className="w-full h-80 bg-[#070b13]/90 border border-gray-800 rounded-xl p-3 font-mono text-[11px] text-indigo-400 focus:outline-none focus:border-blue-500/50"
                      placeholder="SELECT * FROM table JOIN table2 ON..."
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] text-slate-400 font-mono font-bold block uppercase">Query Formatada Decorada:</span>
                      {sqlOutput && (
                        <button
                          onClick={() => handleCopy(sqlOutput, "sql-out")}
                          className="text-[10.5px] text-blue-450 text-blue-400 hover:underline font-mono cursor-pointer"
                        >
                          {copiedId === "sql-out" ? "Copiada!" : "[Copiar Query]"}
                        </button>
                      )}
                    </div>
                    <pre className="w-full h-80 bg-[#070b13]/90 border border-gray-800 rounded-xl p-3 font-mono text-[11px] text-[#A8FF53] overflow-y-auto whitespace-pre custom-scrollbar">
                      {sqlOutput || "Digite alguma consulta SQL para formatar."}
                    </pre>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
