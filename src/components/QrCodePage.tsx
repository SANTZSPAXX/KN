import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { 
  QrCode, 
  Download, 
  Share2, 
  Copy, 
  RotateCcw, 
  Wifi, 
  Link2, 
  MessageSquare, 
  DollarSign, 
  User, 
  Sliders, 
  Palette, 
  History, 
  Check, 
  Sparkles, 
  Smartphone,
  MapPin,
  Trash2,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";

interface QrHistoryItem {
  id: string;
  type: string;
  label: string;
  value: string;
  createdAt: string;
  color: string;
}

export default function QrCodePage() {
  const [qrType, setQrType] = useState<"url" | "whatsapp" | "wifi" | "pix" | "vcard" | "geo">("url");
  const [value, setValue] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<QrHistoryItem[]>([]);
  
  // Customization States
  const [fgColor, setFgColor] = useState("#38bdf8"); // Sky 400 default
  const [bgColor, setBgColor] = useState("#070b14"); // Dark Background default
  const [size, setSize] = useState(384);
  const [margin, setMargin] = useState(4);
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("H");
  const [logoOption, setLogoOption] = useState<"none" | "korenexus" | "whatsapp" | "wifi" | "pix" | "scan">("korenexus");

  // Specific data fields
  // URL / Text
  const [textUrl, setTextUrl] = useState("https://korenexus.com.br");
  
  // WhatsApp
  const [waPhone, setWaPhone] = useState("+55 11 98938-7263");
  const [waMessage, setWaMessage] = useState("Olá, gostaria de falar com a equipe de engenharia da KoreNexus!");
  
  // WiFi
  const [wifiSsid, setWifiSsid] = useState("KoreNexus_Enterprise_5G");
  const [wifiPassword, setWifiPassword] = useState("korenexus_9893");
  const [wifiEncryption, setWifiEncryption] = useState<"WEP" | "WPA" | "nopass">("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);

  // Pix (BR Standard)
  const [pixKey, setPixKey] = useState("contato@korenexus.com.br");
  const [pixMerchantName, setPixMerchantName] = useState("KoreNexus Solucoes ERP LTDA");
  const [pixMerchantCity, setPixMerchantCity] = useState("JUNDIAI");
  const [pixAmount, setPixAmount] = useState("");
  const [pixDescription, setPixDescription] = useState("RPA_SANDBOX_TX");

  // VCard
  const [vcardName, setVcardName] = useState("KoreNexus Suporte");
  const [vcardOrg, setVcardOrg] = useState("KoreNexus Corp");
  const [vcardPhone, setVcardPhone] = useState("+5511989387263");
  const [vcardEmail, setVcardEmail] = useState("contato@korenexus.com.br");

  // Geo
  const [geoLat, setGeoLat] = useState("-23.2201");
  const [geoLng, setGeoLng] = useState("-46.8837");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("korenexus_qr_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load QR history", e);
    }
  }, []);

  // Sync state to QR input based on type selection
  useEffect(() => {
    let rawValue = "";
    switch (qrType) {
      case "url":
        rawValue = textUrl;
        break;
      case "whatsapp":
        const cleanPhone = waPhone.replace(/\D/g, "");
        const cleanMsg = encodeURIComponent(waMessage);
        rawValue = `https://wa.me/${cleanPhone}${cleanMsg ? `?text=${cleanMsg}` : ""}`;
        break;
      case "wifi":
        // WIFI:S:SSID;T:WPA;P:PASSWORD;H:false;;
        rawValue = `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};H:${wifiHidden ? "true" : "false"};;`;
        break;
      case "pix":
        rawValue = generatePixPayload();
        break;
      case "vcard":
        rawValue = `BEGIN:VCARD\nVERSION:3.0\nN:${vcardName}\nORG:${vcardOrg}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
        break;
      case "geo":
        rawValue = `geo:${geoLat},${geoLng}`;
        break;
    }
    setValue(rawValue);
  }, [
    qrType, textUrl, waPhone, waMessage, wifiSsid, wifiPassword, wifiEncryption, 
    wifiHidden, pixKey, pixMerchantName, pixMerchantCity, pixAmount, pixDescription,
    vcardName, vcardOrg, vcardPhone, vcardEmail, geoLat, geoLng
  ]);

  // Pix Payload Generator standard Emvco
  const generatePixPayload = () => {
    const f = (id: string, text: string) => {
      const len = text.length.toString().padStart(2, "0");
      return id + len + text;
    };

    let payload = f("00", "01"); // Format Indicator
    payload += f("26", 
      f("00", "br.gov.bcb.pix") + 
      f("01", pixKey) +
      (pixDescription ? f("02", pixDescription) : "")
    );
    payload += f("52", "0000"); // Merchant Category
    payload += f("53", "986"); // Currency BR
    if (pixAmount) {
      const formattedAmount = parseFloat(pixAmount).toFixed(2);
      payload += f("54", formattedAmount);
    }
    payload += f("58", "BR"); // Country
    payload += f("59", pixMerchantName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().slice(0, 25));
    payload += f("60", pixMerchantCity.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().slice(0, 15));
    payload += f("62", f("05", "***")); // Transaction ID placeholder

    // CRC16 Checksum
    payload += "6304";
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
      let x = ((crc >> 8) ^ payload.charCodeAt(i)) & 0xFF;
      x ^= x >> 4;
      crc = ((crc << 8) ^ (x << 12) ^ (x << 5) ^ x) & 0xFFFF;
    }
    const crcHex = crc.toString(16).toUpperCase().padStart(4, "0");
    return payload + crcHex;
  };

  // Re-generate QR Code in Canvas and Data URL
  useEffect(() => {
    if (!value) return;

    const generateCode = async () => {
      try {
        const tempCanvas = document.createElement("canvas");
        await QRCode.toCanvas(tempCanvas, value, {
          width: size,
          margin: margin,
          errorCorrectionLevel: errorLevel,
          color: {
            dark: fgColor,
            light: bgColor,
          }
        });

        // Add customizable central logo on canvas
        const ctx = tempCanvas.getContext("2d");
        if (ctx && logoOption !== "none") {
          const qrSize = tempCanvas.width;
          const logoSize = qrSize * 0.18; // 18% of QR size
          const x = (qrSize - logoSize) / 2;
          const y = (qrSize - logoSize) / 2;

          // Draw white/bg colored cushion box behind logo
          ctx.fillStyle = bgColor;
          ctx.beginPath();
          ctx.roundRect(x - 4, y - 4, logoSize + 8, logoSize + 8, 8);
          ctx.fill();

          // Draw logo icon details
          ctx.save();
          
          if (logoOption === "korenexus") {
            // Draw a futuristic stylized "K" Logo
            ctx.fillStyle = fgColor;
            ctx.shadowColor = fgColor;
            ctx.shadowBlur = 4;
            
            ctx.beginPath();
            // Vertical bar
            ctx.roundRect(x + logoSize * 0.2, y + logoSize * 0.15, logoSize * 0.18, logoSize * 0.7, 3);
            ctx.fill();

            // Diagonal top
            ctx.beginPath();
            ctx.moveTo(x + logoSize * 0.38, y + logoSize * 0.5);
            ctx.lineTo(x + logoSize * 0.75, y + logoSize * 0.15);
            ctx.lineTo(x + logoSize * 0.82, y + logoSize * 0.25);
            ctx.lineTo(x + logoSize * 0.45, y + logoSize * 0.55);
            ctx.closePath();
            ctx.fill();

            // Diagonal bottom
            ctx.beginPath();
            ctx.moveTo(x + logoSize * 0.38, y + logoSize * 0.45);
            ctx.lineTo(x + logoSize * 0.75, y + logoSize * 0.85);
            ctx.lineTo(x + logoSize * 0.82, y + logoSize * 0.75);
            ctx.lineTo(x + logoSize * 0.45, y + logoSize * 0.4);
            ctx.closePath();
            ctx.fill();
          } else if (logoOption === "whatsapp") {
            // Draw stylized Whatsapp Bubble
            ctx.fillStyle = "#22c55e"; // Green WhatsApp
            ctx.beginPath();
            ctx.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2 - 2, 0, Math.PI * 2);
            ctx.fill();
            // Little bubble speech hook
            ctx.fillStyle = "#22c55e";
            ctx.beginPath();
            ctx.moveTo(x + logoSize * 0.3, y + logoSize * 0.7);
            ctx.lineTo(x + logoSize * 0.15, y + logoSize * 0.85);
            ctx.lineTo(x + logoSize * 0.45, y + logoSize * 0.78);
            ctx.closePath();
            ctx.fill();
            // Phone handset symbol inside
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(x + logoSize / 2, y + logoSize / 2, logoSize * 0.2, 0, Math.PI * 2);
            ctx.fill();
          } else if (logoOption === "wifi") {
            // Wifi Signal icon
            ctx.strokeStyle = fgColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x + logoSize / 2, y + logoSize * 0.75, 2, 0, Math.PI * 2);
            ctx.fillStyle = fgColor;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(x + logoSize / 2, y + logoSize * 0.75, logoSize * 0.25, Math.PI, Math.PI * 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(x + logoSize / 2, y + logoSize * 0.75, logoSize * 0.5, Math.PI, Math.PI * 2);
            ctx.stroke();
          } else if (logoOption === "pix") {
            // Draw beautiful Pix logo badge
            ctx.fillStyle = "#32bcad"; // Pix Theme Teal
            ctx.beginPath();
            ctx.roundRect(x, y, logoSize, logoSize, 6);
            ctx.fill();
            // Draw a subtle intersecting infinity diamond
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x + logoSize * 0.2, y + logoSize * 0.2, logoSize * 0.6, logoSize * 0.6);
          } else if (logoOption === "scan") {
            // Scan text or badge
            ctx.fillStyle = fgColor;
            ctx.font = "8px sans-serif";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText("LER", x + logoSize / 2, y + logoSize / 2);
          }

          ctx.restore();
        }

        // Output to preview canvas
        const finalCanvas = canvasRef.current;
        if (finalCanvas) {
          finalCanvas.width = tempCanvas.width;
          finalCanvas.height = tempCanvas.height;
          const finalCtx = finalCanvas.getContext("2d");
          if (finalCtx) {
            finalCtx.drawImage(tempCanvas, 0, 0);
          }
        }

        setQrDataUrl(tempCanvas.toDataURL("image/png"));
      } catch (err) {
        console.error("QRCode rendering error", err);
      }
    };

    generateCode();
  }, [value, fgColor, bgColor, size, margin, errorLevel, logoOption]);

  const saveToHistory = () => {
    let customLabel = "";
    switch (qrType) {
      case "url":
        customLabel = textUrl;
        break;
      case "whatsapp":
        customLabel = `WhatsApp: ${waPhone}`;
        break;
      case "wifi":
        customLabel = `WiFi: ${wifiSsid}`;
        break;
      case "pix":
        customLabel = `Pix: R$ ${pixAmount || "0.00"} p/ ${pixMerchantName}`;
        break;
      case "vcard":
        customLabel = `Contato: ${vcardName}`;
        break;
      case "geo":
        customLabel = `Coordenadas: ${geoLat}, ${geoLng}`;
        break;
    }

    const newItem: QrHistoryItem = {
      id: "qr-" + Date.now(),
      type: qrType,
      label: customLabel.slice(0, 60),
      value: value,
      createdAt: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      color: fgColor
    };

    const nextHistory = [newItem, ...history].slice(0, 10); // Keep last 10 entries
    setHistory(nextHistory);
    localStorage.setItem("korenexus_qr_history", JSON.stringify(nextHistory));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const downloadQr = () => {
    const link = document.createElement("a");
    link.download = `korenexus-qrcode-${qrType}-${Date.now()}.png`;
    link.href = qrDataUrl;
    link.click();
    saveToHistory();
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("korenexus_qr_history");
  };

  const loadHistoryItem = (item: QrHistoryItem) => {
    setQrType(item.type as any);
    setValue(item.value);
    setFgColor(item.color);
    // Parse value fields back if applicable
    if (item.type === "url") {
      setTextUrl(item.value);
    } else if (item.type === "geo" && item.value.startsWith("geo:")) {
      const parts = item.value.replace("geo:", "").split(",");
      if (parts[0]) setGeoLat(parts[0]);
      if (parts[1]) setGeoLng(parts[1]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2 font-sans" id="qr-generator-root">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5" id="qr-header">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider block">Estúdio de Utilidades KoreNexus</span>
          <h2 className="text-2xl font-display font-extrabold text-white flex items-center gap-2">
            <QrCode className="h-6 w-6 text-sky-400 animate-pulse" />
            <span>Gerador Inteligente de QR Code</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Crie QR codes industriais e comerciais customizados e estilizados. Gere Pix dinâmicos, credenciais de redes locais WiFi, cartões de contato e fluxos automatizados corporativos encriptados.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full text-[10px] font-mono font-semibold uppercase">
            SVG Vector Core
          </span>
          <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-mono font-semibold uppercase">
            Empresarial
          </span>
        </div>
      </div>

      {/* CORE WORKSPACE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="qr-grid-layout">
        
        {/* LEFT COLUMN: SELECTION AND DATA CONTROLS (8 COLS) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          {/* TYPE SELECTOR CARDS */}
          <div className="bg-[#0b1220]/50 border border-gray-800 p-4 rounded-3xl" id="qr-type-selector">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-3 pl-1">
              1. Selecione o Tipo do Provedor de Conteúdo
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <button
                onClick={() => setQrType("url")}
                className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition duration-200 border cursor-pointer group ${
                  qrType === "url" 
                    ? "bg-sky-500/10 text-sky-400 border-sky-500/40 shadow-md shadow-sky-500/5 font-bold" 
                    : "bg-[#0c1220] text-gray-400 border-gray-800 hover:border-gray-700 hover:text-white"
                }`}
                id="btn-type-url"
              >
                <Link2 className={`h-4 w-4 ${qrType === "url" ? "text-sky-400" : "text-gray-400 group-hover:text-white"}`} />
                <span className="text-[10px] uppercase font-semibold">Link/Texto</span>
              </button>

              <button
                onClick={() => setQrType("whatsapp")}
                className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition duration-200 border cursor-pointer group ${
                  qrType === "whatsapp" 
                    ? "bg-green-500/10 text-green-400 border-green-500/40 shadow-md shadow-green-500/5 font-bold" 
                    : "bg-[#0c1220] text-gray-400 border-gray-800 hover:border-gray-700 hover:text-white"
                }`}
                id="btn-type-wa"
              >
                <MessageSquare className={`h-4 w-4 ${qrType === "whatsapp" ? "text-green-400" : "text-gray-400 group-hover:text-white"}`} />
                <span className="text-[10px] uppercase font-semibold">WhatsApp</span>
              </button>

              <button
                onClick={() => setQrType("wifi")}
                className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition duration-200 border cursor-pointer group ${
                  qrType === "wifi" 
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/40 shadow-md shadow-amber-500/5 font-bold" 
                    : "bg-[#0c1220] text-gray-400 border-gray-800 hover:border-gray-700 hover:text-white"
                }`}
                id="btn-type-wifi"
              >
                <Wifi className={`h-4 w-4 ${qrType === "wifi" ? "text-amber-500" : "text-gray-400 group-hover:text-white"}`} />
                <span className="text-[10px] uppercase font-semibold">Rede WiFi</span>
              </button>

              <button
                onClick={() => setQrType("pix")}
                className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition duration-200 border cursor-pointer group ${
                  qrType === "pix" 
                    ? "bg-teal-500/10 text-teal-400 border-teal-500/40 shadow-md shadow-teal-500/5 font-bold" 
                    : "bg-[#0c1220] text-gray-400 border-gray-800 hover:border-gray-700 hover:text-white"
                }`}
                id="btn-type-pix"
              >
                <DollarSign className={`h-4 w-4 ${qrType === "pix" ? "text-teal-400" : "text-gray-400 group-hover:text-white"}`} />
                <span className="text-[10px] uppercase font-semibold">Chave Pix</span>
              </button>

              <button
                onClick={() => setQrType("vcard")}
                className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition duration-200 border cursor-pointer group ${
                  qrType === "vcard" 
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/40 shadow-md shadow-purple-500/5 font-bold" 
                    : "bg-[#0c1220] text-gray-400 border-gray-800 hover:border-gray-700 hover:text-white"
                }`}
                id="btn-type-vcard"
              >
                <User className={`h-4 w-4 ${qrType === "vcard" ? "text-purple-400" : "text-gray-400 group-hover:text-white"}`} />
                <span className="text-[10px] uppercase font-semibold">Contato</span>
              </button>

              <button
                onClick={() => setQrType("geo")}
                className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition duration-200 border cursor-pointer group ${
                  qrType === "geo" 
                    ? "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/40 shadow-md shadow-fuchsia-500/5 font-bold" 
                    : "bg-[#0c1220] text-gray-400 border-gray-800 hover:border-gray-700 hover:text-white"
                }`}
                id="btn-type-geo"
              >
                <MapPin className={`h-4 w-4 ${qrType === "geo" ? "text-fuchsia-400" : "text-gray-400 group-hover:text-white"}`} />
                <span className="text-[10px] uppercase font-semibold">Mapa/Geo</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC DATA ENTRY BOX */}
          <div className="bg-[#0b1220]/80 border border-gray-800 p-6 rounded-3xl space-y-4" id="qr-data-entry">
            <div className="flex items-center gap-2 border-b border-gray-850 pb-3 justify-between">
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest pl-1 header-part">
                2. Configurar Dados do Código QR ({qrType.toUpperCase()})
              </span>
              <span className="px-2 py-0.5 bg-slate-900 border border-gray-800 rounded font-mono text-[9px] text-gray-400 uppercase select-none">
                Codificação Automática
              </span>
            </div>

            {/* URL/TEXT INPUT */}
            {qrType === "url" && (
              <div className="space-y-2 font-sans" id="entry-url">
                <label className="text-xs font-bold text-slate-350 block">Endereço Web (URL) ou Texto Livre</label>
                <input
                  type="text"
                  value={textUrl}
                  onChange={(e) => setTextUrl(e.target.value)}
                  placeholder="https://sua-empresa.com.br"
                  className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none rounded-xl text-xs text-white"
                />
                <span className="text-[10px] text-gray-400 leading-snug block pl-1">
                  Digite qualquer link, domínio ou bloco de texto corrido. O QR code se adapta automaticamente.
                </span>
              </div>
            )}

            {/* WHATSAPP INPUT */}
            {qrType === "whatsapp" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 font-sans" id="entry-whatsapp">
                <div className="md:col-span-4 space-y-2">
                  <label className="text-xs font-bold text-slate-350 block">Número do WhatsApp</label>
                  <input
                    type="text"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="+55 11 99999-9999"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>
                <div className="md:col-span-8 space-y-2">
                  <label className="text-xs font-bold text-slate-350 block">Mensagem Inicial Pré-definida (Opcional)</label>
                  <input
                    type="text"
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    placeholder="Olá, vim através do QR Code Inteligente!"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>
                <span className="md:col-span-12 text-[10px] text-gray-400 leading-snug pl-1">
                  Quando o cliente escanear este QR code com a câmera, um diálogo direta de chat no WhatsApp com o seu destinatário se iniciará automaticamente.
                </span>
              </div>
            )}

            {/* WIFI INPUT */}
            {qrType === "wifi" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans" id="entry-wifi">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-350 block">Nome da Rede (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="Minha_Rede_Local"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-350 block">Senha da Rede WiFi</label>
                  <input
                    type="password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="SenhaDeAcesso123"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-350 block">Criptografia / Segurança</label>
                  <select
                    value={wifiEncryption}
                    onChange={(e) => setWifiEncryption(e.target.value as any)}
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-amber-500 cursor-pointer outline-none rounded-xl text-xs text-slate-300"
                  >
                    <option value="WPA">WPA/WPA2/WPA3 (Recomendado)</option>
                    <option value="WEP">WEP (Antigo)</option>
                    <option value="nopass">Sem senha (Rede Aberta)</option>
                  </select>
                </div>
                <div className="md:col-span-3 flex items-center gap-2 pt-1 pl-1">
                  <input
                    type="checkbox"
                    id="wifiHidden"
                    checked={wifiHidden}
                    onChange={(e) => setWifiHidden(e.target.checked)}
                    className="h-4 w-4 bg-slate-900 border-gray-800 text-amber-500 rounded focus:ring-amber-500 focus:ring-opacity-25"
                  />
                  <label htmlFor="wifiHidden" className="text-xs text-slate-400 select-none cursor-pointer">
                    Esta é uma rede oculta (SSID não transmitido abertamente)
                  </label>
                </div>
              </div>
            )}

            {/* PIX INPUT */}
            {qrType === "pix" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans" id="entry-pix">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-350 block">Chave Pix (E-mail, Telefone, CNPJ ou Aleatória)</label>
                  <input
                    type="text"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder="contato@korenexus.com.br"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-350 block">Valor da Transferência (Opcional - R$)</label>
                  <input
                    type="number"
                    value={pixAmount}
                    onChange={(e) => setPixAmount(e.target.value)}
                    placeholder="Ex: 150.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-350 block">Nome do Beneficiário (Até 25 letras)</label>
                  <input
                    type="text"
                    value={pixMerchantName}
                    onChange={(e) => setPixMerchantName(e.target.value)}
                    placeholder="Empresa Exemplo LTDA"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-350 block">Cidade do Beneficiário (Ex: JUNDIAI)</label>
                  <input
                    type="text"
                    value={pixMerchantCity}
                    onChange={(e) => setPixMerchantCity(e.target.value)}
                    placeholder="JUNDIAI"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-350 block">Identificador de Transação (Opcional TxId)</label>
                  <input
                    type="text"
                    value={pixDescription}
                    onChange={(e) => setPixDescription(e.target.value)}
                    placeholder="KORENEXUSERP"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>
                <span className="md:col-span-2 text-[10px] text-gray-400 leading-snug pl-1">
                  Gera uma String EMVco estática brasileira compatível com Banco Central do Brasil para recebimentos imediatos em aplicativos bancários de sandbox.
                </span>
              </div>
            )}

            {/* VCARD INPUT */}
            {qrType === "vcard" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans" id="entry-vcard">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-350 block">Nome Completo</label>
                  <input
                    type="text"
                    value={vcardName}
                    onChange={(e) => setVcardName(e.target.value)}
                    placeholder="Erick Kore Nexus"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-350 block">Empresa / Cargo</label>
                  <input
                    type="text"
                    value={vcardOrg}
                    onChange={(e) => setVcardOrg(e.target.value)}
                    placeholder="KoreNexus Engenharia"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-350 block">Telefone de Contato</label>
                  <input
                    type="text"
                    value={vcardPhone}
                    onChange={(e) => setVcardPhone(e.target.value)}
                    placeholder="+55 11 98938-7263"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-350 block">E-mail corporativo</label>
                  <input
                    type="email"
                    value={vcardEmail}
                    onChange={(e) => setVcardEmail(e.target.value)}
                    placeholder="contato@korenexus.com.br"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* GEOLOCATION INPUT */}
            {qrType === "geo" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans" id="entry-geo">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-350 block">Latitude</label>
                  <input
                    type="text"
                    value={geoLat}
                    onChange={(e) => setGeoLat(e.target.value)}
                    placeholder="-23.2201"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-350 block">Longitude</label>
                  <input
                    type="text"
                    value={geoLng}
                    onChange={(e) => setGeoLng(e.target.value)}
                    placeholder="-46.8837"
                    className="w-full px-4 py-3 bg-[#070b14] border border-gray-800 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none rounded-xl text-xs text-white"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2 pr-1">
                  <button
                    onClick={() => {
                      setGeoLat("-23.220147");
                      setGeoLng("-46.883732"); // Jundiai KoreNexus headquarter mock
                    }}
                    type="button"
                    className="text-[10px] text-fuchsia-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="h-3 w-3" />
                    <span>Usar Sede Jundiaí, SP</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* DESIGN AND STYLE CUSTOMIZER */}
          <div className="bg-[#0b1220]/80 border border-gray-800 p-6 rounded-3xl space-y-6" id="qr-style-customizer">
            <div className="flex items-center gap-2 border-b border-gray-850 pb-3">
              <Sliders className="h-4 w-4 text-indigo-400" />
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pl-1">
                3. Personalize a Estética & Elementos de Marca
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
              
              {/* COLORS SELECTION */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                  <Palette className="h-3.5 w-3.5 text-sky-400" />
                  <span>Cores de Contraste</span>
                </span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-gray-400 block">Cor do QR Code</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" 
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input 
                        type="text" 
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-full px-2.5 py-2 text-center bg-[#070b14] text-[11px] text-slate-200 border border-gray-850 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] text-gray-400 block">Fundo do Bloco</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" 
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input 
                        type="text" 
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full px-2.5 py-2 text-center bg-[#070b14] text-[11px] text-slate-200 border border-gray-850 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Built-in quick color palettes */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-mono block uppercase">Paletas Premium</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      { fg: "#38bdf8", bg: "#070b14", name: "Sky" },
                      { fg: "#10b981", bg: "#010409", name: "Emerald" },
                      { fg: "#a855f7", bg: "#0a0714", name: "Purple" },
                      { fg: "#f43f5e", bg: "#14070a", name: "Rose" },
                      { fg: "#f59e0b", bg: "#140e07", name: "Amber" },
                      { fg: "#ffffff", bg: "#000000", name: "P&B Corp" }
                    ].map((pal) => (
                      <button
                        key={pal.name}
                        onClick={() => {
                          setFgColor(pal.fg);
                          setBgColor(pal.bg);
                        }}
                        type="button"
                        className="px-2 py-1 bg-[#101422] border border-gray-850 hover:border-gray-700 rounded text-[9.5px] text-slate-300 transition flex items-center gap-1 cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: pal.fg }}></span>
                        <span>{pal.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* LOGO IN CENTRAL HUB */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Emblema Central (Ícone Interno)</span>
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "none", label: "Sem ícone" },
                    { id: "korenexus", label: "KoreNexus" },
                    { id: "whatsapp", label: "WhatsApp" },
                    { id: "wifi", label: "WiFi" },
                    { id: "pix", label: "Pix Brasil" },
                    { id: "scan", label: "Ler Escanear" }
                  ].map((logo) => (
                    <button
                      key={logo.id}
                      onClick={() => {
                        setLogoOption(logo.id as any);
                        // Elevate error level auto to prevent logo occlusion errors
                        if (logo.id !== "none") setErrorLevel("H");
                      }}
                      type="button"
                      className={`py-2 px-1 focus:outline-none transition border rounded-xl text-center text-[10px] uppercase font-bold cursor-pointer font-mono ${
                        logoOption === logo.id 
                          ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/30" 
                          : "bg-[#070b14] text-slate-400 border-gray-850 hover:border-gray-700"
                      }`}
                    >
                      {logo.label}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 leading-snug block pl-1">
                  *A inclusão de ícones centrais ajusta automaticamente o nível de redundância (Error Correction) para o máximo operacional de 30% garantindo a leitura ideal.
                </span>
              </div>
            </div>

            {/* ADAVANCED SLIDERS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 font-sans border-t border-gray-850">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-350 font-semibold">Tamanho da Imagem</span>
                  <span className="text-gray-400 font-mono">{size} x {size} px</span>
                </div>
                <input 
                  type="range"
                  min="256"
                  max="1024"
                  step="64"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-900 rounded"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-350 font-semibold">Espaçamento de Margem</span>
                  <span className="text-gray-400 font-mono">{margin} blocos</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-900 rounded"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-350 font-semibold">Correção de Erro (Redundância)</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    {errorLevel === "L" && "L (7% Mínima)"}
                    {errorLevel === "M" && "M (15% Média)"}
                    {errorLevel === "Q" && "Q (25% Elevada)"}
                    {errorLevel === "H" && "H (30% Máxima)"}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 pt-1 font-mono">
                  {(["L", "M", "Q", "H"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setErrorLevel(level)}
                      disabled={logoOption !== "none" && level !== "H"}
                      className={`text-[9px] py-1 border rounded font-semibold cursor-pointer text-center ${
                        errorLevel === level 
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" 
                          : "bg-slate-950 text-gray-500 border-gray-850 hover:border-gray-700"
                      } ${logoOption !== "none" && level !== "H" ? "opacity-30 cursor-not-allowed" : ""}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PREVIEW AND EXPORT & HISTORY ACTIONS (4 COLS) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          
          {/* INTERACTIVE PREVIEW CARD */}
          <div className="bg-gradient-to-b from-[#0b1220] to-[#080b13] border border-gray-800 p-6 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center text-center shadow-2xl" id="qr-preview-card">
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-650/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="space-y-1 mb-5">
              <span className="px-2 py-0.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[8.5px] font-bold font-mono tracking-wider uppercase rounded-full inline-block">
                Renderização Real-Time
              </span>
              <h3 className="text-sm font-display font-bold text-white uppercase font-sans tracking-wide">Código QR Gerado</h3>
            </div>

            {/* Canvas/Preview Container */}
            <div className="p-4 bg-slate-950/60 border border-gray-850 rounded-2xl flex items-center justify-center relative w-fit mb-6 shadow-inner group">
              <canvas 
                ref={canvasRef} 
                className="max-w-[240px] md:max-w-[280px] h-auto rounded-xl border border-gray-800/40 shadow-lg group-hover:scale-102 transition duration-300"
              />
              <div className="absolute inset-0 border border-white/5 opacity-0 group-hover:opacity-100 transition rounded-2xl pointer-events-none"></div>
            </div>

            {/* Quick Actions Grid */}
            <div className="w-full space-y-3 pt-2" id="preview-actions">
              <button
                onClick={downloadQr}
                className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold rounded-xl text-xs transition duration-200 shadow-lg shadow-sky-500/15 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                id="btn-download-qr"
              >
                <Download className="h-4 w-4" />
                <span>Salvar & Baixar Imagem (PNG)</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="py-2.5 px-3 bg-[#111622] hover:bg-slate-850 text-slate-300 border border-gray-800 hover:text-white rounded-xl text-[10.5px] transition duration-200 flex items-center justify-center gap-1 cursor-pointer select-none"
                  id="btn-copy-raw"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                      <span>Copiar Link Puro</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const printWin = window.open("", "_blank");
                    if (printWin) {
                      printWin.document.write(`
                        <html>
                          <head>
                            <title>KoreNexus QR Code Print Layout</title>
                            <style>
                              body { font-family: sans-serif; text-align: center; padding: 100px; background: #fff; color: #000; }
                              .title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                              .subtitle { font-size: 13px; color: #555; margin-bottom: 40px; }
                              .img-wrap { border: 2px solid #ddd; padding: 10px; display: inline-block; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
                              img { max-width: 320px; display: block; }
                              .footer { margin-top: 50px; font-size: 10px; color: #aaa; border-top: 1px solid #eee; padding-top: 20px; }
                            </style>
                          </head>
                          <body onload="window.print()">
                            <div class="title">KoreNexus QR Code</div>
                            <div class="subtitle">${qrType.toUpperCase()} - Gerado de forma automatizada pelo portal</div>
                            <div class="img-wrap">
                              <img src="${qrDataUrl}" />
                            </div>
                            <div class="footer">Sistemas Automatizados KoreNexus & Emissores Inteligentes</div>
                          </body>
                        </html>
                      `);
                      printWin.document.close();
                    }
                    saveToHistory();
                  }}
                  className="py-2.5 px-3 bg-[#111622] hover:bg-slate-850 text-slate-300 border border-gray-800 hover:text-white rounded-xl text-[10.5px] transition duration-200 flex items-center justify-center gap-1 cursor-pointer select-none"
                  id="btn-print-qr"
                >
                  <Share2 className="h-3.5 w-3.5 text-slate-400" />
                  <span>Imprimir QR</span>
                </button>
              </div>
            </div>

            {/* RAW DATA ACCORDION PREVIEW */}
            <div className="w-full text-left mt-5 bg-[#070b14]/90 border border-gray-900 rounded-xl p-3">
              <span className="text-[9px] font-mono text-gray-500 uppercase block leading-none mb-1">Payload bruto gerado (raw data):</span>
              <p className="text-[10px] text-gray-400 font-mono break-all line-clamp-2" title={value}>{value}</p>
            </div>
          </div>

          {/* GENERATOR HISTORY CARD */}
          <div className="bg-[#0b1220]/80 border border-gray-800 p-5 rounded-3xl space-y-4" id="qr-history-card">
            <div className="flex items-center justify-between border-b border-gray-850 pb-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pl-1">
                  Códigos Recentes
                </span>
              </div>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-[9px] text-red-400 hover:text-red-300 transition flex items-center gap-1 cursor-pointer font-semibold uppercase font-mono"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Limpar</span>
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-6 text-gray-500 font-sans space-y-1">
                <p className="text-xs">Nenhum QR Code no histórico.</p>
                <p className="text-[10px]">Efetue download para guardar os itens gerados.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1" id="history-items-list">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className="p-2.5 bg-[#111622]/80 border border-gray-850 hover:border-gray-700 hover:bg-[#111622]/100 rounded-xl flex items-center justify-between gap-2 cursor-pointer transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 bg-slate-900 border border-gray-850 rounded text-[8px] font-bold text-slate-300 font-mono uppercase">
                          {item.type}
                        </span>
                        <span className="text-[8px] font-mono text-gray-500">{item.createdAt}</span>
                      </div>
                      <p className="text-[10px] text-gray-300 font-sans truncate max-w-[170px]">{item.label}</p>
                    </div>

                    <button 
                      type="button"
                      aria-label="Restaurar item"
                      className="p-1.5 hover:bg-slate-800 rounded bg-[#070b14] border border-gray-850 text-gray-400 hover:text-white shrink-0"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* DETAILED INFO AD AND CONFORMITY COMPONENT */}
      <div className="p-4 bg-slate-950/40 border border-gray-850 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] text-gray-400 font-mono" id="qr-compliance-info">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-sky-400" />
          <span>Qualidade de saída ISO/IEC 18004. O canal síncrono local re-calcula as posições de redundância dinamicamente.</span>
        </div>
        <span className="text-gray-500 text-right">KoreNexus QR-Toolkit v1.2</span>
      </div>
    </div>
  );
}
