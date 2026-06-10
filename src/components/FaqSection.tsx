import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronRight, HelpCircle as QuestionIcon } from "lucide-react";

interface FAQItem {
  id: string;
  pergunta: string;
  resposta: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "q0",
    pergunta: "O que é o Kflow AI e como ele se integra ao meu sistema atual?",
    resposta: "O Kflow AI é o motor de inteligência artificial neural desenvolvido sob medida pela KoreNexus. Ele opera como um middleware seguro que conecta seus ERPs, sistemas de cobrança e canais de relacionamento (como WhatsApp, e-mail e CRMs), automatizando triagens complexas de faturamento e geração de documentos de maneira imediata."
  },
  {
    id: "q1",
    pergunta: "Os softwares desenvolvidos pela KoreNexus contam com segurança e conformidade LGPD?",
    resposta: "Sim, absolutamente. Toda nossa infraestrutura nativa em contêineres e bancos de dados isolados implementa criptografia ponta a ponta (SSL/TLS 1.3), Content Security Policy rígido, tokens JWT e em-tempo-real logs de auditorias imutáveis de tráfego que estão em estrito alinhamento com a Legislação Geral de Proteção de Dados (LGPD)."
  },
  {
    id: "q2",
    pergunta: "A KoreNexus desenvolve integrações diretas com a Sefaz para emissão de Notas Fiscais?",
    resposta: "Sim, somos especialistas em automação fiscal sênior. Criamos robôs (RPA) e integradores síncronos de APIs para envio de XMLs, validações complexas, cartas de correção e download automático de notas emitidas contra o CNPJ integrado diretamente na Receita Federal."
  },
  {
    id: "q3",
    pergunta: "Posso gerenciar o banco de dados de produtos e aplicativos do site?",
    resposta: "Sim, fornecemos uma interface administrativa completa (protegida por controle de acesso por e-mail no rodapé em Painel de Controle de Planilhas) para que você conecte suas planilhas integradas ou visualize os dados gerados em tempo real de forma amigável."
  },
  {
    id: "q4",
    pergunta: "Quanto tempo leva o desenvolvimento de um ERP completo sob medida?",
    resposta: "O cronograma varia conforme o tamanho da sua operação e o número de microsserviços integrados. Normalmente, um protótipo conceitual funcional é entregue em até 15 dias úteis, e o sistema principal de alta usabilidade fica disponível em produção em até 45 dias úteis."
  }
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq-accordions-section" className="py-12 border-t border-gray-900 bg-[#06080E]/60 rounded-3xl p-6 md:p-8 space-y-6">
      <div className="text-center max-w-lg mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full">
          <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">Perguntas Frequentes</span>
        </div>
        <h3 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">Central de Dúvidas Técnicas</h3>
        <p className="text-xs text-gray-400 leading-relaxed font-sans">
          Veja as respostas gerais de arquitetura, prazos, faturamento e integrações construídas sob metodologia corporativa KoreNexus.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3 pt-2">
        {FAQ_DATA.map((item) => {
          const isSelected = openId === item.id;
          return (
            <div
              key={item.id}
              className="bg-[#0A0E17] border border-gray-850 hover:border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-md"
            >
              {/* Question Trigger Row */}
              <button
                onClick={() => toggleOpen(item.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer select-none group focus:outline-none"
              >
                <span className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors flex items-center gap-2">
                  <QuestionIcon className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>{item.pergunta}</span>
                </span>
                <ChevronRight
                  className={`h-4 w-4 text-gray-500 shrink-0 transition-transform duration-350 ${
                    isSelected ? "rotate-90 text-blue-400" : ""
                  }`}
                />
              </button>

              {/* Answer block */}
              <AnimatePresence initial={false}>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <div className="px-5 pb-5 pt-1 text-xs text-gray-400 leading-relaxed font-sans border-t border-gray-900 bg-slate-950/20 pl-11">
                      {item.resposta}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
