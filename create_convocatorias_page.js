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

if (!appPassword) {
  console.error('❌ Error: WP_PASSWORD not found in .env file!');
  process.exit(1);
}

const authString = Buffer.from(`${username}:${appPassword}`).toString('base64');

// HTML content for the Convocatorias page (with premium dark styling)
const convocatoriasPageHtml = `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"100px","bottom":"100px"}},"background":{"gradient":"linear-gradient(135deg, #1e1b4b 0%, #1c1917 100%)"}},"textColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-color has-text-color" style="padding-top:100px;padding-bottom:100px;background:linear-gradient(135deg, #1e1b4b 0%, #1c1917 100%)">
  <!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"3.5rem","fontWeight":"800"}}} -->
  <h1 class="wp-block-heading has-text-align-center" style="font-size:3.5rem;font-weight:800">Convocatorias y Castings</h1>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center","style":{"typography":{"fontSize":"1.4rem"}},"textColor":"accent-1"} -->
  <p class="has-text-align-center has-accent-1-color has-text-color" style="font-size:1.4rem;max-width:800px;margin:20px auto 0 auto">Tu próximo gran papel comienza aquí. Explora audiciones abiertas y oportunidades reales en cine, teatro y televisión en Colombia.</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"80px","bottom":"80px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:80px;padding-bottom:80px">
  <!-- wp:heading {"level":2,"style":{"typography":{"fontSize":"2.2rem","fontWeight":"700"}},"textColor":"contrast"} -->
  <h2 class="wp-block-heading has-contrast-color has-text-color" style="font-size:2.2rem;font-weight:700;margin-bottom:30px">🎭 Oportunidades Artísticas Activas</h2>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.1rem"}}} -->
  <p style="font-size:1.1rem;line-height:1.8;color:#475569;margin-bottom:40px">En la <strong>Fundación Casting Entretenimiento</strong>, impulsamos tu carrera conectándote directamente con producciones nacionales e independientes. En esta sección se publican diariamente castings actualizados y audiciones vigentes procesados automáticamente. Recuerda preparar tu book de fotos y videoreel antes de aplicar.</p>
  <!-- /wp:paragraph -->

  <!-- wp:query {"queryId":10,"query":{"perPage":6,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":{"category":[/* CATEGORY_ID_PLACEHOLDER */]}},"displayLayout":{"type":"flex","columns":3},"layout":{"type":"constrained"}} -->
  <div class="wp-block-query">
    <!-- wp:post-template -->
    <!-- wp:group {"style":{"spacing":{"padding":{"top":"30px","bottom":"30px","left":"25px","right":"25px"}},"border":{"radius":"12px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base-2","layout":{"type":"constrained"}} -->
    <div class="wp-block-group has-base-2-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:12px;padding-top:30px;padding-bottom:30px;padding-left:25px;padding-right:25px;height:100%">
      <!-- wp:post-title {"isLink":true,"style":{"typography":{"fontSize":"1.4rem","fontWeight":"700"}},"textColor":"contrast"} /-->
      <!-- wp:post-date {"style":{"typography":{"fontSize":"0.85rem"}},"textColor":"accent-2"} /-->
      <!-- wp:post-excerpt {"style":{"typography":{"fontSize":"0.95rem"}}} /-->
      <!-- wp:read-more {"style":{"typography":{"fontSize":"0.95rem","fontWeight":"600"}},"textColor":"contrast"} /-->
    </div>
    <!-- /wp:group -->
    <!-- /wp:post-template -->

    <!-- wp:query-no-results -->
    <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.1rem"}}} -->
    <p style="font-size:1.1rem;color:#64748b;font-style:italic">Actualmente estamos procesando nuevas convocatorias. ¡Vuelve pronto para descubrir audiciones activas!</p>
    <!-- /wp:paragraph -->
    <!-- /wp:query-no-results -->
  </div>
  <!-- /wp:query -->
</div>
<!-- /wp:group -->`;

// A sample casting call HTML using native WordPress Gutenberg blocks
const sampleCastingHtml = `<!-- wp:group {"style":{"spacing":{"padding":{"top":"20px","bottom":"20px","left":"20px","right":"20px"}},"border":{"radius":"8px","width":"1px","style":"solid","color":"#e2e8f0"}},"backgroundColor":"base-2"} -->
<div class="wp-block-group has-base-2-background-color has-background" style="border-style:solid;border-width:1px;border-color:#e2e8f0;border-radius:8px;padding:20px;margin-bottom:30px">
  <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.1rem"}}} -->
  <p style="font-size:1.1rem"><strong>🎬 Tipo de Producción:</strong> Largometraje Independiente (Drama Social)</p>
  <!-- /wp:paragraph -->
  <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.1rem"}}} -->
  <p style="font-size:1.1rem"><strong>📍 Ubicación del Rodaje:</strong> Cali y Bogotá, Colombia</p>
  <!-- /wp:paragraph -->
  <!-- wp:paragraph {"style":{"typography":{"fontSize":"1.1rem"}}} -->
  <p style="font-size:1.1rem"><strong>📅 Fecha Límite:</strong> 15 de Junio, 2026</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:heading {"level":3} -->
<h3>👥 Roles Buscados</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
  <li><strong>Actor Principal (Hombre, 20-28 años):</strong> De contextura delgada, expresivo, capaz de interpretar emociones intensas. Personaje protagónico de origen popular.</li>
  <li><strong>Actriz de Reparto (Mujer, 40-50 años):</strong> Con experiencia en teatro. Personaje materno, con fuerte presencia escénica y manejo de voz.</li>
  <li><strong>Extras y Figurantes (Todas las edades):</strong> Residentes en la ciudad de Cali para rodaje en locaciones comunitarias.</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading {"level":3} -->
<h3>📋 Requisitos</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
  <li>Hoja de vida artística actualizada.</li>
  <li>Book de fotos profesional (rostro y cuerpo entero).</li>
  <li>Videoreel (Showreel) reciente o monólogo grabado en video (máximo 2 minutos).</li>
</ul>
<!-- /wp:list -->

<!-- wp:heading {"level":3} -->
<h3>✉️ ¿Cómo aplicar?</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Envía tus materiales en formato digital al correo oficial <strong>fcastingentretenimiento@gmail.com</strong> indicando en el asunto del correo <strong>"Casting - Drama Social [Tu Nombre]"</strong>. Los preseleccionados serán contactados para audición presencial en Cali.</p>
<!-- /wp:paragraph -->`;

async function createCategory() {
  log('Checking/Creating Category "Convocatorias" in WordPress...');
  
  const searchRes = await fetch(`${siteUrl}/wp-json/wp/v2/categories?slug=convocatorias`, {
    headers: { 'Authorization': `Basic ${authString}` }
  });
  
  const categories = await searchRes.json();
  if (categories.length > 0) {
    const catId = categories[0].id;
    log(`Category "Convocatorias" already exists with ID: ${catId}`);
    return catId;
  }
  
  log('Creating a new category for "Convocatorias"...');
  const createRes = await fetch(`${siteUrl}/wp-json/wp/v2/categories`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Convocatorias',
      slug: 'convocatorias',
      description: 'Ofertas de casting, audiciones y trabajo para actores y producción'
    })
  });
  
  if (!createRes.ok) {
    throw new Error(`Failed to create category: ${await createRes.text()}`);
  }
  
  const newCat = await createRes.json();
  log(`✅ Success! Created category "Convocatorias" with ID: ${newCat.id}`);
  return newCat.id;
}

async function createOrUpdatePage(catId) {
  log('Checking if Convocatorias page already exists...');
  
  const searchRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages?slug=convocatorias`, {
    headers: { 'Authorization': `Basic ${authString}` }
  });
  const pages = await searchRes.json();
  
  // Inject category ID into the query block placeholder in HTML
  const finalHtml = convocatoriasPageHtml.replace('/* CATEGORY_ID_PLACEHOLDER */', catId);
  
  if (pages.length > 0) {
    const pageId = pages[0].id;
    log(`Convocatorias page already exists with ID: ${pageId}. Updating content...`);
    const updateRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages/${pageId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: finalHtml
      })
    });
    
    if (updateRes.ok) {
      log('✅ Success! Convocatorias page updated.');
    } else {
      console.error('❌ Failed to update Convocatorias page:', await updateRes.json());
    }
  } else {
    log('Creating a new Convocatorias page...');
    const createRes = await fetch(`${siteUrl}/wp-json/wp/v2/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Convocatorias',
        slug: 'convocatorias',
        content: finalHtml,
        status: 'publish'
      })
    });
    
    if (createRes.ok) {
      log('✅ Success! Created new Convocatorias page.');
    } else {
      console.error('❌ Failed to create Convocatorias page:', await createRes.json());
    }
  }
}

async function publishSampleCasting(catId) {
  log('Publishing a sample active Casting Call...');
  
  // Check if sample casting already exists to avoid duplicates
  const searchRes = await fetch(`${siteUrl}/wp-json/wp/v2/posts?slug=casting-largometraje-independiente-cali`, {
    headers: { 'Authorization': `Basic ${authString}` }
  });
  const posts = await searchRes.json();
  if (posts.length > 0) {
    log('Sample casting already exists. Skipping post creation.');
    return;
  }
  
  const createRes = await fetch(`${siteUrl}/wp-json/wp/v2/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Casting: Largometraje Independiente - Protagónicos Cali',
      slug: 'casting-largometraje-independiente-cali',
      content: sampleCastingHtml,
      excerpt: 'Convocatoria abierta para actor principal (20-28 años) y actriz de reparto (40-50 años) en la ciudad de Cali.',
      status: 'publish',
      categories: [catId]
    })
  });
  
  if (createRes.ok) {
    log('✅ Success! Published sample Casting call.');
  } else {
    console.error('❌ Failed to publish sample Casting call:', await createRes.json());
  }
}

function log(msg) {
  console.log(`[CONVOCATORIAS-SETUP] ${msg}`);
}

async function run() {
  log('--- STARTING CONVOCATORIAS PAGE & CATEGORY CREATION ---');
  try {
    const catId = await createCategory();
    await createOrUpdatePage(catId);
    await publishSampleCasting(catId);
    log('--- CONVOCATORIAS DEPLOYMENT COMPLETED SUCCESSFULLY ---');
  } catch (e) {
    log(`❌ Error: ${e.message}`);
  }
}

run();
