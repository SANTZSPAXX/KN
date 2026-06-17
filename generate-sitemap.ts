import * as fs from "fs";
import * as path from "path";

// Helper to generate slug for sitemaps matching client-side logic
const slugifyForSitemap = (text: string): string => {
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

function generateSitemap() {
  console.log("==========================================");
  console.log("🧭 Gerador Automático de Sitemap.xml para KoreNexus");
  console.log("==========================================");

  const domain = "https://korenexus.com.br";
  const nowStr = new Date().toISOString().split("T")[0];

  const configPath = path.join(process.cwd(), "data", "config.json");
  let dbPath = path.join(process.cwd(), "data", "spreadsheet.json");

  if (fs.existsSync(configPath)) {
    try {
      const configObj = JSON.parse(fs.readFileSync(configPath, "utf8"));
      if (configObj.DB_PATH) {
        dbPath = path.isAbsolute(configObj.DB_PATH) ? configObj.DB_PATH : path.join(process.cwd(), configObj.DB_PATH);
        console.log(`🧭 database path resolved dynamically from config.json: ${dbPath}`);
      }
    } catch (e: any) {
      console.error(`⚠️ Erro ao carregar config.json sitemap setup: ${e.message}`);
    }
  }

  let dbData: any = { produtos: [], ferramentas: [], apps: [], blog: [] };

  if (fs.existsSync(dbPath)) {
    try {
      const content = fs.readFileSync(dbPath, "utf8");
      dbData = JSON.parse(content);
      console.log(`✅ Banco de dados offline carregado com sucesso de: ${dbPath}`);
    } catch (err: any) {
      console.error(`⚠️ Erro ao carregar banco de dados (${err.message}). Utilizando valores padrão.`);
    }
  } else {
    console.log("⚠️ Banco de dados spreadsheet.json não encontrado. Redirecionando para sitemap estático simplificado.");
  }

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

  // 1. Static Routes
  staticRoutes.forEach(route => {
    xml += `
  <url>
    <loc>${domain}${route}</loc>
    <lastmod>${nowStr}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route === "" || route === "/inicio" ? "1.0" : "0.8"}</priority>
  </url>`;
  });

  // 2. Dynamic Products
  let countProducts = 0;
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
        countProducts++;
      }
    });
  }

  // 3. Dynamic Tools
  let countTools = 0;
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
        countTools++;
      }
    });
  }

  // 4. Dynamic Apps
  let countApps = 0;
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
        countApps++;
      }
    });
  }

  // 5. Dynamic Blog Posts
  let countBlog = 0;
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
        countBlog++;
      }
    });
  }

  xml += `
</urlset>`;

  // Define targets
  const rootTarget = path.join(process.cwd(), "sitemap.xml");
  const publicDir = path.join(process.cwd(), "public");
  const publicTarget = path.join(publicDir, "sitemap.xml");
  const distDir = path.join(process.cwd(), "dist");
  const distTarget = path.join(distDir, "sitemap.xml");

  // Create public folder if not exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Save to target locations
  fs.writeFileSync(rootTarget, xml, "utf8");
  console.log(`💾 Sitemap.xml gravado com sucesso na RAIZ do projeto: ${rootTarget}`);

  fs.writeFileSync(publicTarget, xml, "utf8");
  console.log(`💾 Sitemap.xml gravado com sucesso na pasta PUBLIC do Vite: ${publicTarget}`);

  // Create dist if exists or during active build outputs
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(distTarget, xml, "utf8");
    console.log(`💾 Sitemap.xml gravado de forma imediata na pasta DIST de build: ${distTarget}`);
  }

  console.log("------------------------------------------");
  console.log(`📊 Total de Rotas Geradas: ${staticRoutes.length + countProducts + countTools + countApps + countBlog}`);
  console.log(`   └─ Estáticas: ${staticRoutes.length}`);
  console.log(`   └─ Produtos: ${countProducts}`);
  console.log(`   └─ Ferramentas: ${countTools}`);
  console.log(`   └─ Aplicativos: ${countApps}`);
  console.log(`   └─ Blog: ${countBlog}`);
  console.log("==========================================");
}

generateSitemap();
