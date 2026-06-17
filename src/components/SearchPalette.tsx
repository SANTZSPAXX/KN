import React, { useState, useEffect, useRef } from "react";
import { Search, X, Layers, Wrench, Smartphone, FileText, ArrowRight, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SpreadsheetData, Produto, Ferramenta, AppModel, BlogPost } from "../types";

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  database: SpreadsheetData;
  onSelectProduct: (p: Produto) => void;
  onSelectTool: (f: Ferramenta) => void;
  onSelectApp: (a: AppModel) => void;
  onSelectPost: (p: BlogPost) => void;
  onSelectTab: (tab: string) => void;
}

export default function SearchPalette({
  isOpen,
  onClose,
  database,
  onSelectProduct,
  onSelectTool,
  onSelectApp,
  onSelectPost,
  onSelectTab
}: SearchPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      setQuery("");
    }
  }, [isOpen]);

  // Keyboard shortcut listener for escape orientation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Search logic normalizing strings to avoid accent match problems
  const normalize = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const cleanQuery = normalize(query.trim());

  let productsResults: Produto[] = [];
  let toolsResults: Ferramenta[] = [];
  let appsResults: AppModel[] = [];
  let blogResults: BlogPost[] = [];

  if (cleanQuery.length >= 2) {
    if (Array.isArray(database.produtos)) {
      productsResults = database.produtos.filter(
        p => normalize(p.nome).includes(cleanQuery) || normalize(p.descricao || "").includes(cleanQuery)
      );
    }
    if (Array.isArray(database.ferramentas)) {
      toolsResults = database.ferramentas.filter(
        f => normalize(f.nome).includes(cleanQuery) || normalize(f.utilidade || "").includes(cleanQuery)
      );
    }
    if (Array.isArray(database.apps)) {
      appsResults = database.apps.filter(
        a => normalize(a.nome).includes(cleanQuery) || normalize(a.descricao || "").includes(cleanQuery)
      );
    }
    if (Array.isArray(database.blog)) {
      blogResults = database.blog.filter(
        b => normalize(b.titulo).includes(cleanQuery) || normalize(b.resumo || "").includes(cleanQuery) || normalize(b.conteudo || "").includes(cleanQuery)
      );
    }
  }

  const hasResults =
    productsResults.length > 0 ||
    toolsResults.length > 0 ||
    appsResults.length > 0 ||
    blogResults.length > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Search Modal Box */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: -20 }}
          transition={{ duration: 0.18 }}
          className="bg-[#0D111A] border border-gray-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[75vh]"
        >
          {/* Header row with Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800 bg-[#0F1420]">
            <Search className="h-5 w-5 text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="O que você está procurando? (ex: ERP, validador, WhatsApp, Kflow...)"
              className="bg-transparent text-white placeholder-gray-500 font-sans text-sm focus:outline-none w-full border-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
                title="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-gray-800 rounded-md text-[9px] font-mono text-gray-400 uppercase select-none">
              ESC
            </div>
          </div>

          {/* Results container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {query.trim().length < 2 ? (
              <div className="py-10 text-center space-y-2">
                <Search className="h-8 w-8 text-gray-600 mx-auto animate-pulse" />
                <p className="text-sm font-display font-medium text-gray-300">Busca Inteligente KoreNexus</p>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Digite pelo menos 2 caracteres para pesquisar em tempo real em todas as nossas tabelas, artigos, sistemas e APIs.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-4">
                  {["Kflow", "KoreERP", "WhatsApp", "Sefaz", "Fintech", "Consultoria"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-2.5 py-1 bg-[#151B26] hover:bg-[#1C2433] text-[10px] font-mono font-semibold rounded-full border border-gray-800 transition text-gray-400 hover:text-white"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : !hasResults ? (
              <div className="py-12 text-center space-y-2">
                <span className="text-3xl">🔍</span>
                <p className="text-sm font-display font-medium text-gray-300">Nenhum resultado encontrado...</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Não encontramos nada para "{query}". Tente buscar por termos alternativos ou fale direto com nosso comercial.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. PRODUCTS RESULTS */}
                {productsResults.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 px-2 text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold col-span-full">
                      <Layers className="h-3 w-3" />
                      <span>Sistemas & Produtos ({productsResults.length})</span>
                    </div>
                    <div className="grid gap-2">
                      {productsResults.map((p, idx) => (
                        <div
                          key={`${p.id || 'p'}-${idx}`}
                          onClick={() => {
                            onSelectProduct(p);
                            onClose();
                          }}
                          className="flex items-center justify-between p-3 rounded-2xl bg-[#141A26] border border-gray-800 hover:border-blue-500/50 hover:bg-[#182132] transition group cursor-pointer"
                        >
                          <div className="min-w-0 pr-4">
                            <h4 className="text-xs font-semibold text-white group-hover:text-blue-400 transition">{p.nome}</h4>
                            <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{p.descricao}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[8px] px-2 py-0.5 font-mono font-bold rounded bg-blue-600/10 border border-blue-500/20 text-blue-400 uppercase">
                              {p.categoria}
                            </span>
                            <ArrowRight className="h-3 w-3 text-gray-500 group-hover:translate-x-1 transition group-hover:text-blue-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. TOOLS RESULTS */}
                {toolsResults.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 px-2 text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold col-span-full">
                      <Wrench className="h-3 w-3" />
                      <span>Ferramentas & Integrações ({toolsResults.length})</span>
                    </div>
                    <div className="grid gap-2">
                      {toolsResults.map((f, idx) => (
                        <div
                          key={`${f.id || 'f'}-${idx}`}
                          onClick={() => {
                            onSelectTool(f);
                            onClose();
                          }}
                          className="flex items-center justify-between p-3 rounded-2xl bg-[#141A26] border border-gray-800 hover:border-emerald-500/50 hover:bg-[#182132] transition group cursor-pointer"
                        >
                          <div className="min-w-0 pr-4">
                            <h4 className="text-xs font-semibold text-white group-hover:text-emerald-400 transition">{f.nome}</h4>
                            <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{f.utilidade}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[8px] px-2 py-0.5 font-mono font-bold rounded bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 uppercase">
                              {f.tipo}
                            </span>
                            <ArrowRight className="h-3 w-3 text-gray-500 group-hover:translate-x-1 transition group-hover:text-emerald-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. APPS RESULTS */}
                {appsResults.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 px-2 text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold col-span-full">
                      <Smartphone className="h-3 w-3" />
                      <span>Aplicativos Mobile ({appsResults.length})</span>
                    </div>
                    <div className="grid gap-2">
                      {appsResults.map((a, idx) => (
                        <div
                          key={`${a.id || 'a'}-${idx}`}
                          onClick={() => {
                            onSelectApp(a);
                            onClose();
                          }}
                          className="flex items-center justify-between p-3 rounded-2xl bg-[#141A26] border border-gray-800 hover:border-purple-500/50 hover:bg-[#182132] transition group cursor-pointer"
                        >
                          <div className="min-w-0 pr-4">
                            <h4 className="text-xs font-semibold text-white group-hover:text-purple-400 transition">{a.nome}</h4>
                            <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{a.descricao}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[8px] px-2 py-0.5 font-mono font-bold rounded bg-purple-600/10 border border-purple-500/20 text-purple-400 uppercase">
                              {a.plataforma}
                            </span>
                            <ArrowRight className="h-3 w-3 text-gray-500 group-hover:translate-x-1 transition group-hover:text-purple-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. BLOG RESULTS */}
                {blogResults.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 px-2 text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold col-span-full">
                      <FileText className="h-3 w-3" />
                      <span>Artigos & Publicações ({blogResults.length})</span>
                    </div>
                    <div className="grid gap-2">
                      {blogResults.map((b, idx) => (
                        <div
                          key={`${b.id || 'b'}-${idx}`}
                          onClick={() => {
                            onSelectTab("blog");
                            onSelectPost(b);
                            onClose();
                          }}
                          className="flex items-center justify-between p-3 rounded-2xl bg-[#141A26] border border-gray-800 hover:border-indigo-500/50 hover:bg-[#182132] transition group cursor-pointer"
                        >
                          <div className="min-w-0 pr-4">
                            <h4 className="text-xs font-semibold text-white group-hover:text-indigo-400 transition">{b.titulo}</h4>
                            <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{b.resumo}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[8px] px-2 py-0.5 font-mono font-bold rounded bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 uppercase">
                              {b.categoria}
                            </span>
                            <ArrowRight className="h-3 w-3 text-gray-500 group-hover:translate-x-1 transition group-hover:text-indigo-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Footer */}
          <div className="bg-[#0A0D14] border-t border-gray-800 px-5 py-3 flex justify-between items-center text-[10px] text-gray-500">
            <div className="flex items-center gap-1 font-mono">
              <CornerDownLeft className="h-3 w-3 text-gray-600" />
              <span>Clique ou pressione ENTER para navegar</span>
            </div>
            <span>Power By KoreNexus Search v2</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
