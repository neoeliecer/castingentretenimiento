const fs = require('fs');
const path = require('path');

// Helper to load env variables from .env file
const envPath = path.join(__dirname, '.env');
const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const getEnv = (key, fallback) => {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : (process.env[key] || fallback);
};

const siteUrl = getEnv('WP_URL', 'https://dev-castingentretenimiento.pantheonsite.io');
const username = getEnv('WP_USER', 'neoeliecer');
const appPassword = getEnv('WP_PASSWORD', '');
const groqApiKey = getEnv('GROQ_API_KEY', ''); // Safely loaded from .env

if (!appPassword) {
  console.error('❌ Error: WP_PASSWORD not found in .env file!');
  process.exit(1);
}

const authString = Buffer.from(`${username}:${appPassword}`).toString('base64');

// Scratch path for logs and published registry
const scratchDir = path.join(__dirname, 'scratch');
const logFile = path.join(scratchDir, 'auto_blogger.log');
const dbFile = path.join(scratchDir, 'published_posts.json');

// Ensure scratch directory exists
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}

function log(msg) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const formattedMsg = `[${timestamp}] ${msg}`;
  console.log(formattedMsg);
  fs.appendFileSync(logFile, formattedMsg + '\n', 'utf8');
}

// Load database of already published articles
let publishedPosts = [];
if (fs.existsSync(dbFile)) {
  try {
    publishedPosts = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  } catch (e) {
    publishedPosts = [];
  }
}

function saveDb() {
  fs.writeFileSync(dbFile, JSON.stringify(publishedPosts, null, 2), 'utf8');
}

// Fetch and parse Google News RSS
async function fetchNews() {
  log('Fetching news feed from Google News RSS...');
  // Search query: "cine teatro colombia"
  const rssUrl = 'https://news.google.com/rss/search?q=cine+teatro+colombia&hl=es-419&gl=CO&ceid=CO:es-419';
  
  const res = await fetch(rssUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch RSS: ${res.statusText}`);
  }
  
  const rssText = await res.text();
  
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(rssText)) !== null) {
    const itemContent = match[1];
    
    // Simple robust regex extraction of XML nodes
    const rawTitle = (itemContent.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
    const link = (itemContent.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
    const pubDate = (itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
    const description = (itemContent.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || '';
    
    // Clean CDATA and titles (Google News appends " - Source Name")
    const titleClean = rawTitle.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
    const linkClean = link.trim();
    const sourceMatch = titleClean.match(/(.*?)\s+-\s+[^-]+$/);
    const titleOnly = sourceMatch ? sourceMatch[1] : titleClean;
    
    items.push({
      title: titleOnly,
      fullTitle: titleClean,
      link: linkClean,
      pubDate: pubDate.trim(),
      description: description.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()
    });
  }
  
  log(`Found ${items.length} news items in RSS.`);
  return items;
}

// Generate premium post with Groq
async function generatePost(newsItem) {
  log(`Generating article with Groq for news: "${newsItem.title}"`);
  
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${groqApiKey}`
  };
  
  const systemPrompt = `Eres un redactor cultural experto, crítico de cine y teatro colombiano, y periodista oficial de la "Fundación Casting Entretenimiento".
Tu misión es escribir un artículo de blog fascinante, inspirador y educativo basado en una noticia real.
Escribe en un español de Colombia pulido, apasionado y formal.

Reglas estrictas de formato del contenido:
1. El artículo debe estar maquetado con bloques de WordPress (Gutenberg) limpios.
2. Utiliza comentarios de bloque COMPLETAMENTE CERRADOS, por ejemplo: '<!-- wp:paragraph -->\n<p>Contenido</p>\n<!-- /wp:paragraph -->' y '<!-- wp:heading -->\n<h2>Título</h2>\n<!-- /wp:heading -->'.
3. Incorpora subtítulos h2 elegantes (<!-- wp:heading -->) y resalta con negritas los conceptos clave.
4. El post debe tener una sección que conecte de forma emotiva la noticia con el impacto social del arte y el teatro, vinculándolo a la visión de la Fundación (formación actoral gratuita, transformación social).
5. Termina con una llamada a la acción atractiva (<!-- wp:paragraph -->) para que los lectores dejen un comentario o compartan en redes.
6. EVITA ESTRICTAMENTE la repetición y redundancia. Ninguna frase, idea, párrafo o sección debe repetirse en el artículo. Cada párrafo debe ser completamente nuevo y aportar valor real al desarrollo de la noticia.
7. NUNCA incluyas menús de navegación, barras laterales, cabeceras, pies de página o textos repetitivos de la estructura del sitio como "Skip to content", "Apóyanos", "Quiénes Somos", etc. Concéntrate exclusivamente en el cuerpo informativo y narrativo del artículo.
8. La conclusión y el llamado a la acción deben ser redactados una sola vez y colocados única y exclusivamente al final absoluto del artículo.
9. CADA BLOQUE DE APERTURA (como '<!-- wp:paragraph -->' o '<!-- wp:heading -->') DEBE CONTENER OBLIGATORIAMENTE SU CORRESPONDIENTE COMENTARIO DE CIERRE (como '<!-- /wp:paragraph -->' o '<!-- /wp:heading -->'). NUNCA dejes un bloque abierto sin su cierre, ya que esto corrompe el editor de WordPress.

Debes responder ESTRICTAMENTE en formato JSON con la siguiente estructura de campos (no incluyas texto antes o después del JSON, solo devuelve el objeto JSON puro):
{
  "title": "Un título periodístico de alto impacto y gancho sobre la noticia",
  "excerpt": "Un resumen ejecutivo muy atractivo del post en 1 o 2 oraciones.",
  "content": "Contenido completo estructurado en bloques Gutenberg HTML. No pongas comillas de más en los bloques."
}`;

  const userPrompt = `Noticia de referencia:
Título: ${newsItem.fullTitle}
Enlace original: ${newsItem.link}
Descripción de referencia: ${newsItem.description}
Fecha de publicación: ${newsItem.pubDate}

Por favor, escribe un artículo completo de aproximadamente 300 a 450 palabras (sin forzar relleno artificial para cumplir una cuota alta de palabras) analizando e informando sobre este acontecimiento. Estructura el artículo de la siguiente manera:
1. Introducción al acontecimiento y su relevancia cultural en Colombia.
2. Análisis o desarrollo detallado de la noticia (aportando contexto cultural y de la industria).
3. Conexión emotiva y directa con la visión y misión de la Fundación Casting Entretenimiento (el poder del arte dramático como motor de transformación social y acceso gratuito a la formación actoral).
4. Un cierre y llamado a la acción único para invitar a la comunidad a debatir o compartir.

Asegúrate de que cada sección sea única y no tenga ninguna idea o frase duplicada.`;

  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.5,
    frequency_penalty: 0.5,
    max_tokens: 1500
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const resData = await response.json();
  const contentStr = resData.choices[0].message.content;
  
  return JSON.parse(contentStr);
}

// Publish post to WordPress REST API
async function publishToWordPress(postData) {
  log(`Publishing post to WordPress: "${postData.title}"`);

  let bgUrl = `${siteUrl}/wp-content/uploads/2026/05/fondo-1.png`;
  try {
    const searchRes = await fetch(`${siteUrl}/wp-json/wp/v2/media?search=fondo&per_page=5`, {
      headers: { 'Authorization': `Basic ${authString}` }
    });
    if (searchRes.ok) {
      const mediaItems = await searchRes.json();
      const match = mediaItems.find(item => item.slug && item.slug.includes('fondo'));
      if (match) {
        bgUrl = match.source_url;
      }
    }
  } catch (e) {
    log(`Warning: Could not fetch dynamic fondo URL: ${e.message}`);
  }
  
  const styleBlock = `<!-- wp:html -->
<style>
/* Reset backgrounds to allow watermark visibility */
html {
  background-color: #ffffff !important;
}
body, .wp-site-blocks, .wp-block-group {
  background-color: transparent !important;
}

/* Subtle Logo Watermark Fixed Background */
body::before {
  content: "" !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background-image: url('${bgUrl}') !important;
  background-repeat: no-repeat !important;
  background-position: center center !important;
  background-size: 45% auto !important;
  opacity: 0.12 !important;
  z-index: -1 !important;
  pointer-events: none !important;
  mix-blend-mode: multiply !important;
}

/* Style single post elements with logo colors */
h1.wp-block-post-title,
.single-post h1.wp-block-post-title {
  color: #0b132b !important; /* Deep Logo Navy */
  font-weight: 800 !important;
  font-size: clamp(2rem, 2rem + ((1vw - 0.2rem) * 1.5), 3.2rem) !important;
  line-height: 1.3 !important;
  border-left: 5px solid #00b4d8 !important; /* Logo Cyan left accent border */
  padding-left: 20px !important;
  margin-top: 30px !important;
  margin-bottom: 25px !important;
}

h2.wp-block-heading,
h3.wp-block-heading,
.single-post h2, 
.single-post h3 {
  color: #0b132b !important; /* Deep Logo Navy */
  border-bottom: 2px solid rgba(0, 180, 216, 0.2) !important; /* Soft Cyan underline */
  padding-bottom: 8px !important;
  margin-top: 40px !important;
  margin-bottom: 20px !important;
}

/* Style links in single post */
.single-post .entry-content a, 
.single-post p a,
.entry-content a {
  color: #00b4d8 !important; /* Logo Cyan */
  font-weight: 600 !important;
  text-decoration: underline !important;
  transition: color 0.3s ease !important;
}

.single-post .entry-content a:hover, 
.single-post p a:hover,
.entry-content a:hover {
  color: #0077b6 !important; /* Darker Cyan */
}

/* Add a beautiful border or shadow to images in post */
.single-post figure.wp-block-image img,
figure.wp-block-image img {
  border-radius: 12px !important;
  box-shadow: 0 10px 30px rgba(0, 180, 216, 0.08) !important;
  border: 1px solid rgba(0, 180, 216, 0.15) !important;
}
</style>
<!-- /wp:html -->\n`;

  const finalContent = styleBlock + postData.content;
  
  const res = await fetch(`${siteUrl}/wp-json/wp/v2/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: postData.title,
      content: finalContent,
      excerpt: postData.excerpt,
      status: 'publish'
    })
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`WordPress API error: ${res.status} - ${errorText}`);
  }
  
  const createdPost = await res.json();
  log(`✅ Success! Post published with ID: ${createdPost.id}. Link: ${createdPost.link}`);
  return createdPost;
}

async function run() {
  log('====================================================');
  log('Starting Daily News Auto-Blogger Execution');
  log('====================================================');
  
  try {
    const newsItems = await fetchNews();
    if (newsItems.length === 0) {
      log('No news items found in RSS feed. Exiting.');
      return;
    }
    
    // Find the first news item that has NOT been published yet
    let targetNews = null;
    for (const item of newsItems) {
      const isAlreadyPublished = publishedPosts.some(p => p.link === item.link || p.originalTitle === item.title);
      if (!isAlreadyPublished) {
        targetNews = item;
        break;
      }
    }
    
    if (!targetNews) {
      log('All news from the feed have already been published. No new article to write today.');
      return;
    }
    
    log(`Selected target news: "${targetNews.title}"`);
    
    // Generate the post copy using Groq
    const postData = await generatePost(targetNews);
    
    // Publish it to WordPress
    const wpResult = await publishToWordPress(postData);
    
    // Record in the database
    publishedPosts.push({
      originalTitle: targetNews.title,
      link: targetNews.link,
      pubDate: targetNews.pubDate,
      publishedTitle: postData.title,
      wpId: wpResult.id,
      wpLink: wpResult.link,
      timestamp: new Date().toISOString()
    });
    
    saveDb();
    log('Daily auto-blogger task completed successfully.');
    
  } catch (error) {
    log(`❌ CRITICAL ERROR: ${error.message}`);
    if (error.stack) {
      log(error.stack);
    }
  }
  log('====================================================\n');
}

run();
