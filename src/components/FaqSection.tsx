import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  HelpCircle, 
  ChevronRight, 
  Search, 
  Sparkles, 
  Layers, 
  Activity, 
  Cpu, 
  Smartphone, 
  GraduationCap, 
  Database, 
  Tag, 
  Workflow, 
  Lock, 
  Terminal, 
  BookOpen, 
  Users 
} from "lucide-react";

export type FaqCategory =
  | "inicio"
  | "produtos"
  | "kagenda"
  | "kflow"
  | "ferramentas"
  | "apps"
  | "chatkore"
  | "promocoes"
  | "apis"
  | "status"
  | "blog"
  | "sobre"
  | "cursos";

interface FAQItem {
  id: string;
  pergunta: string;
  resposta: string;
}

const CATEGORIES_METADATA: Record<FaqCategory, { label: string; icon: React.ComponentType<any>; color: string }> = {
  inicio: { label: "Institucional", icon: Lock, color: "text-blue-400" },
  produtos: { label: "Sistemas ERP", icon: Database, color: "text-emerald-400" },
  kagenda: { label: "Agenda Comercial", icon: Users, color: "text-indigo-400" },
  kflow: { label: "Console Kflow", icon: Workflow, color: "text-rose-400" },
  ferramentas: { label: "Ferramentas Sefaz", icon: Layers, color: "text-amber-400" },
  apps: { label: "Aplicativos Móveis", icon: Smartphone, color: "text-cyan-400" },
  chatkore: { label: "Chatbot ChatKore", icon: Cpu, color: "text-purple-400" },
  promocoes: { label: "Promoções & Cupons", icon: Tag, color: "text-green-400" },
  apis: { label: "Integrações & APIs", icon: Terminal, color: "text-lime-400" },
  status: { label: "Uptime & Servidores", icon: Activity, color: "text-emerald-400" },
  blog: { label: "Blog de Engenharia", icon: BookOpen, color: "text-sky-400" },
  sobre: { label: "Sobre a KoreNexus", icon: HelpCircle, color: "text-pink-400" },
  cursos: { label: "Cursos & Certificações", icon: GraduationCap, color: "text-violet-400" },
};

const FAQ_DATABASE: Record<FaqCategory, FAQItem[]> = {
  inicio: [
    {
      id: "ini1",
      pergunta: "Como a KoreNexus auxilia indústrias e distribuidoras na região de Jundiaí e Várzea Paulista?",
      resposta: "Fornecemos suporte de proximidade física e consultoria presencial em automação logística, faturamento síncrono, relatórios robustos de inventário e integrações rápidas para otimizar os fluxos industriais da região com tempo reduzido."
    },
    {
      id: "ini2",
      pergunta: "Toda solução desenvolvida pela KoreNexus pertence inteiramente ao cliente final?",
      resposta: "Sim. Entregamos o código-fonte limpo, estruturado e totalmente documentado sob propriedade do cliente, hospedado em suas instâncias de nuvem dedicadas, eliminando dependências arbitrárias de licenciamento perpétuo."
    },
    {
      id: "ini3",
      pergunta: "Qual é o custo médio mensal de manutenção preventiva e infraestrutura em nuvem após a entrega?",
      resposta: "O cliente arca apenas com custos diretos da nuvem consumida (otimizada com scale-to-zero e alto rendimento) e suporte mensal de SLA contratado de forma flexível, garantindo previsibilidade de faturamento."
    },
    {
      id: "ini4",
      pergunta: "Como vocês realizam a integração entre sistemas ERP legados (como SAP, Protheus) e novos módulos?",
      resposta: "Utilizamos conectores exclusivos baseados em REST APIs e filas persistentes redundantes para troca segura de mensagens, garantindo transporte imediato de dados sem indisponibilidade ou riscos operacionais."
    },
    {
      id: "ini5",
      pergunta: "Quais metodologias de entrega ágil são aplicadas no desenvolvimento de softwares?",
      resposta: "Trabalhamos com Sprints quinzenais de entrega, reuniões semanais de progresso técnico e disponibilização contínua de protótipos navegáveis, garantindo que o cliente participe e valide cada etapa ativamente."
    },
    {
      id: "ini6",
      pergunta: "Qual é a cobertura geográfica física para atendimentos presenciais de suporte técnico corporativo?",
      resposta: "Garantimos suporte in-loco imediato para indústrias e empresas de faturamento em Jundiaí, Várzea Paulista, Campo Limpo Paulista, Itupeva, Cabreúva, Louveira, Vinhedo e toda a Grande São Paulo."
    },
    {
      id: "ini7",
      pergunta: "As soluções suportam múltiplos canais de redes sociais e WhatsApp integrados?",
      resposta: "Sim, integramos de forma nativa por meio do nosso barramento Kflow com APIs oficiais corporativas do WhatsApp, Instagram Direct, Facebook Messenger e e-mails de canais centrais da corporação."
    },
    {
      id: "ini8",
      pergunta: "As ferramentas fiscais fornecidas estão preparadas para as diretrizes da nova Reforma Tributária?",
      resposta: "Completamente. Nossas matrizes de cálculo fiscal são modulares e parametrizadas de modo a incorporar novos tributos unificados síncronos assim que entram em período oficial de homologação nacional."
    },
    {
      id: "ini9",
      pergunta: "Como funciona a proteção técnica das soluções contra ataques maliciosos ou tentativas de DDoS?",
      resposta: "Hospedamos os microsserviços sob redundância geográfica na GCP/AWS estruturados por firewalls rígidos de barramento de aplicação (WAF), criptografia simétrica e controle estrito de acessos autenticados por JWT."
    },
    {
      id: "ini10",
      pergunta: "O Plano de Ação KoreNexus possui algum compromisso comercial ou custo embutido?",
      resposta: "Não. A etapa consultiva de levantamento de dores e estruturação de arquitetura inicial é um serviço estritamente gratuito para qualificação de parcerias corporativas sólidas regionais."
    },
    {
      id: "ini11",
      pergunta: "Em quanto tempo posso capacitar meu primeiro time de faturamento nas novas ferramentas?",
      resposta: "O onboarding dura em média 48 horas úteis e é subsidiado por vídeos instrutivos dedicados, documentação completa e suporte local de proximidade no momento do go-live produtivo."
    },
    {
      id: "ini12",
      pergunta: "Vocês realizam migração assistida de bancos de dados legados do tipo SQL Server ou Oracle?",
      resposta: "Sim. Mapeamos as tabelas legadas e programamos scripts especializados de migração com redundância paralela para mitigar riscos de perda de dados históricos importantes."
    },
    {
      id: "ini13",
      pergunta: "Há multas pesadas por rescisão contratual ou cláusulas de fidelidades abusivas?",
      resposta: "Absolutamente não. Nossos contratos de sustentação técnica pós-garantia são mensais e baseados em valor agregado direto com cancelamento simplificado sem burocracias fiscais."
    },
    {
      id: "ini14",
      pergunta: "De que modo a engenharia garante que os sistemas rodem de forma rápida em smartphones mais antigos?",
      resposta: "Reduzimos pacotes de ativos digitais ao mínimo técnico necessário, priorizando componentes mobile nativos híbridos leves de renderização acelerada por GPU para excelente fluidez."
    },
    {
      id: "ini15",
      pergunta: "Como posso iniciar uma conversa formal com um engenheiro sênior para alinhar requisitos?",
      resposta: "Basta descrever sua necessidade em nosso Chatbot ChatKore ou acionar o especialista Yugny instantaneamente pelo botão integrado de redirecionamento por correspondência de WhatsApp comercial."
    }
  ],
  produtos: [
    {
      id: "prd1",
      pergunta: "A quais setores produtivos primários os softwares ERP da KoreNexus oferecem suporte?",
      resposta: "Indústrias de manufatura de pequeno a médio porte, distribuidoras de produtos acabados, operadoras de cadeia fria de alimentos e faturamentos sob demanda de prestadores de serviços robustos."
    },
    {
      id: "prd2",
      pergunta: "Como o ERP KoreNexus apoia a gestão inteligente de estoque em tempo real (WMS)?",
      resposta: "Por meio do controle síncrono de entradas e saídas parametrizadas com alertas de reposição mínima programada, rastreio completo de lotes e suporte integrado a leitores de códigos de barras físicos."
    },
    {
      id: "prd3",
      pergunta: "Posso interligar o painel logístico a transportadoras regionais de faturamento de frete?",
      resposta: "Sim. A plataforma disponibiliza barramentos de APIs flexíveis conectáveis às tabelas de fretes, cotações em tempo real e rastreios oficiais das principais transportadoras nacionais parceiras."
    },
    {
      id: "prd4",
      pergunta: "O ERP envia os respectivos XMLs e relatórios em PDF automaticamente para os e-mails dos clientes?",
      resposta: "Sim, automatizamos rotinas síncronas de faturamento que efetuam os disparos por e-mails parametrizados de forma imediata à autorização fiscal da nota pela receita."
    },
    {
      id: "prd5",
      pergunta: "Como o sistema automatiza a conciliação financeira do contas a pagar e receber?",
      resposta: "Suporta importação automática de extratos bancários padrão OFX e integração direta via APIs de gateways de pagamento, diminuindo intervenções manuais propensas a erros contábeis."
    },
    {
      id: "prd6",
      pergunta: "O que é o suporte multi-empresas (multi-tenant) disponível nos Produtos de Software?",
      resposta: "Uma arquitetura unificada e robusta na qual o gestor central consegue visualizar o balanço, movimentações de caixa e faturamentos de várias filiais isoladas com controle individual."
    },
    {
      id: "prd7",
      pergunta: "É possível configurar permissões detalhadas de visibilidade por perfil funcional?",
      resposta: "Sim. Controle total baseado em RBAC onde somente diretores veem margens operacionais líquidas, enquanto estagiários lidam apenas com ordens de preenchimento básico."
    },
    {
      id: "prd8",
      pergunta: "Como o ERP lida com falhas temporárias de conexão ao lançar dados em campo?",
      resposta: "Grava as movimentações críticas localmente no banco offline seguro do navegador (IndexedDB) e sincroniza instantaneamente de forma resiliente assim que o sinal de internet é restabelecido."
    },
    {
      id: "prd9",
      pergunta: "O método de cálculo de estocagem PEPS é suportado pelo motor contábil?",
      resposta: "Sim, suportamos parametrizas de custo pelo método PEPS (Primeiro que Entra, Primeiro que Sai) ou média ponderada de movimentação, facilitando auditorias contábeis avançadas."
    },
    {
      id: "prd10",
      pergunta: "Há possibilidade de utilizar impressoras térmicas locais diretamente integradas?",
      resposta: "Sim. O sistema conversa diretamente com os protocolos de impressão térmica padrão ESC/POS locais para emissão imediata de etiquetas adesivas ou recibos de balcão."
    },
    {
      id: "prd11",
      pergunta: "De que modo o painel reduz perdas operacionais por data de validade vencida?",
      resposta: "Por meio do controle rígido de lotes do tipo FEFO (First Expired, First Out) com geração de relatórios de atenção em até 90 dias antes do vencimento do lote físico no depósito."
    },
    {
      id: "prd12",
      pergunta: "O software me permite customizar campos adicionais nos cadastros de clientes?",
      resposta: "Sim. Oferecemos um painel de inserção flexível de metadados customizados extensíveis sem a necessidade de reescrever lógica estrutural do banco relacional de dados."
    },
    {
      id: "prd13",
      pergunta: "Há apuração de impostos interestaduais complexos como DIFAL e substituição tributária (ST)?",
      resposta: "Sim, há uma calculadora fiscal paramétrica onde o analista de faturamento insere as regras estaduais e fiscais vigentes para cálculo síncrono automático."
    },
    {
      id: "prd14",
      pergunta: "Existe alguma limitação física de banco de dados para produtos cadastrados?",
      resposta: "Não aplicamos limites artificiais limitadores. As instâncias em containers escalam verticalmente para acompanhar o crescimento real do banco do cliente sem cobranças de licença."
    },
    {
      id: "prd15",
      pergunta: "O ERP está em conformidade completa com a escrituração do Bloco K do SPED Fiscal?",
      resposta: "Sim, os cadastros de fichas técnicas de processos produtivo e perdas de manufatura são desenhados para exportação direta simplificada em conformidade legal com a SEFAZ."
    }
  ],
  kagenda: [
    {
      id: "kag1",
      pergunta: "Como o Kagenda comercial assegura a sincronização de duas vias com o Google Agenda?",
      resposta: "Utilizamos fluxos seguros sob OAuth 2.0 que monitoram alterações síncronas em ambas as plataformas. O agendamento inserido no site surge no smartphone da equipe corporativa imediatamente."
    },
    {
      id: "kag2",
      pergunta: "Consigo definir links específicos e exclusivos de agendamentos para múltiplos vendedores?",
      resposta: "Sim. Cada colaborador ou departamento dispõe de sua respectiva URL customizada compartilhável com regras de horários ebuffers operacionais isolados."
    },
    {
      id: "kag3",
      pergunta: "O link comercial executa disparos automáticos de lembretes aos clientes agendados?",
      resposta: "Sim, o sistema envia e-mails e mensagens instantâneas personalizadas via canais WhatsApp síncronos redundantes no período de 24h e 1 hora antes do agendamento."
    },
    {
      id: "kag4",
      pergunta: "Como o Kagenda impossibilita que dois clientes agendem a mesma vaga de horário comercial?",
      resposta: "Atuamos com travas de concorrência síncronas atomizadas e isoladas em nível de banco de dados no momento da pré-reserva, barrando agendamento duplicado por milissegundos."
    },
    {
      id: "kag5",
      pergunta: "É possível cobrar taxas de reserva de reuniões técnicas ou consultorias?",
      resposta: "Sim, suporte nativo integrado com Pix e Checkout integrado Pix/Stripe para liberação da data somente após a confirmação transacional do pagamento de sinal do cliente."
    },
    {
      id: "kag6",
      pergunta: "Os agendamentos podem ser incorporados em formato de iframe no site de nossa empresa?",
      resposta: "Sim, o Kagenda foi estruturado com flexibilidade responsiva total para encaixe e renderização polida em qualquer site, portal do cliente ou landing page terceirizada."
    },
    {
      id: "kag7",
      pergunta: "Qual o tratamento do Kagenda para contatos feitos de regiões com outros fusos horários?",
      resposta: "O navegador do cliente detecta a região de origem, recalcula os horários vagos e exibe-os convertidos, registrando o compromisso na agenda do vendedor em horário oficial de Brasília."
    },
    {
      id: "kag8",
      pergunta: "O sistema me deixa limitar um teto diário de atendimentos por colaborador comercial?",
      resposta: "Sim. É possível configurar cotas diárias de atendimentos e intervalos de descanso obrigatórios (buffer-time) para evitar sobrecarga operativa da força comercial."
    },
    {
      id: "kag9",
      pergunta: "Consigo aplicar formulários de qualificação de leads antes de liberar a agenda?",
      resposta: "Sim. Crie perguntas obrigatórias estruturadas que filtram e validam contatos frios antes de permiti-los ocupar os horários produtivos dos engenheiros seniores."
    },
    {
      id: "kag10",
      pergunta: "O Kagenda gera métricas em tempo real sobre faltas (no-show) e cancelamentos?",
      resposta: "Sim. Gráficos gerenciais exibem históricos de comparecimento por lead, canais de captação de agendamentos e eficiência de conversão por consultores do comitê comercial."
    },
    {
      id: "kag11",
      pergunta: "O que acontece se um vendedor precisar remover um dia inteiro da agenda produtiva?",
      resposta: "Ele desativa o dia no painel pessoal, notificando em lote via canais configurados todos os compromissos marcados com link prático de remarcação sem custo."
    },
    {
      id: "kag12",
      pergunta: "Onde ficam armazenados com segurança os contatos gerados pelas consultas?",
      resposta: "Todos os dados residem em bancos cadastrados criptografados com acessos isolados de controle de dados corporativos em total conformidade técnica com as diretrizes da LGPD."
    },
    {
      id: "kag13",
      pergunta: "O sistema gerencia conflitos de salas e recursos físicos para as reuniões presenciais?",
      resposta: "Sim, o Kagenda faz a checagem dupla evitando que duas sessões presenciais reservem a mesma sala de conferência corporativa no complexo presencial."
    },
    {
      id: "kag14",
      pergunta: "Como o Kagenda atua para reter leads indecisos que tentam reagendar múltiplas vezes?",
      resposta: "Há parâmetros que limitam a quantidade máxima de reagendamentos livres por contato para forçar o comprometimento comercial prévio do comprador."
    },
    {
      id: "kag15",
      pergunta: "Há consumo excessivo de plano local de internet para atualizar os painéis comerciais do Kagenda?",
      resposta: "Não. Toda inteligência de processamento das datas e robôs de disparo ocorrolocalizada em segundo plano no servidor distribuído central KoreNexus."
    }
  ],
  kflow: [
    {
      id: "kfl1",
      pergunta: "O que é o console inteligente unificado Kflow?",
      resposta: "É o painel de engenharia central que gerencia e conecta os fluxos lógicos de automações de banco de dados, disparos síncronos de APIs e processamento assíncrono seguro."
    },
    {
      id: "kfl2",
      pergunta: "Como o Kflow neutraliza atrasos de conexões em webhooks externos integrados?",
      resposta: "Aplicamos um sistema de fila assíncrona imutável que armazena tentativas rejeitadas e executa retentativas exponenciais automáticas com intervalos inteligentes (backoff)."
    },
    {
      id: "kfl3",
      pergunta: "Consigo criar diagramas visuais explicativos dos fluxos integrados no Kflow?",
      resposta: "Sim. O console disponibiliza um mapeador de processos auto-generativo que desenha a árvore lógica de conexões para auditoria visual de gargalos produtivos regionais."
    },
    {
      id: "kfl4",
      pergunta: "Qual é o limite operacional de requisições concorrentes suportado pelo painel Kflow?",
      resposta: "Desenvolvido em arquitetura sem servidor distribuída que acompanha surtos de tráfego, comportando mais de 12.000 requisições simultâneas sem perdas ou latências visíveis."
    },
    {
      id: "kfl5",
      pergunta: "Consigo injetar códigos customizados JavaScript ou Python nos nós de automação?",
      resposta: "Sim, há suporte para contêineres sandbox isolados de computação em borda (FaaS), permitindo que você trate dados de payloads complexos sob medida técnica livre."
    },
    {
      id: "kfl6",
      pergunta: "O Kflow possui acoplamento com transmissões do tipo gRPC ou apenas REST legacy?",
      resposta: "Tratamos conexões ultra velozes gRPC síncronas, barramentos GraphQL de alta consulta e interfaces REST clássicas sob segurança robusta ponta a ponta."
    },
    {
      id: "kfl7",
      pergunta: "As integrações otimizam o consumo de largura de banda de canais internos industriais?",
      resposta: "Sim, implementamos técnicas de compressão de payload (GZIP) e verificações parciais locais em memória temporária de servidores para evitar desperdícios de banda técnica."
    },
    {
      id: "kfl8",
      pergunta: "Posso gerenciar os barramentos ativos de integrações no telefone celular pelo painel?",
      resposta: "Sim. O visualizador de fluxo do Kflow é 100% responsivo com layouts em bento-grid que mostram erros e chamadas com usabilidade perfeita no smartphone."
    },
    {
      id: "kfl9",
      pergunta: "Como é realizada a segurança de cabeçalhos de APIs e chaves sensíveis?",
      resposta: "As chaves restritas são geradas em cofre imutável (Vault) criptografado com chaves simétricas rotativas, as quais nunca são trafegadas ou expostas em código client-side."
    },
    {
      id: "kfl10",
      pergunta: "Quais alertas urgentes o Kflow gera em caso de erros fatais nos webservices fiscais?",
      resposta: "Gera notificações instantâneas enviadas por canais imediatos de robôs no WhatsApp e-mails críticos de alerta técnico e conexões urgentes de webhooks para o time de plantão."
    },
    {
      id: "kfl11",
      pergunta: "O Kflow suporta versionamento histórico e reversão instantânea de fluxogramas?",
      resposta: "Sim. Toda mudança gera um hash de histórico seguro com opção de retorno operacional a versões estáveis anteriores em um clique caso algum novo endpoint falhe."
    },
    {
      id: "kfl12",
      pergunta: "Como a modelagem customizada de alta latência beneficia empresas de faturamento regional?",
      resposta: "Previne que lentidões transacionais na autorização de notas estaduais paralisem o ritmo produtivo da expedição, desacoplando o processo comercial de ponta."
    },
    {
      id: "kfl13",
      pergunta: "É possível realizar simulações fictícias (Mocking) antes de promover regras operacionais reais?",
      resposta: "Sim. O painel Kflow conta com geradores automáticos de respostas mockadas para testes funcionais práticos exaustivos sem impactar bases reais ou faturamento."
    },
    {
      id: "kfl14",
      pergunta: "Há controle rastreável das mudanças operadas pelos programadores da equipe?",
      resposta: "Completamente. Registro inalterável contendo IP, alteração de parâmetros e horários síncronos UTC, cumprindo exigências padrão ISO para auditorias de segurança corporativas."
    },
    {
      id: "kfl15",
      pergunta: "Onde obtenho modelos prontos de fluxos e conectores rápidos para baixar?",
      resposta: "A biblioteca do Kflow oferece matrizes pré-configuradas para os principais ERPs de mercado, as quais podem ser ativadas de graça em ambiente sandbox de teste."
    }
  ],
  ferramentas: [
    {
      id: "fer1",
      pergunta: "Quais recursos fiscais as Ferramentas Sefaz fornecem nativamente no portal?",
      resposta: "Consulta imediata de status estadual, validação e download em lote de XMLs, auditoria prévia de regras tributárias e saneamento cadastral de NCMs de mercadorias."
    },
    {
      id: "fer2",
      pergunta: "Quais ações são tomadas para evitar lentidões recorrentes da Receita Federal SP?",
      resposta: "Trabalhamos com microsserviços geolocalizados que alternam instantaneamente comandos de emissão para servidores estaduais contingentes autorizados mais rápidos."
    },
    {
      id: "fer3",
      pergunta: "Há necessidade de acoplar ou plugar leitores físicos de cartões de Certificado Digital?",
      resposta: "Não. Hospede com segurança o Certificado Digital A1 no ambiente criptografado KoreNexus e fature de qualquer browser logado no smartphone sem periféricos locais."
    },
    {
      id: "fer4",
      pergunta: "As atualizações das Notas Técnicas da Sefaz nacional são inclusas sem taxas extras?",
      resposta: "Sim. Monitoramos periodicamente os comunicados da SEFAZ e aplicamos as novas normas aos webservices fiscais automaticamente antes do período de obrigatoriedade legal."
    },
    {
      id: "fer5",
      pergunta: "Como executo a manifestação do destinatário de notas fiscais emitidas contra meu CNPJ?",
      resposta: "O robô fiscal KoreNexus automatiza a varredura e executa as manifestações de confirmação ou desconhecimento de operação de forma automatizada respeitando as regras fiscais."
    },
    {
      id: "fer6",
      pergunta: "A ferramenta de auditoria ajuda a evitar multas fiscais de faturamentos anteriores?",
      resposta: "Sim. Efetuamos checagem cruzada das declarações enviadas contra os arquivos de XML originais para apontar fraudes, inconsistências ou omissões fiscais em segundos."
    },
    {
      id: "fer7",
      pergunta: "A plataforma analisa erros estruturais em XMLs antes de transmitir para a Receita?",
      resposta: "Sim. O validador de cabeçalho fiscal analisa codificações de ICMS-ST, IPI e de alíquotas interestaduais antes do envio, evitando rejeições desnecessárias do fisco."
    },
    {
      id: "fer8",
      pergunta: "Por quanto tempo útil os XMLs emitidos permanecem armazenados nos servidores?",
      resposta: "Preservamos o catálogo fiscal imutável e disponível para relatórios por 5 anos inteiros em conformidade legal, com downloads acessíveis em lote a qualquer momento."
    },
    {
      id: "fer9",
      pergunta: "Qual é o grau de dificuldade para acoplar essas ferramentas com outros ERPs terceirizados?",
      resposta: "Mínimo. Disponibilizamos endpoints padronizados em JSON REST extremamente documentados e inteligíveis para fácil integração por qualquer equipe interna de TI comercial."
    },
    {
      id: "fer10",
      pergunta: "O barramento fiscal realiza o cálculo aproximado das alíquotas da Lei da Transparência (IBPT)?",
      resposta: "Sim. Atualizamos periodicamente em nosso banco os índices aproximados tributários do IBPT por NCM para exibição síncrona nos DANFEs de venda e cupons."
    },
    {
      id: "fer11",
      pergunta: "Há limite máximo mensal no processamento ou download de XMLs para contabilidade?",
      resposta: "Nossos servidores são escalonados horizontalmente de forma elástica, comportando desde pequenas empresas locais a indústrias robustas com fluxos fiscais massivos."
    },
    {
      id: "fer12",
      pergunta: "Consigo efetuar o envio de Cartas de Correção Eletrônicas (CC-e) pelo próprio portal?",
      resposta: "Sim. Disponibilizamos uma interface administrativa limpa e orientada com validações automáticas de texto aceito para transmissão síncrona imediata à prefeitura regional."
    },
    {
      id: "fer13",
      pergunta: "É seguro armazenar meu arquivo de certificado digital dentro da plataforma KoreNexus?",
      resposta: "Total segurança. Usamos criptografia de nível militar AES-256 e chaves guardadas sob encriptação dupla de chaves simétricas físicas, protegendo seus dados contra vazamentos."
    },
    {
      id: "fer14",
      pergunta: "Como faço para transformar dados brutos de XML em relatórios de faturamento legíveis?",
      resposta: "Temos um parseador visual de faturamento que resume faturamento bruto, média tributária e movimentação cadastral por período, com visualização em gráficos interativos."
    },
    {
      id: "fer15",
      pergunta: "O que ocorre se a prefeitura de Jundiaí alterar as regras fiscais de emissores ISSQN locais?",
      resposta: "Nossos programadores efetuam os testes necessários no sandbox da prefeitura paulista local e promovem a atualização técnica operacional no portal em tempo recorde de 24h."
    }
  ],
  apps: [
    {
      id: "app1",
      pergunta: "Como os aplicativos móveis KoreNexus conseguem funcionar sem internet em campo?",
      resposta: "Estruturamos armazenamento local transacional SQLite offline no aparelho. Conforme as vendas acontecem, os dados são guardados e sincronizados de forma síncrona no retorno de conexão."
    },
    {
      id: "app2",
      pergunta: "Seus aplicativos são construídos com linguagens nativas ou de forma híbrida avançada?",
      resposta: "Trabalhamos com React Native e Flutter, garantindo transições polidas, ótimo consumo de carga de bateria e desempenho comparável a apps 100% nativos Android e iOS."
    },
    {
      id: "app3",
      pergunta: "Todos os dados captados nos smartphones são integrados com nosso ERP interno?",
      resposta: "Sim. A integração é estruturada por microsserviços seguros e endpoints de API que mantêm os estoques, faturamentos e status de pedidos sincronizados em tempo real."
    },
    {
      id: "app4",
      pergunta: "Há conformidade estrita dos aplicativos móveis com as normas da Apple e Google?",
      resposta: "Sim. Todos os aplicativos cumprem rigorosamente as diretrizes operacionais de LGPD, políticas de dados do usuário e de desempenho estrito para publicação imediata."
    },
    {
      id: "app5",
      pergunta: "Consigo planejar o disparo de notificações corporativas por geolocalização?",
      resposta: "Sim. Oferecemos controle avançado que permite mandar ofertas ou alertas de serviço somente quando o usuário do app cruzar perímetros comerciais mapeados."
    },
    {
      id: "app6",
      pergunta: "Os aplicativos aceitam leituras biométricas por impressão digital e reconhecimento facial?",
      resposta: "Sim, implementamos conexões robustas com os chips integrados de biologia das aparelhos móveis para login seguro sem necessidade de digitar senhas complexas."
    },
    {
      id: "app7",
      pergunta: "O que são as versões em Progressive Web Apps (PWA) de seus aplicativos?",
      resposta: "São aplicativos extremamente otimizados que rodam diretamente pelo browser sem requerer download nas lojas de apps, economizando memória física de armazenamento."
    },
    {
      id: "app8",
      pergunta: "Como o sistema móvel ajuda equipes que operam serviços técnicos ou entregas físicas?",
      resposta: "Oferecemos otimizador de rotas geolocalizadas composto por mapas integrados que agilizam coletas, reportam horários de paradas e emitem protocolos digitais coletados."
    },
    {
      id: "app9",
      pergunta: "Há possibilidade de utilizar canais de câmeras comuns dos celulares para ler códigos de barras?",
      resposta: "Sim. Integramos o scanner óptico rápido diretamente na câmera, otimizado para ler códigos lineares, QR Codes e registros fiscais mesmo em ambientes de baixa iluminação."
    },
    {
      id: "app10",
      pergunta: "Os aplicativos de faturamento continuam operando após atualizações de sistema Android / iOS?",
      resposta: "Sim, nossa equipe faz vistorias constantes de regressão de código e compatibilidade para novas versões de sistemas, prevenindo contra quebras funcionais visuais."
    },
    {
      id: "app11",
      pergunta: "Quem arca com o faturamento de licenças de publicidade e hospedagem nas lojas oficiais?",
      resposta: "Nós auxiliamos na criação técnica de sua conta corporativa de desenvolvedor e gerenciamos as publicações de versões beta gratuitas, sem custos adicionais de assessoria."
    },
    {
      id: "app12",
      pergunta: "Os apps capturam dados de engajamento operacional e estatísticas de uso interno?",
      resposta: "Sim, os painéis administrativos trazem dados de cliques, telas mais usadas por vendedores e fluidez geral respeitando todas as regulações federais brasileiras da LGPD."
    },
    {
      id: "app13",
      pergunta: "É possível emitir pré-pedidos em PDF diretamente pelo celular de campo do parceiro?",
      resposta: "Sim. O app gera os DANFEs, recibos e orçamentos comerciais prévios na hora com layout de usabilidade clean para envio descomplicado por e-mail ou WhatsApp corporativo."
    },
    {
      id: "app14",
      pergunta: "As cores e fontes do aplicativo móvel respeitam nosso livro visual de marca (White Label)?",
      resposta: "Sim. Todo design de experiência móvel é adaptável para retratar com precisão a identidade oficial de sua empresa com logo próprio e paleta cromática personalizada."
    },
    {
      id: "app15",
      pergunta: "Qual o prazo médio previsto para validarmos o primeiro rascunho funcional do app?",
      resposta: "Em no máximo 10 dias úteis, nossa engenharia apresenta as interfaces lógicas do protótipo no sandbox para interação direta e refinamentos de usabilidade."
    }
  ],
  chatkore: [
    {
      id: "chk1",
      pergunta: "O que é o ChatKore AI e como ele otimiza o meu processo de conversão comercial?",
      resposta: "O ChatKore AI é o nosso chatbot neural síncrono desenhado sob medida. Ele qualifica contatos, gera respostas rápidas 24/7 sobre preços e agenda atendimentos de vendas."
    },
    {
      id: "chk2",
      pergunta: "O chatbot atua inclusive durante feriados nacionais e finais de semana?",
      resposta: "Certamente. Toda engrenagem do robô opera ininterruptamente na nuvem isolada, fornecendo interatividade funcional e capturando leads fora de seus horários de expediente."
    },
    {
      id: "chk3",
      pergunta: "O ChatKore é sincronizado por API oficial integrada da operadora Meta?",
      resposta: "Sim, integramos de forma estrita com APIs oficiais do WhatsApp Business (Cloud API), o que elimina riscos de bloqueios ou bans de contas comuns em plataformas amadoras."
    },
    {
      id: "chk4",
      pergunta: "O assistente de inteligência consegue encaminhar encartes ou notas técnicas via WhatsApp?",
      resposta: "Sim, é capaz de identificar demandas de catálogos e remeter anexos em PDF, imagens comerciais explicativas ou planilhas de faturamento de forma instantânea às solicitações."
    },
    {
      id: "chk5",
      pergunta: "Como acontece a transferência humana em conversas que o chatbot não consegue solucionar?",
      resposta: "O ChatKore transiciona a conversa de forma síncrona e transparente para o painel de atendimento humano, notificando o vendedor responsável com o histórico completo de interação."
    },
    {
      id: "chk6",
      pergunta: "Os dados coletados na conversa fluem de forma automática para nossa Planilha de Dados / CRM?",
      resposta: "Sim. Integramos os cadastros captados no fluxo do ChatKore com planilhas de vendas estruturadas e ERPs comerciais de forma redundante e automática."
    },
    {
      id: "chk7",
      pergunta: "Como o bot assegura a confidencialidade das comunicações privadas dos leads?",
      resposta: "Todas as trocas de mensagens na nuvem trafegam sob proteção de SSL avançado e dados em repouso recebem mascaramentos para segurança, de acordo com as leis LGPD."
    },
    {
      id: "chk8",
      pergunta: "É viável personalizar a entonação linguística e o perfil do assistente virtual?",
      resposta: "Completamente. O painel gestor do ChatKore permite que a liderança determine as saudações iniciais, o vocabulário recomendado e as diretrizes estritas de negócio."
    },
    {
      id: "chk9",
      pergunta: "O bot é treinado para prospectar contatos geográficos específicos de Jundiaí e região?",
      resposta: "Sim. O ChatKore consegue segmentar os diálogos guiando ofertas especiais para indústrias da microregião paulista local, potencializando a conversão comercial direta."
    },
    {
      id: "chk10",
      pergunta: "Há travamentos ou atrasos demorados no retorno do fluxo conversacional com o cliente?",
      resposta: "Não. Nosso motor utiliza as APIs mais leves de processamento linguístico, processando intenções textuais e emitindo respostas completas em menos de 1,2 segundos."
    },
    {
      id: "chk11",
      pergunta: "O robô de chat suporta quantas sessões simultâneas de clientes conversando?",
      resposta: "Delineado sob micro-containers que escalam dinamicamente na nuvem, suportando milhares de conversas paralelas ativas sem perda de fluidez ou lentidão nas respostas."
    },
    {
      id: "chk12",
      pergunta: "Consigo alimentar o robô utilizando a documentação e os guias PDF da minha empresa?",
      resposta: "Sim. A inteligência do ChatKore aceita arquivos explicativos, catálogos e guias, tornando-se especialista nas regras técnicas operacionais e de estoque do cliente."
    },
    {
      id: "chk13",
      pergunta: "O portal central me disponibiliza estatísticas de taxa de retenção das conversas?",
      resposta: "Sim. Uma central analítica mensura durações de atendimentos, satisfação geral de usuários (CSAT) e percentagens qualificadas de agendamentos reais gerados."
    },
    {
      id: "chk14",
      pergunta: "O chatbot executa cobranças e emite Pix prontos de forma integrada durante o chat?",
      resposta: "Sim. Há conectores com barramentos financeiros que possibilitam a emissão e disparo síncrono de chaves Pix Copia e Cola prontas para pagamento direto no WhatsApp."
    },
    {
      id: "chk15",
      pergunta: "Como realizo os primeiros ensaios de usabilidade do ChatKore de forma gratuita?",
      resposta: "Nosso time de engenharia configura uma sandbox de homologação gratuita com alguns diálogos testes para sua equipe validar antes de contratar o hub final corporativo."
    }
  ],
  promocoes: [
    {
      id: "prm1",
      pergunta: "De que forma posso garantir as vantagens exclusivas e cupons na contratação?",
      resposta: "Indique o código promocional ativo no formulário de faturamento inicial ou mencione o cupom ao fechar o escopo técnico comercial diretamente por WhatsApp."
    },
    {
      id: "prm2",
      pergunta: "Há descontos específicos de implementação voltados a empresas de Jundiaí e região?",
      resposta: "Sim. Possuímos campanhas periódicas de apoio ao fomento tecnológico regional, fornecendo até 25% de desconto de implantação sob medida em polos locais."
    },
    {
      id: "prm3",
      pergunta: "Consigo juntar ou acumular mais de uma bonificação em um mesmo fluxo comercial?",
      resposta: "As bonificações e cupons não são cumulativos para um único projeto fiscal, porém podem ser aplicadas em módulos adjacentes ou pacotes extras de treinamento técnico."
    },
    {
      id: "prm4",
      pergunta: "A promoção de boas-vindas do plano Kflow exige fidelidade de permanência contratual?",
      resposta: "Não. A KoreNexus apoia a liberdade operacional de faturamento, permitindo cancelamentos sem multas abusivas mesmo após usufruir de promoções de adesão."
    },
    {
      id: "prm5",
      pergunta: "Os cupons e ofertas contam com limites de ativação por CNPJ ou datas limite?",
      resposta: "Sim, os cupons corporativos de oferta contam com dotações mensais regulamentadas e expiram ao final de cada ciclo bimestral nas plataformas oficiais."
    },
    {
      id: "prm6",
      pergunta: "A gratuidade temporária de instâncias educacionais é de caráter permanente?",
      resposta: "Os ambientes de laboratórios sandbox para alunos são 100% gratuitos por tempo indefinido, fomentando o estudo autônomo nas certificações regionais."
    },
    {
      id: "prm7",
      pergunta: "Indicações de clientes geram descontos na mensalidade de sustentação de software?",
      resposta: "Sim. O programa 'Parceria KoreNexus' concede cupons de amortização de até 50% na manutenção técnica mensal de seu ERP para cada indicação que fechar projeto sênior."
    },
    {
      id: "prm8",
      pergunta: "Posso transferir ou dar meus bônus de treinamento estudantil para um funcionário?",
      resposta: "Com certeza, as vagas estudantis e credenciais corporativas podem ser designadas livremente para qualquer colaborador cadastrado de sua empresa."
    },
    {
      id: "prm9",
      pergunta: "Qual é o procedimento de estorno financeiro em ações cobertas pela Garantia Nominal?",
      resposta: "Basta reportar a insatisfação ao suporte até 15 dias após o go-live para reaver os aportes de licenças operacionais de forma simplificada sem burocracias."
    },
    {
      id: "prm10",
      pergunta: "Os planos vigentes incluem suporte local sem custos de deslocamento?",
      resposta: "Sim, para Jundiaí e cidades do polo macro-regional, o suporte in-loco de emergência é incluso nos contratos vigentes de sustentação."
    },
    {
      id: "prm11",
      pergunta: "Onde consigo rastrear meus cupons acumulados e créditos gerenciais de faturamento?",
      resposta: "Todo histórico financeiro, descontos concedidos e pendências do ciclo residem no console seguro e amigável da KoreNexus."
    },
    {
      id: "prm12",
      pergunta: "Quais bandeiras de pagamento são aceitas para quitar as implantações de projetos de software?",
      resposta: "Faturamento facilitado por boletos bancários a prazo, transferências eletrônicas Pix e cartões corporativos de faturamento empresarial."
    },
    {
      id: "prm13",
      pergunta: "As startups locais dispõem de programas de apoio de barramentos fiscais mais em conta?",
      resposta: "Sim, mantemos a iniciativa 'KoreStart' que apoia novos negócios regionais oferecendo até 12 meses de barramento básico de APIs Sefaz com preços reduzidos."
    },
    {
      id: "prm14",
      pergunta: "Posso trocar cupons promocionais de consultoria de banco de dados por suporte de redes?",
      resposta: "Sim, caso o projeto prioritário da empresa mude, os créditos analíticos podem ser realocados entre disciplinas com o aval comercial prévio."
    },
    {
      id: "prm15",
      pergunta: "Como faço para ler as minúcias e regras regulatórias de todas as campanhas em vigor?",
      resposta: "O link regulatório no rodapé descreve com transparência e integridade jurídica todas as regras vigentes das ações ativas na KoreNexus."
    }
  ],
  apis: [
    {
      id: "api1",
      pergunta: "O que é o barramento corporativo de APIs disponibilizado no ecossistema?",
      resposta: "Refere-se ao hub modular de interfaces de faturamento que conecta e exporta informações de inventário, agenda, faturamento e dados cadastrais em tempo imediato."
    },
    {
      id: "api2",
      pergunta: "Como é estruturada a criptografia síncrona de tráfego de dados nas APIs?",
      resposta: "Todas as consultas exigem cabeçalhos HTTPS criptografados com algoritmos TLS 1.3 de alto desempenho, prevenindo violações externas de pacotes trafegados na rede."
    },
    {
      id: "api3",
      pergunta: "Existe compatibilidade com bancos estruturados do tipo Totvs, Protheus ou ERPs antigos?",
      resposta: "Sim. Nossas APIs mapeiam os esquemas tributários e de faturamento tradicionais dessas marcas possibilitando pontes de transmissões seguras sem falhas."
    },
    {
      id: "api4",
      pergunta: "Qual é a velocidade média nominal de resposta para transmissões das chamadas REST?",
      resposta: "Garantimos respostas que processam e retornam arrays compactados de dados em tempo médio inferior a 250 milissegundos, agilizando fluxos em lotes."
    },
    {
      id: "api5",
      pergunta: "Vocês publicam kits de desenvolvimento de códigos (SDKs) para programadores?",
      resposta: "Sim, disponibilizamos bibliotecas oficiais completas em Node.js (TypeScript), Python e adaptadores de faturamento prontos para automações diretas com o Kflow."
    },
    {
      id: "api6",
      pergunta: "Onde realizo a gestão e rotação técnica de minhas API Keys secretas de acesso?",
      resposta: "Através da área restrita do desenvolvedor no dashboard administrativo da plataforma. Você consegue criar, suspender ou alternar credenciais com segurança total."
    },
    {
      id: "api7",
      pergunta: "O barramento implementa teto ou limites de chamadas abusivas por segundo (Rate Limiting)?",
      resposta: "Sim. Visando blindar a estabilidade operacional dos containers, aplicamos bloqueios temporários de IP caso extrapole quotas contratadas de acessos simultâneos."
    },
    {
      id: "api8",
      pergunta: "O que sucede se o webhook de faturamento de minha empresa de TI estiver offline?",
      resposta: "O Kflow gerencia o reenvio agendado, efetuando até 5 tentativas consecutivas de transmissão em janelas de 5 minutos antes de gerar alerta de anomalia."
    },
    {
      id: "api9",
      pergunta: "Há conectores prontos para buscar registros cadastrais em arquivos históricos em lote?",
      resposta: "Sim. A API conta com recursos de paginação estruturada e filtros por tags que entregam dados volumosos de forma fatiada para excelente performance de banda."
    },
    {
      id: "api10",
      pergunta: "O barramento técnico de webhook opera sob infraestruturas tolerantes a picos repentinos?",
      resposta: "Sim, os webhooks residem em microsserviços escaláveis, garantindo que mesmo picos inesperados de vendas sejam enfileirados e processados sem lentidões técnicas."
    },
    {
      id: "api11",
      pergunta: "Posso acessar esquemas OpenAPI/Swagger detalhados para orientar meus programadores?",
      resposta: "Completamente. Todas as nossas rotas corporativas são documentadas sob especificações Swagger com exemplos prontos de requisição e retornos de respostas lógicas."
    },
    {
      id: "api12",
      pergunta: "Como são mapeados e sinalizados os códigos de exceções das APIs?",
      resposta: "Usamos os status de comunicação HTTP padrão corporativos (como 400 Bad Request, 401 Unauthorized, 429 Rate Limited), contendo mensagens lógicas detalhadas em português."
    },
    {
      id: "api13",
      pergunta: "O Sandbox de testes das APIs exige cadastro de cartões ou faturamentos prévios?",
      resposta: "Não. A homologação educacional ou de teste é franca de restrições de custos artificiais, incentivando testes práticos exaustivos de rotas fiscais."
    },
    {
      id: "api14",
      pergunta: "De que forma evitam-se injeções SQL nocivas nas requisições parametrizadas?",
      resposta: "Toda transferência lógica utiliza variáveis parametrizadas estritas de bancos e frameworks ORM modernos (como Drizzle e Prisma) para saneamento sistemático."
    },
    {
      id: "api15",
      pergunta: "Onde posso contratar orientação sênior para me ajudar no desenho da arquitetura de APIs?",
      resposta: "Nosso comitê sênior de engenharia industrial fornece assessorias consultivas para o desenho e codificação de robustos barramentos de APIs sob medida."
    }
  ],
  status: [
    {
      id: "sts1",
      pergunta: "Qual é o índice de uptime garantido e assinado nos contratos de serviços?",
      resposta: "Asseguramos uma disponibilidade operacional contratual de 99,99% (SLA padrão ouro), o que representa menos de 5 minutos acumulados de eventual lentidão por mês."
    },
    {
      id: "sts2",
      pergunta: "Como a KoreNexus monitora a saúde das soluções de forma proativa?",
      resposta: "Utilizamos robôs independentes de checagem técnica de latência (ping) e logs contínuos que analisam o consumo de memória RAM e processamento dos containers."
    },
    {
      id: "sts3",
      pergunta: "Como os dados de cadastros de clientes são protegidos contra perdas físicas de servidores?",
      resposta: "Nossos bancos de dados Cloud SQL contam com replicadores contínuos e redundância automática de geolocalização multi-zonas em nuvems confiáveis."
    },
    {
      id: "sts4",
      pergunta: "Há paradas programadas para sustentação técnica periódica dos códigos?",
      resposta: "As atualizações acontecem sem interrupções (Zero Downtime Deployments). Novas versões entram em contêineres paralelos sem indisponibilidade."
    },
    {
      id: "sts5",
      pergunta: "Posso checar o nível de latência de rotas regionais ativas nos polos industriais?",
      resposta: "Sim. O dashboard do Uptime exibe taxas históricas de respostas de Jundiaí e Grande São Paulo de forma aberta e auditável para os analistas."
    },
    {
      id: "sts6",
      pergunta: "Onde reside o histórico público oficial das eventuais anomalias passadas?",
      resposta: "Disponibilizamos o relatório transparente no painel 'Status', documentando com integridade as causas, soluções e horários de quaisquer instabilidades anteriores."
    },
    {
      id: "sts7",
      pergunta: "O que acontece ao sistema ERP se houver um blecaute total na nuvem principal?",
      resposta: "Os servidores em contingência assumem as rotas em menos de 10 segundos por roteamento dinâmico de tráfego, mitigando perigos operacionais."
    },
    {
      id: "sts8",
      pergunta: "Os ativos de imagens e arquivos estáticos são distribuídos sob CDNs robustas?",
      resposta: "Sim, os arquivos de mídias são servidos globalmente através de servidores de borda (CDNs), agilizando faturamentos visuais em Jundiaí e região."
    },
    {
      id: "sts9",
      pergunta: "Como a infraestrutura reage a surtos inesperados de faturamento comercial?",
      resposta: "Iniciamos automaticamente réplicas de novos servidores paralelos (Autoscaling horizontal) para processar o tráfego extra sem retenções de fila."
    },
    {
      id: "sts10",
      pergunta: "De quanto em quanto tempo ocorrem as rotinas redundantes de backups completos?",
      resposta: "Executamos cópias integrais de bancos de dados a cada 24 horas consecutivas de forma programada com retenção imutável de redundância de 30 dias de dados."
    },
    {
      id: "sts11",
      pergunta: "Há relatórios de integridade de processamento das CPUs de nossos computadores virtuais?",
      resposta: "Sim. Disponibilizamos painéis simplificados de controle e integridade que mostram a atividade de recursos de forma amigável no menu do desenvolvedor."
    },
    {
      id: "sts12",
      pergunta: "A engenharia sênior é avisada se um barramento de faturamento reportar erro persistente?",
      resposta: "Sim. Sistemas de pager e alertas imediatos disparam em tempo real mensagens urgentes para a gerência de plantão realizar correções preventivas."
    },
    {
      id: "sts13",
      pergunta: "Como é calculado o balanceamento dinâmico de cargas em múltiplos containers?",
      resposta: "Usamos algoritmos de roteamento inteligentes síncronos que avaliam as máquinas mais ociosas para depositar novas transações comerciais."
    },
    {
      id: "sts14",
      pergunta: "Os certificados criptográficos SSL do site expiram ou dão erros visuais de navegação?",
      resposta: "Não. A manutenção técnica é automatizada por renovações automáticas assíncronas em segundo plano com a autoridade Let's Encrypt."
    },
    {
      id: "sts15",
      pergunta: "Quem é o contato prioritário h24 corporativo em casos de incidentes ou instabilidades severas?",
      resposta: "As empresas parceiras dispõem de canais de suporte SLA Gold diretos de engenheiros locais com tempo de resposta estrito inferior a 15 minutos."
    }
  ],
  blog: [
    {
      id: "blg1",
      pergunta: "Qual é o principal foco de conteúdo tratado no Blog de Engenharia da KoreNexus?",
      resposta: "Análises avançadas de infraestruturas em nuvem, otimizações de bancos relacionais SQL, arquiteturas seguras de APIs e rotinas otimizadas de faturamentos."
    },
    {
      id: "blg2",
      pergunta: "Posso utilizar os fragmentos de códigos e scripts dos posts em minhas automações?",
      resposta: "Sim. Todo código postado de forma pública no Blog técnico é de caráter aberto com licença MIT, incentivando o uso e adaptação livre por desenvolvedores."
    },
    {
      id: "blg3",
      pergunta: "Qual é a frequência de publicações de novos relatórios técnicos e artigos?",
      resposta: "Nossa engenharia sênior edita e publica novas lições aprendidas de fábrica e manuais de APIs quinzenalmente de forma recorrente."
    },
    {
      id: "blg4",
      pergunta: "Como posso enviar feedbacks ou propor ideias de novos artigos para a redação?",
      resposta: "Basta entrar em contato manual indicando suas ponderações técnicas ou interagir diretamente com a equipe técnica sênior em Jundiaí por nossos e-mails."
    },
    {
      id: "blg5",
      pergunta: "O Blog traz artigos voltados a compliance e adequações jurídicas relativas à LGPD?",
      resposta: "Sim. Abordamos com integridade boas práticas de segurança, mascaramentos em banco de dados e direitos fundamentais de privacidade dos usuários."
    },
    {
      id: "blg6",
      pergunta: "Há análises publicadas ensinando a integrar microsserviços com o WhatsApp Business?",
      resposta: "Sim. Temos tutoriais detalhando lógicas de webhooks oficiais, formatos de respostas e segurança de conexões para que sua TI domine a ferramenta."
    },
    {
      id: "blg7",
      pergunta: "Os posts cobrem temas de design de experiência visual de interfaces industriais (UI/UX)?",
      resposta: "Com certeza. Discorremos sobre ergonomia visual, contrastes robustos para expedições industriais e lógicas fluidas de menus para smartphones de campo."
    },
    {
      id: "blg8",
      pergunta: "Posso assinar uma newsletter técnica para receber os artigos em meu e-mail principal?",
      resposta: "Sim. Há um formulário de cadastro de e-mail no rodapé do blog para remessa automática integrada a cada nova lição publicada pela engenharia."
    },
    {
      id: "blg9",
      pergunta: "Os artigos trazem simulações práticas de estresses de performance de bancos de dados?",
      resposta: "Sim. Documentamos testes de stress em PostgreSQL e Cloud SQL comparando performance de consultas estruturadas para grandes volumes operacionais."
    },
    {
      id: "blg10",
      pergunta: "Há artigos sobre o ecossistema Android e desenvolvimento nativo em Kotlin?",
      resposta: "Sim, trazemos abordagens robustas de lógicas offline no smartphone, sincronizações seguras de banco e boas práticas recomendadas pelas lojas."
    },
    {
      id: "blg11",
      pergunta: "Como são tratados os desafios de orquestração de microsserviços via Docker?",
      resposta: "Explicamos táticas de isolamento de processos, escalonamento automático de containers e mitigação de vulnerabilidades comuns de infraestrutura."
    },
    {
      id: "blg12",
      pergunta: "O Blog corporativo ensina a desenhar defesas robustas contra invasões de servidores?",
      resposta: "Abordamos configurações de cabeçalhos de segurança, auditorias de JWTs e proteções de firewalls de rede de forma didática e transparente."
    },
    {
      id: "blg13",
      pergunta: "Os redatores e engenheiros do Blog atuam em Jundiaí e região de forma presencial?",
      resposta: "Sim. Toda nossa equipe de engenharia responsável pelas análises e posts de tecnologia reside e atua de perto no hub de Jundiaí e Várzea Paulista."
    },
    {
      id: "blg14",
      pergunta: "Há posts no Blog dedicados a auxiliar pequenas distribuidoras de faturamento?",
      resposta: "Sim, publicamos artigos de planejamento gerencial e logística que demonstram como economizar em recursos de rede e sistemas corporativos de ponta."
    },
    {
      id: "blg15",
      pergunta: "Onde encontro os repositórios públicos oficiais no GitHub vinculados às análises?",
      resposta: "Os links de projetos de demonstração residem diretamente ao final de cada post para fácil clonagem e homologação isolada do programador."
    }
  ],
  sobre: [
    {
      id: "sob1",
      pergunta: "Quais são as metas essenciais de fundação que guiam a cultura KoreNexus?",
      resposta: "Nossa missão reside em democratizar e simplificar tecnologias industriais robustas fora das grandes capitais, entregando códigos limpos de propriedade de nossos clientes."
    },
    {
      id: "sob2",
      pergunta: "De que forma vocês evitam dores burocráticas comuns de grandes consultorias de TI?",
      resposta: "Mantemos atendimento direto desprovido de atendentes virtuais lentos, focando em comunicações síncronas entre nosso corpo de engenharia sênior e a diretoria do cliente."
    },
    {
      id: "sob3",
      pergunta: "Por qual razão a diretoria fixou seu hub de engenharia no polo de Jundiaí / Várzea?",
      resposta: "Reconhecemos o expressivo polo industrial, logístico e comercial de Jundiaí e arredores regionais. Oferecemos suporte local com menor custo de faturamento de equipe."
    },
    {
      id: "sob4",
      pergunta: "A KoreNexus fornece propriedade absoluta de código aos clientes parceiros?",
      resposta: "Sim. Não trabalhamos com prender clientes aprisionados. Todo software encomendado pelo comitê técnico é entregue com direitos autorais e códigos completos."
    },
    {
      id: "sob5",
      pergunta: "Há metas sustentáveis no desenho de suas arquiteturas de dados em nuvem?",
      resposta: "Sim. Privilegiamos servidores verdes baseados em scale-to-zero e alto grau de aproveitamento térmico de hardware nos datacenters globais parceiros."
    },
    {
      id: "sob6",
      pergunta: "A KoreNexus conta com vagas e contratações abertas para programadores regionais?",
      resposta: "Fomentamos a captação de talentos de Jundiaí e região. As vagas técnicas de desenvolvedor são postadas em nosso hub oficial e divulgadas ativamente."
    },
    {
      id: "sob7",
      pergunta: "Como o comitê gerencial assegura a transparência em relação aos prazos técnicos?",
      resposta: "Os termos de prazos das entregas de Sprints quinzenais são descritos de forma incondicional em contrato sob acompanhamento gerencial aberto na nuvem."
    },
    {
      id: "sob8",
      pergunta: "A equipe possui diplomas e certificações de conformidade técnica em grandes nuvens?",
      resposta: "Sim, os engenheiros seniores dispõem de certificações de arquitetura na GCP (Google Cloud) e AWS, asseverando segurança e conformidade de alto padrão."
    },
    {
      id: "sob9",
      pergunta: "Como a empresa zela pela privacidade industrial de projetos de fusões seguras?",
      resposta: "Assinamos acordos rígidos textuais de privacidade comercial mútua (NDA) antes de vistorias técnicas de banco ou escopos lógicos confidenciais."
    },
    {
      id: "sob10",
      pergunta: "Há projetos de inclusão social ou bolsas estudantis executados pela KoreNexus?",
      resposta: "Mantemos parcerias educacionais que oferecem vagas gratuitas e mentorias assistidas para formação de jovens devas locais no ecossistema regional."
    },
    {
      id: "sob11",
      pergunta: "Como a KoreNexus atua na sustentabilidade financeira de pequenas distribuidoras?",
      resposta: "Substituímos aluguéis exorbitantes de softwares legacy por modelos otimizados flexíveis ajustáveis à real usabilidade e tráfego útil faturado do parceiro."
    },
    {
      id: "sob12",
      pergunta: "Como agendar uma reunião presencial no escritório estratégico com os sócios-diretores?",
      resposta: "Basta acionar os especialistas via chatbot ChatKore ou correspondência de WhatsApp oficial para definir dados de agendas de visitas presenciais corporativas."
    },
    {
      id: "sob13",
      pergunta: "Qual é o background profissional de liderança técnica corporativa na empresa?",
      resposta: "Nossos diretores trazem robusta experiência acumulada em desenvolvimento de ERPs corporativos industriais, barramentos fiscais sênior de SEFAZ e lideranças acadêmicas regionais."
    },
    {
      id: "sob14",
      pergunta: "Como vocês enxergam a inserção de inteligência artificial generativa em processos corporativos?",
      resposta: "Defendemos o uso sóbrio e voltado à segurança onde a IA complementa a eficiência assistida do trabalhador, mantendo conformidade completa com dados da LGPD."
    },
    {
      id: "sob15",
      pergunta: "Qual o canal oficial para propor assessoria de imprensas ou eventos institucionais locais?",
      resposta: "Interaja diretamente por correspondência pelo e-mail focado no contato corporativo de relações públicasContato@korenexus.com.br."
    }
  ],
  cursos: [
    {
      id: "cur1",
      pergunta: "Como funciona a chancela e validação das certificações da KoreNexus?",
      resposta: "Nossos certificados possuem autenticação digital via QR Code gerado de forma segura na blockchain corporativa, indexada oficialmente na plataforma Learn Bright Certify."
    },
    {
      id: "cur2",
      pergunta: "Quais são as principais áreas de mentorias técnicas ministradas no portal de estudos?",
      resposta: "Treinamentos práticos de gestão de ERPs Corporativos, automação de processos via barramento Kflow e arquiteturas escaláveis de APIs conectadas a Sefaz."
    },
    {
      id: "cur3",
      pergunta: "Os cursos são síncronos ao vivo com mentores ou compostos por aulas pré-gravadas?",
      resposta: "Trata-se de uma formação presencial híbrida inteligente com conteúdos gravados de extrema usabilidade em estúdio e fóruns recorrentes ao vivo com engenheiros seniores."
    },
    {
      id: "cur4",
      pergunta: "Empresas em Jundiaí e região conseguem contratar treinamentos empresariais em grupo (In-Company)?",
      resposta: "Sim, possuímos dotações de capacitações formatadas para equipes in-company com cronogramas orientados à realidade logística particular de cada fábrica contratante."
    },
    {
      id: "cur5",
      pergunta: "As certificações trazem carga horária homologada de validade técnica nacional?",
      resposta: "Com certeza, as formações variam de 40 a 120 horas acadêmicas intensas contendo avaliações práticas estritas homologadas com alta aceitação pelo comitê técnico regional."
    },
    {
      id: "cur6",
      pergunta: "O material técnico escolar é adaptado quando os webservices de faturamento SEFAZ mudam?",
      resposta: "Sim, os laboratórios estudantis e conteúdos das matrizes são atualizados gratuitamente sempre que novas Notas Técnicas Fiscais entram em homologação."
    },
    {
      id: "cur7",
      pergunta: "Utilizar os ambientes escolares de Sandbox gera custos extras nas minhas faturas de nuvem?",
      resposta: "Absolutamente não. A KoreNexus subsidia toda a infraestrutura de laboratórios sandbox para que o aluno programe e execute testes sem despesas pessoais de tráfego."
    },
    {
      id: "cur8",
      pergunta: "Há concessões de bolsas corporativas de estudos para alunos da rede pública regionais?",
      resposta: "Sim, mantemos em Jundiaí o fundo estudantil 'KoreEstudo' que destina mensalmente bolsas completas de isenção de matrículas a candidatos selecionados de polos públicos."
    },
    {
      id: "cur9",
      pergunta: "Em quanto tempo posso gerar meu certificado digital após completar as aulas do curso?",
      resposta: "A emissão do diploma autenticado ocorre de forma automatizada em até 10 segundos úteis após o aluno atingir a pontuação mínima de corte exigida nas provas."
    },
    {
      id: "cur10",
      pergunta: "Posso assistir meu conteúdo de certificações e ler manuais em meu telefone celular offline?",
      resposta: "Sim, o portal possui portabilidade responsiva e o gerenciador de mídias Learn Bright Certify possibilita downloads locais das aulas para estudos offline fluidos."
    },
    {
      id: "cur11",
      pergunta: "Os instrutores dos cursos atuam como desenvolvedores ativos na própria KoreNexus?",
      resposta: "Sim, todos os mentores exercem posições seniores na engenharia quotidiana de nossos ERPs, barramentos fiscais e microsserviços seguros ativos corporativos."
    },
    {
      id: "cur12",
      pergunta: "Há atendimento ativo de dúvidas de código caso o aluno encontre um erro de código?",
      resposta: "O fórum de desenvolvedores conta com suporte assíncrono moderado por engenheiros em até 24 horas úteis de segunda a sexta-feira para destravar seu raciocínio."
    },
    {
      id: "cur13",
      pergunta: "Quais são as possibilidades de faturamento e parcelamentos das certificações pagas?",
      resposta: "Opções de faturamento corporativo para empresas, repasses por boletos parcelados sem juros de faturamento e cartões de crédito integrados de forma segura."
    },
    {
      id: "cur14",
      pergunta: "Há um período final ou prazo de validade estrito para eu concluir minha trilha comprada?",
      resposta: "Não aplicamos prazos de expiração arbitrários. O acesso do aluno é vitalício, assegurando livre progressão técnica no seu ritmo de tempo pessoal."
    },
    {
      id: "cur15",
      pergunta: "Qual é o nível de absorção de mercado e contratações reais dos formandos das trilhas?",
      resposta: "Asseguramos excelente empregabilidade com mais de 85% dos alunos formados contratados por grandes indústrias e distribuidoras aliadas regionais em até 6 meses."
    }
  ]
};

interface FaqSectionProps {
  pageId?: string;
}

export default function FaqSection({ pageId }: FaqSectionProps) {
  // Try to default to the passed pageId if valid, otherwise fallback to "inicio"
  const defaultCategory = (pageId && FAQ_DATABASE[pageId as FaqCategory]) ? (pageId as FaqCategory) : "inicio";
  
  const [activeCategory, setActiveCategory] = useState<FaqCategory>(defaultCategory);
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-sync activeCategory if the pageId prop changes dynamically
  useEffect(() => {
    if (pageId && FAQ_DATABASE[pageId as FaqCategory]) {
      setActiveCategory(pageId as FaqCategory);
      setOpenIds([]);
      setSearchQuery("");
    }
  }, [pageId]);

  const toggleOpen = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCategoryChange = (category: FaqCategory) => {
    setActiveCategory(category);
    setOpenIds([]);
    setSearchQuery("");
  };

  // Filter questions based on category and search query
  const rawFaqs = FAQ_DATABASE[activeCategory] || [];
  const filteredFaqs = rawFaqs.filter(
    (faq) =>
      faq.pergunta.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.resposta.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const expandAll = () => {
    const allIds = filteredFaqs.map((faq) => faq.id);
    setOpenIds(allIds);
  };

  const collapseAll = () => {
    setOpenIds([]);
  };

  const ActiveIcon = CATEGORIES_METADATA[activeCategory]?.icon || HelpCircle;
  const activeColor = CATEGORIES_METADATA[activeCategory]?.color || "text-blue-400";
  const activeLabel = CATEGORIES_METADATA[activeCategory]?.label || "Geral";

  return (
    <section id="faq-section" className="py-12 border border-slate-900 bg-[#06080E]/90 rounded-3xl p-4 md:p-8 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* 1. SECTION HEADER */}
      <div className="text-center max-w-lg mx-auto space-y-3 z-10 relative">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
            FAQ de Engenharia Multitópicos
          </span>
        </div>
        <h3 className="text-xl md:text-2xl font-display font-medium text-white tracking-tight">
          Central Integrada de Documentação & FAQ
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed font-sans">
          Navegue pelas 15 dúvidas sênior exclusivas mapeadas para cada seção do portal KoreNexus.
        </p>
      </div>

      {/* 2. RESPONSIVE HORIZONTAL PILL CATEGORY SELECTOR */}
      <div className="w-full z-10 relative">
        <div className="text-xs font-mono text-slate-500 mb-2.5 px-1 uppercase tracking-widest text-left md:text-center">
          Selecione o Tópico de Análise Técnica:
        </div>
        
        {/* Scrollable container for mobile pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent justify-start lg:justify-center -mx-4 md:mx-0 px-4 md:px-0">
          {(Object.keys(CATEGORIES_METADATA) as FaqCategory[]).map((cat) => {
            const CatIcon = CATEGORIES_METADATA[cat].icon;
            const isCatActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border shrink-0 cursor-pointer select-none ${
                  isCatActive
                    ? "bg-indigo-600/15 text-indigo-300 border-indigo-500/40 shadow-md shadow-indigo-600/5"
                    : "bg-[#0A0D15] hover:bg-slate-900/60 text-slate-400 border-slate-900/80 hover:text-slate-300"
                }`}
                style={{ touchAction: "manipulation", minHeight: "40px" }}
              >
                <CatIcon className="h-3.5 w-3.5 shrink-0" />
                <span>{CATEGORIES_METADATA[cat].label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PREMIUM REAL TIME SEARCH FILTER */}
      <div className="max-w-xl mx-auto z-10 relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder={`Pesquise entre os 15 tópicos de "${activeLabel}"...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#080B12] border border-slate-850 hover:border-slate-800 focus:border-indigo-500/60 text-xs text-slate-200 placeholder-slate-500 rounded-2xl outline-none transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              LIMPAR
            </button>
          )}
        </div>
      </div>

      {/* 4. QUESTIONS AND RESPONSES (ONLY ACCORDION EXPANSION IN COLLAPSE MANNER) */}
      <div className="max-w-3xl mx-auto space-y-3 pt-2 z-10 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-mono text-slate-500 px-2 pb-2.5 border-b border-slate-900">
          <div className="flex items-center gap-1.5">
            <ActiveIcon className={`h-3.5 w-3.5 ${activeColor}`} />
            <span className="uppercase tracking-wider font-semibold text-slate-400">{activeLabel}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 sm:justify-end">
            <button
              onClick={expandAll}
              className="text-[10px] text-slate-400 hover:text-indigo-400 font-bold uppercase tracking-wider transition duration-200 cursor-pointer flex items-center gap-1 select-none"
            >
              [+] Expandir Tudo
            </button>
            <button
              onClick={collapseAll}
              className="text-[10px] text-slate-400 hover:text-indigo-400 font-bold uppercase tracking-wider transition duration-200 cursor-pointer flex items-center gap-1 select-none"
            >
              [-] Recolher Tudo
            </button>
            <span className="text-slate-800 hidden sm:inline">|</span>
            <div className="text-slate-500">
              Exibindo <strong>{filteredFaqs.length}</strong> de <strong>{rawFaqs.length}</strong> dúvidas
            </div>
          </div>
        </div>

        {filteredFaqs.length > 0 ? (
          <div className="space-y-3">
            {filteredFaqs.map((item, index) => {
              const isSelected = openIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 shadow-sm ${
                    isSelected
                      ? "bg-[#0b0f19] border-slate-800"
                      : "bg-[#080B13] border-slate-900/60 hover:border-slate-800/80"
                  }`}
                >
                  {/* Dynamic Trigger Touch Action Area (touch targets optimized for mobile 44px+) */}
                  <button
                    onClick={() => toggleOpen(item.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer select-none group focus:outline-none"
                    style={{ minHeight: "48px" }}
                  >
                    <div className="flex items-start gap-3.5 text-xs font-semibold text-slate-200 group-hover:text-white transition-colors pr-4 leading-relaxed">
                      <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0 mt-0.5">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-sans font-medium text-slate-200 group-hover:text-white transition">
                        {item.pergunta}
                      </span>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 text-slate-500 shrink-0 transition-transform duration-300 ${
                        isSelected ? "rotate-90 text-indigo-400" : "group-hover:text-slate-400"
                      }`}
                    />
                  </button>

                  {/* Responsive Collapsible Answer Section with micro animation markup */}
                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                      >
                        <div className="px-5 pb-5 pt-1.5 text-xs text-slate-400 leading-relaxed font-sans border-t border-slate-900 bg-slate-950/20 pl-12">
                          {item.resposta}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search Filter State */
          <div className="text-center py-10 bg-[#080B13] border border-slate-900 rounded-2xl space-y-2">
            <HelpCircle className="h-6 w-6 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400 font-sans font-medium">Nenhum resultado filtrado para sua consulta</p>
            <p className="text-[10.5px] text-slate-500 font-sans">
              Tente reescrever a pesquisa ou limpe o termo para ver as 15 perguntas oficiais da seção.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSearchQuery("")}
                className="px-3 py-1 bg-slate-900 border border-slate-800 text-[10.5px] font-mono text-slate-400 rounded-lg hover:text-white transition"
              >
                Resetar Filtro
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
