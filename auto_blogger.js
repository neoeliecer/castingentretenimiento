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
2. Utiliza comentarios de bloque <!-- wp:paragraph -->, <!-- wp:heading -->, etc.
3. Incorpora subtítulos h2 elegantes (<!-- wp:heading -->) y resalta con negritas los conceptos clave.
4. El post debe tener una sección que conecte de forma emotiva la noticia con el impacto social del arte y el teatro, vinculándolo a la visión de la Fundación (formación actoral gratuita, transformación social).
5. Termina con una llamada a la acción atractiva (<!-- wp:paragraph -->) para que los lectores dejen un comentario o compartan en redes.

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

Por favor escribe un artículo completo de aproximadamente 400 a 600 palabras analizando e informando sobre este acontecimiento. Mantén la calidad de redacción premium y asegúrate de conectar el tema con el poder del arte dramático y la cinematografía como motores culturales y de transformación.`;

  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
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
  
  const res = await fetch(`${siteUrl}/wp-json/wp/v2/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: postData.title,
      content: postData.content,
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
