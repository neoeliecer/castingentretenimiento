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

// Scratch path for logs and published casting registry
const scratchDir = path.join(__dirname, 'scratch');
const logFile = path.join(scratchDir, 'auto_convocatorias.log');
const dbFile = path.join(scratchDir, 'published_convocatorias.json');

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

// Load database of already processed casting calls
let processedCastings = [];
if (fs.existsSync(dbFile)) {
  try {
    processedCastings = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  } catch (e) {
    processedCastings = [];
  }
}

function saveDb() {
  fs.writeFileSync(dbFile, JSON.stringify(processedCastings, null, 2), 'utf8');
}

// Dynamically fetch "convocatorias" category ID
async function getCategoryId() {
  log('Fetching category ID for "convocatorias"...');
  const res = await fetch(`${siteUrl}/wp-json/wp/v2/categories?slug=convocatorias`, {
    headers: { 'Authorization': `Basic ${authString}` }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch category: ${res.statusText}`);
  }
  
  const categories = await res.json();
  if (categories.length > 0) {
    return categories[0].id;
  }
  
  // Safe fallback to ID 3
  log('Warning: Slug "convocatorias" category not found via API. Using safe fallback ID: 3');
  return 3;
}

// Fetch and parse casting/audition news RSS in Colombia
async function fetchCastingNews() {
  log('Fetching casting calls and audition news from Google News RSS...');
  // Search query: "casting convocatoria actores colombia" OR "audiciones teatro cine colombia"
  const rssUrl = 'https://news.google.com/rss/search?q=casting+convocatoria+actores+colombia+OR+audiciones+teatro+cine+colombia&hl=es-419&gl=CO&ceid=CO:es-419';
  
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
    
    const rawTitle = (itemContent.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
    const link = (itemContent.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
    const pubDate = (itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
    const description = (itemContent.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || '';
    
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
  
  log(`Found ${items.length} casting/audition news items in RSS.`);
  return items;
}

// Generate premium Casting call post with Groq
async function generateCastingPost(newsItem) {
  log(`Structuring casting listing with Groq for: "${newsItem.title}"`);
  
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${groqApiKey}`
  };
  
  const systemPrompt = `Eres un director de casting y gestor cultural experto en el sector audiovisual y teatral de Colombia, coordinando la sección de "Convocatorias" de la "Fundación Casting Entretenimiento".
Tu misión es estructurar y redactar un anuncio formal, claro y sumamente profesional de convocatoria de casting/audición basado en una noticia real.
Escribe en un tono formal, directo y corporativo de la industria de cine y teatro. Mantén el contenido muy conciso y directo (aproximadamente 250 a 400 palabras en total) para evitar textos excesivamente largos.

Reglas estrictas de maquetación:
1. Utiliza comentarios de bloque <!-- wp:group --> con estilo de recuadro elegante para la ficha técnica del casting (Ubicación, Tipo de Producción, Plazo).
2. Estructura con subtítulos h3 (<!-- wp:heading -->) las secciones: "Roles Buscados", "Requisitos" e "Instrucciones para Aplicar".
3. Utiliza listas estructuradas (<!-- wp:list -->) para describir brevemente cada perfil de actor/actriz buscado (edades, características) y los materiales requeridos.
4. El post DEBE dar instrucciones de contacto profesionales. Como canal predeterminado, indica que envíen sus materiales a fcastingentretenimiento@gmail.com o que visiten el enlace oficial de referencia: ${newsItem.link}.

Debes responder ESTRICTAMENTE en formato JSON con la siguiente estructura de campos (no incluyas texto antes o después del JSON, solo devuelve el objeto JSON puro):
{
  "title": "Casting: [Nombre / Tipo de Proyecto] - [Ciudad/Ubicación] Colombia",
  "excerpt": "Breve resumen de la convocatoria: perfiles solicitados, fecha límite y ubicación (1 o 2 oraciones).",
  "content": "Contenido completo estructurado en bloques Gutenberg HTML."
}`;

  const userPrompt = `Noticia/Referencia de Convocatoria:
Título: ${newsItem.fullTitle}
Enlace oficial: ${newsItem.link}
Descripción: ${newsItem.description}
Fecha de publicación: ${newsItem.pubDate}

Por favor estructúrala como una ficha de casting concisa e impecable para nuestro portal de la Fundación. Explica de forma directa qué perfiles se buscan y cómo aplicar.`;

  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 3000
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

// Publish post to WordPress under "Convocatorias" Category
async function publishCastingToWordPress(postData, catId) {
  log(`Publishing casting call to WordPress under category ID ${catId}: "${postData.title}"`);
  
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
      status: 'publish',
      categories: [catId]
    })
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`WordPress API error: ${res.status} - ${errorText}`);
  }
  
  const createdPost = await res.json();
  log(`✅ Success! Casting post published with ID: ${createdPost.id}. Link: ${createdPost.link}`);
  return createdPost;
}

async function run() {
  log('====================================================');
  log('Starting Daily Casting Calls Automator Execution');
  log('====================================================');
  
  try {
    const catId = await getCategoryId();
    const castingItems = await fetchCastingNews();
    
    if (castingItems.length === 0) {
      log('No casting news items found. Exiting.');
      return;
    }
    
    // Find the first item that has NOT been processed yet
    let targetCasting = null;
    for (const item of castingItems) {
      const isAlreadyProcessed = processedCastings.some(c => c.link === item.link || c.originalTitle === item.title);
      if (!isAlreadyProcessed) {
        targetCasting = item;
        break;
      }
    }
    
    if (!targetCasting) {
      log('All casting calls from the feed have already been processed. No new convocatorias today.');
      return;
    }
    
    log(`Selected target casting news: "${targetCasting.title}"`);
    
    // Generate casting listing using Groq
    const postData = await generateCastingPost(targetCasting);
    
    // Publish to WordPress category "Convocatorias"
    const wpResult = await publishCastingToWordPress(postData, catId);
    
    // Record in the database
    processedCastings.push({
      originalTitle: targetCasting.title,
      link: targetCasting.link,
      pubDate: targetCasting.pubDate,
      publishedTitle: postData.title,
      wpId: wpResult.id,
      wpLink: wpResult.link,
      timestamp: new Date().toISOString()
    });
    
    saveDb();
    log('Daily convocatorias auto-updater completed successfully.');
    
  } catch (error) {
    log(`❌ CRITICAL ERROR in Convocatorias task: ${error.message}`);
    if (error.stack) {
      log(error.stack);
    }
  }
  log('====================================================\n');
}

run();
