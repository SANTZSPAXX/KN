export interface PublicApiItem {
  name: string;
  description: string;
  category: string;
  auth: string;
  cors: string;
  url: string;
  sampleEndpoint: string;
}

export const NEW_PUBLIC_APIS_LIST: PublicApiItem[] = [
  // Animals
  {
    name: "AdoptAPet",
    description: "Recurso completo e oficial para localizar e adotar animais de estimação necessitados.",
    category: "Animais",
    auth: "apiKey",
    cors: "Sim",
    url: "https://www.adoptapet.com/public/apis",
    sampleEndpoint: "https://api.adoptapet.com/v3/pets"
  },
  {
    name: "Axolotl facts & pics",
    description: "Coleção de fotos incríveis de axolotes e curiosidades biológicas sobre a espécie.",
    category: "Animais",
    auth: "Nenhum",
    cors: "Não",
    url: "https://axolotlapi.herokuapp.com/",
    sampleEndpoint: "https://axolotlapi.herokuapp.com/fact"
  },
  {
    name: "Cat Facts Ninja",
    description: "Fatos interativos, aleatórios e informativos sobre gatos via requisição HTTP.",
    category: "Animais",
    auth: "Nenhum",
    cors: "Sim",
    url: "https://catfact.ninja/fact",
    sampleEndpoint: "https://catfact.ninja/fact"
  },
  {
    name: "Cataas",
    description: "Cat as a service: imagens, GIFs personalizáveis e filtros dinâmicos de gatos fofos.",
    category: "Animais",
    auth: "Nenhum",
    cors: "Não",
    url: "https://cataas.com",
    sampleEndpoint: "https://cataas.com/cat?json=true"
  },
  {
    name: "Dog Facts API",
    description: "Recupere fatos e curiosidades aleatórias sobre dezenas de raças de cães cadastrados.",
    category: "Animais",
    auth: "Nenhum",
    cors: "Sim",
    url: "https://dog-api.kinduff.com",
    sampleEndpoint: "https://dog-api.kinduff.com/api/facts"
  },
  {
    name: "HTTP Cat",
    description: "API divertida contendo imagens de gatos representando cada código HTTP de status.",
    category: "Animais",
    auth: "Nenhum",
    cors: "Sim",
    url: "https://http.cat",
    sampleEndpoint: "https://http.cat/200"
  },
  {
    name: "HTTP Dog",
    description: "Imagens estilizadas de cachorros representando cada código de status de resposta HTTP.",
    category: "Animais",
    auth: "Nenhum",
    cors: "Sim",
    url: "https://http.dog",
    sampleEndpoint: "https://http.dog/200.jpg"
  },
  {
    name: "MeowFacts",
    description: "Obtenha fatos e frases sobre felinos geradas aleatoriamente em múltiplos idiomas.",
    category: "Animais",
    auth: "Nenhum",
    cors: "Não",
    url: "https://meowfacts.herokuapp.com",
    sampleEndpoint: "https://meowfacts.herokuapp.com/?count=1"
  },
  {
    name: "Shibe.Online",
    description: "Coleção de imagens em altíssima qualidade de cães da raça Shiba Inu, gatos ou pássaros.",
    category: "Animais",
    auth: "Nenhum",
    cors: "Sim",
    url: "https://shibe.online",
    sampleEndpoint: "https://shibe.online/api/shibes?count=1&urls=true"
  },

  // Anime
  {
    name: "AniList GraphQL",
    description: "Descubra, filtre e rastreie perfis, episódios e estatísticas completas de anime e mangá.",
    category: "Anime",
    auth: "OAuth",
    cors: "Sim",
    url: "https://anilist.co",
    sampleEndpoint: "https://graphql.anilist.co"
  },
  {
    name: "AnimeChan Quotes",
    description: "API contendo mais de 10.000 citações famosas inspiradoras e marcantes dos animes.",
    category: "Anime",
    auth: "Nenhum",
    cors: "Não",
    url: "https://animechan.xyz",
    sampleEndpoint: "https://animechan.xyz/api/random"
  },
  {
    name: "Kitsu Platform",
    description: "Descobridor moderno de animes e mangás contendo avaliações completas e rankings.",
    category: "Anime",
    auth: "OAuth",
    cors: "Sim",
    url: "https://kitsu.io",
    sampleEndpoint: "https://kitsu.io/api/edge/anime?page[limit]=1"
  },
  {
    name: "Studio Ghibli API",
    description: "Acesse metadados de diretores, personagens, trilhas e filmes clássicos do Studio Ghibli.",
    category: "Anime",
    auth: "Nenhum",
    cors: "Sim",
    url: "https://ghibliapi.vercel.app",
    sampleEndpoint: "https://ghibliapi.vercel.app/films"
  },
  {
    name: "Trace.moe",
    description: "Envie uma captura de tela de anime e descubra instantaneamente o episódio e timestamps.",
    category: "Anime",
    auth: "Nenhum",
    cors: "Sim",
    url: "https://trace.moe",
    sampleEndpoint: "https://api.trace.moe/search?url=https://images.plurk.com/32v67QL9Fgah76HpRffDCz.jpg"
  },

  // Anti-Malware
  {
    name: "AbuseIPDB",
    description: "Verificação rápida de reputação de endereços IP corporativos contra tentativas de spam.",
    category: "Antimalware",
    auth: "apiKey",
    cors: "Desconhecido",
    url: "https://www.abuseipdb.com",
    sampleEndpoint: "https://api.abuseipdb.com/api/v2/check"
  },
  {
    name: "Google Safe Browsing",
    description: "API de segurança corporativa do Google para verificação e flag de URLs fraudulentas.",
    category: "Antimalware",
    auth: "apiKey",
    cors: "Desconhecido",
    url: "https://developers.google.com/safe-browsing",
    sampleEndpoint: "https://safebrowsing.googleapis.com/v4/threatMatches:find"
  },
  {
    name: "VirusTotal Analytics",
    description: "Análise profunda de ameaças cibernéticas contra malwares de arquivos e logs de IPs.",
    category: "Antimalware",
    auth: "apiKey",
    cors: "Desconhecido",
    url: "https://virustotal.com",
    sampleEndpoint: "https://www.virustotal.com/api/v3/ip_addresses/8.8.8.8"
  },
  {
    name: "NoPhishy API",
    description: "Analise se um domínio ou link específico faz parte de listas ativas de fraudes ou phishing.",
    category: "Antimalware",
    auth: "apiKey",
    cors: "Sim",
    url: "https://nophishy.io",
    sampleEndpoint: "https://api.nophishy.io/v1/check?domain=google.com"
  },

  // Art & Design
  {
    name: "Art Institute ox",
    description: "Explore o acervo de milhares de pinturas históricas catalogadas de Chicago de alta resolução.",
    category: "Arte & Design",
    auth: "Nenhum",
    cors: "Sim",
    url: "https://www.artic.edu/open-access/public-api",
    sampleEndpoint: "https://api.artic.edu/api/v1/artworks/129884"
  },
  {
    name: "EmojiHub Library",
    description: "Pesquise e extraia emojis catalogados por assunto, humor, Unicode e grupos visuais.",
    category: "Arte & Design",
    auth: "Nenhum",
    cors: "Sim",
    url: "https://github.com/cheatsnake/emojihub",
    sampleEndpoint: "https://emojihub.yurace.pro/api/random"
  },
  {
    name: "Dribbble Creators",
    description: "API para explorar os portfólios, conceitos e ilustrações dos designers mais influentes.",
    category: "Arte & Design",
    auth: "OAuth",
    cors: "Desconhecido",
    url: "https://dribbble.com/api",
    sampleEndpoint: "https://api.dribbble.com/v2/user"
  },
  {
    name: "Lordicon Animated",
    description: "API para integração direta de ícones dinâmicos animados de alta usabilidade.",
    category: "Arte & Design",
    auth: "Nenhum",
    cors: "Sim",
    url: "https://lordicon.com",
    sampleEndpoint: "https://cdn.lordicon.com/fmasbamy.json"
  },

  // Authentication & Authorization
  {
    name: "Auth0 Platform",
    description: "Ferramenta empresarial líder mundial em gerenciamento de sessões, login social e RBAC.",
    category: "Autenticação",
    auth: "apiKey",
    cors: "Sim",
    url: "https://auth0.com",
    sampleEndpoint: "https://auth0.com/oauth/token"
  },
  {
    name: "GetOTP Service",
    description: "Verificação instantânea baseada em celular ou email com validação por código OTP temporário.",
    category: "Autenticação",
    auth: "apiKey",
    cors: "Não",
    url: "https://getotp.net",
    sampleEndpoint: "https://api.getotp.net/v1/send"
  },

  // Blockchain
  {
    name: "Bitquery DEXs",
    description: "Consultas analíticas complexas via GraphQL das redes de cripto, tokens e DEXs.",
    category: "Blockchain",
    auth: "apiKey",
    cors: "Sim",
    url: "https://bitquery.io",
    sampleEndpoint: "https://graphql.bitquery.io"
  },
  {
    name: "Etherscan Developer",
    description: "Acesse saldos, transações pendentes, contratos e preços de gás da rede Ethereum.",
    category: "Blockchain",
    auth: "apiKey",
    cors: "Sim",
    url: "https://etherscan.io",
    sampleEndpoint: "https://api.etherscan.io/api?module=stats&action=ethprice"
  },

  // Books
  {
    name: "Google Books API",
    description: "API abrangente para buscar e extrair conteúdos catalogados de livros do acervo Google.",
    category: "Livros",
    auth: "OAuth",
    cors: "Desconhecido",
    url: "https://developers.google.com/books",
    sampleEndpoint: "https://www.googleapis.com/books/v1/volumes?q=isbn:9780132350884"
  },
  {
    name: "Open Library Metadata",
    description: "Banco de dados aberto contendo milhões de registros literários completos e imagens de capas.",
    category: "Livros",
    auth: "Nenhum",
    cors: "Não",
    url: "https://openlibrary.org",
    sampleEndpoint: "https://openlibrary.org/api/books?bibkeys=ISBN:0451526554&format=json"
  },

  // Business
  {
    name: "Apache Superset Manager",
    description: "Integração programática e administração de dashboards de dados Superset em tempo real.",
    category: "Negócios",
    auth: "apiKey",
    cors: "Sim",
    url: "https://superset.apache.org",
    sampleEndpoint: "https://superset.apache.org/api/v1/chart/1"
  },
  {
    name: "Clearbit Logos",
    description: "API inteligente para buscar logotipos de marcas e empresas instantaneamente via domínio.",
    category: "Negócios",
    auth: "apiKey",
    cors: "Desconhecido",
    url: "https://clearbit.com/logo",
    sampleEndpoint: "https://logo.clearbit.com/korenexus.com.br"
  },

  // Calendar
  {
    name: "Google Calendar Core",
    description: "Crie, modifique e sincronize agendas corporativas em tempo real entre colaboradores.",
    category: "Agenda",
    auth: "OAuth",
    cors: "Desconhecido",
    url: "https://developers.google.com/calendar",
    sampleEndpoint: "https://www.googleapis.com/calendar/v3/users/me/calendarList"
  },
  {
    name: "Worldwide Holiday API",
    description: "Informações consolidadas de feriados civis, bancários e religiosos dos 195 países.",
    category: "Agenda",
    auth: "apiKey",
    cors: "Sim",
    url: "https://holidayapi.com",
    sampleEndpoint: "https://key.holidayapi.com/v1/holidays?country=BR&year=2025"
  },

  // Cloud Storage
  {
    name: "Google Drive Client",
    description: "Envie, agrupe, compartilhe e estruture pastas de arquivos na nuvem automatizada do Drive.",
    category: "Armazenamento",
    auth: "OAuth",
    cors: "Desconhecido",
    url: "https://developers.google.com/drive",
    sampleEndpoint: "https://www.googleapis.com/drive/v3/files?pageSize=1"
  },
  {
    name: "Dropbox Cloud API",
    description: "Barramento robusto para sincronizar arquivos do usuário, criando backups automáticos.",
    category: "Armazenamento",
    auth: "OAuth",
    cors: "Desconhecido",
    url: "https://www.dropbox.com/developers",
    sampleEndpoint: "https://api.dropboxapi.com/2/files/list_folder"
  },

  // Cryptocurrency
  {
    name: "CoinGecko Market Data",
    description: "Feed completo com cotações, variações diárias e volume de milhares de moedas criptográficas.",
    category: "Cripto",
    auth: "Nenhum",
    cors: "Sim",
    url: "https://www.coingecko.com",
    sampleEndpoint: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
  },
  {
    name: "Binance Public Feed",
    description: "Ordens e preços de negociação de criptoativos direto da maior corretora de ativos digitais.",
    category: "Cripto",
    auth: "apiKey",
    cors: "Desconhecido",
    url: "https://binance-docs.github.io",
    sampleEndpoint: "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
  },

  // Currency Exchange
  {
    name: "Fixer forex",
    description: "API de alta estabilidade e taxa de latência reduzida com cotações forex de moedas globais.",
    category: "Câmbio",
    auth: "apiKey",
    cors: "Não",
    url: "https://fixer.io",
    sampleEndpoint: "http://data.fixer.io/api/latest?access_key=YOUR_KEY"
  },
  {
    name: "ExchangeRate API",
    description: "Taxas de conversão de moedas mundiais atualizadas de hora em hora com suporte a cruzamento.",
    category: "Câmbio",
    auth: "apiKey",
    cors: "Sim",
    url: "https://www.exchangerate-api.com",
    sampleEndpoint: "https://v6.exchangerate-api.com/v6/YOUR_KEY/latest/USD"
  },

  // Data Validation
  {
    name: "Lob.com Address validator",
    description: "Padronizador e validador de correspondência postal e preenchimento de endereços oficiais.",
    category: "Validação",
    auth: "apiKey",
    cors: "Desconhecido",
    url: "https://lob.com",
    sampleEndpoint: "https://api.lob.com/v1/addresses"
  },
  {
    name: "US Autocomplete Suggestions",
    description: "Estações de digitação preditiva e busca veloz de endereços válidos em milissegundos.",
    category: "Validação",
    auth: "apiKey",
    cors: "Sim",
    url: "https://www.smarty.com",
    sampleEndpoint: "https://us-autocomplete-pro.api.smartystreets.com/lookup?search=1600+Amphitheatre"
  },

  // Development
  {
    name: "GitHub REST API",
    description: "Gerencie e resgate commits, pulls, issues e logs de releases de repositórios do desenvolvedor.",
    category: "Desenvolvimento",
    auth: "OAuth",
    cors: "Sim",
    url: "https://docs.github.com/rest",
    sampleEndpoint: "https://api.github.com/repos/facebook/react"
  },
  {
    name: "JSONPlaceholder Engine",
    description: "Mock REST API perfeito contendo milhares de mocks e esquemas de dados prontos para testes.",
    category: "Desenvolvimento",
    auth: "Nenhum",
    cors: "Sim",
    url: "https://jsonplaceholder.typicode.com",
    sampleEndpoint: "https://jsonplaceholder.typicode.com/posts/1"
  },

  // Documents & Productivity
  {
    name: "Airtable API Integration",
    description: "Leitura, gravação, alteração e exclusão rápida de dados simulando planilhas robustas em nuvem.",
    category: "Produtividade",
    auth: "apiKey",
    cors: "Desconhecido",
    url: "https://airtable.com",
    sampleEndpoint: "https://api.airtable.com/v0/appSomeId/Table1"
  },
  {
    name: "iLovePDF Compressor",
    description: "Unifique, reduza tamanho, quebre e converta imagens de arquivos PDF via fluxo programático.",
    category: "Produtividade",
    auth: "apiKey",
    cors: "Sim",
    url: "https://developer.ilovepdf.com",
    sampleEndpoint: "https://api.ilovepdf.com/v1/auth"
  },

  // Email
  {
    name: "Sendgrid Mailing Engine",
    description: "Pontos de conexão SMTP de alta tolerância para e-mails institucionais, marketing e alertas.",
    category: "E-mail",
    auth: "apiKey",
    cors: "Desconhecido",
    url: "https://sendgrid.com",
    sampleEndpoint: "https://api.sendgrid.com/v3/mail/send"
  },

  // Entertainment
  {
    name: "JokeAPI Database",
    description: "Banco integrado com piadas fáceis em múltiplos idiomas e filtros por categoria.",
    category: "Humor",
    auth: "Nenhum",
    cors: "Sim",
    url: "https://sv443.net/jokeapi/v2",
    sampleEndpoint: "https://v2.jokeapi.dev/joke/Any"
  },

  // Environment
  {
    name: "Carbon Index Calculators",
    description: "Metrificadores ecológicos de poluição para faturamentos e frotas veiculares industriais.",
    category: "Ambiente",
    auth: "apiKey",
    cors: "Sim",
    url: "https://www.carboninterface.com",
    sampleEndpoint: "https://www.carboninterface.com/api/v1/estimates"
  },

  // Finance
  {
    name: "Marketstack Stocks",
    description: "API robusta fornecendo cotações da Bolsa em tempo real de dezenas de países.",
    category: "Finanças",
    auth: "apiKey",
    cors: "Desconhecido",
    url: "https://marketstack.com",
    sampleEndpoint: "http://api.marketstack.com/v1/tickers"
  },
  {
    name: "Banco do Brasil Integrator",
    description: "Sistemas integrados de faturamento com registro de boletos, pix e confirmações via banco.",
    category: "Finanças",
    auth: "OAuth",
    cors: "Sim",
    url: "https://developers.bb.com.br",
    sampleEndpoint: "https://api.bb.com.br/v2/boletos"
  },

  // Food & Drink
  {
    name: "TheMealDB Recipes",
    description: "Explore ingredientes detalhados, passos, receitas, culturas alimentares e imagens culinárias.",
    category: "Alimentação",
    auth: "apiKey",
    cors: "Sim",
    url: "https://www.themealdb.com",
    sampleEndpoint: "https://www.themealdb.com/api/json/v1/1/random.php"
  },

  // Geocoding
  {
    name: "IPstack Geo",
    description: "Acesse latitude, longitude, país e dados de ISP completos através de consulta de IP de origem.",
    category: "Geografia",
    auth: "apiKey",
    cors: "Sim",
    url: "https://ipstack.com",
    sampleEndpoint: "http://api.ipstack.com/check?access_key=YOUR_KEY"
  },
  {
    name: "ViaCep CEP Search",
    description: "Encontre endereços brasileiros completos e formatações postais através do número do CEP.",
    category: "Geografia",
    auth: "Nenhum",
    cors: "Sim",
    url: "https://viacep.com.br",
    sampleEndpoint: "https://viacep.com.br/ws/01001000/json/"
  },

  // Machine Learning
  {
    name: "Groq High-Speed IA",
    description: "Sistemas integráveis de inferência ultra veloz para Llama 3, Gemma & Mixtral corporativos.",
    category: "IA & ML",
    auth: "apiKey",
    cors: "Sim",
    url: "https://groq.com",
    sampleEndpoint: "https://api.groq.com/openai/v1/chat/completions"
  },
  {
    name: "Hugging Face Inference",
    description: "Barramento contendo dezenas de milhares de microsserviços neurais em tempo real.",
    category: "IA & ML",
    auth: "apiKey",
    cors: "Sim",
    url: "https://huggingface.co",
    sampleEndpoint: "https://api-inference.huggingface.co/models"
  },

  // Transportation
  {
    name: "Aviationstack Flights",
    description: "Acompanhamento em tempo real de voos globais, rotas de aviação, escalas e horários.",
    category: "Transporte",
    auth: "apiKey",
    cors: "Desconhecido",
    url: "https://aviationstack.com",
    sampleEndpoint: "http://api.aviationstack.com/v1/flights"
  },
  {
    name: "Uber Rides Platform",
    description: "Modelagem e precificação integrada automática de custos de transporte e frotas de entrega.",
    category: "Transporte",
    auth: "OAuth",
    cors: "Sim",
    url: "https://developer.uber.com",
    sampleEndpoint: "https://api.uber.com/v1/estimates/price?start_latitude=37&start_longitude=-122"
  },

  // URL Shorteners
  {
    name: "Bitly Link Engine",
    description: "Encurte e administre links de cupons e campanhas com estatísticas de clique corporativas.",
    category: "Utilidades",
    auth: "OAuth",
    cors: "Desconhecido",
    url: "https://bitly.com",
    sampleEndpoint: "https://api-ssl.bitly.com/v4/shorten"
  },

  // Vehicles
  {
    name: "Smartcar Telematics",
    description: "Conexão oficial com frotas de veículos para leitura de hodômetro, carga de bateria e localização.",
    category: "Utilidades",
    auth: "OAuth",
    cors: "Sim",
    url: "https://smartcar.com",
    sampleEndpoint: "https://api.smartcar.com/v2.0/vehicles"
  }
];
